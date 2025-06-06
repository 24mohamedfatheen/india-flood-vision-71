import { IMDRegionData } from '../services/imdApiService';
import { imdApiService } from '../services/imdApiService'; // Import the live API service
import { staticHistoricalRainfallData } from './staticHistoricalRainfallData'; // Import the new static historical data
import { parseCsv } from '../utils/csvParser'; // Import the CSV parser

// Hardcoded content of weather.csv for direct use in the browser environment
// This avoids needing to read a file from the file system.
const WEATHER_CSV_CONTENT = `
,city,lat,lng,country,iso2,admin_name,capital,population,population_proper
0,Mumbai,19.076,72.8777,India,IN,Maharashtra,admin,20000000,12442373
1,Delhi,28.66,77.2167,India,IN,Delhi,admin,25000000,16314838
2,Bengaluru,12.9719,77.5937,India,IN,Karnataka,admin,13193000,8443675
3,Hyderabad,17.385,78.4867,India,IN,Telangana,admin,9746000,6993262
4,Ahmedabad,23.03,72.58,India,IN,Gujarat,admin,8650000,5570585
5,Chennai,13.0825,80.275,India,IN,Tamil Nadu,admin,9714000,4646732
6,Kolkata,22.5667,88.3667,India,IN,West Bengal,admin,14681000,4496694
7,Surat,21.1667,72.8333,India,IN,Gujarat,,6936000,4462006
8,Pune,18.5203,73.8567,India,IN,Maharashtra,,6200000,3124458
9,Jaipur,26.9167,75.8167,India,IN,Rajasthan,admin,3766000,3046163
10,Lucknow,26.8467,80.9462,India,IN,Uttar Pradesh,admin,3382000,2815601
11,Kanpur,26.4667,80.35,India,IN,Uttar Pradesh,,3100000,2920496
12,Nagpur,21.1497,79.0806,India,IN,Maharashtra,,2900000,2405665
13,Patna,25.61,85.1417,India,IN,Bihar,admin,2500000,2046652
14,Indore,22.7167,75.8472,India,IN,Madhya Pradesh,,2400000,1964086
15,Kochi,9.9667,76.2833,India,IN,Kerala,,2300000,602046
16,Guwahati,26.1833,91.75,India,IN,Assam,,1100000,962334
`;

// Define an interface for the parsed CSV data
interface CityData {
  city: string;
  lat: number;
  lng: number;
  admin_name: string; // This will be the state
}

// Parse the CSV content to dynamically generate regions
const parsedCities = parseCsv<CityData>(WEATHER_CSV_CONTENT);

// Map parsed cities to your existing regions format
export const regions = parsedCities.map(city => ({
  value: city.city.toLowerCase(),
  label: city.city,
  state: city.admin_name || 'N/A', // Use admin_name as state, fallback if empty
  coordinates: [city.lat, city.lng] // Add coordinates for consistency
}));

// Ensure FloodData interface is consistent with IMDRegionData for flexibility
// Added historicalRainfallData to this interface
export interface FloodData {
  id: number;
  region: string;
  state: string;
  riskLevel: 'low' | 'medium' | 'high' | 'severe';
  affectedArea: number;
  populationAffected: number;
  coordinates: [number, number]; // [latitude, longitude]
  timestamp: string;
  currentRainfall: number; // Renamed from 'rainfall' to be explicit about current rainfall
  historicalRainfallData: { year: number; month: string; rainfall: number; }[]; // Updated type for multi-year data
  predictionAccuracy: number;
  riverLevel?: number;
  predictedFlood?: {
    date: string;
    probabilityPercentage: number;
    timestamp?: string;
    predictedEvent?: string;
    predictedLocation?: string;
    timeframe?: string;
    supportingData?: string;
    expectedRainfall?: number;
    expectedRiverRise?: number;
    source?: {
      name: string;
      url: string;
      type?: string;
    }
  };
  riverData?: {
    name: string;
    currentLevel: number;
    dangerLevel: number;
    warningLevel: number;
    normalLevel: number;
    trend: 'rising' | 'falling' | 'stable';
    source: {
      name: string;
      url: string;
      type?: string;
    }
  };
  activeWarnings?: {
    type: 'severe' | 'warning' | 'alert' | 'watch';
    issuedBy: string;
    issuedAt: string;
    validUntil: string;
    message: string;
    sourceUrl: string;
  }[];
  estimatedDamage?: {
    crops: number;
    properties: number;
    infrastructure?: number;
  };
}

