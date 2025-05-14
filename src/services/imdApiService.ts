
import { regions } from '../data/floodData';

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

// Map for accurate coordinates of each city
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
  'Jaipur': [26.9139, 75.7873],
  'Lucknow': [26.8467, 80.9462],
  'Kanpur': [26.4499, 80.3319],
  'Nagpur': [21.1458, 79.0882],
  'Patna': [25.5941, 85.1376],
  'Indore': [22.7196, 75.8577],
  'Kochi': [9.9312, 76.2600],
  'Guwahati': [26.1445, 91.7362]
};

// Simulated API service
export const imdApiService = {
  // Fetch data (simulated)
  fetchFloodData: async (): Promise<IMDRegionData[]> => {
    console.log('Fetching data from Weather Services API...');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate simulated data based on states and districts
    const statesData: IMDRegionData[] = regions.map(region => {
      // Generate realistic data for each region
      const rainfall = Math.floor(Math.random() * 400) + 50; // 50-450mm
      const riskLevels: ('low' | 'medium' | 'high' | 'severe')[] = ['low', 'medium', 'high', 'severe'];
      const riskIndex = Math.min(
        Math.floor((rainfall - 50) / 100), // Higher rainfall = higher risk
        3 // Max index for riskLevels array
      );
      const floodRiskLevel = riskLevels[riskIndex];
      
      // Population affected scales with risk level
      const populationMultiplier = {
        'low': 5000,
        'medium': 20000,
        'high': 50000,
        'severe': 100000
      };
      const populationAffected = Math.floor(Math.random() * populationMultiplier[floodRiskLevel]) + 1000;
      
      // Affected area also scales with risk level
      const areaMultiplier = {
        'low': 20,
        'medium': 50,
        'high': 100,
        'severe': 200
      };
      const affectedArea = Math.floor(Math.random() * areaMultiplier[floodRiskLevel]) + 10;
      
      // Only add river data for high and severe risk areas
      let riverData: IMDRiverData | undefined;
      if (floodRiskLevel === 'high' || floodRiskLevel === 'severe') {
        const riverNames = {
          'Maharashtra': 'Godavari',
          'West Bengal': 'Hooghly',
          'Tamil Nadu': 'Cauvery',
          'Delhi': 'Yamuna',
          'Karnataka': 'Krishna',
          'Kerala': 'Periyar',
          'Assam': 'Brahmaputra',
          'Bihar': 'Ganga',
          'Uttar Pradesh': 'Yamuna',
          'Telangana': 'Krishna',
          'Gujarat': 'Sabarmati',
          'Rajasthan': 'Luni',
          'Madhya Pradesh': 'Narmada'
        };
        
        const defaultRiverName = 'Local River';
        const riverName = riverNames[region.state as keyof typeof riverNames] || defaultRiverName;
        
        riverData = {
          name: riverName,
          currentLevel: Math.floor((Math.random() * 6) * 10) / 10 + 2, // 2-8 meters
          dangerLevel: 7.5,
          warningLevel: 6.0,
          normalLevel: 3.5,
          trend: Math.random() > 0.5 ? 'rising' : (Math.random() > 0.5 ? 'falling' : 'stable'),
          lastUpdated: new Date().toISOString()
        };
      }
      
      // Add warnings for high and severe risk areas
      let activeWarnings: IMDWeatherWarning[] | undefined;
      if (floodRiskLevel === 'high' || floodRiskLevel === 'severe') {
        activeWarnings = [{
          type: floodRiskLevel === 'severe' ? 'severe' : 'warning',
          issuedBy: 'Weather Services ' + region.state,
          issuedAt: new Date().toISOString(),
          validUntil: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // Valid for 72 hours
          message: floodRiskLevel === 'severe' 
            ? `Severe rainfall warning for ${region.label} and surrounding areas` 
            : `Heavy rainfall warning for ${region.label} area`,
          affectedAreas: `${region.label}, ${region.state}`,
          sourceUrl: 'https://mausam.imd.gov.in/'
        }];
      }
      
      // Add flood predictions based on risk level
      const predictedFlood = {
        date: new Date(Date.now() + Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        probabilityPercentage: Math.floor(Math.random() * 30) + (riskIndex * 20), // Higher risk = higher probability
        expectedRainfall: rainfall * (Math.random() * 0.4 + 0.8), // Expected rainfall similar to current
        timeframe: `Next ${Math.floor(Math.random() * 3) + 1} days`
      };
      
      // Use accurate coordinates for each city
      const coordinates = cityCoordinates[region.label] || [
        20.5937 + (Math.random() * 10 - 5), // Default fallback with randomization
        78.9629 + (Math.random() * 10 - 5)
      ];
      
      return {
        state: region.state,
        district: region.label,
        rainfall,
        floodRiskLevel,
        populationAffected,
        affectedArea,
        riverData,
        activeWarnings,
        predictedFlood,
        coordinates: coordinates
      };
    });
    
    console.log('Weather data fetched successfully:', statesData);
    return statesData;
  }
};
