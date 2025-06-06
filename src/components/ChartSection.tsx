
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getHistoricalRainfallData, fetchImdData } from '../data/floodData';
import { format, isValid, parseISO } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import AiFloodForecast from './AiFloodForecast';

interface ChartSectionProps {
  selectedRegion: string;
  locationData?: {
    coordinates: [number, number];
    rainfall: any;
  };
}

const ChartSection: React.FC<ChartSectionProps> = ({ selectedRegion, locationData }) => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data when component mounts or selectedRegion changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await fetchImdData(true);
        
        // If we have location rainfall data, use it; otherwise fall back to historical
        let processedData = [];
        
        if (locationData?.rainfall?.historical) {
          // Transform Open-Meteo data to chart format
          const { dates, precipitation } = locationData.rainfall.historical;
          processedData = dates.map((date: string, index: number) => {
            const parsedDate = new Date(date);
            const month = parsedDate.toLocaleDateString('en-US', { month: 'short' });
            return {
              month,
              rainfall: precipitation[index] || 0
            };
          });
          
          // Group by month and sum rainfall
          const monthlyData: { [key: string]: number } = {};
          processedData.forEach(item => {
            if (monthlyData[item.month]) {
              monthlyData[item.month] += item.rainfall;
            } else {
              monthlyData[item.month] = item.rainfall;
            }
          });
          
          processedData = Object.entries(monthlyData).map(([month, rainfall]) => ({
            month,
            rainfall: Math.round(rainfall * 10) / 10 // Round to 1 decimal
          }));
        } else {
          // Fall back to static historical data
          processedData = getHistoricalRainfallData(selectedRegion, selectedYear);
        }
        
        setHistoricalData(processedData);
      } catch (err) {
        console.error("Failed to load historical data:", err);
        setError("Failed to load historical data. Please try again later.");
        setHistoricalData(getHistoricalRainfallData(selectedRegion, selectedYear));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedRegion, selectedYear, locationData]);

  // Generate available years for selection
  const availableYears = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = new Set<number>();
    years.add(currentYear);
    years.add(2020);
    years.add(2021);
    years.add(2022);
    for (let i = 1; i <= 3; i++) {
      years.add(currentYear - i);
      years.add(currentYear + i);
    }
    return Array.from(years).sort((a, b) => b - a);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="flood-card">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <div>
            <h2 className="section-title">
              {locationData?.rainfall ? 'Live Weather Data' : 'Historical Rainfall Data'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1)} rainfall data
              {locationData?.coordinates && (
                <span className="ml-2 text-blue-600">
                  📍 {locationData.coordinates[0].toFixed(2)}, {locationData.coordinates[1].toFixed(2)}
                </span>
              )}
            </p>
          </div>
          {!locationData?.rainfall && (
            <div className="flex items-center space-x-2 mt-2 md:mt-0">
              <Select
                value={selectedYear.toString()}
                onValueChange={(value: string) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className="w-[120px] h-9">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Loading {locationData?.rainfall ? 'live weather' : 'historical'} data...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">{error}</div>
          ) : historicalData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              No rainfall data available for this region.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(tick) => tick}
                />
                <YAxis domain={[0, 'dataMax + 50']} />
                <Tooltip
                  formatter={(value) => [`${value} mm`, 'Rainfall']}
                  labelFormatter={(label) => `${label} ${locationData?.rainfall ? '(Live Data)' : selectedYear}`}
                />
                <Legend />
                <Bar 
                  dataKey="rainfall" 
                  name="Rainfall (mm)" 
                  fill={locationData?.rainfall ? "#16A34A" : "#2196F3"} 
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        
        {locationData?.rainfall && (
          <div className="mt-2 text-xs text-green-600 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
            Live weather data from Open-Meteo API
          </div>
        )}
      </div>

      {/* Enhanced AI forecast with location data */}
      <AiFloodForecast 
        selectedRegion={selectedRegion} 
        locationData={locationData}
      />
    </div>
  );
};

export default ChartSection;