// This will now be a mutable array that stores either live data or static fallback
export let floodData: FloodData[] = [];

// Add proper type for the cached data with timestamp
interface CachedIMDData {
  data: IMDRegionData[];
  timestamp: string;
  expiresAt: string; // When this cache expires
}

// Replace simple cache with a proper cache object
let imdDataCache: CachedIMDData | null = null;

// Cache validity duration in milliseconds (6 hours)
const CACHE_VALIDITY_DURATION = 6 * 60 * 60 * 1000;

// Local storage key for persisting cache
const IMD_CACHE_KEY = 'imd_data_cache';

// Helper function to map IMDRegionData to FloodData
// This is necessary because IMDRegionData is what imdApiService returns,
// but floodData and getFloodDataForRegion expect FloodData.
const mapIMDRegionDataToFloodData = (imdData: IMDRegionData[]): FloodData[] => {
  const currentYear = new Date().getFullYear();
  return imdData.map((item, index) => {
    // Attempt to get static historical data for the region and current year
    const staticHistorical = staticHistoricalRainfallData[item.district.toLowerCase()]?.filter(d => d.year === currentYear);

    // If static historical data for the current year is available, use it.
    // Otherwise, generate a plausible pattern based on the current rainfall from live data.
    const historicalDataForChart = staticHistorical && staticHistorical.length === 12
      ? staticHistorical
      : (() => {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const baseRainfall = item.rainfall; // This is the derived 'current rainfall' from reservoir data
          return months.map((month, idx) => {
            let monthlyRainfall = baseRainfall;
            if (idx >= 5 && idx <= 8) { // Jun-Sep (monsoon peak)
              monthlyRainfall = Math.floor(baseRainfall * (1.2 + (Math.random() * 0.4)));
            } else if (idx >= 9 && idx <= 11) { // Oct-Dec (post-monsoon)
              monthlyRainfall = Math.floor(baseRainfall * (0.6 + (Math.random() * 0.4)));
            } else { // Jan-May (pre-monsoon)
              monthlyRainfall = Math.floor(baseRainfall * (0.3 + (Math.random() * 0.3)));
            }
            return { year: currentYear, month, rainfall: Math.max(0, monthlyRainfall) };
          });
        })();

    // Find coordinates from the dynamically generated regions
    const regionCoords = regions.find(r => r.value === item.district.toLowerCase())?.coordinates || item.coordinates;

    return {
      id: index + 1, // Generate a simple ID
      region: item.district,
      state: item.state,
      riskLevel: item.floodRiskLevel,
      affectedArea: item.affectedArea,
      populationAffected: item.populationAffected,
      coordinates: regionCoords as [number, number], // Type assertion to fix coordinates
      timestamp: new Date().toISOString(), // Use current time for consistency
      currentRainfall: item.rainfall, // This is the current/derived rainfall
      historicalRainfallData: historicalDataForChart, // Populate with generated or static historical data
      predictionAccuracy: 85, // Default or derive from IMDRegionData if available
      riverLevel: item.riverData?.currentLevel,
      predictedFlood: item.predictedFlood,
      riverData: item.riverData ? {
        name: item.riverData.name,
        currentLevel: item.riverData.currentLevel,
        dangerLevel: item.riverData.dangerLevel,
        warningLevel: item.riverData.warningLevel,
        normalLevel: item.riverData.normalLevel,
        trend: item.riverData.trend,
        source: { name: 'Live Data', url: '' } // Placeholder source
      } : undefined,
      activeWarnings: item.activeWarnings,
      estimatedDamage: { crops: 0, properties: 0, infrastructure: 0 } // Default or derive
    };
  });
};

// Load cache from localStorage on init
const loadCachedData = (): void => {
  try {
    const storedCache = localStorage.getItem(IMD_CACHE_KEY);
    if (storedCache) {
      const parsedCache = JSON.parse(storedCache) as CachedIMDData;

      // Check if cache is still valid
      if (new Date(parsedCache.expiresAt).getTime() > Date.now()) {
        imdDataCache = parsedCache;
        console.log('Loaded valid IMD data from local storage cache');
        floodData = mapIMDRegionDataToFloodData(parsedCache.data); // Populate floodData on load
      } else {
        console.log('Cached IMD data expired, will fetch fresh data');
        localStorage.removeItem(IMD_CACHE_KEY);
      }
    }
  } catch (error) {
    console.error('Error loading cached IMD data:', error);
    localStorage.removeItem(IMD_CACHE_KEY);
  }
};

