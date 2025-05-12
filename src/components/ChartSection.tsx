
import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getHistoricalRainfallData, getPredictionData } from '../data/floodData';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { format, subMonths, addDays, isValid } from 'date-fns';
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
  
  // Get rainfall data based on selected region and date range
  const rainfallData = getHistoricalRainfallData(selectedRegion);
  
  // Filter data based on selected date and range
  const filteredRainfallData = React.useMemo(() => {
    return rainfallData.filter(item => {
      const itemDate = new Date(item.date);
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
  }, [rainfallData, selectedDate, dateRange]);
  
  // Get prediction data starting from the selected date
  const predictionData = getPredictionData(selectedRegion);
  
  // Filter prediction data to start from selected date
  const filteredPredictionData = React.useMemo(() => {
    return predictionData.filter(item => {
      const itemDate = new Date(item.date);
      return isValid(itemDate) && itemDate >= selectedDate;
    }).slice(0, 7); // Limit to 7 days of predictions
  }, [predictionData, selectedDate]);
  
  // Safe date formatter function to prevent errors
  const safeDateFormat = (dateValue: string | number | Date, formatStr: string) => {
    const date = new Date(dateValue);
    if (!isValid(date)) {
      return 'Invalid date';
    }
    return format(date, formatStr);
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
                dataKey="date" 
                tickFormatter={(tick) => {
                  return safeDateFormat(tick, dateRange === 'year' ? 'MMM' : 'MMM dd');
                }}
              />
              <YAxis domain={[0, 'dataMax + 50']} />
              <Tooltip
                formatter={(value) => [`${value} mm`, 'Rainfall']}
                labelFormatter={(label) => {
                  return safeDateFormat(label, 'MMMM d, yyyy');
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
                dataKey="date" 
                tickFormatter={(tick) => {
                  return safeDateFormat(tick, 'MMM dd');
                }}
              />
              <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <Tooltip
                formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Probability']}
                labelFormatter={(label) => {
                  return safeDateFormat(label, 'MMMM d, yyyy');
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
