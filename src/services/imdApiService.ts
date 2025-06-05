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
  'Jaipur': [26.9139, 75.8167],
  'Lucknow': [26.8467, 80.9462],
  'Kanpur': [26.4499, 80.3319],
  'Nagpur': [21.1497, 79.0806],
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

      // Initialize regionDataMap with all regions to ensure all are present
      regions.forEach(region => {
        const defaultCoordinates: [number, number] = region.coordinates && region.coordinates.length >= 2 
          ? [region.coordinates[0], region.coordinates[1]] 
          : cityCoordinates[region.label] || [0, 0];
        regionDataMap.set(region.label.toLowerCase(), {
          state: region.state,
          district: region.label,
          reservoirPercentage: 0, 
          inflowCusecs: 0,        
          floodRiskLevel: 'low', 
          populationAffected: 0,
          affectedArea: 0,
          coordinates: defaultCoordinates,
        });
      });

      // Special handling for an 'unknown' region to catch unmapped data
      // Ensure 'unknown' region is initialized.
      if (!regionDataMap.has('unknown')) {
          regionDataMap.set('unknown', {
              state: 'N/A', // Or a more appropriate default state
              district: 'unknown',
              reservoirPercentage: 0,
              inflowCusecs: 0,
              floodRiskLevel: 'low',
              populationAffected: 0,
              affectedArea: 0,
              coordinates: [20.5937, 78.9629], // Center of India or a sensible default
          });
      }


      reservoirs.forEach((res: ReservoirData) => {
        let regionName: string = 'unknown'; // Default to unknown
        let matchedRegion = false;

        // 1. Try to match by district name first
        if (res.district) {
            const potentialRegion = regions.find(r => r.label.toLowerCase() === res.district.toLowerCase());
            if (potentialRegion) {
                regionName = potentialRegion.label;
                matchedRegion = true;
            }
        }
        
        // 2. If no district match, try to match by state
        if (!matchedRegion && res.state) {
            const potentialRegion = regions.find(r => r.state.toLowerCase() === res.state.toLowerCase());
            if (potentialRegion) {
                regionName = potentialRegion.label; // Use the region's main label
                matchedRegion = true;
            }
        }
        
        // If still no match, it remains 'unknown' based on the default initialization
        const lowerRegionName = regionName.toLowerCase();

        // Get or create IMDRegionData for this region
        let regionEntry = regionDataMap.get(lowerRegionName);
        if (!regionEntry) {
            // This should ideally not happen if 'regions' contains all relevant cities and 'unknown' is initialized.
            // But as a safeguard for unexpected district/state names from Supabase not in our CSV.
            const fallbackCoordinates: [number, number] = cityCoordinates[regionName] || [res.lat || 0, res.long || 0];
            regionEntry = {
                state: getStateForRegion(regionName), 
                district: regionName,
                reservoirPercentage: 0,
                inflowCusecs: 0,
                floodRiskLevel: 'low',
                populationAffected: 0,
                affectedArea: 0,
                coordinates: fallbackCoordinates,
            };
            regionDataMap.set(lowerRegionName, regionEntry);
        }

        // --- Aggregate Reservoir Data to IMDRegionData fields ---
        // Sanitize percentage_full: ensure it's a number and within a reasonable range (0-100)
        const rawPercentageFull = parseFloat(res.percentage_full as any); // Cast to any to handle potential string numbers
        const percentageFull = isNaN(rawPercentageFull) ? 0 : Math.min(100, Math.max(0, rawPercentageFull));
        
        const inflowCusecs = res.inflow_cusecs || 0;
        const outflowCusecs = res.outflow_cusecs || 0; // Not directly used in IMDRegionData, but good for trend

        // DEBUG LOG: Log raw values from each reservoir record
        console.log(`DEBUG_IMD_RAW: Reservoir=${res.reservoir_name}, District=${res.district}, MappedTo=${regionName}, CleanedPercentageFull=${percentageFull}, InflowCusecs=${inflowCusecs}`);
        
        // NEW DEBUG LOG: To trace the 'unknown' aggregation issue (now less likely to have erroneous data)
        if (lowerRegionName === 'unknown') {
            console.log(`DEBUG_UNKNOWN_AGG: Reservoir=${res.reservoir_name}, MappedRegion='${regionName}', RawPerc=${res.percentage_full}, CleanedPerc=${percentageFull}, RawInflow=${res.inflow_cusecs}`);
        }


        if (percentageFull > regionEntry.reservoirPercentage) {
            regionEntry.reservoirPercentage = percentageFull;
        }
        regionEntry.inflowCusecs += inflowCusecs; // Sum inflows for the region

        // Determine flood risk level based on aggregated percentage full and inflow
        // **ADJUSTED THRESHOLDS for more sensitive risk detection**
        // These thresholds are slightly adjusted based on the assumption that even lower values should indicate risk.
        let riskLevel: IMDRegionData['floodRiskLevel'] = 'low';
        if (regionEntry.reservoirPercentage >= 75 || regionEntry.inflowCusecs >= 2000) { // Very high
          riskLevel = 'severe';
        } else if (regionEntry.reservoirPercentage >= 50 || regionEntry.inflowCusecs >= 500) { // High
          riskLevel = 'high';
        } else if (regionEntry.reservoirPercentage >= 20 || regionEntry.inflowCusecs >= 50) { // Medium
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
