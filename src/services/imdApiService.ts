// src/services/imdApiService.ts
// This file is responsible for fetching all reservoir data from Supabase
// with pagination, aggregating it by state/district, and calculating flood risk levels.
// This data will be consumed by the Map and MapControls components.

// Import the supabase client from your auto-generated client.ts
import { supabase } from '../integrations/supabase/client';

// Define the structure for raw reservoir data coming directly from Supabase
// (Matches your Supabase table columns, ensure names are exact)
export interface RawReservoirData {
  id?: number;
  reservoir_name?: string;
  state?: string;
  district?: string;
  current_level_mcm?: number;
  capacity_mcm?: number;
  percentage_full?: number;
  inflow_cusecs?: number;
  outflow_cusecs?: number;
  last_updated?: string;
  lat?: number;
  long?: number;
}

// Define the aggregated data structure that your UI components will consume.
// Each object in this array will represent a unique state-district combination.
export type IMDRegionData = {
  state: string;
  district: string;
  reservoirPercentage: number; // Max percentage_full for reservoirs in this district
  inflowCusecs: number;        // Sum of inflows for reservoirs in this district
  outflowCusecs: number;       // Sum of outflows for reservoirs in this district
  floodRiskLevel: 'low' | 'medium' | 'high' | 'severe'; // Calculated risk for the district
  coordinates: [number, number]; // Representative coordinates for the district
  lastUpdated: string;           // Most recent last_updated timestamp for any reservoir in the district
  populationAffected: number;    // Placeholder, always 0 for now as per no-dummy rule
  affectedArea: number;          // Placeholder, always 0 for now as per no-dummy rule
};

// Define the maximum number of records to fetch per Supabase request for pagination
const SUPABASE_FETCH_LIMIT = 1000;

