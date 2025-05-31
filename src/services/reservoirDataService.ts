
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type ReservoirData = Tables<'indian_reservoir_levels'>;

export interface ProcessedReservoirData {
  reservoir_name: string;
  current_level: number;
  capacity: number;
  percentage_full: number;
  inflow: number;
  outflow: number;
  state: string;
  district: string;
  status: string;
  last_updated: string;
  risk_level: 'low' | 'medium' | 'high' | 'severe';
}

export async function fetchReservoirData(): Promise<ReservoirData[]> {
  try {
    const { data, error } = await supabase
      .from('indian_reservoir_levels')
      .select('*')
      .order('last_updated', { ascending: false });

    if (error) {
      console.error('Error fetching reservoir data:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch reservoir data:', error);
    throw error;
  }
}

export async function fetchReservoirsByState(state: string): Promise<ReservoirData[]> {
  try {
    const { data, error } = await supabase
      .from('indian_reservoir_levels')
      .select('*')
      .eq('state', state)
      .order('last_updated', { ascending: false });

    if (error) {
      console.error('Error fetching reservoir data by state:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch reservoir data by state:', error);
    throw error;
  }
}

export function processReservoirData(reservoirs: ReservoirData[]): ProcessedReservoirData[] {
  return reservoirs.map(reservoir => {
    const percentage = reservoir.percentage_full || 0;
    const riskLevel = getRiskLevel(percentage, reservoir.inflow_cusecs || 0);
    
    return {
      reservoir_name: reservoir.reservoir_name,
      current_level: reservoir.level || 0,
      capacity: reservoir.capacity_mcm || 0,
      percentage_full: percentage,
      inflow: reservoir.inflow_cusecs || 0,
      outflow: reservoir.outflow_cusecs || 0,
      state: reservoir.state || 'Unknown',
      district: reservoir.district || 'Unknown',
      status: reservoir.status || 'Unknown',
      last_updated: reservoir.last_updated,
      risk_level: riskLevel
    };
  });
}

function getRiskLevel(percentage: number, inflow: number): 'low' | 'medium' | 'high' | 'severe' {
  if (percentage > 90 || inflow > 50000) return 'severe';
  if (percentage > 75 || inflow > 30000) return 'high';
  if (percentage > 60 || inflow > 15000) return 'medium';
  return 'low';
}

export async function getFloodRiskByRegion(region: string) {
  try {
    const reservoirs = await fetchReservoirData();
    const regionReservoirs = reservoirs.filter(r => 
      r.state?.toLowerCase().includes(region.toLowerCase()) ||
      r.district?.toLowerCase().includes(region.toLowerCase())
    );
    
    const processed = processReservoirData(regionReservoirs);
    
    // Calculate overall risk for the region
    const highRiskCount = processed.filter(r => r.risk_level === 'severe' || r.risk_level === 'high').length;
    const totalReservoirs = processed.length;
    
    let overallRisk: 'low' | 'medium' | 'high' | 'severe' = 'low';
    if (totalReservoirs > 0) {
      const riskRatio = highRiskCount / totalReservoirs;
      if (riskRatio > 0.5) overallRisk = 'severe';
      else if (riskRatio > 0.3) overallRisk = 'high';
      else if (riskRatio > 0.1) overallRisk = 'medium';
    }
    
    return {
      region,
      reservoirs: processed,
      overall_risk: overallRisk,
      total_reservoirs: totalReservoirs,
      high_risk_count: highRiskCount,
      last_updated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting flood risk by region:', error);
    throw error;
  }
}
