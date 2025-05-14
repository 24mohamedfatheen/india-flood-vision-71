
import { IMDRegionData } from '../services/imdApiService';

export interface FloodData {
  id: number;
  region: string;
  state: string;
  riskLevel: 'low' | 'medium' | 'high' | 'severe';
  affectedArea: number;
  populationAffected: number;
  coordinates: [number, number];  // [latitude, longitude]
  predictedFlood?: {
    date: string;
    probabilityPercentage: number;
    source?: {
      name: string;
      url: string;
    }
  }
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
    predictedFlood: {
      date: '2025-07-15',
      probabilityPercentage: 72,
      source: {
        name: 'Weather Services',
        url: 'https://mausam.imd.gov.in/'
      }
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
    predictedFlood: {
      date: '2025-08-10',
      probabilityPercentage: 58,
      source: {
        name: 'Weather Services',
        url: 'https://mausam.imd.gov.in/'
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
    predictedFlood: {
      date: '2025-08-05',
      probabilityPercentage: 85,
      source: {
        name: 'Weather Services',
        url: 'https://mausam.imd.gov.in/'
      }
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
    coordinates: [23.0225, 72.5714]
  },
  {
    id: 8,
    region: 'Pune',
    state: 'Maharashtra',
    riskLevel: 'medium',
    affectedArea: 130,
    populationAffected: 850000,
    coordinates: [18.5204, 73.8567]
  },
  {
    id: 9,
    region: 'Surat',
    state: 'Gujarat',
    riskLevel: 'high',
    affectedArea: 240,
    populationAffected: 1800000,
    coordinates: [21.1702, 72.8311]
  },
  {
    id: 10,
    region: 'Jaipur',
    state: 'Rajasthan',
    riskLevel: 'low',
    affectedArea: 110,
    populationAffected: 750000,
    coordinates: [26.9139, 75.7873]
  },
  {
    id: 11,
    region: 'Lucknow',
    state: 'Uttar Pradesh',
    riskLevel: 'medium',
    affectedArea: 160,
    populationAffected: 980000,
    coordinates: [26.8467, 80.9462]
  },
  {
    id: 12,
    region: 'Kanpur',
    state: 'Uttar Pradesh',
    riskLevel: 'high',
    affectedArea: 230,
    populationAffected: 1700000,
    coordinates: [26.4499, 80.3319]
  },
  {
    id: 13,
    region: 'Nagpur',
    state: 'Maharashtra',
    riskLevel: 'low',
    affectedArea: 100,
    populationAffected: 700000,
    coordinates: [21.1458, 79.0882]
  },
  {
    id: 14,
    region: 'Patna',
    state: 'Bihar',
    riskLevel: 'severe',
    affectedArea: 350,
    populationAffected: 2900000,
    coordinates: [25.5941, 85.1376],
    predictedFlood: {
      date: '2025-08-01',
      probabilityPercentage: 88,
      source: {
        name: 'Weather Services',
        url: 'https://mausam.imd.gov.in/'
      }
    }
  },
  {
    id: 15,
    region: 'Indore',
    state: 'Madhya Pradesh',
    riskLevel: 'low',
    affectedArea: 80,
    populationAffected: 650000,
    coordinates: [22.7196, 75.8577]
  },
  {
    id: 16,
    region: 'Kochi',
    state: 'Kerala',
    riskLevel: 'high',
    affectedArea: 260,
    populationAffected: 1650000,
    coordinates: [9.9312, 76.2600],
    predictedFlood: {
      date: '2025-07-25',
      probabilityPercentage: 75,
      source: {
        name: 'Weather Services',
        url: 'https://mausam.imd.gov.in/'
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
    predictedFlood: {
      date: '2025-07-10',
      probabilityPercentage: 89,
      source: {
        name: 'Weather Services',
        url: 'https://mausam.imd.gov.in/'
      }
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
