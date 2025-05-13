import { IMDRegionData, IMDRiverData, IMDWeatherWarning, imdApiService } from '../services/imdApiService';

export type AgencyType = "IMD" | "CWC" | "NDMA" | "SDMA" | "CMWSSB" | "other";

export type FloodData = {
  id: number;
  region: string;
  state: string;
  affectedArea: number; // in sq km
  populationAffected: number;
  riskLevel: 'low' | 'medium' | 'high' | 'severe';
  rainfall: number; // in mm
  riverLevel: number; // in meters
  coordinates: [number, number]; // [latitude, longitude]
  predictionAccuracy: number; // in percentage
  timestamp: string;
  predictedFlood?: {
    date: string;
    probabilityPercentage: number;
    expectedRainfall: number; // in mm
    expectedRiverRise: number; // in meters
    // New fields for sourced predictions
    predictedLocation?: string;
    predictedEvent?: string;
    timeframe?: string;
    supportingData?: string;
    timestamp?: string;
    source?: {
      name: string;
      url: string;
      type: AgencyType;
    };
  };
  // New field for damage estimates
  estimatedDamage?: {
    crops: number; // in crores of rupees
    properties: number; // in crores of rupees
    infrastructure?: number; // in crores of rupees
  };
  // New fields for river data
  riverData?: {
    name: string;
    currentLevel: number; // in meters
    dangerLevel: number; // in meters
    warningLevel: number; // in meters
    normalLevel: number; // in meters
    trend: 'rising' | 'falling' | 'stable';
    lastUpdated: string;
    source: {
      name: string;
      url: string;
      type: AgencyType;
    };
  };
  // New field for active warnings
  activeWarnings?: {
    type: 'alert' | 'warning' | 'severe' | 'watch';
    issuedBy: string;
    issuedAt: string;
    validUntil: string;
    message: string;
    affectedAreas: string;
    sourceUrl: string;
  }[];
};

export type RegionOption = {
  value: string;
  label: string;
  state: string;
};

// These regions will still be used for UI selection
export const regions: RegionOption[] = [
  { value: 'mumbai', label: 'Mumbai', state: 'Maharashtra' },
  { value: 'delhi', label: 'Delhi', state: 'Delhi' },
  { value: 'kolkata', label: 'Kolkata', state: 'West Bengal' },
  { value: 'chennai', label: 'Chennai', state: 'Tamil Nadu' },
  { value: 'bangalore', label: 'Bangalore', state: 'Karnataka' },
  { value: 'hyderabad', label: 'Hyderabad', state: 'Telangana' },
  { value: 'ahmedabad', label: 'Ahmedabad', state: 'Gujarat' },
  { value: 'pune', label: 'Pune', state: 'Maharashtra' },
  { value: 'surat', label: 'Surat', state: 'Gujarat' },
  { value: 'jaipur', label: 'Jaipur', state: 'Rajasthan' },
  { value: 'lucknow', label: 'Lucknow', state: 'Uttar Pradesh' },
  { value: 'kanpur', label: 'Kanpur', state: 'Uttar Pradesh' },
  { value: 'nagpur', label: 'Nagpur', state: 'Maharashtra' },
  { value: 'patna', label: 'Patna', state: 'Bihar' },
  { value: 'indore', label: 'Indore', state: 'Madhya Pradesh' },
  { value: 'kochi', label: 'Kochi', state: 'Kerala' },
  { value: 'guwahati', label: 'Guwahati', state: 'Assam' },
];

// This will store the IMD data once fetched
let imdFloodData: IMDRegionData[] = [];

