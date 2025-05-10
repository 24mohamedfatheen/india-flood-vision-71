
// This file contains comprehensive data about India's states, union territories and their districts
// Including geographical coordinates and flood-related information

export interface FloodInfo {
  hasFloodData: boolean;
  floodProbability: string;  // "Low", "Medium", "High", or percentage
  floodRisk: string;  // "Green - Low Risk", "Yellow - Medium Risk", "Red - High Risk"
}

export interface District {
  value: string;
  label: string;
  coordinates: [number, number];  // [latitude, longitude]
  floodInfo: FloodInfo;
}

export interface State {
  value: string;
  label: string;
  districts: District[];
}

export const indiaStatesAndDistricts: State[] = [
  {
    value: "andhra_pradesh",
    label: "Andhra Pradesh",
    districts: [
      { 
        value: "anantapur", 
        label: "Anantapur", 
        coordinates: [14.6819, 77.6006],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "chittoor", 
        label: "Chittoor", 
        coordinates: [13.2172, 79.1003],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      },
      { 
        value: "east_godavari", 
        label: "East Godavari", 
        coordinates: [17.3307, 82.0407],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "guntur", 
        label: "Guntur", 
        coordinates: [16.3067, 80.4365],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "krishna", 
        label: "Krishna", 
        coordinates: [16.6100, 80.7214],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "kurnool", 
        label: "Kurnool", 
        coordinates: [15.8281, 78.0373],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "nellore", 
        label: "Nellore", 
        coordinates: [14.4426, 79.9865],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "prakasam", 
        label: "Prakasam", 
        coordinates: [15.3485, 79.5604],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      },
      { 
        value: "srikakulam", 
        label: "Srikakulam", 
        coordinates: [18.2949, 83.8938],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "visakhapatnam", 
        label: "Visakhapatnam", 
        coordinates: [17.6868, 83.2185],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "vizianagaram", 
        label: "Vizianagaram", 
        coordinates: [18.1067, 83.3956],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      },
      { 
        value: "west_godavari", 
        label: "West Godavari", 
        coordinates: [16.9174, 81.3399],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "kadapa", 
        label: "YSR Kadapa", 
        coordinates: [14.4673, 78.8242],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      }
    ]
  },
  {
    value: "arunachal_pradesh",
    label: "Arunachal Pradesh",
    districts: [
      { 
        value: "anjaw", 
        label: "Anjaw", 
        coordinates: [28.0642, 96.8089],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "changlang", 
        label: "Changlang", 
        coordinates: [27.1303, 95.7344],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "east_kameng", 
        label: "East Kameng", 
        coordinates: [27.3006, 93.0373],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "east_siang", 
        label: "East Siang", 
        coordinates: [28.0634, 95.2534],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "kurung_kumey", 
        label: "Kurung Kumey", 
        coordinates: [27.9057, 93.3932],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "lohit", 
        label: "Lohit", 
        coordinates: [28.0062, 96.1667],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "lower_dibang_valley", 
        label: "Lower Dibang Valley", 
        coordinates: [28.1508, 95.8425],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "lower_subansiri", 
        label: "Lower Subansiri", 
        coordinates: [27.2896, 93.8446],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "papum_pare", 
        label: "Papum Pare", 
        coordinates: [27.1522, 93.7260],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "tawang", 
        label: "Tawang", 
        coordinates: [27.5884, 91.8754],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      },
      { 
        value: "tirap", 
        label: "Tirap", 
        coordinates: [26.9884, 95.5629],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "upper_siang", 
        label: "Upper Siang", 
        coordinates: [28.6635, 95.0407],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "upper_subansiri", 
        label: "Upper Subansiri", 
        coordinates: [28.3033, 93.8527],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "west_kameng", 
        label: "West Kameng", 
        coordinates: [27.2500, 92.4000],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      },
      { 
        value: "west_siang", 
        label: "West Siang", 
        coordinates: [28.4033, 94.5519],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      }
    ]
  },
  {
    value: "assam",
    label: "Assam",
    districts: [
      { 
        value: "baksa", 
        label: "Baksa", 
        coordinates: [26.7360, 91.7320],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "barpeta", 
        label: "Barpeta", 
        coordinates: [26.3200, 91.0100],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "cachar", 
        label: "Cachar", 
        coordinates: [24.8333, 92.7789],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "darrang", 
        label: "Darrang", 
        coordinates: [26.4509, 92.0276],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "dhemaji", 
        label: "Dhemaji", 
        coordinates: [27.4833, 94.5756],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "dhubri", 
        label: "Dhubri", 
        coordinates: [26.0200, 89.9700],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "dibrugarh", 
        label: "Dibrugarh", 
        coordinates: [27.4728, 94.9120],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "goalpara", 
        label: "Goalpara", 
        coordinates: [26.1700, 90.6200],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "guwahati", 
        label: "Guwahati", 
        coordinates: [26.1445, 91.7362],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "jorhat", 
        label: "Jorhat", 
        coordinates: [26.7509, 94.2037],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "kamrup", 
        label: "Kamrup", 
        coordinates: [26.3152, 91.5714],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "lakhimpur", 
        label: "Lakhimpur", 
        coordinates: [27.2335, 94.1002],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      }
    ]
  },
  {
    value: "bihar",
    label: "Bihar",
    districts: [
      { 
        value: "araria", 
        label: "Araria", 
        coordinates: [26.1352, 87.4736],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "bhagalpur", 
        label: "Bhagalpur", 
        coordinates: [25.2424, 86.9842],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "darbhanga", 
        label: "Darbhanga", 
        coordinates: [26.1542, 85.8918],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "east_champaran", 
        label: "East Champaran", 
        coordinates: [26.6098, 84.7818],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "gopalganj", 
        label: "Gopalganj", 
        coordinates: [26.4710, 84.4380],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "katihar", 
        label: "Katihar", 
        coordinates: [25.5521, 87.5700],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "khagaria", 
        label: "Khagaria", 
        coordinates: [25.5021, 86.4670],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "madhubani", 
        label: "Madhubani", 
        coordinates: [26.3482, 86.0789],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "muzaffarpur", 
        label: "Muzaffarpur", 
        coordinates: [26.1209, 85.3647],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "patna", 
        label: "Patna", 
        coordinates: [25.6000, 85.1000],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "purnia", 
        label: "Purnia", 
        coordinates: [25.7771, 87.4753],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "saharsa", 
        label: "Saharsa", 
        coordinates: [25.8800, 86.6000],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "saran", 
        label: "Saran", 
        coordinates: [25.9200, 84.7500],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "sitamarhi", 
        label: "Sitamarhi", 
        coordinates: [26.5900, 85.4900],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      }
    ]
  },
  {
    value: "chhattisgarh",
    label: "Chhattisgarh",
    districts: [
      { 
        value: "bastar", 
        label: "Bastar", 
        coordinates: [19.1071, 81.9535],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      },
      { 
        value: "bilaspur", 
        label: "Bilaspur", 
        coordinates: [22.0797, 82.1409],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "dantewada", 
        label: "Dantewada", 
        coordinates: [18.9027, 81.3544],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      },
      { 
        value: "dhamtari", 
        label: "Dhamtari", 
        coordinates: [20.7073, 81.5497],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "janjgir_champa", 
        label: "Janjgir-Champa", 
        coordinates: [21.9705, 82.5819],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "jashpur", 
        label: "Jashpur", 
        coordinates: [22.8809, 84.1380],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      },
      { 
        value: "kanker", 
        label: "Kanker", 
        coordinates: [20.2724, 81.4924],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      },
      { 
        value: "korba", 
        label: "Korba", 
        coordinates: [22.3595, 82.7501],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "mahasamund", 
        label: "Mahasamund", 
        coordinates: [21.1122, 82.1042],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "raigarh", 
        label: "Raigarh", 
        coordinates: [21.9007, 83.3949],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "raipur", 
        label: "Raipur", 
        coordinates: [21.2514, 81.6296],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "rajnandgaon", 
        label: "Rajnandgaon", 
        coordinates: [21.0972, 81.0316],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "surguja", 
        label: "Surguja", 
        coordinates: [22.9507, 83.1649],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      }
    ]
  },
  {
    value: "delhi",
    label: "Delhi",
    districts: [
      { 
        value: "central_delhi", 
        label: "Central Delhi", 
        coordinates: [28.6519, 77.2315],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "east_delhi", 
        label: "East Delhi", 
        coordinates: [28.6527, 77.2748],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "new_delhi", 
        label: "New Delhi", 
        coordinates: [28.6139, 77.2090],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "north_delhi", 
        label: "North Delhi", 
        coordinates: [28.7186, 77.2010],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "north_east_delhi", 
        label: "North East Delhi", 
        coordinates: [28.6890, 77.3029],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "south_delhi", 
        label: "South Delhi", 
        coordinates: [28.5310, 77.2346],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "west_delhi", 
        label: "West Delhi", 
        coordinates: [28.6663, 77.0845],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      }
    ]
  },
  {
    value: "gujarat",
    label: "Gujarat",
    districts: [
      { 
        value: "ahmedabad", 
        label: "Ahmedabad", 
        coordinates: [23.0225, 72.5714],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "amreli", 
        label: "Amreli", 
        coordinates: [21.6022, 71.2204],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "anand", 
        label: "Anand", 
        coordinates: [22.5645, 72.9289],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "banaskantha", 
        label: "Banaskantha", 
        coordinates: [24.1722, 72.2618],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "bharuch", 
        label: "Bharuch", 
        coordinates: [21.7051, 73.0020],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "bhavnagar", 
        label: "Bhavnagar", 
        coordinates: [21.7522, 72.1567],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "jamnagar", 
        label: "Jamnagar", 
        coordinates: [22.4707, 70.0577],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "junagadh", 
        label: "Junagadh", 
        coordinates: [21.5222, 70.4579],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "kutch", 
        label: "Kutch", 
        coordinates: [23.4333, 70.4500],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "kheda", 
        label: "Kheda", 
        coordinates: [22.7519, 72.6840],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "mehsana", 
        label: "Mehsana", 
        coordinates: [23.6007, 72.3855],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "panchmahal", 
        label: "Panchmahal", 
        coordinates: [22.7749, 73.6005],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "rajkot", 
        label: "Rajkot", 
        coordinates: [22.3039, 70.8022],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "surat", 
        label: "Surat", 
        coordinates: [21.1702, 72.8311],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "vadodara", 
        label: "Vadodara", 
        coordinates: [22.3072, 73.1812],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "valsad", 
        label: "Valsad", 
        coordinates: [20.5931, 73.0125],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      }
    ]
  },
  {
    value: "haryana",
    label: "Haryana",
    districts: [
      { 
        value: "ambala", 
        label: "Ambala", 
        coordinates: [30.3752, 76.7821],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "bhiwani", 
        label: "Bhiwani", 
        coordinates: [28.7834, 76.1400],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      },
      { 
        value: "faridabad", 
        label: "Faridabad", 
        coordinates: [28.4089, 77.3178],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "fatehabad", 
        label: "Fatehabad", 
        coordinates: [29.5152, 75.4507],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "gurugram", 
        label: "Gurugram", 
        coordinates: [28.4595, 77.0266],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "hisar", 
        label: "Hisar", 
        coordinates: [29.1492, 75.7217],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      },
      { 
        value: "jhajjar", 
        label: "Jhajjar", 
        coordinates: [28.6057, 76.6599],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "jind", 
        label: "Jind", 
        coordinates: [29.3166, 76.3170],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "kaithal", 
        label: "Kaithal", 
        coordinates: [29.8011, 76.3996],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "karnal", 
        label: "Karnal", 
        coordinates: [29.6857, 76.9905],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "kurukshetra", 
        label: "Kurukshetra", 
        coordinates: [29.9695, 76.8783],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "sonipat", 
        label: "Sonipat", 
        coordinates: [28.9931, 77.0151],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "yamunanagar", 
        label: "Yamunanagar", 
        coordinates: [30.1446, 77.2885],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      }
    ]
  },
  {
    value: "himachal_pradesh",
    label: "Himachal Pradesh",
    districts: [
      { 
        value: "bilaspur", 
        label: "Bilaspur", 
        coordinates: [31.3349, 76.7580],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "chamba", 
        label: "Chamba", 
        coordinates: [32.5533, 76.1256],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "hamirpur", 
        label: "Hamirpur", 
        coordinates: [31.6895, 76.5318],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      },
      { 
        value: "kangra", 
        label: "Kangra", 
        coordinates: [32.0998, 76.2691],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "kinnaur", 
        label: "Kinnaur", 
        coordinates: [31.5896, 78.1772],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "kullu", 
        label: "Kullu", 
        coordinates: [31.9592, 77.1090],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "lahaul_spiti", 
        label: "Lahaul and Spiti", 
        coordinates: [32.5797, 77.0513],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      },
      { 
        value: "mandi", 
        label: "Mandi", 
        coordinates: [31.7242, 76.9326],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "shimla", 
        label: "Shimla", 
        coordinates: [31.1048, 77.1734],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      },
      { 
        value: "sirmaur", 
        label: "Sirmaur", 
        coordinates: [30.5686, 77.3940],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      },
      { 
        value: "solan", 
        label: "Solan", 
        coordinates: [30.9045, 77.0967],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      },
      { 
        value: "una", 
        label: "Una", 
        coordinates: [31.4685, 76.2661],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      }
    ]
  },
  {
    value: "jharkhand",
    label: "Jharkhand",
    districts: [
      { 
        value: "bokaro", 
        label: "Bokaro", 
        coordinates: [23.6950, 85.9932],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "dhanbad", 
        label: "Dhanbad", 
        coordinates: [23.7998, 86.4305],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "dumka", 
        label: "Dumka", 
        coordinates: [24.2800, 87.2500],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "east_singhbhum", 
        label: "East Singhbhum", 
        coordinates: [22.8046, 86.2029],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "garhwa", 
        label: "Garhwa", 
        coordinates: [24.1600, 83.5200],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "giridih", 
        label: "Giridih", 
        coordinates: [24.1800, 86.3100],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "godda", 
        label: "Godda", 
        coordinates: [24.8274, 87.2196],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "gumla", 
        label: "Gumla", 
        coordinates: [23.0101, 84.5365],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "hazaribagh", 
        label: "Hazaribagh", 
        coordinates: [23.9925, 85.3637],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "jamshedpur", 
        label: "Jamshedpur", 
        coordinates: [22.8046, 86.2029],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "ranchi", 
        label: "Ranchi", 
        coordinates: [23.3441, 85.3096],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      }
    ]
  },
  {
    value: "karnataka",
    label: "Karnataka",
    districts: [
      { 
        value: "bagalkot", 
        label: "Bagalkot", 
        coordinates: [16.1691, 75.6615],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "bangalore_rural", 
        label: "Bengaluru Rural", 
        coordinates: [13.2679, 77.8772],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "bangalore_urban", 
        label: "Bengaluru Urban", 
        coordinates: [12.9716, 77.5946],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "belgaum", 
        label: "Belagavi", 
        coordinates: [15.8546, 74.5076],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "bellary", 
        label: "Ballari", 
        coordinates: [15.1394, 76.9214],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "bidar", 
        label: "Bidar", 
        coordinates: [17.9104, 77.5199],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "chamarajanagar", 
        label: "Chamarajanagar", 
        coordinates: [11.9261, 76.9437],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      },
      { 
        value: "chikmagalur", 
        label: "Chikkamagaluru", 
        coordinates: [13.3161, 75.7720],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "chitradurga", 
        label: "Chitradurga", 
        coordinates: [14.2250, 76.4000],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "dakshina_kannada", 
        label: "Dakshina Kannada", 
        coordinates: [12.8438, 75.2479],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "davangere", 
        label: "Davangere", 
        coordinates: [14.4644, 75.9218],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "dharwad", 
        label: "Dharwad", 
        coordinates: [15.4589, 75.0078],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "gulbarga", 
        label: "Kalaburagi", 
        coordinates: [17.3297, 76.8343],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "hassan", 
        label: "Hassan", 
        coordinates: [13.0068, 76.1033],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "kodagu", 
        label: "Kodagu", 
        coordinates: [12.4244, 75.7382],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "kolar", 
        label: "Kolar", 
        coordinates: [13.1367, 78.1296],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "mandya", 
        label: "Mandya", 
        coordinates: [12.5218, 76.8951],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "mysore", 
        label: "Mysuru", 
        coordinates: [12.3052, 76.6552],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "raichur", 
        label: "Raichur", 
        coordinates: [16.2076, 77.3463],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "shimoga", 
        label: "Shivamogga", 
        coordinates: [13.9304, 75.5600],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "tumkur", 
        label: "Tumakuru", 
        coordinates: [13.3379, 77.1173],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "udupi", 
        label: "Udupi", 
        coordinates: [13.3409, 74.7421],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "uttara_kannada", 
        label: "Uttara Kannada", 
        coordinates: [14.7936, 74.6941],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      }
    ]
  },
  {
    value: "kerala",
    label: "Kerala",
    districts: [
      { 
        value: "alappuzha", 
        label: "Alappuzha", 
        coordinates: [9.5012, 76.3599],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "ernakulam", 
        label: "Ernakulam", 
        coordinates: [9.9816, 76.2999],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "idukki", 
        label: "Idukki", 
        coordinates: [9.8500, 77.1700],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "kannur", 
        label: "Kannur", 
        coordinates: [11.8745, 75.3704],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "kasaragod", 
        label: "Kasaragod", 
        coordinates: [12.4996, 75.0004],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "kollam", 
        label: "Kollam", 
        coordinates: [8.8932, 76.6141],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "kottayam", 
        label: "Kottayam", 
        coordinates: [9.5916, 76.5222],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "kozhikode", 
        label: "Kozhikode", 
        coordinates: [11.2588, 75.7804],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "malappuram", 
        label: "Malappuram", 
        coordinates: [11.0757, 76.0743],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "palakkad", 
        label: "Palakkad", 
        coordinates: [10.7867, 76.6548],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "pathanamthitta", 
        label: "Pathanamthitta", 
        coordinates: [9.2648, 76.7870],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "thiruvananthapuram", 
        label: "Thiruvananthapuram", 
        coordinates: [8.5241, 76.9366],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "thrissur", 
        label: "Thrissur", 
        coordinates: [10.5276, 76.2144],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "wayanad", 
        label: "Wayanad", 
        coordinates: [11.6854, 76.1320],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      }
    ]
  },
  {
    value: "madhya_pradesh",
    label: "Madhya Pradesh",
    districts: [
      { 
        value: "bhopal", 
        label: "Bhopal", 
        coordinates: [23.2599, 77.4126],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "chhindwara", 
        label: "Chhindwara", 
        coordinates: [22.0574, 78.9382],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "gwalior", 
        label: "Gwalior", 
        coordinates: [26.2183, 78.1828],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "indore", 
        label: "Indore", 
        coordinates: [22.7196, 75.8577],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "jabalpur", 
        label: "Jabalpur", 
        coordinates: [23.1815, 79.9864],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "rewa", 
        label: "Rewa", 
        coordinates: [24.5362, 81.3037],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "sagar", 
        label: "Sagar", 
        coordinates: [23.8388, 78.7378],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "ujjain", 
        label: "Ujjain", 
        coordinates: [23.1765, 75.7885],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      }
    ]
  },
  {
    value: "maharashtra",
    label: "Maharashtra",
    districts: [
      { 
        value: "ahmednagar", 
        label: "Ahmednagar", 
        coordinates: [19.0901, 74.7380],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "akola", 
        label: "Akola", 
        coordinates: [20.7002, 77.0082],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "amravati", 
        label: "Amravati", 
        coordinates: [20.9320, 77.7523],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "aurangabad", 
        label: "Aurangabad", 
        coordinates: [19.8762, 75.3433],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "beed", 
        label: "Beed", 
        coordinates: [18.9891, 75.7601],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "bhandara", 
        label: "Bhandara", 
        coordinates: [21.1755, 79.6554],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "buldhana", 
        label: "Buldhana", 
        coordinates: [20.5289, 76.1842],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "chandrapur", 
        label: "Chandrapur", 
        coordinates: [19.9615, 79.2961],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "dhule", 
        label: "Dhule", 
        coordinates: [20.9042, 74.7749],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "jalgaon", 
        label: "Jalgaon", 
        coordinates: [21.0077, 76.0340],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "kolhapur", 
        label: "Kolhapur", 
        coordinates: [16.7050, 74.2433],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "latur", 
        label: "Latur", 
        coordinates: [18.4088, 76.5604],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "mumbai_city", 
        label: "Mumbai City", 
        coordinates: [18.9667, 72.8333],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "mumbai_suburban", 
        label: "Mumbai Suburban", 
        coordinates: [19.0760, 72.8777],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "nagpur", 
        label: "Nagpur", 
        coordinates: [21.1458, 79.0882],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "nanded", 
        label: "Nanded", 
        coordinates: [19.1383, 77.3210],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "nashik", 
        label: "Nashik", 
        coordinates: [20.0059, 73.7912],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "osmanabad", 
        label: "Osmanabad", 
        coordinates: [18.1837, 76.0400],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "pune", 
        label: "Pune", 
        coordinates: [18.5204, 73.8567],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "raigad", 
        label: "Raigad", 
        coordinates: [18.5159, 73.1822],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "ratnagiri", 
        label: "Ratnagiri", 
        coordinates: [17.0005, 73.2700],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "sangli", 
        label: "Sangli", 
        coordinates: [16.8524, 74.5815],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "satara", 
        label: "Satara", 
        coordinates: [17.6805, 74.0183],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "solapur", 
        label: "Solapur", 
        coordinates: [17.6599, 75.9064],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "thane", 
        label: "Thane", 
        coordinates: [19.2183, 72.9781],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "wardha", 
        label: "Wardha", 
        coordinates: [20.7453, 78.6022],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "yavatmal", 
        label: "Yavatmal", 
        coordinates: [20.3888, 78.1204],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      }
    ]
  },
  {
    value: "odisha",
    label: "Odisha",
    districts: [
      { 
        value: "balasore", 
        label: "Balasore", 
        coordinates: [21.5006, 86.9404],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "cuttack", 
        label: "Cuttack", 
        coordinates: [20.4625, 85.8830],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "ganjam", 
        label: "Ganjam", 
        coordinates: [19.5906, 84.6897],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "jagatsinghpur", 
        label: "Jagatsinghpur", 
        coordinates: [20.2667, 86.1700],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "jajpur", 
        label: "Jajpur", 
        coordinates: [20.8500, 86.3300],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "kendrapara", 
        label: "Kendrapara", 
        coordinates: [20.5000, 86.4200],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "khordha", 
        label: "Khordha", 
        coordinates: [20.1306, 85.4788],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "mayurbhanj", 
        label: "Mayurbhanj", 
        coordinates: [21.9349, 86.7219],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "puri", 
        label: "Puri", 
        coordinates: [19.8106, 85.8314],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      }
    ]
  },
  {
    value: "punjab",
    label: "Punjab",
    districts: [
      { 
        value: "amritsar", 
        label: "Amritsar", 
        coordinates: [31.6340, 74.8723],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "bathinda", 
        label: "Bathinda", 
        coordinates: [30.2110, 74.9455],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "faridkot", 
        label: "Faridkot", 
        coordinates: [30.6706, 74.7580],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "fatehgarh_sahib", 
        label: "Fatehgarh Sahib", 
        coordinates: [30.6483, 76.3887],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "ferozepur", 
        label: "Ferozepur", 
        coordinates: [30.9331, 74.6225],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "gurdaspur", 
        label: "Gurdaspur", 
        coordinates: [32.0419, 75.4053],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "hoshiarpur", 
        label: "Hoshiarpur", 
        coordinates: [31.5273, 75.9115],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "jalandhar", 
        label: "Jalandhar", 
        coordinates: [31.3260, 75.5762],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "kapurthala", 
        label: "Kapurthala", 
        coordinates: [31.3800, 75.3864],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "ludhiana", 
        label: "Ludhiana", 
        coordinates: [30.9010, 75.8573],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "moga", 
        label: "Moga", 
        coordinates: [30.8130, 75.1718],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "patiala", 
        label: "Patiala", 
        coordinates: [30.3398, 76.3869],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "rupnagar", 
        label: "Rupnagar", 
        coordinates: [30.9684, 76.5331],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "sahibzada_ajit_singh_nagar", 
        label: "Sahibzada Ajit Singh Nagar", 
        coordinates: [30.6882, 76.7292],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      }
    ]
  },
  {
    value: "rajasthan",
    label: "Rajasthan",
    districts: [
      { 
        value: "ajmer", 
        label: "Ajmer", 
        coordinates: [26.4691, 74.6390],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      },
      { 
        value: "alwar", 
        label: "Alwar", 
        coordinates: [27.5430, 76.6346],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      },
      { 
        value: "banswara", 
        label: "Banswara", 
        coordinates: [23.5461, 74.4349],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "barmer", 
        label: "Barmer", 
        coordinates: [25.7521, 71.3967],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      },
      { 
        value: "bharatpur", 
        label: "Bharatpur", 
        coordinates: [27.2152, 77.4938],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "bhilwara", 
        label: "Bhilwara", 
        coordinates: [25.3407, 74.6313],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      },
      { 
        value: "bikaner", 
        label: "Bikaner", 
        coordinates: [28.0229, 73.3119],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      },
      { 
        value: "chittorgarh", 
        label: "Chittorgarh", 
        coordinates: [24.8887, 74.6270],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      },
      { 
        value: "dausa", 
        label: "Dausa", 
        coordinates: [26.8946, 76.3335],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      },
      { 
        value: "jaipur", 
        label: "Jaipur", 
        coordinates: [26.9124, 75.7873],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "jaisalmer", 
        label: "Jaisalmer", 
        coordinates: [26.9157, 70.9083],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      },
      { 
        value: "jodhpur", 
        label: "Jodhpur", 
        coordinates: [26.2389, 73.0243],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      },
      { 
        value: "kota", 
        label: "Kota", 
        coordinates: [25.2138, 75.8648],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "udaipur", 
        label: "Udaipur", 
        coordinates: [24.5854, 73.7125],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Low",
          floodRisk: "Green - Low Risk"
        }
      }
    ]
  },
  {
    value: "tamil_nadu",
    label: "Tamil Nadu",
    districts: [
      { 
        value: "chennai", 
        label: "Chennai", 
        coordinates: [13.0827, 80.2707],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "coimbatore", 
        label: "Coimbatore", 
        coordinates: [11.0168, 76.9558],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "cuddalore", 
        label: "Cuddalore", 
        coordinates: [11.7482, 79.7685],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "dindigul", 
        label: "Dindigul", 
        coordinates: [10.3673, 77.9803],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "erode", 
        label: "Erode", 
        coordinates: [11.3410, 77.7172],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "kancheepuram", 
        label: "Kanchipuram", 
        coordinates: [12.8342, 79.7036],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "kanniyakumari", 
        label: "Kanniyakumari", 
        coordinates: [8.0883, 77.5385],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "madurai", 
        label: "Madurai", 
        coordinates: [9.9252, 78.1198],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "nagapattinam", 
        label: "Nagapattinam", 
        coordinates: [10.7672, 79.8449],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "nilgiris", 
        label: "Nilgiris", 
        coordinates: [11.4916, 76.7337],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "ramanathapuram", 
        label: "Ramanathapuram", 
        coordinates: [9.3639, 78.8395],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "salem", 
        label: "Salem", 
        coordinates: [11.6643, 78.1460],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "thanjavur", 
        label: "Thanjavur", 
        coordinates: [10.7870, 79.1378],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "tiruchirappalli", 
        label: "Tiruchirappalli", 
        coordinates: [10.7905, 78.7047],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "tirunelveli", 
        label: "Tirunelveli", 
        coordinates: [8.7139, 77.7567],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "tiruvallur", 
        label: "Tiruvallur", 
        coordinates: [13.1231, 79.9120],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "tiruvannamalai", 
        label: "Tiruvannamalai", 
        coordinates: [12.2266, 79.0747],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "vellore", 
        label: "Vellore", 
        coordinates: [12.9165, 79.1325],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      }
    ]
  },
  {
    value: "telangana",
    label: "Telangana",
    districts: [
      { 
        value: "adilabad", 
        label: "Adilabad", 
        coordinates: [19.6640, 78.5320],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "hyderabad", 
        label: "Hyderabad", 
        coordinates: [17.3850, 78.4867],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "karimnagar", 
        label: "Karimnagar", 
        coordinates: [18.4386, 79.1288],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "khammam", 
        label: "Khammam", 
        coordinates: [17.2472, 80.1514],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "mahabubnagar", 
        label: "Mahabubnagar", 
        coordinates: [16.7375, 78.0047],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "medak", 
        label: "Medak", 
        coordinates: [18.0457, 78.2632],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "nalgonda", 
        label: "Nalgonda", 
        coordinates: [17.0575, 79.2671],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "nizamabad", 
        label: "Nizamabad", 
        coordinates: [18.6725, 78.0941],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "rangareddy", 
        label: "Rangareddy", 
        coordinates: [17.4161, 78.1442],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "warangal", 
        label: "Warangal", 
        coordinates: [18.0000, 79.5800],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      }
    ]
  },
  {
    value: "uttar_pradesh",
    label: "Uttar Pradesh",
    districts: [
      { 
        value: "agra", 
        label: "Agra", 
        coordinates: [27.1767, 78.0081],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "aligarh", 
        label: "Aligarh", 
        coordinates: [27.8974, 78.0883],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "allahabad", 
        label: "Prayagraj", 
        coordinates: [25.4358, 81.8463],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "azamgarh", 
        label: "Azamgarh", 
        coordinates: [26.0739, 83.1860],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "bahraich", 
        label: "Bahraich", 
        coordinates: [27.5743, 81.5957],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "ballia", 
        label: "Ballia", 
        coordinates: [25.7548, 84.1486],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "bareilly", 
        label: "Bareilly", 
        coordinates: [28.3670, 79.4304],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "basti", 
        label: "Basti", 
        coordinates: [26.8139, 82.7600],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "deoria", 
        label: "Deoria", 
        coordinates: [26.5139, 83.7781],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "faizabad", 
        label: "Ayodhya", 
        coordinates: [26.7756, 82.1443],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "farrukhabad", 
        label: "Farrukhabad", 
        coordinates: [27.3886, 79.5820],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "fatehpur", 
        label: "Fatehpur", 
        coordinates: [25.8577, 80.8087],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "ghaziabad", 
        label: "Ghaziabad", 
        coordinates: [28.6692, 77.4538],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "gonda", 
        label: "Gonda", 
        coordinates: [27.1339, 81.9657],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "gorakhpur", 
        label: "Gorakhpur", 
        coordinates: [26.7605, 83.3731],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "jaunpur", 
        label: "Jaunpur", 
        coordinates: [25.7464, 82.6836],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "kanpur", 
        label: "Kanpur", 
        coordinates: [26.4499, 80.3319],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "lucknow", 
        label: "Lucknow", 
        coordinates: [26.8467, 80.9462],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "mathura", 
        label: "Mathura", 
        coordinates: [27.4924, 77.6737],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "meerut", 
        label: "Meerut", 
        coordinates: [28.9845, 77.7064],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "moradabad", 
        label: "Moradabad", 
        coordinates: [28.8386, 78.7733],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "muzaffarnagar", 
        label: "Muzaffarnagar", 
        coordinates: [29.4727, 77.7085],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "saharanpur", 
        label: "Saharanpur", 
        coordinates: [29.9680, 77.5460],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "varanasi", 
        label: "Varanasi", 
        coordinates: [25.3176, 82.9739],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      }
    ]
  },
  {
    value: "uttarakhand",
    label: "Uttarakhand",
    districts: [
      { 
        value: "almora", 
        label: "Almora", 
        coordinates: [29.5971, 79.6562],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "dehradun", 
        label: "Dehradun", 
        coordinates: [30.3165, 78.0322],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "haridwar", 
        label: "Haridwar", 
        coordinates: [29.9457, 78.1642],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "nainital", 
        label: "Nainital", 
        coordinates: [29.3919, 79.4542],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "pauri_garhwal", 
        label: "Pauri Garhwal", 
        coordinates: [30.1469, 78.7808],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "pithoragarh", 
        label: "Pithoragarh", 
        coordinates: [29.5828, 80.2181],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "rudraprayag", 
        label: "Rudraprayag", 
        coordinates: [30.2844, 78.9812],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "tehri_garhwal", 
        label: "Tehri Garhwal", 
        coordinates: [30.3000, 78.5700],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "udham_singh_nagar", 
        label: "Udham Singh Nagar", 
        coordinates: [29.0000, 79.4000],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "uttarkashi", 
        label: "Uttarkashi", 
        coordinates: [30.7268, 78.4354],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "champawat", 
        label: "Champawat", 
        coordinates: [29.3300, 80.1000],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "chamoli", 
        label: "Chamoli", 
        coordinates: [30.4089, 79.3200],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "bageshwar", 
        label: "Bageshwar", 
        coordinates: [29.8500, 79.7700],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      }
    ]
  },
  {
    value: "west_bengal",
    label: "West Bengal",
    districts: [
      { 
        value: "bankura", 
        label: "Bankura", 
        coordinates: [23.2500, 87.0700],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "bardhaman", 
        label: "Bardhaman", 
        coordinates: [23.2500, 87.8500],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "birbhum", 
        label: "Birbhum", 
        coordinates: [23.9084, 87.5320],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "cooch_behar", 
        label: "Cooch Behar", 
        coordinates: [26.3258, 89.4435],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "darjeeling", 
        label: "Darjeeling", 
        coordinates: [27.0380, 88.2627],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "hooghly", 
        label: "Hooghly", 
        coordinates: [22.9159, 88.3962],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "howrah", 
        label: "Howrah", 
        coordinates: [22.5958, 88.2636],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "jalpaiguri", 
        label: "Jalpaiguri", 
        coordinates: [26.5172, 88.7326],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "kolkata", 
        label: "Kolkata", 
        coordinates: [22.5726, 88.3639],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "malda", 
        label: "Malda", 
        coordinates: [25.0051, 88.1393],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "murshidabad", 
        label: "Murshidabad", 
        coordinates: [24.2290, 88.2461],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "nadia", 
        label: "Nadia", 
        coordinates: [23.4710, 88.5565],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "north_24_parganas", 
        label: "North 24 Parganas", 
        coordinates: [22.6168, 88.4029],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "purba_medinipur", 
        label: "Purba Medinipur", 
        coordinates: [22.2877, 87.9162],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "purulia", 
        label: "Purulia", 
        coordinates: [23.3320, 86.3616],
        floodInfo: {
          hasFloodData: false,
          floodProbability: "Medium",
          floodRisk: "Yellow - Medium Risk"
        }
      },
      { 
        value: "south_24_parganas", 
        label: "South 24 Parganas", 
        coordinates: [22.1352, 88.4016],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      },
      { 
        value: "uttar_dinajpur", 
        label: "Uttar Dinajpur", 
        coordinates: [25.6200, 88.1300],
        floodInfo: {
          hasFloodData: true,
          floodProbability: "High",
          floodRisk: "Red - High Risk"
        }
      }
    ]
  }
];

// Helper function to get districts for a specific state
export const getDistrictsForState = (stateValue: string): { value: string; label: string }[] => {
  const state = indiaStatesAndDistricts.find(state => state.value === stateValue);
  if (!state) return [];
  
  // Return only value and label properties for the districts dropdown
  return state.districts.map(district => ({
    value: district.value,
    label: district.label
  }));
};

// Helper function to get a district with its full data including coordinates and flood info
export const getDistrictFullData = (stateValue: string, districtValue: string): District | undefined => {
  const state = indiaStatesAndDistricts.find(state => state.value === stateValue);
  if (!state) return undefined;
  
  return state.districts.find(district => district.value === districtValue);
};

