
import { toast } from "../hooks/use-toast";

// Types for Cursor AI service
export interface CursorAiForecast {
  date: string;
  probability: number;
  confidence: number;
  expectedRainfall?: number;
  riverLevelChange?: number;
  factors?: Record<string, number>;
}

export interface CursorAiModelInfo {
  version: string;
  lastTrained: string;
  accuracy: number;
  source: string;
}

export interface CursorAiResponse {
  forecasts: CursorAiForecast[];
  modelInfo: CursorAiModelInfo;
  timestamp: string;
  region: string;
  state: string;
}

export interface ForecastParams {
  region: string;
  state?: string;
  days?: number;
  coordinates?: [number, number];
}

// Base API URL - in a real app, this would be in an environment variable
const API_BASE_URL = '/api';

/**
 * Fetch flood forecast from Cursor AI via our backend
 */
export async function fetchFloodForecast(params: ForecastParams): Promise<CursorAiResponse> {
  try {
    // In a real implementation, this would be an actual API call to our backend
    // For now, we'll simulate the API call with a delay and mock data
    console.log('Fetching forecast for:', params.region);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // This is simulated data - in a real app, this would come from the backend
    // We're using region-specific risk level to simulate different forecasts
    const { getFloodDataForRegion } = await import('../data/floodData');
    const regionData = getFloodDataForRegion(params.region);
    
    const riskLevelBase = {
      'low': 20,
      'medium': 40,
      'high': 60,
      'severe': 80
    };
    
    const baseValue = riskLevelBase[regionData?.riskLevel || 'medium'];
    const days = params.days || 10;
    
    // Generate forecasts with some randomness but based on risk level
    const forecasts: CursorAiForecast[] = Array.from({ length: days }, (_, i) => {
      // Create a trend based on day
      let trendFactor = 1;
      
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
      
      // Generate date for forecast
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      return {
        date: date.toISOString().split('T')[0],
        probability: Number(probability.toFixed(1)),
        confidence: Math.floor(85 + Math.random() * 10), // Random confidence between 85-95%
        expectedRainfall: Math.floor(10 + Math.random() * 50), // Random rainfall prediction
        riverLevelChange: Number((Math.random() * 0.5).toFixed(2)), // Random river level change
        factors: {
          rainfall: Math.floor(10 + Math.random() * 50),
          riverLevel: Math.floor(2 + Math.random() * 5),
          groundSaturation: Math.floor(50 + Math.random() * 40)
        }
      };
    });
    
    return {
      forecasts,
      modelInfo: {
        version: "cursor-flood-v1.2",
        lastTrained: new Date().toISOString(),
        accuracy: Math.floor(85 + Math.random() * 10), // Random accuracy between 85-95%
        source: "Cursor AI"
      },
      timestamp: new Date().toISOString(),
      region: params.region,
      state: regionData?.state || "Unknown"
    };
  } catch (error) {
    console.error('Error fetching Cursor AI forecast:', error);
    throw new Error('Failed to fetch forecast data');
  }
}

// Mock function for what would be a backend API endpoint for model information
export async function fetchAiModelInfo(): Promise<CursorAiModelInfo> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    version: "cursor-flood-v1.2.1",
    lastTrained: new Date().toISOString(),
    accuracy: 92,
    source: "Cursor AI"
  };
}
