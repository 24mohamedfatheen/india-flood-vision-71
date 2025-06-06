// src/services/imdApiService.ts
// This file is responsible for fetching all reservoir data from Supabase
// with pagination, aggregating it by state/district, and calculating flood risk levels.

import { supabase } from '../integrations/supabase/client';

// Define the structure for raw reservoir data coming directly from Supabase
// (Matches your Supabase table columns)
export interface RawReservoirData {
  id?: number;
  reservoir_name?: string;
  state?: string;
  district?: string;
  current_level_mcm?: number;
  capacity_mcm?: number;
  percentage_full?: number; // This is now derived during ingestion
  inflow_cusecs?: number;
  outflow_cusecs?: number;
  last_updated?: string;
  lat?: number;
  long?: number;
}

// Define the aggregated data structure that your UI components will consume
export type IMDRegionData = {
  state: string;
  district: string;
  reservoirPercentage: number; // Max percentage_full for the district
  inflowCusecs: number;        // Sum of inflows for the district
  outflowCusecs: number;       // Sum of outflows for the district (for completeness, though not used in risk)
  floodRiskLevel: 'low' | 'medium' | 'high' | 'severe';
  // These fields are placeholders. As per master plan, no dummy/random data.
  populationAffected: number; 
  affectedArea: number;       
  coordinates: [number, number]; // Representative coordinates for the district
  lastUpdated: string;           // Most recent last_updated for any reservoir in the district
};

// Define the maximum number of records to fetch per Supabase request to enable pagination
const SUPABASE_FETCH_LIMIT = 1000;

