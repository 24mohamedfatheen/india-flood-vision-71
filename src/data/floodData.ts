
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
  };
};

export type RegionOption = {
  value: string;
  label: string;
  state: string;
};

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

export const floodData: FloodData[] = [
  {
    id: 1,
    region: 'mumbai',
    state: 'Maharashtra',
    affectedArea: 120.5,
    populationAffected: 50000,
    riskLevel: 'high',
    rainfall: 342.8,
    riverLevel: 5.2,
    coordinates: [19.0760, 72.8777],
    predictionAccuracy: 87,
    timestamp: '2025-05-01T08:30:00',
    predictedFlood: {
      date: '2025-05-15',
      probabilityPercentage: 75,
      expectedRainfall: 400,
      expectedRiverRise: 1.5
    }
  },
  {
    id: 2,
    region: 'kolkata',
    state: 'West Bengal',
    affectedArea: 85.3,
    populationAffected: 35000,
    riskLevel: 'medium',
    rainfall: 210.5,
    riverLevel: 4.7,
    coordinates: [22.5726, 88.3639],
    predictionAccuracy: 82,
    timestamp: '2025-05-02T10:15:00',
    predictedFlood: {
      date: '2025-05-20',
      probabilityPercentage: 60,
      expectedRainfall: 250,
      expectedRiverRise: 1.2
    }
  },
  {
    id: 3,
    region: 'chennai',
    state: 'Tamil Nadu',
    affectedArea: 95.8,
    populationAffected: 42000,
    riskLevel: 'severe',
    rainfall: 389.2,
    riverLevel: 6.1,
    coordinates: [13.0827, 80.2707],
    predictionAccuracy: 91,
    timestamp: '2025-05-01T12:45:00',
    predictedFlood: {
      date: '2025-05-12',
      probabilityPercentage: 85,
      expectedRainfall: 420,
      expectedRiverRise: 1.8
    }
  },
  {
    id: 4,
    region: 'delhi',
    state: 'Delhi',
    affectedArea: 45.2,
    populationAffected: 28000,
    riskLevel: 'low',
    rainfall: 120.5,
    riverLevel: 3.5,
    coordinates: [28.6139, 77.2090],
    predictionAccuracy: 79,
    timestamp: '2025-05-03T09:20:00',
    predictedFlood: {
      date: '2025-05-25',
      probabilityPercentage: 30,
      expectedRainfall: 150,
      expectedRiverRise: 0.8
    }
  },
  {
    id: 5,
    region: 'bangalore',
    state: 'Karnataka',
    affectedArea: 38.6,
    populationAffected: 22000,
    riskLevel: 'low',
    rainfall: 105.8,
    riverLevel: 2.9,
    coordinates: [12.9716, 77.5946],
    predictionAccuracy: 81,
    timestamp: '2025-05-02T14:10:00',
    predictedFlood: {
      date: '2025-05-28',
      probabilityPercentage: 25,
      expectedRainfall: 130,
      expectedRiverRise: 0.6
    }
  },
  {
    id: 6,
    region: 'kochi',
    state: 'Kerala',
    affectedArea: 75.3,
    populationAffected: 32000,
    riskLevel: 'high',
    rainfall: 315.6,
    riverLevel: 5.3,
    coordinates: [9.9312, 76.2673],
    predictionAccuracy: 88,
    timestamp: '2025-05-01T11:30:00',
    predictedFlood: {
      date: '2025-05-14',
      probabilityPercentage: 78,
      expectedRainfall: 350,
      expectedRiverRise: 1.6
    }
  },
  {
    id: 7,
    region: 'guwahati',
    state: 'Assam',
    affectedArea: 110.2,
    populationAffected: 48000,
    riskLevel: 'severe',
    rainfall: 425.3,
    riverLevel: 6.8,
    coordinates: [26.1445, 91.7362],
    predictionAccuracy: 93,
    timestamp: '2025-04-30T10:00:00',
    predictedFlood: {
      date: '2025-05-10',
      probabilityPercentage: 90,
      expectedRainfall: 470,
      expectedRiverRise: 2.0
    }
  },
  {
    id: 8,
    region: 'patna',
    state: 'Bihar',
    affectedArea: 98.7,
    populationAffected: 45000,
    riskLevel: 'high',
    rainfall: 305.2,
    riverLevel: 5.5,
    coordinates: [25.5941, 85.1376],
    predictionAccuracy: 85,
    timestamp: '2025-05-02T08:45:00',
    predictedFlood: {
      date: '2025-05-16',
      probabilityPercentage: 72,
      expectedRainfall: 340,
      expectedRiverRise: 1.4
    }
  }
];

