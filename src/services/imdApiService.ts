import { supabase } from '../integrations/supabase/client';
import { regions } from '../data/floodData';
import { ReservoirData } from './reservoirDataService';

// Types for IMD API responses
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
  currentLevel: number;
  dangerLevel: number;
  warningLevel: number;
  normalLevel: number;
  trend: 'rising' | 'falling' | 'stable';
  lastUpdated: string;
};

export type IMDRegionData = {
  state: string;
  district: string;
  rainfall: number;
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

// Weather API integration for rainfall data with error handling
export const fetchRainfallData = async (lat: number, lon: number, days: number = 7) => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    
    console.log(`Fetching rainfall data for coordinates: ${lat}, ${lon}`);
    
    // Open-Meteo API for historical and forecast rainfall
    const historicalUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}&daily=precipitation_sum&timezone=Asia/Kolkata`;
    
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_sum,precipitation_probability_max&timezone=Asia/Kolkata&forecast_days=10`;
    
    const [historicalResponse, forecastResponse] = await Promise.all([
      fetch(historicalUrl),
      fetch(forecastUrl)
    ]);
    
    if (!historicalResponse.ok) {
      throw new Error(`Historical weather API error: ${historicalResponse.status} ${historicalResponse.statusText}`);
    }
    
    if (!forecastResponse.ok) {
      throw new Error(`Forecast weather API error: ${forecastResponse.status} ${forecastResponse.statusText}`);
    }
    
    const historical = await historicalResponse.json();
    const forecast = await forecastResponse.json();
    
    console.log('Weather data fetched successfully:', { historical, forecast });
    
    return {
      historical: {
        dates: historical.daily?.time || [],
        precipitation: historical.daily?.precipitation_sum || []
      },
      forecast: {
        dates: forecast.daily?.time || [],
        precipitation: forecast.daily?.precipitation_sum || [],
        probability: forecast.daily?.precipitation_probability_max || []
      }
    };
  } catch (error) {
    console.error('Error fetching rainfall data:', error);
    throw new Error(`Could not fetch weather data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Fetch all reservoir data with pagination and comprehensive error handling
const fetchAllReservoirData = async (): Promise<ReservoirData[]> => {
  console.log('🔄 Fetching all reservoir data with pagination...');
  
  const allData: ReservoirData[] = [];
  const pageSize = 1000;
  let currentPage = 0;
  let hasMoreData = true;
  
  try {
    while (hasMoreData) {
      const startIndex = currentPage * pageSize;
      const endIndex = startIndex + pageSize - 1;
      
      console.log(`📖 Fetching page ${currentPage + 1} (rows ${startIndex}-${endIndex})`);
      
      const { data, error } = await supabase
        .from('indian_reservoir_levels')
        .select('id, reservoir_name, state, district, current_level_mcm, capacity_mcm, percentage_full, inflow_cusecs, outflow_cusecs, last_updated, lat, long')
        .range(startIndex, endIndex)
        .order('id');
      
      if (error) {
        console.error(`❌ Error fetching page ${currentPage + 1}:`, error);
        if (currentPage === 0) {
          // If first page fails, throw error
          throw new Error(`Database error: ${error.message}`);
        } else {
          // If subsequent pages fail, break but keep existing data
          console.warn('Partial data fetch - continuing with available data');
          break;
        }
      }
      
      if (!data || data.length === 0) {
        hasMoreData = false;
        break;
      }
      
      allData.push(...data);
      console.log(`✅ Page ${currentPage + 1}: ${data.length} records fetched`);
      
      // If we got less than pageSize records, we've reached the end
      if (data.length < pageSize) {
        hasMoreData = false;
      }
      
      currentPage++;
      
      // Safety limit to prevent infinite loops
      if (currentPage > 100) {
        console.warn('Reached maximum page limit, stopping fetch');
        break;
      }
    }
    
    console.log(`🎉 Total records fetched: ${allData.length}`);
    return allData;
    
  } catch (error) {
    console.error('💥 Critical error in pagination fetch:', error);
    throw new Error(`Reservoir data fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Fetch distinct states from Supabase with error handling
export const fetchStatesFromReservoirs = async (): Promise<string[]> => {
  try {
    console.log('🗺️ Fetching distinct states from reservoirs...');
    
    const { data, error } = await supabase
      .from('indian_reservoir_levels')
      .select('state')
      .not('state', 'is', null)
      .order('state');
    
    if (error) {
      console.error('❌ Error fetching states:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.warn('⚠️ No states found in database');
      return [];
    }
    
    const uniqueStates = Array.from(new Set(data.map(item => item.state).filter(Boolean)));
    console.log(`✅ Found ${uniqueStates.length} unique states`);
    return uniqueStates;
    
  } catch (error) {
    console.error('💥 Error fetching states:', error);
    throw new Error(`Could not fetch states: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Fetch districts for a specific state with error handling
export const fetchDistrictsForState = async (state: string): Promise<string[]> => {
  try {
    console.log(`🏘️ Fetching districts for state: ${state}`);
    
    if (!state || state.trim() === '') {
      throw new Error('State parameter is required');
    }
    
    const { data, error } = await supabase
      .from('indian_reservoir_levels')
      .select('district')
      .eq('state', state)
      .not('district', 'is', null)
      .order('district');
    
    if (error) {
      console.error('❌ Error fetching districts:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.warn(`⚠️ No districts found for state: ${state}`);
      return [];
    }
    
    const uniqueDistricts = Array.from(new Set(data.map(item => item.district).filter(Boolean)));
    console.log(`✅ Found ${uniqueDistricts.length} districts in ${state}`);
    return uniqueDistricts;
    
  } catch (error) {
    console.error('💥 Error fetching districts:', error);
    throw new Error(`Could not fetch districts: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Get coordinates for a district with error handling
export const getDistrictCoordinates = async (state: string, district: string): Promise<[number, number] | null> => {
  try {
    console.log(`📍 Getting coordinates for ${district}, ${state}`);
    
    if (!state || !district) {
      throw new Error('Both state and district parameters are required');
    }
    
    const { data, error } = await supabase
      .from('indian_reservoir_levels')
      .select('lat, long')
      .eq('state', state)
      .eq('district', district)
      .not('lat', 'is', null)
      .not('long', 'is', null)
      .limit(1);
    
    if (error) {
      console.error('❌ Error fetching coordinates:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.warn(`⚠️ No coordinates found for ${district}, ${state}`);
      return null;
    }
    
    const coords: [number, number] = [data[0].lat, data[0].long];
    console.log(`✅ Coordinates found: ${coords[0]}, ${coords[1]}`);
    return coords;
    
  } catch (error) {
    console.error('💥 Error fetching coordinates:', error);
    throw new Error(`Could not fetch coordinates: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Enhanced flood prediction logic with error handling
export const generateFloodPrediction = (
  reservoirData: ReservoirData[],
  rainfallData: any,
  coordinates: [number, number]
): { predictions: Array<{ date: string; probability: number; confidence: number }> } => {
  try {
    console.log('🧠 Generating flood prediction...', { reservoirData: reservoirData.length, coordinates });
    
    const predictions = [];
    
    // Calculate base risk from reservoir data
    let baseRisk = 0;
    if (reservoirData && reservoirData.length > 0) {
      reservoirData.forEach(reservoir => {
        const percentageFull = reservoir.percentage_full || 0;
        const inflowRate = reservoir.inflow_cusecs || 0;
        
        if (percentageFull > 90) baseRisk += 40;
        else if (percentageFull > 80) baseRisk += 25;
        else if (percentageFull > 70) baseRisk += 15;
        
        if (inflowRate > 10000) baseRisk += 30;
        else if (inflowRate > 5000) baseRisk += 20;
      });
    } else {
      // Default base risk if no reservoir data
      baseRisk = 15;
    }
    
    // Generate 10-day predictions
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      let probability = Math.min(95, baseRisk);
      
      // Factor in rainfall forecast if available
      if (rainfallData?.forecast?.precipitation?.[i] !== undefined) {
        const rainfall = rainfallData.forecast.precipitation[i];
        probability += Math.min(30, rainfall * 0.5);
      }
      
      // Decrease confidence over time
      const confidence = Math.max(60, 95 - (i * 4));
      
      predictions.push({
        date: date.toISOString().split('T')[0],
        probability: Math.round(Math.min(95, Math.max(5, probability))),
        confidence: Math.round(confidence)
      });
    }
    
    console.log('✅ Flood prediction generated successfully');
    return { predictions };
    
  } catch (error) {
    console.error('💥 Error generating flood prediction:', error);
    // Return default prediction in case of error
    const defaultPredictions = [];
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      defaultPredictions.push({
        date: date.toISOString().split('T')[0],
        probability: 20,
        confidence: 70
      });
    }
    return { predictions: defaultPredictions };
  }
};

// Main API service using enhanced pagination and error handling
export const imdApiService = {
  fetchFloodData: async (): Promise<IMDRegionData[]> => {
    console.log('🚀 Starting enhanced flood data fetch...');

    try {
      // Fetch all reservoir data with pagination
      const reservoirs = await fetchAllReservoirData();
      
      if (!reservoirs || reservoirs.length === 0) {
        console.warn('⚠️ No reservoir data found, using default regions');
        
        // Return default regions if no reservoir data
        return regions.map(region => ({
          state: region.state,
          district: region.label,
          rainfall: 0,
          floodRiskLevel: 'low' as const,
          populationAffected: 0,
          affectedArea: 0,
          coordinates: region.coordinates && region.coordinates.length >= 2 
            ? [region.coordinates[0], region.coordinates[1]] as [number, number]
            : [0, 0] as [number, number],
        }));
      }

      console.log(`📊 Processing ${reservoirs.length} reservoir records...`);

      // Process reservoir data to fit IMDRegionData structure
      const regionDataMap = new Map<string, IMDRegionData>();

      // Initialize with existing regions for compatibility
      regions.forEach(region => {
        const defaultCoordinates: [number, number] = region.coordinates && region.coordinates.length >= 2 
          ? [region.coordinates[0], region.coordinates[1]] 
          : [0, 0];
          
        regionDataMap.set(region.label.toLowerCase(), {
          state: region.state,
          district: region.label,
          rainfall: 0,
          floodRiskLevel: 'low',
          populationAffected: 0,
          affectedArea: 0,
          coordinates: defaultCoordinates,
        });
      });

      // Process all reservoir data
      for (const res of reservoirs) {
        try {
          const regionName = res.district || res.state || 'unknown';
          const lowerRegionName = regionName.toLowerCase();

          const predefinedRegion = regions.find(r =>
            r.label.toLowerCase() === lowerRegionName || r.state.toLowerCase() === lowerRegionName
          );
          
          const currentRegionLabel = predefinedRegion ? predefinedRegion.label : regionName;
          const currentRegionState = predefinedRegion ? predefinedRegion.state : (res.state || 'Unknown');

          let regionEntry = regionDataMap.get(currentRegionLabel.toLowerCase());
          if (!regionEntry) {
            const fallbackCoordinates: [number, number] = [res.lat || 0, res.long || 0];
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

          // Enhanced risk calculation
          const percentageFull = res.percentage_full || 0;
          const inflowCusecs = res.inflow_cusecs || 0;
          const outflowCusecs = res.outflow_cusecs || 0;

          const currentRainfallProxy = Math.floor(percentageFull * 3);
          if (currentRainfallProxy > regionEntry.rainfall) {
            regionEntry.rainfall = currentRainfallProxy;
          }

          // Determine flood risk level
          let riskLevel: IMDRegionData['floodRiskLevel'] = 'low';
          if (percentageFull > 90 || inflowCusecs > 10000) {
            riskLevel = 'severe';
          } else if (percentageFull > 80 || inflowCusecs > 5000) {
            riskLevel = 'high';
          } else if (percentageFull > 70 || inflowCusecs > 1000) {
            riskLevel = 'medium';
          }

          const riskLevelOrder = { 'low': 0, 'medium': 1, 'high': 2, 'severe': 3 };
          if (riskLevelOrder[riskLevel] > riskLevelOrder[regionEntry.floodRiskLevel]) {
            regionEntry.floodRiskLevel = riskLevel;
          }

          // Enhanced river data
          if (res.reservoir_name) {
            if (!regionEntry.riverData || (res.current_level_mcm && res.current_level_mcm > (regionEntry.riverData.currentLevel || 0))) {
              regionEntry.riverData = {
                name: res.reservoir_name,
                currentLevel: res.current_level_mcm || 0,
                dangerLevel: res.capacity_mcm ? res.capacity_mcm * 0.95 : 7.5,
                warningLevel: res.capacity_mcm ? res.capacity_mcm * 0.85 : 6.0,
                normalLevel: res.capacity_mcm ? res.capacity_mcm * 0.5 : 3.5,
                trend: (inflowCusecs > outflowCusecs) ? 'rising' : (outflowCusecs > inflowCusecs ? 'falling' : 'stable'),
                lastUpdated: res.last_updated || new Date().toISOString()
              };
            }
          }
        } catch (error) {
          console.error(`Error processing reservoir record:`, error, res);
          // Continue processing other records
        }
      }

      const resultData = Array.from(regionDataMap.values());
      console.log(`✅ Enhanced flood data processing complete: ${resultData.length} regions`);
      return resultData;

    } catch (error) {
      console.error('💥 Critical error in enhanced flood data fetch:', error);
      
      // Return default regions as fallback
      return regions.map(region => ({
        state: region.state,
        district: region.label,
        rainfall: 0,
        floodRiskLevel: 'low' as const,
        populationAffected: 0,
        affectedArea: 0,
        coordinates: region.coordinates && region.coordinates.length >= 2 
          ? [region.coordinates[0], region.coordinates[1]] as [number, number]
          : [0, 0] as [number, number],
      }));
    }
  }
};
