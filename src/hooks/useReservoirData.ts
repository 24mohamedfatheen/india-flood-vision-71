
import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import { 
  fetchReservoirData, 
  fetchReservoirsByState, 
  getFloodRiskByRegion,
  type ReservoirData,
  type ProcessedReservoirData 
} from '../services/reservoirDataService';

interface UseReservoirDataReturn {
  reservoirs: ReservoirData[];
  processedReservoirs: ProcessedReservoirData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  fetchByState: (state: string) => Promise<void>;
  getRegionRisk: (region: string) => Promise<any>;
}

export function useReservoirData(): UseReservoirDataReturn {
  const [reservoirs, setReservoirs] = useState<ReservoirData[]>([]);
  const [processedReservoirs, setProcessedReservoirs] = useState<ProcessedReservoirData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadReservoirData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchReservoirData();
      setReservoirs(data);
      
      // Process the data for easier consumption
      const processed = data.map(reservoir => {
        const percentage = reservoir.percentage_full || 0;
        const riskLevel = percentage > 90 ? 'severe' : 
                         percentage > 75 ? 'high' : 
                         percentage > 60 ? 'medium' : 'low';
        
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
          risk_level: riskLevel as 'low' | 'medium' | 'high' | 'severe'
        };
      });
      
      setProcessedReservoirs(processed);
      
      toast({
        title: "Data Updated",
        description: `Loaded ${data.length} reservoir records`,
        duration: 3000,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load reservoir data';
      setError(errorMessage);
      
      toast({
        title: "Error Loading Data",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchByState = useCallback(async (state: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchReservoirsByState(state);
      setReservoirs(data);
      
      toast({
        title: "State Data Loaded",
        description: `Loaded ${data.length} reservoirs for ${state}`,
        duration: 3000,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load state data';
      setError(errorMessage);
      
      toast({
        title: "Error Loading State Data",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getRegionRisk = useCallback(async (region: string) => {
    try {
      return await getFloodRiskByRegion(region);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get region risk';
      setError(errorMessage);
      throw err;
    }
  }, []);

  useEffect(() => {
    loadReservoirData();
  }, [loadReservoirData]);

  return {
    reservoirs,
    processedReservoirs,
    isLoading,
    error,
    refetch: loadReservoirData,
    fetchByState,
    getRegionRisk
  };
}
