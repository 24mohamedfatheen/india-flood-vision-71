
import React from 'react';
import { ArrowUp } from 'lucide-react';
import { FloodData } from '../data/floodData';

interface PredictionCardProps {
  floodData: FloodData | undefined;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ floodData }) => {
  if (!floodData?.predictedFlood) {
    return (
      <div className="flood-card animate-pulse h-[200px] flex items-center justify-center">
        <p className="text-muted-foreground">No prediction data available</p>
      </div>
    );
  }

  const { predictedFlood } = floodData;
  
  // Format date
  const formattedDate = new Date(predictedFlood.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  const probabilityColor = 
    predictedFlood.probabilityPercentage > 75 ? 'text-flood-danger' :
    predictedFlood.probabilityPercentage > 50 ? 'text-flood-warning' :
    'text-flood-safe';
    
  const daysUntil = Math.ceil((new Date(predictedFlood.date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));

  return (
    <div className="flood-card">
      <h2 className="font-semibold mb-4 text-lg">Flood Risk Assessment</h2>
      
      <div className="space-y-4">
        <div>
          <span className="text-xs text-muted-foreground block mb-1">Region Risk Level</span>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            floodData.riskLevel === 'severe' ? 'bg-flood-danger/20 text-flood-danger' :
            floodData.riskLevel === 'high' ? 'bg-flood-warning/20 text-flood-warning' :
            floodData.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-flood-safe/20 text-flood-safe'
          }`}>
            {floodData.riskLevel.toUpperCase()}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Predicted Date:</span>
          <div>
            <span className="font-semibold">{formattedDate}</span>
            <span className="text-xs text-muted-foreground ml-2">({daysUntil} days)</span>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Flood Probability:</span>
            <span className={`font-semibold ${probabilityColor}`}>{predictedFlood.probabilityPercentage}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                predictedFlood.probabilityPercentage > 75 ? 'bg-flood-danger' :
                predictedFlood.probabilityPercentage > 50 ? 'bg-flood-warning' :
                'bg-flood-safe'
              }`} 
              style={{ width: `${predictedFlood.probabilityPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Expected Rainfall</p>
            <p className="font-semibold flex items-center">
              {predictedFlood.expectedRainfall} mm
              <ArrowUp className="ml-1 h-4 w-4 text-flood-danger" />
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">River Rise</p>
            <p className="font-semibold flex items-center">
              {predictedFlood.expectedRiverRise} m
              <ArrowUp className="ml-1 h-4 w-4 text-flood-danger" />
            </p>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Prediction based on historical patterns, weather forecasts, and current river levels.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PredictionCard;
