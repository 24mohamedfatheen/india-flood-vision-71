
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

// Simulated IMD API service
export const imdApiService = {
  // Fetch data from IMD (simulated)
  fetchFloodData: async (): Promise<IMDRegionData[]> => {
    console.log('Fetching data from IMD API...');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate simulated IMD data based on states and districts
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
          'Bihar': 'Ganga'
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
          issuedBy: 'IMD ' + region.state,
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
        coordinates: [
          19.0760 + (Math.random() * 10 - 5), // Randomize coordinates for each region
          72.8777 + (Math.random() * 10 - 5)
        ]
      };
    });
    
    console.log('IMD data fetched successfully:', statesData);
    return statesData;
  }
};