export const imdApiService = {
  /**
   * Fetches all raw reservoir data from Supabase using pagination,
   * aggregates it by state and district, and calculates flood risk levels.
   * This is the primary data source for the Map and related controls.
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
          // Select relevant columns. Ensure these match your Supabase table schema exactly.
          .select('reservoir_name, state, district, current_level_mcm, capacity_mcm, percentage_full, inflow_cusecs, outflow_cusecs, last_updated, lat, long')
          .range(offset, offset + SUPABASE_FETCH_LIMIT - 1); // Supabase range is inclusive

        if (error) {
          console.error('ERROR: Supabase data fetch failed during pagination:', error);
          hasMore = false; // Stop fetching on error
          break; // Exit loop on error
        }

        if (!currentBatch || currentBatch.length === 0) {
          hasMore = false; // No more records to fetch
        } else {
          allRawReservoirData = allRawReservoirData.concat(currentBatch);
          console.log(`Fetched ${currentBatch.length} records in current batch. Total raw records fetched: ${allRawReservoirData.length}`);
          offset += currentBatch.length;

          // If the number of records returned is less than the limit, it means it's the last batch
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

      // --- Aggregation Logic: Process raw data into IMDRegionData (by unique state-district) ---
      const regionDataMap = new Map<string, IMDRegionData>(); // Key: 'state_district_lowercase' to ensure uniqueness

      allRawReservoirData.forEach((res: RawReservoirData) => {
        // Sanitize and normalize state/district names for consistent mapping and key generation
        const stateName = res.state ? res.state.trim() : 'Unknown State';
        const districtName = res.district ? res.district.trim() : 'Unknown District';
        const mapKey = `${stateName.toLowerCase()}_${districtName.toLowerCase()}`;

        // Initialize region entry if it doesn't exist for this state-district combination
        if (!regionDataMap.has(mapKey)) {
          // Use the first reservoir's coordinates as a representative for the district, or a fallback (center of India)
          const representativeCoords: [number, number] = [res.lat || 20.5937, res.long || 78.9629]; 
          regionDataMap.set(mapKey, {
            state: stateName,
            district: districtName,
            reservoirPercentage: 0, // Will be updated to max percentage
            inflowCusecs: 0,        // Will be updated to sum of inflows
            outflowCusecs: 0,       // Will be updated to sum of outflows
            floodRiskLevel: 'low',  // Default risk, will be updated to highest calculated risk
            populationAffected: 0,  // Placeholder, not dynamically calculated in this step
            affectedArea: 0,        // Placeholder, not dynamically calculated in this step
            coordinates: representativeCoords,
            lastUpdated: res.last_updated || new Date().toISOString(), // Most recent update timestamp in this district
          });
        }

        const regionEntry = regionDataMap.get(mapKey)!; // Get the mutable reference to the region data

        // Sanitize percentage_full, ensuring it's a number and within 0-100 range
        let currentPercentageFull: number = typeof res.percentage_full === 'number'
          ? res.percentage_full
          : parseFloat(String(res.percentage_full || '0'));
        currentPercentageFull = isNaN(currentPercentageFull) ? 0 : Math.min(100, Math.max(0, currentPercentageFull));

        // Aggregate values:
        // Use the highest percentage_full encountered across all reservoirs in this district
        if (currentPercentageFull > regionEntry.reservoirPercentage) {
          regionEntry.reservoirPercentage = currentPercentageFull;
        }
        // Sum inflows from all reservoirs in this district
        regionEntry.inflowCusecs += (res.inflow_cusecs || 0);
        // Sum outflows from all reservoirs in this district
        regionEntry.outflowCusecs += (res.outflow_cusecs || 0); 

        // Update last updated timestamp to the most recent one among all reservoirs in this district
        if (res.last_updated && new Date(res.last_updated) > new Date(regionEntry.lastUpdated)) {
            regionEntry.lastUpdated = res.last_updated;
        }
        
        // IMPORTANT: The flood risk level for the region entry is calculated AFTER all individual
        // reservoir data for that region has been processed. This ensures the risk is based
        // on the aggregated (max percentage, sum inflows) data for the *entire district*.
        let calculatedRiskBasedOnAggregatedData: IMDRegionData['floodRiskLevel'] = 'low';
        if (regionEntry.reservoirPercentage >= 90 || regionEntry.inflowCusecs > 10000) {
            calculatedRiskBasedOnAggregatedData = 'severe'; // Highest risk
        } else if (regionEntry.reservoirPercentage >= 75 || regionEntry.inflowCusecs > 5000) {
            calculatedRiskBasedOnAggregatedData = 'high';   // High risk
        } else if (regionEntry.reservoirPercentage >= 50 || regionEntry.inflowCusecs > 1000) {
            calculatedRiskBasedOnAggregatedData = 'medium'; // Medium risk
        }

        // Update the overall flood risk level for the region entry if a higher risk is calculated
        const riskLevelOrder = { 'low': 0, 'medium': 1, 'high': 2, 'severe': 3 };
        if (riskLevelOrder[calculatedRiskBasedOnAggregatedData] > riskLevelOrder[regionEntry.floodRiskLevel]) {
          regionEntry.floodRiskLevel = calculatedRiskBasedOnAggregatedData;
        }
      });

      // Convert the Map values (aggregated region data) into an array
      const aggregatedResult = Array.from(regionDataMap.values());

      console.log(`SUCCESS: Aggregated data for ${aggregatedResult.length} unique regions.`);
      // Log each aggregated item for debugging purposes to verify data
      aggregatedResult.forEach(item => {
          console.log(`DEBUG_IMD_AGGREGATED: State=${item.state}, District=${item.district}, ReservoirPercentage=${item.reservoirPercentage.toFixed(2)}, InflowCusecs=${item.inflowCusecs}, FloodRiskLevel=${item.floodRiskLevel}, Coordinates=[${item.coordinates[0].toFixed(4)}, ${item.coordinates[1].toFixed(4)}]`);
      });

      return aggregatedResult;

    } catch (error: any) {
      console.error('CRITICAL ERROR in imdApiService.fetchAggregatedFloodData:', error);
      return []; // Return an empty array on critical failure to prevent app crash
    }
  },
};