// Initialize by loading cache
loadCachedData();

// Improved API fetch function with proper caching and fallback
export const fetchImdData = async (forceRefresh = false): Promise<FloodData[]> => {
  console.log('fetchImdData called, forceRefresh:', forceRefresh);

  // Return cached data if available and not forcing refresh
  if (!forceRefresh && imdDataCache && new Date(imdDataCache.expiresAt).getTime() > Date.now()) {
    console.log('Using cached IMD data from', new Date(imdDataCache.timestamp).toLocaleString());
    floodData = mapIMDRegionDataToFloodData(imdDataCache.data); // Update global floodData
    return floodData;
  }

  try {
    console.log('Attempting to fetch fresh IMD data from live API...');

    // Attempt to fetch from the live API
    const liveImdData = await imdApiService.fetchFloodData();

    if (liveImdData && liveImdData.length > 0) {
      const now = new Date();
      const newCache: CachedIMDData = {
        data: liveImdData,
        timestamp: now.toISOString(),
        expiresAt: new Date(now.getTime() + CACHE_VALIDITY_DURATION).toISOString()
      };

      imdDataCache = newCache; // Update in-memory cache
      try {
        localStorage.setItem(IMD_CACHE_KEY, JSON.stringify(newCache)); // Persist cache
      } catch (storageError) {
        console.warn('Failed to store IMD data in localStorage:', storageError);
      }

      console.log('Fresh IMD data fetched from live API and cached at', now.toLocaleString());
      floodData = mapIMDRegionDataToFloodData(liveImdData); // Update global floodData
      return floodData;
    } else {
      console.warn('Live API returned no data. Falling back to static data.');
      // Fallback to static data from staticHistoricalRainfallData
      // Create FloodData objects for each region, populating historicalRainfallData
      floodData = regions.map(r => {
        const staticHistorical = staticHistoricalRainfallData[r.value];
        const currentYear = new Date().getFullYear();
        const currentYearData = staticHistorical?.filter(d => d.year === currentYear);

        // If specific year data is not available in staticHistoricalRainfallData,
        // we'll use a placeholder or average for currentRainfall and generate historical
        // for the current year based on that.
        let currentRainfallValue = 0;
        if (currentYearData && currentYearData.length > 0) {
          currentRainfallValue = currentYearData.reduce((sum, item) => sum + item.rainfall, 0) / currentYearData.length;
        } else if (staticHistorical && staticHistorical.length > 0) {
          // If current year data is not present, take an average from all available static years
          const allStaticRainfall = staticHistorical.map(d => d.rainfall);
          currentRainfallValue = allStaticRainfall.reduce((sum, val) => sum + val, 0) / allStaticRainfall.length;
        }

        return {
          id: regions.indexOf(r) + 1,
          region: r.label,
          state: r.state,
          riskLevel: 'low' as const, // Default, could be derived from static data if available
          affectedArea: 0,
          populationAffected: 0,
          coordinates: r.coordinates as [number, number], // Type assertion to fix coordinates
          timestamp: new Date().toISOString(),
          currentRainfall: Math.floor(currentRainfallValue),
          historicalRainfallData: staticHistorical || [], // Use the full static historical data
          predictionAccuracy: 70,
        };
      });
      return floodData;
    }

  } catch (error) {
    console.error('Error fetching IMD data from live API, falling back to static:', error);

    // If fetch fails but we have cached data, use it even if expired
    if (imdDataCache) {
      console.log('Using expired cached data due to fetch failure');
      floodData = mapIMDRegionDataToFloodData(imdDataCache.data); // Update global floodData
      return floodData;
    }

    // Return static data if no cached data available and live fetch failed
    console.log('No cached data, returning static data.');
    // Fallback to static data from staticHistoricalRainfallData
    floodData = regions.map(r => {
      const staticHistorical = staticHistoricalRainfallData[r.value];
      const currentYear = new Date().getFullYear();
      const currentYearData = staticHistorical?.filter(d => d.year === currentYear);

      let currentRainfallValue = 0;
      if (currentYearData && currentYearData.length > 0) {
        currentRainfallValue = currentYearData.reduce((sum, item) => sum + item.rainfall, 0) / currentYearData.length;
      } else if (staticHistorical && staticHistorical.length > 0) {
        const allStaticRainfall = staticHistorical.map(d => d.rainfall);
        currentRainfallValue = allStaticRainfall.reduce((sum, val) => sum + val, 0) / allStaticRainfall.length;
      }

      return {
        id: regions.indexOf(r) + 1,
        region: r.label,
        state: r.state,
        riskLevel: 'low' as const,
        affectedArea: 0,
        populationAffected: 0,
        coordinates: r.coordinates as [number, number], // Type assertion to fix coordinates
        timestamp: new Date().toISOString(),
        currentRainfall: Math.floor(currentRainfallValue),
        historicalRainfallData: staticHistorical || [],
        predictionAccuracy: 70,
      };
    });
    return floodData;
  }
};

