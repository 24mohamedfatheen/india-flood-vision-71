// src/components/map/MapControls.tsx
// This component provides map zoom and layer toggle controls (buttons only).

import React from 'react';
import { ZoomIn, ZoomOut, Map as MapIcon, Layers } from 'lucide-react';
import { Button } from '../ui/button'; // Assuming this is your shadcn/ui button
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'; // Assuming this is your shadcn/ui tooltip

// Define the props for the MapControls component
interface MapControlsProps {
  map: L.Map | null; // Leaflet map instance, nullable as it might not be ready immediately
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetView: () => void;
  toggleLayerVisibility: (layerId: string) => void;
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
      {/* Positioning might need adjustment in parent container (Index.tsx) for overall layout */}
      <div className="absolute top-16 right-4 z-10 flex flex-col space-y-2"> {/* Changed to flex-col for stacking buttons */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => toggleLayerVisibility('floodAreas')} // Placeholder, needs actual layer management
                className="bg-white/90 hover:bg-white" // Removed mb-2 for vertical stack
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
      {/* Positioning might need adjustment in parent container (Index.tsx) for overall layout */}
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
