// src/services/imdApiService.ts

import { supabase } from '../integrations/supabase/client'; // Import Supabase client
import { regions } from '../data/floodData'; // Import regions for mapping (now dynamic)
import { ReservoirData } from './reservoirDataService'; // Import ReservoirData interface

// Types for IMD API responses (unchanged)
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
  reservoirPercentage: number;
  inflowCusecs: number;
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
  'Jaipur': [26.9167, 75.8167],
  'Lucknow': [26.8467, 80.9462],
  'Kanpur': [26.4667, 80.35],
  'Nagpur': [21.1497, 79.0806],
  'Patna': [25.61, 85.1417],
  'Indore': [22.7167, 75.8472],
  'Kochi': [9.9312, 76.2600],
  'Guwahati': [26.1833, 91.75]
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
          reservoirPercentage: 0, // Initialized
          inflowCusecs: 0,        // Initialized
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
            reservoirPercentage: 0,
            inflowCusecs: 0,
            floodRiskLevel: 'low',
            populationAffected: 0,
            affectedArea: 0,
            coordinates: fallbackCoordinates,
          };
          regionDataMap.set(currentRegionLabel.toLowerCase(), regionEntry);
        }

        // --- Aggregate Reservoir Data to IMDRegionData fields ---
        // Take max percentageFull and sum inflowCusecs for a given district/region
        const percentageFull = res.percentage_full || 0;
        const inflowCusecs = res.inflow_cusecs || 0;
        const outflowCusecs = res.outflow_cusecs || 0;

        // DEBUG LOG: Log raw values from each reservoir record
        console.log(`DEBUG_IMD_RAW: Reservoir=${res.reservoir_name}, District=${res.district}, PercentageFull=${percentageFull}, InflowCusecs=${inflowCusecs}`);


        if (percentageFull > regionEntry.reservoirPercentage) {
            regionEntry.reservoirPercentage = percentageFull;
        }
        regionEntry.inflowCusecs += inflowCusecs; // Sum inflows for the region

        // Determine flood risk level based on aggregated percentage full and inflow
        // Adjusted thresholds for risk levels based on percentage full and inflow
        let riskLevel: IMDRegionData['floodRiskLevel'] = 'low';
        // **ADJUSTED THRESHOLDS for more sensitive risk detection**
        // These thresholds were adjusted aggressively in the last response.
        // We need to see the raw data to confirm if they are appropriate.
        if (regionEntry.reservoirPercentage >= 80 || regionEntry.inflowCusecs >= 5000) { // Very high
          riskLevel = 'severe';
        } else if (regionEntry.reservoirPercentage >= 60 || regionEntry.inflowCusecs >= 1000) { // High
          riskLevel = 'high';
        } else if (regionEntry.reservoirPercentage >= 40 || regionEntry.inflowCusecs >= 200) { // Medium
          riskLevel = 'medium';
        }
        // Update risk level if this reservoir's contribution leads to a higher risk
        const riskLevelOrder = { 'low': 0, 'medium': 1, 'high': 2, 'severe': 3 };
        if (riskLevelOrder[riskLevel] > riskLevelOrder[regionEntry.floodRiskLevel]) {
          regionEntry.floodRiskLevel = riskLevel;
        }

        // Populate riverData if relevant. We'll store the reservoir with max current level.
        if (res.reservoir_name) {
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
      // DEBUG LOG: Log aggregated region data before returning
      resultData.forEach(item => {
          console.log(`DEBUG_IMD_AGGREGATED: District=${item.district}, ReservoirPercentage=${item.reservoirPercentage}, InflowCusecs=${item.inflowCusecs}, FloodRiskLevel=${item.floodRiskLevel}`);
      });
      console.log('Live IMD data fetched and processed successfully:', resultData);
      return resultData;

    } catch (error) {
      console.error('Error fetching live IMD data from Supabase:', error);
      return []; // Return empty array on critical failure
    }
  }
};

