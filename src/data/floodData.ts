
import { IMDRegionData } from '../services/imdApiService';

export interface FloodData {
  id: number;
  region: string;
  state: string;
  riskLevel: 'low' | 'medium' | 'high' | 'severe';
  affectedArea: number;
  populationAffected: number;
  coordinates: [number, number];  // [latitude, longitude]
  timestamp: string;
  rainfall: number;
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

// Predefined regions with accurate coordinates
export const regions = [
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
  { value: 'guwahati', label: 'Guwahati', state: 'Assam' }
];

// Default flood data with accurate coordinates
export const floodData: FloodData[] = [
  {
    id: 1,
    region: 'Mumbai',
    state: 'Maharashtra',
    riskLevel: 'high',
    affectedArea: 280,
    populationAffected: 2800000,
    coordinates: [19.0760, 72.8777],
    timestamp: new Date().toISOString(),
    rainfall: 235,
    predictionAccuracy: 87,
    predictedFlood: {
      date: '2025-07-15',
      probabilityPercentage: 72,
      timestamp: new Date().toISOString(),
      expectedRainfall: 280,
      expectedRiverRise: 1.8,
      timeframe: '2025-07-10 to 2025-07-20',
      predictedEvent: 'Monsoon Flooding',
      predictedLocation: 'Mumbai and Suburban Areas',
      supportingData: 'Based on increased precipitation forecasts and river monitoring',
      source: {
        name: 'Weather Services',
        url: 'https://mausam.imd.gov.in/',
        type: 'Weather'
      }
    },
    riverData: {
      name: 'Mithi River',
      currentLevel: 4.8,
      dangerLevel: 7.5,
      warningLevel: 6.0,
      normalLevel: 3.5,
      trend: 'rising',
      source: {
        name: 'Water Resources',
        url: 'https://cwc.gov.in/',
        type: 'Water'
      }
    },
    activeWarnings: [
      {
        type: 'warning',
        issuedBy: 'Weather Services Mumbai',
        issuedAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        message: 'Heavy rainfall warning for Mumbai and surrounding areas',
        sourceUrl: 'https://mausam.imd.gov.in/'
      }
    ],
    estimatedDamage: {
      crops: 45,
      properties: 120,
      infrastructure: 85
    }
  },
  {
    id: 2,
    region: 'Delhi',
    state: 'Delhi',
    riskLevel: 'medium',
    affectedArea: 220,
    populationAffected: 1500000,
    coordinates: [28.7041, 77.1025],
    timestamp: new Date().toISOString(),
    rainfall: 185,
    predictionAccuracy: 79,
    predictedFlood: {
      date: '2025-08-10',
      probabilityPercentage: 58,
      timestamp: new Date().toISOString(),
      expectedRainfall: 210,
      expectedRiverRise: 1.2,
      source: {
        name: 'Weather Services',
        url: 'https://mausam.imd.gov.in/',
        type: 'Weather'
      }
    },
    riverData: {
      name: 'Yamuna River',
      currentLevel: 5.2,
      dangerLevel: 7.5,
      warningLevel: 6.0,
      normalLevel: 3.5,
      trend: 'stable',
      source: {
        name: 'Water Resources',
        url: 'https://cwc.gov.in/',
        type: 'Water'
      }
    }
  },
  {
    id: 3,
    region: 'Kolkata',
    state: 'West Bengal',
    riskLevel: 'severe',
    affectedArea: 320,
    populationAffected: 3100000,
    coordinates: [22.5726, 88.3639],
    timestamp: new Date().toISOString(),
    rainfall: 310,
    predictionAccuracy: 92,
    predictedFlood: {
      date: '2025-08-05',
      probabilityPercentage: 85,
      timestamp: new Date().toISOString(),
      expectedRainfall: 350,
      expectedRiverRise: 2.3,
      source: {
        name: 'Weather Services',
        url: 'https://mausam.imd.gov.in/',
        type: 'Weather'
      }
    },
    riverData: {
      name: 'Hooghly River',
      currentLevel: 6.8,
      dangerLevel: 7.5,
      warningLevel: 6.0,
      normalLevel: 3.5,
      trend: 'rising',
      source: {
        name: 'Water Resources',
        url: 'https://cwc.gov.in/',
        type: 'Water'
      }
    },
    activeWarnings: [
      {
        type: 'severe',
        issuedBy: 'Weather Services Kolkata',
        issuedAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        message: 'Severe rainfall alert for Kolkata metropolitan area',
        sourceUrl: 'https://mausam.imd.gov.in/'
      }
    ],
    estimatedDamage: {
      crops: 75,
      properties: 180,
      infrastructure: 130
    }
  },
  {
    id: 4,
    region: 'Chennai',
    state: 'Tamil Nadu',
    riskLevel: 'high',
    affectedArea: 290,
    populationAffected: 2500000,
    coordinates: [13.0827, 80.2707],
    timestamp: new Date().toISOString(),
    rainfall: 250,
    predictionAccuracy: 90,
    predictedFlood: {
      date: '2025-09-20',
      probabilityPercentage: 78
    }
  },
  {
    id: 5,
    region: 'Bangalore',
    state: 'Karnataka',
    riskLevel: 'low',
    affectedArea: 90,
    populationAffected: 900000,
    coordinates: [12.9716, 77.5946],
    timestamp: new Date().toISOString(),
    rainfall: 100,
    predictionAccuracy: 80,
    predictedFlood: {
      date: '2025-10-15',
      probabilityPercentage: 32
    }
  },
  {
    id: 6,
    region: 'Hyderabad',
    state: 'Telangana',
    riskLevel: 'medium',
    affectedArea: 180,
    populationAffected: 1200000,
    coordinates: [17.3850, 78.4867],
    timestamp: new Date().toISOString(),
    rainfall: 150,
    predictionAccuracy: 85,
    predictedFlood: {
      date: '2025-09-05',
      probabilityPercentage: 54
    }
  },
  {
    id: 7,
    region: 'Ahmedabad',
    state: 'Gujarat',
    riskLevel: 'medium',
    affectedArea: 150,
    populationAffected: 950000,
    coordinates: [23.0225, 72.5714],
    timestamp: new Date().toISOString(),
    rainfall: 140,
    predictionAccuracy: 82,
    predictedFlood: {
      date: '2025-08-25',
      probabilityPercentage: 45
    }
  },
  {
    id: 8,
    region: 'Pune',
    state: 'Maharashtra',
    riskLevel: 'medium',
    affectedArea: 130,
    populationAffected: 850000,
    coordinates: [18.5204, 73.8567],
    timestamp: new Date().toISOString(),
    rainfall: 160,
    predictionAccuracy: 84,
    predictedFlood: {
      date: '2025-07-30',
      probabilityPercentage: 52
    }
  },
  {
    id: 9,
    region: 'Surat',
    state: 'Gujarat',
    riskLevel: 'high',
    affectedArea: 240,
    populationAffected: 1800000,
    coordinates: [21.1702, 72.8311],
    timestamp: new Date().toISOString(),
    rainfall: 220,
    predictionAccuracy: 88,
    predictedFlood: {
      date: '2025-08-15',
      probabilityPercentage: 68
    }
  },
  {
    id: 10,
    region: 'Jaipur',
    state: 'Rajasthan',
    riskLevel: 'low',
    affectedArea: 110,
    populationAffected: 750000,
    coordinates: [26.9139, 75.7873],
    timestamp: new Date().toISOString(),
    rainfall: 95,
    predictionAccuracy: 78,
    predictedFlood: {
      date: '2025-08-30',
      probabilityPercentage: 28
    }
  },
  {
    id: 11,
    region: 'Lucknow',
    state: 'Uttar Pradesh',
    riskLevel: 'medium',
    affectedArea: 160,
    populationAffected: 980000,
    coordinates: [26.8467, 80.9462],
    timestamp: new Date().toISOString(),
    rainfall: 165,
    predictionAccuracy: 83,
    predictedFlood: {
      date: '2025-08-10',
      probabilityPercentage: 56
    }
  },
  {
    id: 12,
    region: 'Kanpur',
    state: 'Uttar Pradesh',
    riskLevel: 'high',
    affectedArea: 230,
    populationAffected: 1700000,
    coordinates: [26.4499, 80.3319],
    timestamp: new Date().toISOString(),
    rainfall: 215,
    predictionAccuracy: 87,
    predictedFlood: {
      date: '2025-08-05',
      probabilityPercentage: 71
    }
  },
  {
    id: 13,
    region: 'Nagpur',
    state: 'Maharashtra',
    riskLevel: 'low',
    affectedArea: 100,
    populationAffected: 700000,
    coordinates: [21.1458, 79.0882],
    timestamp: new Date().toISOString(),
    rainfall: 110,
    predictionAccuracy: 81,
    predictedFlood: {
      date: '2025-09-10',
      probabilityPercentage: 35
    }
  },
  {
    id: 14,
    region: 'Patna',
    state: 'Bihar',
    riskLevel: 'severe',
    affectedArea: 350,
    populationAffected: 2900000,
    coordinates: [25.5941, 85.1376],
    timestamp: new Date().toISOString(),
    rainfall: 350,
    predictionAccuracy: 95,
    predictedFlood: {
      date: '2025-08-01',
      probabilityPercentage: 88,
      timestamp: new Date().toISOString(),
      expectedRainfall: 400,
      expectedRiverRise: 2.5,
      source: {
        name: 'Weather Services',
        url: 'https://mausam.imd.gov.in/',
        type: 'Weather'
      }
    },
    riverData: {
      name: 'Ganga River',
      currentLevel: 7.2,
      dangerLevel: 7.5,
      warningLevel: 6.0,
      normalLevel: 3.5,
      trend: 'falling',
      source: {
        name: 'Water Resources',
        url: 'https://cwc.gov.in/',
        type: 'Water'
      }
    },
    activeWarnings: [
      {
        type: 'severe',
        issuedBy: 'Weather Services Patna',
        issuedAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        message: 'Severe rainfall alert for Patna and surrounding areas',
        sourceUrl: 'https://mausam.imd.gov.in/'
      }
    ],
    estimatedDamage: {
      crops: 100,
      properties: 250,
      infrastructure: 180
    }
  },
  {
    id: 15,
    region: 'Indore',
    state: 'Madhya Pradesh',
    riskLevel: 'low',
    affectedArea: 80,
    populationAffected: 650000,
    coordinates: [22.7196, 75.8577],
    timestamp: new Date().toISOString(),
    rainfall: 90,
    predictionAccuracy: 79,
    predictedFlood: {
      date: '2025-09-15',
      probabilityPercentage: 30
    }
  },
  {
    id: 16,
    region: 'Kochi',
    state: 'Kerala',
    riskLevel: 'high',
    affectedArea: 260,
    populationAffected: 1650000,
    coordinates: [9.9312, 76.2600],
    timestamp: new Date().toISOString(),
    rainfall: 260,
    predictionAccuracy: 90,
    predictedFlood: {
      date: '2025-07-25',
      probabilityPercentage: 75,
      timestamp: new Date().toISOString(),
      expectedRainfall: 300,
      expectedRiverRise: 2.0,
      source: {
        name: 'Weather Services',
        url: 'https://mausam.imd.gov.in/',
        type: 'Weather'
      }
    },
    riverData: {
      name: 'Thamiraparamba River',
      currentLevel: 6.5,
      dangerLevel: 7.5,
      warningLevel: 6.0,
      normalLevel: 3.5,
      trend: 'stable',
      source: {
        name: 'Water Resources',
        url: 'https://cwc.gov.in/',
        type: 'Water'
      }
    }
  },
  {
    id: 17,
    region: 'Guwahati',
    state: 'Assam',
    riskLevel: 'severe',
    affectedArea: 330,
    populationAffected: 1920000,
    coordinates: [26.1445, 91.7362],
    timestamp: new Date().toISOString(),
    rainfall: 330,
    predictionAccuracy: 98,
    predictedFlood: {
      date: '2025-07-10',
      probabilityPercentage: 89,
      timestamp: new Date().toISOString(),
      expectedRainfall: 370,
      expectedRiverRise: 2.8,
      source: {
        name: 'Weather Services',
        url: 'https://mausam.imd.gov.in/',
        type: 'Weather'
      }
    },
    riverData: {
      name: 'Ganges River',
      currentLevel: 8.0,
      dangerLevel: 7.5,
      warningLevel: 6.0,
      normalLevel: 3.5,
      trend: 'rising',
      source: {
        name: 'Water Resources',
        url: 'https://cwc.gov.in/',
        type: 'Water'
      }
    },
    activeWarnings: [
      {
        type: 'severe',
        issuedBy: 'Weather Services Guwahati',
        issuedAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        message: 'Severe rainfall alert for Guwahati and surrounding areas',
        sourceUrl: 'https://mausam.imd.gov.in/'
      }
    ],
    estimatedDamage: {
      crops: 120,
      properties: 300,
      infrastructure: 200
    }
  }
];

// Import cache for flood data
let cachedImdData: IMDRegionData[] | null = null;

// Simulated API fetch function for flood data
export const fetchImdData = async (): Promise<IMDRegionData[]> => {
  try {
    // In a real app, this would be a fetch to an actual API endpoint
    // For demo purposes, we'll simulate the API response
    const imdApiService = await import('../services/imdApiService');
    const imdData = await imdApiService.imdApiService.fetchFloodData();
    
    // Cache the data for future use
    cachedImdData = imdData;
    
    return imdData;
  } catch (error) {
    console.error('Error fetching flood data:', error);
    // Return empty array if there's an error
    return [];
  }
};

// Get flood data for a specific region
export const getFloodDataForRegion = (region: string): FloodData | null => {
  // Check if the region matches any predefined regions
  const regionLower = region.toLowerCase();
  const matchingRegion = floodData.find(data => 
    data.region.toLowerCase() === regionLower
  );
  
  if (matchingRegion) {
    return matchingRegion;
  }
  
  // If no match is found, return Mumbai as default
  return floodData[0];
};

// Add functions for chart section
export const getHistoricalRainfallData = (region: string) => {
  // Return historical rainfall data for the selected region
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Generate realistic data based on the region's risk level
  const regionData = getFloodDataForRegion(region);
  const riskLevelMultiplier = {
    'low': 0.7,
    'medium': 1.0,
    'high': 1.3,
    'severe': 1.6
  };
  
  const multiplier = riskLevelMultiplier[regionData?.riskLevel || 'medium'];
  
  // Generate monthly data with a monsoon pattern (higher in Jul-Sep)
  return months.map((month, index) => {
    // Higher rainfall during monsoon months (Jun-Sep)
    let baseRainfall = 0;
    if (index >= 5 && index <= 8) {  // Jun-Sep
      baseRainfall = Math.floor(Math.random() * 200) + 100; // 100-300mm during monsoon
    } else if (index >= 9 && index <= 11) { // Oct-Dec
      baseRainfall = Math.floor(Math.random() * 100) + 50; // 50-150mm post-monsoon
    } else { // Jan-May
      baseRainfall = Math.floor(Math.random() * 50) + 10; // 10-60mm pre-monsoon
    }
    
    // Apply risk level multiplier
    const rainfall = Math.floor(baseRainfall * multiplier);
    
    return {
      month,
      rainfall
    };
  });
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
