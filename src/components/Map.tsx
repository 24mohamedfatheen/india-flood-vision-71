
import React from 'react';
import { lazy, Suspense } from 'react';

// We're using lazy loading to ensure Leaflet only loads in the browser
const MapComponent = lazy(() => import('./map/Map'));

const Map: React.FC<{ selectedRegion: string }> = ({ selectedRegion }) => {
  return (
    <Suspense fallback={<div className="w-full h-96 bg-gray-100 flex items-center justify-center rounded-lg">Loading map...</div>}>
      <MapComponent selectedRegion={selectedRegion} />
    </Suspense>
  );
};

export default Map;