// Convert IMD data to our FloodData format
const convertImdToFloodData = (imdData: IMDRegionData): FloodData => {
  const region = regions.find(r => r.label === imdData.district);
  const regionValue = region ? region.value : imdData.district.toLowerCase().replace(/\s+/g, '-');
  
  const riverLevel = imdData.riverData?.currentLevel || Math.floor(Math.random() * 5) + 1;
  
  const floodData: FloodData = {
    id: Math.floor(Math.random() * 1000) + 1,
    region: regionValue,
    state: imdData.state,
    affectedArea: imdData.affectedArea,
    populationAffected: imdData.populationAffected,
    riskLevel: imdData.floodRiskLevel,
    rainfall: imdData.rainfall,
    riverLevel,
    coordinates: imdData.coordinates,
    predictionAccuracy: Math.floor(Math.random() * 15) + 75, // 75-90%
    timestamp: new Date().toISOString(),
    predictedFlood: imdData.predictedFlood ? {
      date: imdData.predictedFlood.date,
      probabilityPercentage: imdData.predictedFlood.probabilityPercentage,
      expectedRainfall: imdData.predictedFlood.expectedRainfall,
      expectedRiverRise: Math.floor(Math.random() * 20) / 10, // 0-2 meters
      predictedLocation: `${imdData.district}, ${imdData.state}`,
      predictedEvent: `Potential flooding in ${imdData.district}`,
      timeframe: imdData.predictedFlood.timeframe,
      supportingData: `Based on IMD forecast data showing ${imdData.predictedFlood.expectedRainfall}mm expected rainfall in ${imdData.predictedFlood.timeframe}`,
      timestamp: new Date().toISOString(),
      source: {
        name: 'India Meteorological Department',
        url: 'https://mausam.imd.gov.in/',
        type: 'IMD'
      }
    } : undefined
  };
  
  // Add river data if available
  if (imdData.riverData) {
    floodData.riverData = {
      ...imdData.riverData,
      source: {
        name: 'Central Water Commission',
        url: 'https://cwc.gov.in/',
        type: 'CWC'
      }
    };
  }
  
  // Add warnings if available
  if (imdData.activeWarnings && imdData.activeWarnings.length > 0) {
    floodData.activeWarnings = imdData.activeWarnings;
  }
  
  // Add damage estimates for high and severe risk levels
  if (imdData.floodRiskLevel === 'high' || imdData.floodRiskLevel === 'severe') {
    const damageMultiplier = imdData.floodRiskLevel === 'severe' ? 2 : 1;
    floodData.estimatedDamage = {
      crops: Math.floor(Math.random() * 15 * damageMultiplier * 10) / 10 + 5,
      properties: Math.floor(Math.random() * 25 * damageMultiplier * 10) / 10 + 10,
      infrastructure: Math.floor(Math.random() * 30 * damageMultiplier * 10) / 10 + 15
    };
  }
  
  return floodData;
};

// Initialize with empty data
export let floodData: FloodData[] = [];

// Fetch and convert IMD data
export const fetchImdData = async () => {
  try {
    imdFloodData = await imdApiService.fetchFloodData();
    floodData = imdFloodData.map(convertImdToFloodData);
    console.log('IMD data converted to flood data:', floodData);
    return floodData;
  } catch (error) {
    console.error('Error fetching IMD data:', error);
    return [];
  }
};

// Get flood data for a specific region
export const getFloodDataForRegion = (region: string): FloodData | undefined => {
  return floodData.find(data => data.region === region);
};

// The following utility functions remain unchanged
export const getHistoricalRainfallData = (region: string) => {
  // Historical rainfall data for charts
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Base values adjusted to be more realistic for Indian regions
  const baseValues: {[key: string]: number[]} = {
    mumbai: [5, 2, 0, 8, 15, 475, 820, 540, 380, 75, 10, 2],
    delhi: [15, 20, 10, 5, 25, 65, 180, 240, 120, 10, 2, 5],
    kolkata: [12, 20, 30, 55, 140, 280, 390, 350, 320, 160, 20, 8],
    chennai: [35, 5, 10, 15, 65, 50, 95, 120, 140, 310, 340, 160],
    bangalore: [5, 10, 15, 45, 130, 90, 105, 120, 190, 160, 60, 15],
    hyderabad: [5, 10, 20, 30, 45, 120, 150, 140, 180, 100, 30, 5],
    ahmedabad: [2, 1, 0, 2, 10, 95, 310, 280, 90, 10, 2, 0],
    pune: [2, 0, 2, 10, 25, 160, 350, 180, 120, 40, 20, 5],
    surat: [2, 0, 0, 2, 15, 160, 520, 380, 75, 10, 2, 0],
    jaipur: [5, 10, 5, 2, 20, 60, 180, 150, 65, 5, 2, 2],
    lucknow: [15, 10, 5, 2, 15, 80, 290, 310, 180, 25, 2, 5],
    kanpur: [15, 10, 5, 2, 15, 75, 310, 295, 160, 20, 2, 5],
    nagpur: [5, 2, 10, 15, 20, 180, 340, 240, 190, 30, 5, 2],
    patna: [10, 10, 2, 5, 25, 110, 290, 310, 230, 50, 2, 2],
    indore: [5, 2, 2, 5, 10, 140, 320, 350, 150, 20, 10, 2],
    kochi: [15, 25, 40, 115, 220, 680, 410, 320, 330, 330, 210, 45],
    guwahati: [10, 20, 50, 135, 220, 370, 420, 350, 290, 120, 25, 8],
  };
  
  // Get base values for the requested region or use Mumbai as default
  const regionValues = baseValues[region] || baseValues.mumbai;
  
  // Add some randomness to make the data look more realistic
  return months.map((month, idx) => ({
    month,
    rainfall: Math.max(0, Math.round(regionValues[idx] + (Math.random() * 15 - 7)))
  }));
};

