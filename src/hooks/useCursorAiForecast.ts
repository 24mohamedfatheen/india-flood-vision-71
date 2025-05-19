
import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import { 
  fetchFloodForecast, 
  ForecastParams, 
  CursorAiResponse,
  analyzeForecastData
} from '../services/floodForecastService';

interface UseCursorAiForecastOptions {
  region: string;
  state?: string;
  days?: number;
  coordinates?: [number, number];
  enabled?: boolean;
  useHistoricalData?: boolean;
}

export function useCursorAiForecast({
  region,
  state,
  days = 10,
  coordinates,
  enabled = true,
  useHistoricalData = true
}: UseCursorAiForecastOptions) {
  const [data, setData] = useState<CursorAiResponse | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchForecast = useCallback(async () => {
    if (!enabled || !region) return;

    setIsLoading(true);
    setError(null);

    try {
      const params: ForecastParams = {
        region,
        state,
        days,
        coordinates,
        useHistoricalData
      };

      console.log('Fetching forecast with params:', params);
      const response = await fetchFloodForecast(params);
      
      // Store the full forecast data
      setData(response);
      
      // Also generate and store analysis of the forecast
      const forecastAnalysis = analyzeForecastData(response);
      setAnalysis(forecastAnalysis);
      
      // Show success toast for new data
      toast({
        title: "Forecast Updated",
        description: `Latest data for ${region} has been loaded.`,
        variant: "default"
      });
    } catch (err) {
      console.error('Error fetching forecast:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch forecast'));
      toast({
        title: "Forecast Error",
        description: "Could not load forecast data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [region, state, days, coordinates, enabled, useHistoricalData, toast]);

  useEffect(() => {
    fetchForecast();
  }, [fetchForecast]);

  return {
    data,
    analysis,
    isLoading,
    error,
    refetch: fetchForecast
  };
}
