
import React from 'react';
import { CloudRain, MapPin, Earth, Users } from 'lucide-react';
import { FloodData } from '../data/floodData';

interface FloodStatsProps {
  floodData: FloodData | undefined;
}

const FloodStats: React.FC<FloodStatsProps> = ({ floodData }) => {
  if (!floodData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flood-card animate-pulse">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </div>
    );
  }

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'severe':
        return 'bg-flood-danger/20 text-flood-danger border-flood-danger/30';
      case 'high':
        return 'bg-flood-warning/20 text-flood-warning border-flood-warning/30';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
      default:
        return 'bg-flood-safe/20 text-flood-safe border-flood-safe/30';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="flood-card">
        <h2 className="font-semibold mb-2 flex items-center">
          <MapPin className="mr-2 h-5 w-5 text-primary" />
          Location Information
        </h2>
        <div className="space-y-3">
          <div>
            <p className="data-label">Region</p>
            <p className="font-medium">{floodData.region.charAt(0).toUpperCase() + floodData.region.slice(1)}, {floodData.state}</p>
          </div>
          <div>
            <p className="data-label">Risk Level</p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getRiskBadgeColor(floodData.riskLevel)}`}>
              {floodData.riskLevel.charAt(0).toUpperCase() + floodData.riskLevel.slice(1)}
            </span>
          </div>
          <div>
            <p className="data-label">Prediction Accuracy</p>
            <p className="data-value">{floodData.predictionAccuracy}%</p>
          </div>
        </div>
      </div>

      <div className="flood-card">
        <h2 className="font-semibold mb-2 flex items-center">
          <CloudRain className="mr-2 h-5 w-5 text-primary" />
          Current Conditions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="data-label">Rainfall</p>
            <p className="data-value">{floodData.rainfall} mm</p>
          </div>
          <div>
            <p className="data-label">River Level</p>
            <p className="data-value">{floodData.riverLevel} m</p>
          </div>
          <div>
            <p className="data-label flex items-center">
              <Earth className="mr-1 h-4 w-4 text-muted-foreground" />
              Affected Area
            </p>
            <p className="data-value">{floodData.affectedArea} km²</p>
          </div>
          <div>
            <p className="data-label flex items-center">
              <Users className="mr-1 h-4 w-4 text-muted-foreground" />
              People Affected
            </p>
            <p className="data-value">{floodData.populationAffected.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloodStats;
