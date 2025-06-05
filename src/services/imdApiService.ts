// src/services/imdApiService.ts

import { supabase } from '../integrations/supabase/client'; // Import Supabase client
import { regions } from '../data/floodData'; // Import regions for mapping (now dynamic)
import { ReservoirData } from './reservoirDataService'; // Import ReservoirData interface

// Types for IMD API responses (unchanged, but conceptually 'rainfall' is now 'derived_rainfall')
export type IMDWeatherWarning = {
  type: 'alert' | 'warning' | 'severe' | 'watch';
  issuedBy: string;
  issuedAt: string;
  validUntil: string;
  message: string;
  affectedAreas: string;
  sourceUrl: string;
};

export type IMDRiverData = {
  name: string;
  currentLevel: number; // in MCM
  dangerLevel: number; // in MCM
  warningLevel: number; // in MCM
  normalLevel: number; // in MCM
  trend: 'rising' | 'falling' | 'stable';
  lastUpdated: string;
};

export type IMDRegionData = {
  state: string;
  district: string;
  // Renamed from 'rainfall' to be more descriptive of source.
  // This will be converted to 'currentRainfall' in FloodData.
  rainfall: number; // This will be derived from reservoir data // NOTE: This was 'reservoirPercentage' and 'inflowCusecs' in my last version
                                                                // Reverting to 'rainfall' as per user's provided code.
  floodRiskLevel: 'low' | 'medium' | 'high' | 'severe';
  populationAffected: number;
  affectedArea: number;
  riverData?: IMDRiverData;
  activeWarnings?: IMDWeatherWarning[];
  predictedFlood?: {
    date: string;
    probabilityPercentage: number;
    expectedRainfall: number;
    timeframe: string;
  };
  coordinates: [number, number];
};

// Map for accurate coordinates of each city (still useful for lookup if not in CSV)
const cityCoordinates: Record<string, [number, number]> = {
  'Mumbai': [19.0760, 72.8777],
  'Delhi': [28.7041, 77.1025],
  'Kolkata': [22.5726, 88.3639],
  'Chennai': [13.0827, 80.2707],
  'Bangalore': [12.9716, 77.5946],
  'Hyderabad': [17.3850, 78.4867],
  'Ahmedabad': [23.0225, 72.5714],
  'Pune': [18.5204, 73.8567],
  'Surat': [21.1702, 72.8311],
  'Jaipur': [26.9139, 75.8167],
  'Lucknow': [26.8467, 80.9462],
  'Kanpur': [26.4499, 80.3319],
  'Nagpur': [21.1497, 79.0882],
  'Patna': [25.5941, 85.1417],
  'Indore': [22.7167, 75.8472],
  'Kochi': [9.9312, 76.2600],
  'Guwahati': [26.1445, 91.7362]
};

// Helper to get state for region (now uses the dynamic regions array)
const getStateForRegion = (regionName: string): string => {
  const foundRegion = regions.find(r => r.value === regionName.toLowerCase());
  return foundRegion ? foundRegion.state : 'N/A';
};

