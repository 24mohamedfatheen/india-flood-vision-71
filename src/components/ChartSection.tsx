
import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getHistoricalRainfallData, getPredictionData } from '../data/floodData';

interface ChartSectionProps {
  selectedRegion: string;
}

const ChartSection: React.FC<ChartSectionProps> = ({ selectedRegion }) => {
  const rainfallData = getHistoricalRainfallData(selectedRegion);
  const predictionData = getPredictionData(selectedRegion);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="flood-card">
        <h2 className="section-title">Historical Rainfall Data</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Monthly rainfall in millimeters for {selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1)}
        </p>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rainfallData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 'dataMax + 50']} />
              <Tooltip
                formatter={(value) => [`${value} mm`, 'Rainfall']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              <Bar dataKey="rainfall" name="Rainfall (mm)" fill="#2196F3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="flood-card">
        <h2 className="section-title">7-Day Flood Probability Forecast</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Flood risk prediction based on current conditions and historical patterns
        </p>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={predictionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <Tooltip
                formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Probability']}
                labelFormatter={(label) => `${label}`}
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
