
import React from 'react';
import { MapPin } from 'lucide-react';
import { regions } from '../data/floodData';

interface RegionSelectorProps {
  selectedRegion: string;
  onRegionChange: (value: string) => void;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ selectedRegion, onRegionChange }) => {
  return (
    <div className="bg-white rounded-lg border border-border p-4 shadow-sm mb-6">
      <div className="flex items-center mb-4">
        <MapPin className="mr-2 h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Select Region</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="region-select" className="block text-sm font-medium mb-2 text-muted-foreground">
            Select a location in India:
          </label>
          <select
            id="region-select"
            className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value)}
          >
            {regions.map((region) => (
              <option key={region.value} value={region.value}>
                {region.label}, {region.state}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center justify-center md:justify-end">
          <div className="flex items-center mr-4">
            <span className="inline-block w-3 h-3 rounded-full bg-flood-safe mr-2"></span>
            <span className="text-xs">Low Risk</span>
          </div>
          <div className="flex items-center mr-4">
            <span className="inline-block w-3 h-3 rounded-full bg-flood-warning mr-2"></span>
            <span className="text-xs">Medium Risk</span>
          </div>
          <div className="flex items-center mr-4">
            <span className="inline-block w-3 h-3 rounded-full bg-flood-danger mr-2"></span>
            <span className="text-xs">High Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionSelector;