// Live API service using Supabase
export const imdApiService = {
  fetchFloodData: async (): Promise<IMDRegionData[]> => {
    console.log('Fetching live data from Supabase (indian_reservoir_levels)...');

    try {
      // Fetch all reservoir data
      const { data: reservoirs, error } = await supabase
        .from('indian_reservoir_levels')
        .select('reservoir_name, state, district, current_level_mcm, capacity_mcm, percentage_full, inflow_cusecs, outflow_cusecs, last_updated, lat, long');

      if (error) {
        console.error('Error fetching reservoir data from Supabase:', error);
        return []; // Return empty array on error
      }

      if (!reservoirs || reservoirs.length === 0) {
        console.warn('No reservoir data found in Supabase.');
        return []; // Return empty array if no data
      }

      console.log(`Successfully fetched ${reservoirs.length} reservoir records from Supabase.`);

      // Process reservoir data to fit IMDRegionData structure
      const regionDataMap = new Map<string, IMDRegionData>();

      // Initialize regionDataMap with all regions to ensure all are present, even if no reservoir data
      // Use the dynamically loaded 'regions' here
      regions.forEach(region => {
        // Prefer coordinates from the regions array (derived from weather.csv)
        const defaultCoordinates: [number, number] = region.coordinates && region.coordinates.length >= 2 
          ? [region.coordinates[0], region.coordinates[1]] 
          : cityCoordinates[region.label] || [0, 0];
        regionDataMap.set(region.label.toLowerCase(), {
          state: region.state,
          district: region.label,
          rainfall: 0, // Default to 0, will be updated
          floodRiskLevel: 'low', // Default, will be updated
          populationAffected: 0,
          affectedArea: 0,
          coordinates: defaultCoordinates,
          // Other fields can be undefined or default
        });
      });


      reservoirs.forEach((res: ReservoirData) => {
        const regionName = res.district || res.state || 'unknown'; // Use district or state as region identifier
        const lowerRegionName = regionName.toLowerCase();

        // Find the corresponding predefined region to get its label
        const predefinedRegion = regions.find(r =>
          r.label.toLowerCase() === lowerRegionName || r.state.toLowerCase() === lowerRegionName
        );
        const currentRegionLabel = predefinedRegion ? predefinedRegion.label : regionName;
        const currentRegionState = predefinedRegion ? predefinedRegion.state : getStateForRegion(regionName);

        // Get or create IMDRegionData for this region
        let regionEntry = regionDataMap.get(currentRegionLabel.toLowerCase());
        if (!regionEntry) {
          const fallbackCoordinates: [number, number] = cityCoordinates[currentRegionLabel] || [res.lat || 0, res.long || 0];
          regionEntry = {
            state: currentRegionState,
            district: currentRegionLabel,
            rainfall: 0,
            floodRiskLevel: 'low',
            populationAffected: 0,
            affectedArea: 0,
            coordinates: fallbackCoordinates,
          };
          regionDataMap.set(currentRegionLabel.toLowerCase(), regionEntry);
        }

        // --- Map Reservoir Data to IMDRegionData fields ---
        // For 'rainfall', we'll use 'percentage_full' as a proxy for water abundance/flood potential.
        // Scale it to a plausible rainfall range (e.g., 0-400mm)
        const percentageFull = res.percentage_full || 0;
        const inflowCusecs = res.inflow_cusecs || 0;
        const outflowCusecs = res.outflow_cusecs || 0;

        // Simple aggregation: take the highest percentage full or inflow for a region for now
        // Or, if multiple reservoirs, average them or pick the most critical one.
        // For simplicity, let's just update if the current reservoir indicates a higher "rainfall" proxy
        const currentRainfallProxy = Math.floor(percentageFull * 3); // Scale 0-100% to 0-300mm
        if (currentRainfallProxy > regionEntry.rainfall) {
          regionEntry.rainfall = currentRainfallProxy;
        }

        // Determine flood risk level based on percentage full and inflow
        let riskLevel: IMDRegionData['floodRiskLevel'] = 'low';
        if (percentageFull > 90 || inflowCusecs > 10000) {
          riskLevel = 'severe';
        } else if (percentageFull > 80 || inflowCusecs > 5000) {
          riskLevel = 'high';
        } else if (percentageFull > 70 || inflowCusecs > 1000) {
          riskLevel = 'medium';
        }
        // Update risk level if this reservoir indicates a higher risk
        const riskLevelOrder = { 'low': 0, 'medium': 1, 'high': 2, 'severe': 3 };
        if (riskLevelOrder[riskLevel] > riskLevelOrder[regionEntry.floodRiskLevel]) {
          regionEntry.floodRiskLevel = riskLevel;
        }

        // Populate riverData if relevant
        if (res.reservoir_name) {
          // If there's already river data, decide whether to update (e.g., take the highest level)
          if (!regionEntry.riverData || (res.current_level_mcm && res.current_level_mcm > (regionEntry.riverData.currentLevel || 0))) {
            regionEntry.riverData = {
              name: res.reservoir_name,
              currentLevel: res.current_level_mcm || 0,
              dangerLevel: res.capacity_mcm ? res.capacity_mcm * 0.95 : 7.5, // 95% of capacity as danger
              warningLevel: res.capacity_mcm ? res.capacity_mcm * 0.85 : 6.0, // 85% of capacity as warning
              normalLevel: res.capacity_mcm ? res.capacity_mcm * 0.5 : 3.5, // 50% of capacity as normal
              trend: (inflowCusecs > outflowCusecs) ? 'rising' : (outflowCusecs > inflowCusecs ? 'falling' : 'stable'),
              lastUpdated: res.last_updated || new Date().toISOString()
            };
          }
        }
      });

      const resultData = Array.from(regionDataMap.values());
      console.log('Live IMD data fetched and processed successfully:', resultData);
      return resultData;

    } catch (error) {
      console.error('Error fetching live IMD data from Supabase:', error);
      return []; // Return empty array on critical failure
    }
  }
};