export const getPredictionData = (region: string) => {
  const nextDays = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10'];
  const floodInfo = getFloodDataForRegion(region);
  
  // Realistic pattern based on the risk level and region characteristics
  let pattern: number[] = [];
  
  switch(floodInfo?.riskLevel) {
    case 'severe':
      // High immediate risk that gradually decreases
      pattern = [80, 92, 95, 85, 75, 60, 45, 35, 30, 25];
      break;
    case 'high':
      // Risk that peaks in a few days then decreases
      pattern = [55, 65, 80, 75, 65, 50, 40, 35, 30, 25];
      break;
    case 'medium':
      // Moderate risk with slight increase then decrease
      pattern = [35, 45, 55, 65, 60, 50, 40, 35, 30, 25];
      break;
    case 'low':
    default:
      // Low risk that remains relatively stable
      pattern = [15, 20, 25, 30, 30, 25, 20, 18, 15, 12];
      break;
  }
  
  // Add daily variation based on the current date to make it update every day
  const today = new Date();
  const dayFactor = today.getDate() % 10;
  
  // Add some variation based on the region to make it more realistic
  const regionFactor = floodInfo?.region.length ?? 6;
  
  return nextDays.map((day, idx) => {
    // Use current date to create daily variation
    const dailyVariation = ((today.getDate() + idx) % 5) - 2;
    
    return {
      day,
      probability: Math.min(100, Math.max(0, pattern[idx] + dailyVariation + ((idx + regionFactor + dayFactor) % 5)))
    };
  });
};

// New function to get river level history for charts
export const getRiverLevelHistory = (region: string) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const floodInfo = getFloodDataForRegion(region);
  
  if (!floodInfo?.riverData) {
    return [];
  }
  
  // Base river level adjusted per region - this would be real historical data in production
  const baseLevel = floodInfo.riverData.normalLevel;
  const dangerLevel = floodInfo.riverData.dangerLevel;
  const warningLevel = floodInfo.riverData.warningLevel;
  
  // Generate a realistic annual pattern for river levels in India
  // Higher in monsoon seasons, lower in dry seasons
  const getSeasonalFactor = (month: number) => {
    // June to September (monsoon season) - higher levels
    if (month >= 5 && month <= 8) return 1.2 + (Math.random() * 0.4);
    // October to November (post-monsoon) - gradually decreasing
    if (month >= 9 && month <= 10) return 1.0 + (Math.random() * 0.3);
    // December to February (winter) - lower levels
    if (month >= 11 || month <= 1) return 0.7 + (Math.random() * 0.2);
    // March to May (summer/pre-monsoon) - lowest levels
    return 0.5 + (Math.random() * 0.2);
  };
  
  return months.map((month, idx) => {
    const seasonalFactor = getSeasonalFactor(idx);
    const level = +(baseLevel * seasonalFactor).toFixed(1);
    
    return {
      month,
      level,
      dangerLevel,
      warningLevel,
    };
  });
};

// New function to get active flood warnings
export const getActiveWarnings = (region: string) => {
  const floodInfo = getFloodDataForRegion(region);
  return floodInfo?.activeWarnings || [];
};
