// src/services/imdApiService.ts

import { supabase } from '../integrations/supabase/client';
// No longer importing 'regions' directly here as it will be derived or managed elsewhere for dropdowns
// import { regions } from '../data/floodData'; // This import should eventually be removed or modified if 'regions' is dynamically built
import { ReservoirData } from './reservoirDataService'; // Assuming this interface is correct

// Type for IMDRegionData based on our Supabase data structure
export type IMDRegionData = {
  state: string;
  district: string;
  reservoirPercentage: number;
  inflowCusecs: number;
  outflowCusecs: number; // Added outflowCusecs for completeness
  floodRiskLevel: 'low' | 'medium' | 'high' | 'severe';
  populationAffected: number; // Placeholder for now
  affectedArea: number;       // Placeholder for now
  coordinates: [number, number]; // Coordinates for the district/region (will use data from Supabase or GeoJSON)
  lastUpdated: string; // Latest last_updated from aggregated reservoirs
};

// Define the maximum number of records to fetch per Supabase request
const SUPABASE_FETCH_LIMIT = 1000; // Standard Supabase limit per request, for pagination

export const imdApiService = {
  fetchFloodData: async (): Promise<IMDRegionData[]> => {
    console.log('Fetching ALL live data from Supabase (indian_reservoir_levels) with pagination...');

    let allReservoirs: ReservoirData[] = [];
    let offset = 0;
    let hasMore = true;

    try {
      while (hasMore) {
        // Fetch data in chunks using .range() instead of .limit()
        const { data: reservoirs, error } = await supabase
          .from('indian_reservoir_levels')
          .select('reservoir_name, state, district, current_level_mcm, capacity_mcm, percentage_full, inflow_cusecs, outflow_cusecs, last_updated, lat, long')
          .range(offset, offset + SUPABASE_FETCH_LIMIT - 1); // Supabase range is inclusive

        if (error) {
          console.error('Error fetching reservoir data from Supabase during pagination:', error);
          // If an error occurs, stop fetching and return what we have so far
          hasMore = false;
          break;
        }

        if (!reservoirs || reservoirs.length === 0) {
          hasMore = false; // No more records or first fetch returned nothing
        } else {
          allReservoirs = allReservoirs.concat(reservoirs);
          console.log(`Fetched batch: ${reservoirs.length} records. Total so far: ${allReservoirs.length}`);
          offset += reservoirs.length; // Increment offset by actual fetched count

          // If the number of records returned is less than the limit, it means it's the last batch
          if (reservoirs.length < SUPABASE_FETCH_LIMIT) {
            hasMore = false;
          }
        }
      }

      if (allReservoirs.length === 0) {
        console.warn('No reservoir data found in Supabase after all pagination attempts.');
        return [];
      }

      console.log(`Successfully fetched total of ${allReservoirs.length} reservoir records from Supabase.`);

      // --- Aggregation Logic: Process raw reservoir data into aggregated IMDRegionData ---
      const regionDataMap = new Map<string, IMDRegionData>(); // Key: 'state_district' (lowercase)

      allReservoirs.forEach((res: ReservoirData) => {
        const stateName = res.state ? res.state.trim() : 'Unknown State';
        const districtName = res.district ? res.district.trim() : 'Unknown District';
        const mapKey = `${stateName.toLowerCase()}_${districtName.toLowerCase()}`;

        // Initialize region entry if it doesn't exist
        if (!regionDataMap.has(mapKey)) {
          // Use the first reservoir's coordinates for the district, or a default
          const defaultCoords: [number, number] = [res.lat || 20.5937, res.long || 78.9629]; 
          regionDataMap.set(mapKey, {
            state: stateName,
            district: districtName,
            reservoirPercentage: 0,
            inflowCusecs: 0,
            outflowCusecs: 0,
            floodRiskLevel: 'low',
            populationAffected: 0,
            affectedArea: 0,
            coordinates: defaultCoords, 
            lastUpdated: res.last_updated || new Date().toISOString(),
          });
        }

        const regionEntry = regionDataMap.get(mapKey)!; // Assert not undefined as we just ensured it exists

        // Aggregate values: Use max percentage, sum inflows/outflows
        let currentPercentageFull: number = typeof res.percentage_full === 'number' ? res.percentage_full : parseFloat(String(res.percentage_full) || '0');
        currentPercentageFull = isNaN(currentPercentageFull) ? 0 : Math.min(100, Math.max(0, currentPercentageFull));
        
        // Use the highest percentage_full encountered for the district
        if (currentPercentageFull > regionEntry.reservoirPercentage) {
          regionEntry.reservoirPercentage = currentPercentageFull;
        }
        // Sum inflows for the district
        regionEntry.inflowCusecs += (res.inflow_cusecs || 0);
        // Sum outflows for the district
        regionEntry.outflowCusecs += (res.outflow_cusecs || 0);

        // Update last updated if more recent
        if (res.last_updated && new Date(res.last_updated) > new Date(regionEntry.lastUpdated)) {
            regionEntry.lastUpdated = res.last_updated;
        }

        // --- Determine Flood Risk Level (Aggressive Thresholds, non-random) ---
        let riskLevel: IMDRegionData['floodRiskLevel'] = 'low';
        // Logic for risk: very sensitive for demonstration purposes
        if (regionEntry.reservoirPercentage >= 50 || regionEntry.inflowCusecs >= 1000) {
          riskLevel = 'severe';
        } else if (regionEntry.reservoirPercentage >= 30 || regionEntry.inflowCusecs >= 100) {
          riskLevel = 'high';
        } else if (regionEntry.reservoirPercentage >= 5 || regionEntry.inflowCusecs >= 10) {
          riskLevel = 'medium';
        }

        // Update risk level if this reservoir's contribution leads to a higher risk for the district
        const riskLevelOrder = { 'low': 0, 'medium': 1, 'high': 2, 'severe': 3 };
        if (riskLevelOrder[riskLevel] > riskLevelOrder[regionEntry.floodRiskLevel]) {
          regionEntry.floodRiskLevel = riskLevel;
        }

        // populationAffected and affectedArea remain 0 as per "no dummy data" rule unless source provides
        // These fields are placeholders to match IMDRegionData structure
        // regionEntry.populationAffected = 0;
        // regionEntry.affectedArea = 0;
      });

      const resultData = Array.from(regionDataMap.values());

      // DEBUG LOG: Log aggregated region data before returning
      resultData.forEach(item => {
          console.log(`DEBUG_IMD_AGGREGATED: State=${item.state}, District=${item.district}, ReservoirPercentage=${item.reservoirPercentage.toFixed(2)}, InflowCusecs=${item.inflowCusecs}, OutflowCusecs=${item.outflowCusecs}, FloodRiskLevel=${item.floodRiskLevel}, Coordinates=[${item.coordinates[0].toFixed(4)}, ${item.coordinates[1].toFixed(4)}]`);
      });
      console.log(`Live IMD data fetched and aggregated successfully for ${resultData.length} regions.`);
      return resultData;

    } catch (error) {
      console.error('Critical error in fetchFloodData:', error);
      return []; // Return empty array on critical failure
    }
  }
};
