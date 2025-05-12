
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

const ChartSection: React.FC<ChartSectionProps> = ({ selectedRegion }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month');
  
  // Get rainfall data based on selected region
  const rainfallData = getHistoricalRainfallData(selectedRegion);
  
  // Process rainfall data to add proper date objects
  const processedRainfallData = React.useMemo(() => {
    const currentYear = selectedDate.getFullYear();
    return rainfallData.map((item, index) => {
      // Create an actual date from the month name
      // For simplicity, using the 1st day of each month
      const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(item.month);
      const date = new Date(currentYear, monthIndex, 1);
      return {
        ...item,
        date: date,
        formattedDate: format(date, 'yyyy-MM-dd') // String format for comparison
      };
    });
  }, [rainfallData, selectedDate]);
  
  // Filter data based on selected date and range
  const filteredRainfallData = React.useMemo(() => {
    return processedRainfallData.filter(item => {
      const itemDate = item.date;
      if (!isValid(itemDate)) return false;
      
      if (dateRange === 'week') {
        const weekAgo = new Date(selectedDate);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return itemDate >= weekAgo && itemDate <= selectedDate;
      } else if (dateRange === 'month') {
        const monthAgo = subMonths(selectedDate, 1);
        return itemDate >= monthAgo && itemDate <= selectedDate;
      } else if (dateRange === 'year') {
        const yearAgo = new Date(selectedDate);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        return itemDate >= yearAgo && itemDate <= selectedDate;
      }
      return true;
    });
  }, [processedRainfallData, selectedDate, dateRange]);
  
  // Get prediction data starting from the selected date
  const predictionData = getPredictionData(selectedRegion);
  
  // Process prediction data to add proper date objects
  const processedPredictionData = React.useMemo(() => {
    return predictionData.map((item, index) => {
      // Create actual dates from the prediction days
      const date = new Date(selectedDate);
      date.setDate(date.getDate() + index); // Adding days based on index
      return {
        ...item,
        date: date,
        formattedDate: format(date, 'yyyy-MM-dd') // String format for comparison
      };
    });
  }, [predictionData, selectedDate]);
  
  // Filter prediction data to start from selected date
  const filteredPredictionData = React.useMemo(() => {
    return processedPredictionData.slice(0, 7); // Limit to 7 days of predictions
  }, [processedPredictionData]);
  
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="flood-card">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <div>
            <h2 className="section-title">Historical Rainfall Data</h2>
            <p className="text-sm text-muted-foreground">
              {selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1)} rainfall data
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            <Select
              value={dateRange}
              onValueChange={(value: 'week' | 'month' | 'year') => setDateRange(value)}
            >
              <SelectTrigger className="w-[120px] h-9">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 px-4 py-2"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {safeDateFormat(selectedDate, "MMM dd, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredRainfallData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="formattedDate" 
                tickFormatter={(tick) => {
                  const date = new Date(tick);
                  return isValid(date) ? format(date, dateRange === 'year' ? 'MMM' : 'MMM dd') : '';
                }}
              />
              <YAxis domain={[0, 'dataMax + 50']} />
              <Tooltip
                formatter={(value) => [`${value} mm`, 'Rainfall']}
                labelFormatter={(label) => {
                  if (typeof label === 'string') {
                    const date = new Date(label);
                    return isValid(date) ? format(date, 'MMMM d, yyyy') : label;
                  }
                  return label;
                }}
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
            <h2 className="section-title">7-Day Flood Probability Forecast</h2>
            <p className="text-sm text-muted-foreground">
              Starting from {safeDateFormat(selectedDate, 'MMM dd, yyyy')}
            </p>
          </div>
          <div className="mt-2 md:mt-0">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 px-4 py-2"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {safeDateFormat(selectedDate, "MMM dd, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  disabled={(date) => date > new Date() || date < subMonths(new Date(), 3)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
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
              <Tooltip
                formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Probability']}
                labelFormatter={(label) => {
                  if (typeof label === 'string') {
                    const date = new Date(label);
                    return isValid(date) ? format(date, 'MMMM d, yyyy') : label;
                  }
                  return label;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="probability"
                name="Flood Probability (%)"
                stroke="#FF9800"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
