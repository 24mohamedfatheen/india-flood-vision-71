import { supabase } from '../integrations/supabase/client';

export interface ReservoirData {
  id: number;
  reservoir_name: string;
  state?: string;
  district?: string;
  current_level_mcm?: number;
  capacity_mcm?: number;
  percentage_full?: number;
  inflow_cusecs?: number;
  outflow_cusecs?: number;
  last_updated?: string;
  lat?: number;
  long?: number;
}

export interface FloodRiskCalculation {
  riskLevel: 'low' | 'medium' | 'high' | 'severe';
  probabilityIncrease: number;
  affectedPopulation: number;
  reasoning: string;
}

// Map regions to their relevant reservoirs
const REGION_RESERVOIR_MAP: Record<string, string[]> = {
  'mumbai': ['Tansa', 'Vihar', 'Tulsi', 'Vaitarna'],
  'delhi': ['Yamuna', 'Bhakra'],
  'kolkata': ['Damodar Valley', 'Farakka'],
  'chennai': ['Poondi', 'Cholavaram', 'Redhills', 'Chembarambakkam'],
  'bangalore': ['Cauvery', 'Kabini', 'Krishna Raja Sagara'],
  'hyderabad': ['Nagarjuna Sagar', 'Srisailam'],
  'ahmedabad': ['Sardar Sarovar', 'Ukai'],
  'pune': ['Khadakwasla', 'Panshet', 'Warasgaon'],
  'surat': ['Ukai', 'Kadana'],
  'jaipur': ['Bisalpur', 'Mahi Bajaj Sagar'],
  'lucknow': ['Rihand', 'Obra'],
  'kanpur': ['Rihand', 'Mata Tila'],
  'nagpur': ['Gosikhurd', 'Totladoh'],
  'patna': ['Sone', 'Kosi'],
  'indore': ['Omkareshwar', 'Bargi'],
  'kochi': ['Idukki', 'Mullaperiyar'],
  'guwahati': ['Kopili', 'Umiam']
};

export const fetchReservoirData = async (): Promise<ReservoirData[]> => {
  try {
    console.log('Fetching reservoir data from Supabase...');
    
    const { data, error } = await supabase
      .from('indian_reservoir_levels')
      .select('id,reservoir_name')
      .not('reservoir_name', 'is', null);

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    console.log(`Successfully fetched ${data?.length || 0} reservoir records`);
    return data || [];
  } catch (error) {
    console.error('Error fetching reservoir data:', error);
    return [];
  }
};

export const calculateFloodRiskFromReservoirs = (
  region: string,
  reservoirs: ReservoirData[]
): FloodRiskCalculation => {
  const regionReservoirs = REGION_RESERVOIR_MAP[region.toLowerCase()] || [];
  
  // Find reservoirs relevant to this region
  const relevantReservoirs = reservoirs.filter(r => 
    regionReservoirs.some(name => 
      r.reservoir_name?.toLowerCase().includes(name.toLowerCase()) ||
      r.state?.toLowerCase() === getStateForRegion(region).toLowerCase()
    )
  );

  if (relevantReservoirs.length === 0) {
    return {
      riskLevel: 'medium',
      probabilityIncrease: 0,
      affectedPopulation: 0,
      reasoning: 'No local reservoir data available'
    };
  }

  // Calculate risk based on reservoir conditions
  let totalRiskScore = 0;
  let criticalReservoirs = 0;
  let overflowingReservoirs = 0;
  let highInflowReservoirs = 0;

  relevantReservoirs.forEach(reservoir => {
    const percentageFull = reservoir.percentage_full || 
      (reservoir.current_level_mcm / reservoir.capacity_mcm) * 100;
    
    const inflowRate = reservoir.inflow_cusecs || 0;
    const outflowRate = reservoir.outflow_cusecs || 0;
    const netInflow = inflowRate - outflowRate;

    // Risk scoring based on multiple factors
    let reservoirRisk = 0;

    // High capacity = higher risk
    if (percentageFull > 90) {
      reservoirRisk += 40;
      criticalReservoirs++;
    } else if (percentageFull > 80) {
      reservoirRisk += 25;
    } else if (percentageFull > 70) {
      reservoirRisk += 15;
    }

    // High net inflow = higher risk
    if (netInflow > 10000) {
      reservoirRisk += 30;
      highInflowReservoirs++;
    } else if (netInflow > 5000) {
      reservoirRisk += 20;
    } else if (netInflow > 1000) {
      reservoirRisk += 10;
    }

    // Check for overflow conditions
    if (percentageFull > 95 && netInflow > 0) {
      reservoirRisk += 50;
      overflowingReservoirs++;
    }

    totalRiskScore += reservoirRisk;
  });

  // Average risk score
  const avgRiskScore = totalRiskScore / relevantReservoirs.length;

  // Determine risk level and probability increase
  let riskLevel: 'low' | 'medium' | 'high' | 'severe';
  let probabilityIncrease: number;
  let affectedPopulation: number;

  if (avgRiskScore >= 70 || overflowingReservoirs > 0) {
    riskLevel = 'severe';
    probabilityIncrease = 40;
    affectedPopulation = 2000000;
  } else if (avgRiskScore >= 50 || criticalReservoirs > 1) {
    riskLevel = 'high';
    probabilityIncrease = 25;
    affectedPopulation = 1200000;
  } else if (avgRiskScore >= 30 || highInflowReservoirs > 0) {
    riskLevel = 'medium';
    probabilityIncrease = 15;
    affectedPopulation = 600000;
  } else {
    riskLevel = 'low';
    probabilityIncrease = 5;
    affectedPopulation = 200000;
  }

  // Generate reasoning
  let reasoning = `Based on ${relevantReservoirs.length} local reservoirs: `;
  if (criticalReservoirs > 0) {
    reasoning += `${criticalReservoirs} reservoir(s) above 80% capacity. `;
  }
  if (overflowingReservoirs > 0) {
    reasoning += `${overflowingReservoirs} reservoir(s) near overflow. `;
  }
  if (highInflowReservoirs > 0) {
    reasoning += `${highInflowReservoirs} reservoir(s) with high inflow rates. `;
  }

  return {
    riskLevel,
    probabilityIncrease,
    affectedPopulation,
    reasoning: reasoning.trim()
  };
};

// Helper function to get state for region
const getStateForRegion = (region: string): string => {
  const regionStateMap: Record<string, string> = {
    'mumbai': 'Maharashtra',
    'delhi': 'Delhi',
    'kolkata': 'West Bengal',
    'chennai': 'Tamil Nadu',
    'bangalore': 'Karnataka',
    'hyderabad': 'Telangana',
    'ahmedabad': 'Gujarat',
    'pune': 'Maharashtra',
    'surat': 'Gujarat',
    'jaipur': 'Rajasthan',
    'lucknow': 'Uttar Pradesh',
    'kanpur': 'Uttar Pradesh',
    'nagpur': 'Maharashtra',
    'patna': 'Bihar',
    'indore': 'Madhya Pradesh',
    'kochi': 'Kerala',
    'guwahati': 'Assam'
  };
  
  return regionStateMap[region.toLowerCase()] || '';
};
