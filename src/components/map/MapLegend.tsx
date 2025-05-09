
import React from 'react';
import { MapLegendProps } from './types';

const MapLegend: React.FC<MapLegendProps> = () => {
  return (
    <div className="absolute bottom-0 left-0 p-2 bg-white/80 backdrop-blur-sm rounded-tr m-2 shadow-sm">
      <div className="text-xs font-medium mb-1">Risk Levels</div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
          <span className="text-xs">Low</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-amber-400 mr-1"></span>
          <span className="text-xs">Medium</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-1"></span>
          <span className="text-xs">High</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
          <span className="text-xs">Severe</span>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;