export const getFloodDataForRegion = (region: string): FloodData | undefined => {
  return floodData.find(data => data.region === region);
};

export const getHistoricalRainfallData = (region: string) => {
  // Mock historical rainfall data for charts
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Base values for each region (randomized but with patterns)
  const baseValues: {[key: string]: number[]} = {
    mumbai: [10, 5, 8, 12, 65, 350, 620, 420, 320, 90, 15, 5],
    delhi: [20, 25, 15, 10, 30, 70, 210, 180, 90, 15, 5, 10],
    kolkata: [15, 25, 35, 65, 135, 300, 330, 310, 250, 120, 25, 10],
    chennai: [25, 10, 15, 30, 115, 70, 90, 120, 150, 290, 310, 150],
    bangalore: [10, 15, 30, 65, 120, 80, 110, 140, 170, 180, 70, 20],
    hyderabad: [10, 5, 15, 25, 40, 110, 180, 160, 170, 90, 40, 5],
    ahmedabad: [5, 3, 2, 5, 15, 80, 270, 240, 120, 20, 5, 2],
    pune: [5, 2, 5, 15, 30, 120, 400, 290, 140, 60, 25, 5],
    surat: [5, 2, 2, 5, 10, 120, 450, 320, 100, 20, 5, 2],
    jaipur: [10, 15, 10, 5, 25, 70, 210, 190, 80, 10, 5, 5],
    lucknow: [20, 15, 10, 5, 15, 90, 250, 280, 160, 30, 5, 10],
    kanpur: [20, 15, 10, 5, 20, 80, 270, 290, 150, 25, 5, 10],
    nagpur: [10, 5, 15, 20, 30, 160, 320, 210, 180, 40, 10, 5],
    patna: [15, 10, 5, 10, 30, 120, 310, 290, 210, 60, 5, 5],
    indore: [10, 5, 5, 10, 15, 130, 290, 310, 160, 30, 15, 5],
    kochi: [20, 30, 50, 110, 200, 650, 350, 290, 310, 310, 190, 40],
    guwahati: [15, 25, 50, 110, 210, 340, 360, 320, 260, 110, 30, 10],
  };
  
  // Get base values for the requested region or use Mumbai as default
  const regionValues = baseValues[region] || baseValues.mumbai;
  
  // Add some randomness to make the data look more realistic
  return months.map((month, idx) => ({
    month,
    rainfall: Math.max(0, regionValues[idx] + (Math.random() * 20 - 10))
  }));
};

export const getPredictionData = (region: string) => {
  const nextDays = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
  const floodInfo = getFloodDataForRegion(region);
  
  // Base pattern based on the risk level
  let pattern: number[] = [];
  
  switch(floodInfo?.riskLevel) {
    case 'severe':
      pattern = [85, 95, 90, 80, 70, 60, 50];
      break;
    case 'high':
      pattern = [60, 75, 85, 80, 70, 60, 50];
      break;
    case 'medium':
      pattern = [40, 50, 60, 70, 65, 55, 45];
      break;
    case 'low':
    default:
      pattern = [20, 25, 30, 40, 35, 30, 25];
      break;
  }
  
  return nextDays.map((day, idx) => ({
    day,
    probability: pattern[idx] + (Math.random() * 10 - 5)
  }));
};
