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
      type: 'IMD' | 'CMWSSB' | 'other';
    };
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
      expectedRiverRise: 1.5,
      predictedLocation: 'Mumbai City and Suburban Districts',
      predictedEvent: 'Urban flooding in low-lying areas',
      timeframe: 'Next 72 hours, valid until May 15, 2025',
      supportingData: 'Based on IMD data, Mumbai is expected to receive heavy rainfall (400mm) in the next 72 hours, which exceeds the threshold for urban flooding.',
      timestamp: '2025-05-09T08:30:00',
      source: {
        name: 'India Meteorological Department',
        url: 'https://mausam.imd.gov.in/',
        type: 'IMD'
      }
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
      expectedRiverRise: 1.2,
      predictedLocation: 'East Kolkata and Salt Lake Areas',
      predictedEvent: 'Moderate waterlogging in low-lying areas',
      timeframe: 'May 18-20, 2025',
      supportingData: 'IMD forecasts indicate moderate to heavy rainfall (250mm) expected over 3 days with higher intensity during evening hours.',
      timestamp: '2025-05-09T10:15:00',
      source: {
        name: 'India Meteorological Department',
        url: 'https://mausam.imd.gov.in/',
        type: 'IMD'
      }
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
      expectedRiverRise: 1.8,
      predictedLocation: 'Chennai - Velachery, T. Nagar, and Adyar River basin',
      predictedEvent: 'Severe urban flooding and possible overflow of Adyar River',
      timeframe: 'Next 48 hours, valid until May 11, 2025',
      supportingData: 'Based on IMD data, Chennai is expected to receive extreme rainfall (420mm) in the next 48 hours. Additionally, Chembarambakkam reservoir level has reached 82% as reported by CMWSSB, and discharge is being increased, posing significant risk of flooding along the Adyar River.',
      timestamp: '2025-05-09T12:45:00',
      source: {
        name: 'Chennai Metropolitan Water Supply and Sewerage Board',
        url: 'https://chennaimetrowater.tn.gov.in/',
        type: 'CMWSSB'
      }
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
      expectedRiverRise: 0.8,
      predictedLocation: 'Delhi NCR',
      predictedEvent: 'Minor water accumulation possible in some areas',
      timeframe: 'May 24-25, 2025',
      supportingData: 'IMD forecasts indicate light to moderate rainfall, unlikely to cause significant flooding issues.',
      timestamp: '2025-05-09T09:20:00',
      source: {
        name: 'India Meteorological Department',
        url: 'https://mausam.imd.gov.in/',
        type: 'IMD'
      }
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
      expectedRiverRise: 0.6,
      predictedLocation: 'Bangalore Urban District',
      predictedEvent: 'Minimal risk of waterlogging in isolated areas',
      timeframe: 'May 26-28, 2025',
      supportingData: 'IMD data indicates light rainfall with occasional moderate showers, below flooding threshold for the region.',
      timestamp: '2025-05-09T14:10:00',
      source: {
        name: 'India Meteorological Department',
        url: 'https://mausam.imd.gov.in/',
        type: 'IMD'
      }
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
      expectedRiverRise: 1.6,
      predictedLocation: 'Ernakulam District, Kochi City',
      predictedEvent: 'High risk of urban flooding and potential canal overflows',
      timeframe: 'May 12-14, 2025',
      supportingData: 'IMD has issued a heavy rainfall warning with expected precipitation of 350mm over 3 days, combined with high tides increasing backwater levels.',
      timestamp: '2025-05-09T11:30:00',
      source: {
        name: 'India Meteorological Department',
        url: 'https://mausam.imd.gov.in/',
        type: 'IMD'
      }
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
      expectedRiverRise: 2.0,
      predictedLocation: 'Guwahati and surrounding Brahmaputra basin areas',
      predictedEvent: 'Severe flooding expected with Brahmaputra River above danger mark',
      timeframe: 'Immediate - next 24 hours',
      supportingData: 'IMD has issued red alert with extreme rainfall forecast of 470mm. Brahmaputra River is already 0.3m above danger level and rising rapidly.',
      timestamp: '2025-05-09T10:00:00',
      source: {
        name: 'India Meteorological Department',
        url: 'https://mausam.imd.gov.in/',
        type: 'IMD'
      }
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
      expectedRiverRise: 1.4,
      predictedLocation: 'Patna District and Ganges River basin',
      predictedEvent: 'High risk of flooding in low-lying areas along Ganges',
      timeframe: 'May 14-16, 2025',
      supportingData: 'IMD forecast shows heavy rainfall (340mm) combined with upstream water release from barrages, raising river levels significantly.',
      timestamp: '2025-05-09T08:45:00',
      source: {
        name: 'India Meteorological Department',
        url: 'https://mausam.imd.gov.in/',
        type: 'IMD'
      }
    }
  }
];

export const getFloodDataForRegion = (region: string): FloodData | undefined => {
  return floodData.find(data => data.region === region);
};

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
  const nextDays = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
  const floodInfo = getFloodDataForRegion(region);
  
  // Realistic pattern based on the risk level and region characteristics
  let pattern: number[] = [];
  
  switch(floodInfo?.riskLevel) {
    case 'severe':
      // High immediate risk that gradually decreases
      pattern = [80, 92, 95, 85, 75, 60, 45];
      break;
    case 'high':
      // Risk that peaks in a few days then decreases
      pattern = [55, 65, 80, 75, 65, 50, 40];
      break;
    case 'medium':
      // Moderate risk with slight increase then decrease
      pattern = [35, 45, 55, 65, 60, 50, 40];
      break;
    case 'low':
    default:
      // Low risk that remains relatively stable
      pattern = [15, 20, 25, 30, 30, 25, 20];
      break;
  }
  
  // Add some variation based on the region to make it more realistic
  const regionFactor = floodInfo?.region.length ?? 6;
  
  return nextDays.map((day, idx) => ({
    day,
    probability: Math.min(100, Math.max(0, pattern[idx] + ((idx + regionFactor) % 5)))
  }));
};
