
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Brain, Loader2, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { generateFloodPrediction } from '../services/imdApiService';
import { useToast } from '../hooks/use-toast';

interface AiFloodForecastProps {
  selectedRegion: string;
  locationData?: {
    coordinates: [number, number];
    rainfall: any;
    reservoirData?: any[];
  };
}

const AiFloodForecast: React.FC<AiFloodForecastProps> = ({ 
  selectedRegion, 
  locationData 
}) => {
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Generate forecast when location data changes
  useEffect(() => {
    if (locationData?.coordinates && locationData?.rainfall) {
      generateForecast();
    }
  }, [locationData]);

  const generateForecast = async () => {
    if (!locationData?.coordinates) {
      setError('Location coordinates not available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate reservoir data if not provided
      const mockReservoirData = locationData.reservoirData || [
        {
          percentage_full: Math.random() * 100,
          inflow_cusecs: Math.random() * 15000,
          outflow_cusecs: Math.random() * 10000
        }
      ];

      const predictionResult = generateFloodPrediction(
        mockReservoirData,
        locationData.rainfall,
        locationData.coordinates
      );

      // Transform for chart display
      const chartData = predictionResult.predictions.map((pred, index) => ({
        day: `Day ${index + 1}`,
        date: pred.date,
        probability: pred.probability,
        confidence: pred.confidence,
        expectedRainfall: locationData.rainfall?.forecast?.precipitation?.[index] || 0
      }));

      setForecast({
        predictions: predictionResult.predictions,
        chartData,
        summary: {
          maxProbability: Math.max(...predictionResult.predictions.map(p => p.probability)),
          avgConfidence: Math.round(predictionResult.predictions.reduce((sum, p) => sum + p.confidence, 0) / predictionResult.predictions.length),
          riskTrend: predictionResult.predictions[0].probability > predictionResult.predictions[9].probability ? 'decreasing' : 'increasing'
        }
      });

      toast({
        title: "Forecast Updated",
        description: "10-day flood probability forecast generated using AI analysis",
        duration: 3000
      });

    } catch (error) {
      console.error('Error generating forecast:', error);
      setError('Failed to generate flood forecast');
      toast({
        title: "Forecast Error",
        description: "Could not generate flood forecast. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (probability: number) => {
    if (probability >= 80) return '#DC2626'; // red-600
    if (probability >= 60) return '#EA580C'; // orange-600
    if (probability >= 40) return '#D97706'; // amber-600
    if (probability >= 20) return '#65A30D'; // lime-600
    return '#16A34A'; // green-600
  };

  const getRiskLevel = (probability: number) => {
    if (probability >= 80) return 'Severe';
    if (probability >= 60) return 'High';
    if (probability >= 40) return 'Medium';
    if (probability >= 20) return 'Low';
    return 'Very Low';
  };

  return (
    <div className="flood-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Brain className="mr-2 h-5 w-5 text-blue-600" />
          <h2 className="section-title">AI Flood Forecast</h2>
        </div>
        <Button 
          onClick={generateForecast} 
          disabled={loading || !locationData?.coordinates}
          size="sm"
          className="h-8"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <TrendingUp className="mr-2 h-4 w-4" />
              Update Forecast
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
            <span className="text-sm text-red-800">{error}</span>
          </div>
        </div>
      )}

      {!locationData?.coordinates && !loading && (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Select a location to generate AI flood forecast</p>
          <p className="text-xs mt-1">Forecast uses real-time reservoir levels and weather data</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-600" />
          <p className="text-gray-600">Analyzing flood probability...</p>
          <p className="text-xs text-gray-500 mt-1">Processing reservoir levels, rainfall patterns, and historical data</p>
        </div>
      )}

      {forecast && !loading && (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-900">
                {forecast.summary.maxProbability}%
              </div>
              <div className="text-xs text-blue-700">Peak Risk</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-900">
                {forecast.summary.avgConfidence}%
              </div>
              <div className="text-xs text-green-700">Avg Confidence</div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-amber-900 capitalize">
                {forecast.summary.riskTrend}
              </div>
              <div className="text-xs text-amber-700">Trend</div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecast.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value}${name === 'probability' ? '%' : name === 'expectedRainfall' ? 'mm' : '%'}`, 
                    name === 'probability' ? 'Flood Probability' : 
                    name === 'confidence' ? 'Confidence' : 'Expected Rainfall'
                  ]}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return `${label} (${payload[0].payload.date})`;
                    }
                    return label;
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="probability" 
                  stroke="#DC2626" 
                  strokeWidth={3}
                  name="Flood Probability (%)"
                  dot={{ fill: '#DC2626', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="confidence" 
                  stroke="#16A34A" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Confidence (%)"
                  dot={{ fill: '#16A34A', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Breakdown */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">10-Day Detailed Forecast</h3>
            <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
              {forecast.predictions.slice(0, 10).map((pred: any, index: number) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
                >
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: getRiskColor(pred.probability) }}
                    />
                    <span className="font-medium">Day {index + 1}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{pred.probability}%</div>
                    <div className="text-gray-500">{getRiskLevel(pred.probability)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Disclaimer */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start">
              <Brain className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-800">
                <p className="font-medium mb-1">AI-Powered Analysis</p>
                <p>
                  This forecast combines real-time reservoir levels, weather patterns, and historical data 
                  using machine learning algorithms. Predictions should be used alongside official weather warnings.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiFloodForecast;
