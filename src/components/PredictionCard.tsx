
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

  return (
    <div className="flood-card">
      <h2 className="font-semibold mb-4 text-lg">Flood Prediction</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Predicted Date:</span>
          <span className="font-semibold">{formattedDate}</span>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Probability:</span>
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
            These predictions are based on historical data, current weather conditions, and machine learning models.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PredictionCard;
