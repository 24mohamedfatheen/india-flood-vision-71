import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getHistoricalRainfallData, getPredictionData } from '../data/floodData';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { format, subMonths, addDays, isValid, parseISO } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { cn } from '../lib/utils';

interface ChartSectionProps {
  selectedRegion: string;
}

// Helper function to get color based on risk level - keeping consistent with Map component
const getRiskLevelColor = (riskLevel: string | number): string => {
  if (typeof riskLevel === 'number') {
    // For probability values
    if (riskLevel >= 75) return '#F44336'; // Severe (Red)
    if (riskLevel >= 50) return '#FF9800'; // High (Orange)
    if (riskLevel >= 25) return '#FFC107'; // Medium (Yellow)
    return '#4CAF50'; // Low (Green)
  } else {
    // For string risk levels
    switch (riskLevel) {
      case 'severe': return '#F44336';
      case 'high': return '#FF9800';
      case 'medium': return '#FFC107';
      case 'low': return '#4CAF50';
      default: return '#4CAF50';
    }
  }
};

const ChartSection: React.FC<ChartSectionProps> = ({ selectedRegion }) => {
  // Separate state variables for historical data and prediction forecast
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [dateRange, setDateRange] = useState<'year'>('year');
  
  // Separate state for forecast
  const [forecastMonth, setForecastMonth] = useState<number>(new Date().getMonth());
  
  // Get rainfall data based on selected region and year
  const rainfallData = getHistoricalRainfallData(selectedRegion);
  
  // Process rainfall data to add proper date objects
  const processedRainfallData = React.useMemo(() => {
    return rainfallData.map((item, index) => {
      // Create an actual date from the month name
      // For simplicity, using the 1st day of each month
      const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(item.month);
      const date = new Date(selectedYear, monthIndex, 1);
      return {
        ...item,
        date: date,
        formattedDate: format(date, 'yyyy-MM-dd') // String format for comparison
      };
    });
  }, [rainfallData, selectedYear]);
  
  // Get prediction data starting from the selected date
  // Use the current date to ensure data changes daily
  const today = new Date();
  const predictionData = getPredictionData(selectedRegion);
  
  // Process prediction data to add proper date objects
  const processedPredictionData = React.useMemo(() => {
    return predictionData.map((item, index) => {
      // Create actual dates from the prediction days, but using the forecast month
      const date = new Date();
      date.setMonth(forecastMonth); // Use forecast month instead of current month
      date.setDate(date.getDate() + index); // Adding days based on index
      return {
        ...item,
        date: date,
        formattedDate: format(date, 'yyyy-MM-dd'), // String format for comparison
        color: getRiskLevelColor(item.probability) // Add color based on probability
      };
    });
  }, [predictionData, forecastMonth]);
  
  // Filter prediction data to show 10 days of predictions
  const filteredPredictionData = React.useMemo(() => {
    return processedPredictionData.slice(0, 10); // Extended to 10 days of predictions
  }, [processedPredictionData]);
  
  // Generate available years for selection (going back 10 years)
  const availableYears = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 11 }, (_, i) => currentYear - i);
  }, []);
  
  // Safe date formatter function to prevent errors
  const safeDateFormat = (dateValue: string | number | Date, formatStr: string) => {
    let date: Date;
    
    if (typeof dateValue === 'string') {
      try {
        // Try to parse ISO string first
        date = parseISO(dateValue);
      } catch (e) {
        // If not ISO format, try direct Date construction
        date = new Date(dateValue);
      }
    } else if (dateValue instanceof Date) {
      date = dateValue;
    } else if (typeof dateValue === 'number') {
      date = new Date(dateValue);
    } else {
      return 'Invalid date';
    }
    
    if (!isValid(date)) {
      return 'Invalid date';
    }
    
    try {
      return format(date, formatStr);
    } catch (e) {
      return 'Format error';
    }
  };

  // Custom tooltip for the probability forecast chart
  const CustomProbabilityTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const probability = payload[0].value;
      const color = getRiskLevelColor(probability);
      let riskLevel = 'Low';
      
      if (probability >= 75) riskLevel = 'Severe';
      else if (probability >= 50) riskLevel = 'High';
      else if (probability >= 25) riskLevel = 'Medium';
      
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
          <p className="font-semibold">{safeDateFormat(label, 'MMMM d, yyyy')}</p>
          <p>Probability: <span style={{ color }}>{probability}%</span></p>
          <p>Risk Level: <span style={{ color }}>{riskLevel}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="flood-card">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <div>
            <h2 className="section-title">Historical Rainfall Data</h2>
            <p className="text-sm text-muted-foreground">
              {selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1)} rainfall data for {selectedYear}
            </p>
          </div>
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
        </div>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedRainfallData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month"
                tickFormatter={(tick) => tick}
              />
              <YAxis domain={[0, 'dataMax + 50']} />
              <Tooltip
                formatter={(value) => [`${value} mm`, 'Rainfall']}
                labelFormatter={(label) => `${label}, ${selectedYear}`}
              />
              <Legend />
              <Bar dataKey="rainfall" name="Rainfall (mm)" fill="#2196F3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="flood-card">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <div>
            <h2 className="section-title">10-Day Flood Probability Forecast</h2>
            <p className="text-sm text-muted-foreground">
              Starting from {safeDateFormat(today, 'MMM dd, yyyy')}
            </p>
          </div>
          <div className="mt-2 md:mt-0">
            <Select
              value={forecastMonth.toString()}
              onValueChange={(value: string) => {
                setForecastMonth(parseInt(value));
              }}
            >
              <SelectTrigger className="w-[120px] h-9">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                  .map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>{month}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredPredictionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="formattedDate" 
                tickFormatter={(tick) => {
                  const date = new Date(tick);
                  return isValid(date) ? format(date, 'MMM dd') : '';
                }}
              />
              <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <Tooltip content={<CustomProbabilityTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="probability"
                name="Flood Probability (%)"
                stroke="#FF9800"
                strokeWidth={2}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  const color = getRiskLevelColor(payload.probability);
                  return (
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r={4} 
                      fill={color} 
                      stroke="white" 
                      strokeWidth={1} 
                    />
                  );
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
