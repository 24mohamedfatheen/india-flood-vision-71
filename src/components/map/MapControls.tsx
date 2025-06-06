// src/components/map/MapControls.tsx
// This component provides map zoom and layer toggle controls (buttons only).

import React from 'react';
import { ZoomIn, ZoomOut, Map as MapIcon, Layers } from 'lucide-react';
import { Button } from '../ui/button'; // Assuming this is your shadcn/ui button
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'; // Assuming this is your shadcn/ui tooltip
import L from 'leaflet'; // Import Leaflet for type hinting

// Define the props for the MapControls component
interface MapControlsProps {
  map: L.Map | null; // Leaflet map instance, nullable as it might not be ready immediately
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetView: () => void;
  toggleLayerVisibility: (layerId: string) => void; // This will be a placeholder in Index.tsx for now
}

const MapControls: React.FC<MapControlsProps> = ({ 
  map, 
  handleZoomIn, 
  handleZoomOut, 
  handleResetView, 
  toggleLayerVisibility 
}) => {
  return (
    <>
      {/* Layer controls */}
      {/* Positioned absolutely within the parent map container or a dedicated relative div */}
      <div className="absolute top-16 right-4 z-10 flex flex-col space-y-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => toggleLayerVisibility('floodAreas')} // Placeholder: actual layer management needs to be in Map.tsx or Index.tsx
                className="bg-white/90 hover:bg-white" 
              >
                <Layers className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Toggle flood areas</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Zoom controls */}
      {/* Positioned absolutely within the parent map container or a dedicated relative div */}
      <div className="absolute bottom-16 right-4 z-10 flex flex-col space-y-2">
        <Button variant="outline" size="icon" onClick={handleZoomIn} className="bg-white/90 hover:bg-white">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomOut} className="bg-white/90 hover:bg-white">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleResetView} className="bg-white/90 hover:bg-white">
          <MapIcon className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};

export default MapControls;
