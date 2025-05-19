
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format, isValid, parseISO } from 'date-fns';
import { useCursorAiForecast } from '../hooks/useCursorAiForecast';
import { getFloodDataForRegion } from '../data/floodData';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { AlertCircle, AlertTriangle, CloudRain, RefreshCw } from 'lucide-react';
import { Badge } from './ui/badge';

interface AiFloodForecastProps {
  selectedRegion: string;
}

const AiFloodForecast: React.FC<AiFloodForecastProps> = ({ selectedRegion }) => {
  // Get region details
  const floodData = getFloodDataForRegion(selectedRegion);
  
  // Use our custom hook to fetch forecast data
  const { data, isLoading, error, refetch } = useCursorAiForecast({
    region: selectedRegion,
    state: floodData?.state,
    coordinates: floodData?.coordinates,
    days: 10
  });

  // Format the forecast data for the chart
  const chartData = React.useMemo(() => {
    if (!data?.forecasts) return [];
    
    return data.forecasts.map(item => {
      let date;
      try {
        date = parseISO(item.date);
      } catch (e) {
        date = new Date(); // Fallback
      }
      
      return {
        ...item,
        date,
        formattedDate: format(date, 'yyyy-MM-dd')
      };
    });
  }, [data]);

  // Format a date safely
  const safeDateFormat = (dateValue: string | Date | number, formatStr: string) => {
    let date;
    
    if (typeof dateValue === 'string') {
      try {
        date = parseISO(dateValue);
      } catch (e) {
        date = new Date(dateValue);
      }
    } else if (dateValue instanceof Date) {
      date = dateValue;
    } else if (typeof dateValue === 'number') {
      date = new Date(dateValue);
    } else {
      return 'Invalid date';
    }
    
    if (!isValid(date)) return 'Invalid date';
    
    try {
      return format(date, formatStr);
    } catch (e) {
      return 'Format error';
    }
  };
  
  // Determine badge color based on risk level
  const riskLevelColor = React.useMemo(() => {
    if (!floodData) return "bg-blue-500";
    
    switch (floodData.riskLevel) {
      case 'severe': return "bg-red-500";
      case 'high': return "bg-orange-500";
      case 'medium': return "bg-yellow-400";
      case 'low': return "bg-green-500";
      default: return "bg-blue-500";
    }
  }, [floodData]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flood-card">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="section-title">10-Day Flood Probability Forecast</h2>
            <p className="text-sm text-muted-foreground flex items-center">
              <CloudRain className="h-3.5 w-3.5 mr-1" />
              Developed with Cursor IDE
            </p>
          </div>
        </div>
        
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-medium">Loading forecast data...</p>
            <p className="text-xs text-muted-foreground mt-1">Analyzing flood risk patterns</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error && !data) {
    return (
      <div className="flood-card">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="section-title">10-Day Flood Probability Forecast</h2>
            <p className="text-sm text-muted-foreground flex items-center">
              <AlertCircle className="h-3.5 w-3.5 mr-1 text-red-500" />
              Forecast Unavailable
            </p>
          </div>
          <Button size="sm" onClick={refetch} className="h-8">
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Retry
          </Button>
        </div>
        
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-800">Unable to load forecast</h3>
              <p className="text-sm text-red-600 mt-1">
                We're having trouble generating the forecast.
                Please try again later.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flood-card">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="section-title">10-Day Flood Probability Forecast</h2>
            <Badge variant="outline" className={`${riskLevelColor} text-white text-xs`}>
              {floodData?.riskLevel.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center mt-1">
            <CloudRain className="h-3.5 w-3.5 mr-1 text-blue-600" />
            <p className="text-xs text-muted-foreground">
              Developed with Cursor IDE • Last updated: {data?.timestamp ? safeDateFormat(data.timestamp, 'MMM dd, yyyy, h:mm a') : 'Unknown'}
            </p>
          </div>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8 mt-2 md:mt-0"
          onClick={refetch}
        >
          <RefreshCw className="h-3 w-3 mr-1.5" />
          Refresh
        </Button>
      </div>
      
      {data?.modelInfo && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-2 rounded-md mb-4 text-xs">
          <div className="flex items-center">
            <AlertCircle className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
            <span>
              Using forecast algorithm <strong>{data.modelInfo.version}</strong> 
              with {data.modelInfo.accuracy}% accuracy 
            </span>
          </div>
        </div>
      )}
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => safeDateFormat(date, 'MMM dd')}
            />
            <YAxis 
              domain={[0, 100]} 
              tickFormatter={(value) => `${value}%`} 
            />
            <Tooltip
              formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Probability']}
              labelFormatter={(date) => safeDateFormat(date, 'MMMM d, yyyy')}
            />
            <Legend />
            <ReferenceLine y={75} stroke="red" strokeDasharray="3 3" label={{ value: "Severe Risk", position: "insideBottomRight", fill: "red", fontSize: 10 }} />
            <ReferenceLine y={50} stroke="orange" strokeDasharray="3 3" label={{ value: "High Risk", position: "insideBottomRight", fill: "orange", fontSize: 10 }} />
            <Line
              type="monotone"
              dataKey="probability"
              name="Flood Probability"
              stroke="#FF9800"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {data && chartData.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Risk Assessment</h3>
            <div className="bg-muted p-2 rounded-sm">
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Highest Probability:</span>
                  <span className="font-medium">
                    {Math.max(...chartData.map(d => d.probability))}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Average Probability:</span>
                  <span className="font-medium">
                    {(chartData.reduce((sum, d) => sum + d.probability, 0) / chartData.length).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Confidence Level:</span>
                  <span className="font-medium">
                    {data.forecasts[0]?.confidence || "N/A"}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Weather Factors</h3>
            <div className="bg-muted p-2 rounded-sm">
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Expected Rainfall:</span>
                  <span className="font-medium">
                    {data.forecasts[0]?.expectedRainfall || "N/A"} mm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>River Level Change:</span>
                  <span className="font-medium">
                    +{data.forecasts[0]?.riverLevelChange || "N/A"} m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Data Source:</span>
                  <span className="font-medium text-blue-600">
                    Historical Analysis
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiFloodForecast;
