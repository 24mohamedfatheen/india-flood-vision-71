
import React from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
import { MapPlaceholderProps } from './types';

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ showMapboxTokenWarning }) => {
  if (!showMapboxTokenWarning) return null;
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
      <div className="text-center p-6 max-w-md">
        <MapPin className="h-12 w-12 text-flood-warning mx-auto mb-4" />
        <h3 className="text-lg font-bold mb-2">Mapbox Token Required</h3>
        <p className="mb-4">
          To display the interactive map of India, a valid Mapbox API token is required. 
          For security reasons, we don't include a real token in demo projects.
        </p>
        <div className="text-sm text-muted-foreground mb-2">
          <p>For demonstration purposes, we're showing a static image of the map.</p>
        </div>
        <a 
          href="https://mapbox.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline flex items-center justify-center mt-4"
        >
          Get your free Mapbox token <ExternalLink className="h-4 w-4 ml-1" />
        </a>
      </div>
      
      <div className="mt-4 relative w-full h-[400px] overflow-hidden">
        <img 
          src="/lovable-uploads/4cb07a0d-3ee5-4eeb-812b-39da5332c812.png" 
          alt="Map of India" 
          className="w-full h-full object-contain opacity-70"
        />
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow">
            <h3 className="font-semibold">Static Map Preview</h3>
            <p className="text-sm text-muted-foreground">Interactive map requires a valid Mapbox token</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPlaceholder;
