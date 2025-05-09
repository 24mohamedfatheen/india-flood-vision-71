
import React from 'react';
import { MapAttributionProps } from './types';

const MapAttribution: React.FC<MapAttributionProps> = ({ lastUpdate }) => {
  return (
    <>
      <div className="absolute top-0 left-0 p-3 bg-white/80 backdrop-blur-sm rounded-br m-2 z-10 shadow-sm">
        <h3 className="font-medium text-sm">India Flood Vision Dashboard</h3>
        <p className="text-xs text-muted-foreground">
          Showing flood-affected areas across India
        </p>
        <p className="text-xs italic">Last updated: {lastUpdate}</p>
      </div>
      
      {/* Attribution */}
      <div className="absolute bottom-0 right-0 p-2 bg-white/80 backdrop-blur-sm rounded-tl m-2 shadow-sm">
        <div className="text-xs flex flex-wrap gap-x-2">
          <a href="https://mausam.imd.gov.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">IMD</a>
          <a href="https://cwc.gov.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">CWC</a>
          <a href="https://ndma.gov.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">NDMA</a>
        </div>
      </div>
    </>
  );
};

export default MapAttribution;
