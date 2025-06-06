
import React from 'react';
import { ZoomIn, ZoomOut, Map as MapIcon, Layers } from 'lucide-react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import L from 'leaflet';

interface MapControlsProps {
  map: L.Map | null;
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
      <div className="absolute top-16 right-4 z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => toggleLayerVisibility('floodAreas')}
                className="bg-white/90 hover:bg-white mb-2"
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