export const imdApiService = {
  /**
   * Fetches all historical reservoir data from Supabase using pagination,
   * aggregates it by state and district, and calculates flood risk levels.
   * This is the primary data source for the Flood Vision map and panels.
   * @returns A promise that resolves to an array of aggregated IMDRegionData.
   */
  fetchAggregatedFloodData: async (): Promise<IMDRegionData[]> => {
    console.log('--- imdApiService: Starting comprehensive data fetch and aggregation ---');

    let allRawReservoirData: RawReservoirData[] = [];
    let offset = 0;
    let hasMore = true;

    try {
      while (hasMore) {
        console.log(`Fetching batch from Supabase: offset=${offset}, limit=${SUPABASE_FETCH_LIMIT}`);
        const { data: currentBatch, error } = await supabase
          .from('indian_reservoir_levels')
          .select('reservoir_name, state, district, current_level_mcm, capacity_mcm, percentage_full, inflow_cusecs, outflow_cusecs, last_updated, lat, long')
          .range(offset, offset + SUPABASE_FETCH_LIMIT - 1); // Supabase range is inclusive

        if (error) {
          console.error('ERROR: Supabase data fetch failed during pagination:', error);
          hasMore = false; // Stop fetching on error
          // Continue with whatever data was fetched successfully so far, or return empty if nothing
          break;
        }

        if (!currentBatch || currentBatch.length === 0) {
          hasMore = false; // No more records to fetch
        } else {
          allRawReservoirData = allRawReservoirData.concat(currentBatch);
          console.log(`Fetched ${currentBatch.length} records in current batch. Total raw records fetched: ${allRawReservoirData.length}`);
          offset += currentBatch.length;

          // If the number of records returned is less than the limit, it's the last batch
          if (currentBatch.length < SUPABASE_FETCH_LIMIT) {
            hasMore = false;
          }
        }
      }

      if (allRawReservoirData.length === 0) {
        console.warn('WARNING: No raw reservoir data found in Supabase after all pagination attempts.');
        return [];
      }

      console.log(`SUCCESS: Finished fetching all ${allRawReservoirData.length} raw reservoir records from Supabase.`);

      // --- Aggregation Logic: Process raw data into IMDRegionData ---
      const regionDataMap = new Map<string, IMDRegionData>(); // Key: 'state_district_lowercase'

      allRawReservoirData.forEach((res: RawReservoirData) => {
        // Sanitize and normalize state/district names for consistent mapping
        const stateName = res.state ? res.state.trim() : 'Unknown State';
        const districtName = res.district ? res.district.trim() : 'Unknown District';
        const mapKey = `${stateName.toLowerCase()}_${districtName.toLowerCase()}`;

        // Initialize region entry if it doesn't exist
        if (!regionDataMap.has(mapKey)) {
          // Use the first reservoir's coordinates as a representative for the district, or a fallback
          const representativeCoords: [number, number] = [res.lat || 20.5937, res.long || 78.9629]; // Default to center of India
          regionDataMap.set(mapKey, {
            state: stateName,
            district: districtName,
            reservoirPercentage: 0, // Will be updated to max
            inflowCusecs: 0,        // Will be updated to sum
            outflowCusecs: 0,       // Will be updated to sum
            floodRiskLevel: 'low',  // Default, will be updated to highest risk
            populationAffected: 0,  // Placeholder as per "no dummy data" rule
            affectedArea: 0,        // Placeholder as per "no dummy data" rule
            coordinates: representativeCoords,
            lastUpdated: res.last_updated || new Date().toISOString(), // Most recent update in the district
          });
        }

        const regionEntry = regionDataMap.get(mapKey)!; // Assert not undefined as we just ensured it exists

        // Sanitize percentage_full, ensuring it's a number and within 0-100 range
        let currentPercentageFull: number = typeof res.percentage_full === 'number'
          ? res.percentage_full
          : parseFloat(String(res.percentage_full || '0'));
        currentPercentageFull = isNaN(currentPercentageFull) ? 0 : Math.min(100, Math.max(0, currentPercentageFull));

        // Aggregate values:
        // Use the highest percentage_full encountered for the district
        if (currentPercentageFull > regionEntry.reservoirPercentage) {
          regionEntry.reservoirPercentage = currentPercentageFull;
        }
        // Sum inflows and outflows for the district
        regionEntry.inflowCusecs += (res.inflow_cusecs || 0);
        regionEntry.outflowCusecs += (res.outflow_cusecs || 0); // Include outflow in aggregation

        // Update last updated timestamp to the most recent one for the district
        if (res.last_updated && new Date(res.last_updated) > new Date(regionEntry.lastUpdated)) {
            regionEntry.lastUpdated = res.last_updated;
        }

        // --- Calculate Flood Risk Level for the district (Aggressive Thresholds) ---
        // This is a simplified risk calculation based on reservoir data only.
        let currentReservoirRisk: IMDRegionData['floodRiskLevel'] = 'low';
        if (currentPercentageFull >= 90 || (res.inflow_cusecs || 0) > 10000) {
            currentReservoirRisk = 'severe';
        } else if (currentPercentageFull >= 75 || (res.inflow_cusecs || 0) > 5000) {
            currentReservoirRisk = 'high';
        } else if (currentPercentageFull >= 50 || (res.inflow_cusecs || 0) > 1000) {
            currentReservoirRisk = 'medium';
        }

        // Update the overall flood risk level for the region if a higher risk is encountered
        const riskLevelOrder = { 'low': 0, 'medium': 1, 'high': 2, 'severe': 3 };
        if (riskLevelOrder[currentReservoirRisk] > riskLevelOrder[regionEntry.floodRiskLevel]) {
          regionEntry.floodRiskLevel = currentReservoirRisk;
        }
      });

      const aggregatedResult = Array.from(regionDataMap.values());

      console.log(`SUCCESS: Aggregated data for ${aggregatedResult.length} unique regions.`);
      aggregatedResult.forEach(item => {
          console.log(`DEBUG_IMD_AGGREGATED: State=${item.state}, District=${item.district}, ReservoirPercentage=${item.reservoirPercentage.toFixed(2)}, InflowCusecs=${item.inflowCusecs}, FloodRiskLevel=${item.floodRiskLevel}, Coordinates=[${item.coordinates[0].toFixed(4)}, ${item.coordinates[1].toFixed(4)}]`);
      });

      return aggregatedResult;

    } catch (error: any) {
      console.error('CRITICAL ERROR in imdApiService.fetchAggregatedFloodData:', error);
      // It's crucial to return a structured empty array if there's a critical error
      return [];
    }
  },
};
