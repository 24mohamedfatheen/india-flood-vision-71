
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const MapLegend = () => {
  return (
    <div className="absolute bottom-3 left-3 z-10 bg-white p-3 rounded-lg shadow-md text-xs">
      <h4 className="font-medium text-sm flex items-center mb-2">
        <AlertTriangle className="h-3 w-3 mr-1 text-yellow-600" />
        Flood Risk Levels
      </h4>
      <div className="space-y-1.5">
        <div className="flex items-center">
          <div className="h-4 w-4 mr-2 rounded bg-red-500"></div>
          <span>Severe Risk</span>
        </div>
        <div className="flex items-center">
          <div className="h-4 w-4 mr-2 rounded bg-orange-500"></div>
          <span>High Risk</span>
        </div>
        <div className="flex items-center">
          <div className="h-4 w-4 mr-2 rounded bg-yellow-400"></div>
          <span>Medium Risk</span>
        </div>
        <div className="flex items-center">
          <div className="h-4 w-4 mr-2 rounded bg-green-500"></div>
          <span>Low Risk</span>
        </div>
      </div>

      <div className="pt-2 mt-2 border-t border-gray-100">
        <div className="flex items-center">
          <div className="h-4 w-4 mr-2 rounded-full bg-blue-600 border-2 border-white"></div>
          <span>Selected Location</span>
        </div>
        <div className="flex items-center mt-1.5">
          <div className="h-3 w-6 mr-2 bg-blue-200 opacity-40 border border-blue-500"></div>
          <span>State Boundary</span>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;