// Improved function to get region data with consistency
export const getFloodDataForRegion = (region: string): FloodData | null => {
  const regionLower = region.toLowerCase();
  const matchingRegion = floodData.find(data =>
    data.region.toLowerCase() === regionLower
  );

  if (matchingRegion) {
    return matchingRegion;
  }

  // If no match is found, return Mumbai as default from the current floodData
  return floodData[0] || null; // Ensure floodData[0] exists
};

// Add functions for chart section
export const getHistoricalRainfallData = (region: string, year: number) => {
  const regionData = getFloodDataForRegion(region);

  if (!regionData || !regionData.historicalRainfallData || regionData.historicalRainfallData.length === 0) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({ month, rainfall: 0 }));
  }

  // Filter historical data by the selected year
  const yearData = regionData.historicalRainfallData.filter(d => d.year === year);

  if (yearData.length === 0) {
    // If no specific year data is found, we can try to generate a plausible pattern
    // based on the overall average of the static data for that region if available,
    // or a default.
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const allRainfallValues = regionData.historicalRainfallData.map(d => d.rainfall);
    const averageRainfall = allRainfallValues.length > 0 ? allRainfallValues.reduce((sum, val) => sum + val, 0) / allRainfallValues.length : 0;

    // Generate a plausible pattern for the selected year based on average
    return months.map((month, idx) => {
      let monthlyRainfall = averageRainfall;
      if (idx >= 5 && idx <= 8) { // Jun-Sep (monsoon peak)
        monthlyRainfall = Math.floor(averageRainfall * (1.2 + (Math.random() * 0.4)));
      } else if (idx >= 9 && idx <= 11) { // Oct-Dec (post-monsoon)
        monthlyRainfall = Math.floor(averageRainfall * (0.6 + (Math.random() * 0.4)));
      } else { // Jan-May (pre-monsoon)
        monthlyRainfall = Math.floor(averageRainfall * (0.3 + (Math.random() * 0.3)));
      }
      return { month, rainfall: Math.max(0, monthlyRainfall) };
    });
  }

  // If year-specific data is found, return it
  return yearData.map(d => ({ month: d.month, rainfall: d.rainfall }));
};

export const getPredictionData = (region: string) => {
  // Return 10-day flood prediction data
  const regionData = getFloodDataForRegion(region);
  const riskLevelBase = {
    'low': 20,
    'medium': 35,
    'high': 50,
    'severe': 70
  };

  const baseValue = riskLevelBase[regionData?.riskLevel || 'medium'];

  // Generate 10 days of prediction data with some randomness
  return Array.from({ length: 10 }, (_, i) => {
    let trendFactor = 1;

    // Create a trend based on day
    if (i < 3) {
      // First 3 days - increasing trend
      trendFactor = 1 + (i * 0.1);
    } else if (i >= 3 && i < 6) {
      // Middle days - peak
      trendFactor = 1.3 - ((i - 3) * 0.05);
    } else {
      // Last days - decreasing trend
      trendFactor = 1.15 - ((i - 6) * 0.1);
    }

    // Calculate probability with some randomness
    const probability = Math.min(95, Math.max(5,
      baseValue * trendFactor + (Math.random() * 10 - 5)
    ));

    return {
      day: i + 1,
      probability: Number(probability.toFixed(1))
    };
  });
};
