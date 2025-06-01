
import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import { fetchReservoirData, calculateFloodRiskFromReservoirs, ReservoirData } from '../services/reservoirDataService';
import { FloodData } from '../data/floodData';

interface UseReservoirFloodDataResult {
  isLoading: boolean;
  error: string | null;
  updateFloodDataWithReservoirs: (baseFloodData: FloodData[]) => FloodData[];
  lastUpdated: Date | null;
  reservoirCount: number;
}

export const useReservoirFloodData = (): UseReservoirFloodDataResult => {
  const [reservoirData, setReservoirData] = useState<ReservoirData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();

  const loadReservoirData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Starting reservoir data fetch...');
      const data = await fetchReservoirData();
      console.log('Received reservoir data:', data);
      
      setReservoirData(data);
      setLastUpdated(new Date());
      
      if (data.length > 0) {
        console.log(`Successfully loaded ${data.length} reservoir records for flood calculations`);
        toast({
          title: "Reservoir data loaded",
          description: `Loaded ${data.length} reservoir records`,
          duration: 3000,
        });
      } else {
        console.warn('No reservoir data received');
        toast({
          title: "No reservoir data",
          description: "Unable to load reservoir data for enhanced flood calculations",
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (err) {
      const errorMessage = 'Failed to load reservoir data for flood calculations';
      setError(errorMessage);
      console.error('Reservoir data error:', err);
      toast({
        title: "Reservoir data error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadReservoirData();
    
    // Refresh every 30 minutes
    const interval = setInterval(loadReservoirData, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [loadReservoirData]);

  const updateFloodDataWithReservoirs = useCallback((baseFloodData: FloodData[]): FloodData[] => {
    if (reservoirData.length === 0) {
      return baseFloodData;
    }

    return baseFloodData.map(floodItem => {
      const riskCalculation = calculateFloodRiskFromReservoirs(floodItem.region, reservoirData);
      
      // Update flood data based on reservoir conditions
      const updatedFloodData: FloodData = {
        ...floodItem,
        riskLevel: riskCalculation.riskLevel,
        populationAffected: Math.max(
          floodItem.populationAffected, 
          riskCalculation.affectedPopulation
        ),
        timestamp: new Date().toISOString(),
        predictionAccuracy: Math.min(95, floodItem.predictionAccuracy + 10), // Higher accuracy with live data
        predictedFlood: floodItem.predictedFlood ? {
          ...floodItem.predictedFlood,
          probabilityPercentage: Math.min(95, 
            floodItem.predictedFlood.probabilityPercentage + riskCalculation.probabilityIncrease
          ),
          timestamp: new Date().toISOString(),
          supportingData: `${floodItem.predictedFlood.supportingData}. Live reservoir analysis: ${riskCalculation.reasoning}`,
          source: {
            name: 'Live Reservoir Data + Weather Services',
            url: 'https://mausam.imd.gov.in/',
            type: 'Live Data'
          }
        } : undefined
      };

      return updatedFloodData;
    });
  }, [reservoirData]);

  return {
    isLoading,
    error,
    updateFloodDataWithReservoirs,
    lastUpdated,
    reservoirCount: reservoirData.length
  };
};
