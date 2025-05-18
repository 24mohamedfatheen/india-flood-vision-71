
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getHistoricalRainfallData } from '../data/floodData';
import { Button } from './ui/button';
import { format, isValid, parseISO } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import AiFloodForecast from './AiFloodForecast';

interface ChartSectionProps {
  selectedRegion: string;
}

const ChartSection: React.FC<ChartSectionProps> = ({ selectedRegion }) => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
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
      
      {/* AI-powered forecast component */}
      <AiFloodForecast selectedRegion={selectedRegion} />
    </div>
  );
};

export default ChartSection;
