// src/components/map/MapControls.tsx
// This component now combines both dropdown-based region selection
// and map zoom/layer toggle buttons.

import React from 'react';
import { ZoomIn, ZoomOut, Map as MapIcon, Layers } from 'lucide-react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

// Import UI components for dropdowns (assuming these are from shadcn/ui Select component)
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { MapPin, LocateFixed } from 'lucide-react'; // Icons for dropdowns

// Define the comprehensive props for this combined MapControls component
interface MapControlsProps {
  // Props for the dropdowns (from App.tsx state)
  selectedState: string;
  setSelectedState: (state: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  availableStates: string[];
  availableDistricts: string[];

  // Props for the map control buttons (passed from App.tsx, which manages map instance)
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
  toggleLayerVisibility,
  selectedState,
  setSelectedState,
  selectedDistrict,
  setSelectedDistrict,
  availableStates,
  availableDistricts,
}) => {
  return (
    <>
      {/* Region Selection Dropdowns (positioned at the top) */}
      {/* This block replaces the previous standalone dropdown div from App.tsx */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100 mx-auto max-w-2xl z-20 relative">
        {/* State Selection Dropdown */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <MapPin className="text-gray-500 flex-shrink-0" size={20} />
          <label htmlFor="state-select" className="sr-only">Select a State</label>
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger id="state-select" className="w-full md:w-[250px] h-12 rounded-xl shadow-sm border border-gray-300 bg-white text-gray-800 text-base focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out hover:border-blue-400">
              <SelectValue placeholder="Select a State" />
            </SelectTrigger>
            <SelectContent className="max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-[999]"> 
              {availableStates.length === 0 ? (
                <SelectItem disabled value="">No States Available</SelectItem>
              ) : (
                availableStates.map(state => (
                  <SelectItem key={state} value={state} className="py-2 px-4 hover:bg-blue-50 focus:bg-blue-100 cursor-pointer text-gray-800 text-base">{state}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* District Selection Dropdown */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <LocateFixed className="text-gray-500 flex-shrink-0" size={20} />
          <label htmlFor="district-select" className="sr-only">Select a District</label>
          <Select value={selectedDistrict} onValueChange={setSelectedDistrict} disabled={!selectedState || availableDistricts.length === 0}>
            <SelectTrigger id="district-select" className="w-full md:w-[250px] h-12 rounded-xl shadow-sm border border-gray-300 bg-white text-gray-800 text-base focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out hover:border-blue-400">
              <SelectValue placeholder="Select a District" />
            </SelectTrigger>
            <SelectContent className="max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-[999]"> 
              {availableDistricts.length === 0 ? (
                <SelectItem disabled value="">Select a State first</SelectItem>
              ) : (
                availableDistricts.map(district => (
                  <SelectItem key={district} value={district} className="py-2 px-4 hover:bg-blue-50 focus:bg-blue-100 cursor-pointer text-gray-800 text-base">{district}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>


      {/* Layer controls (existing from your file, positioned absolutely) */}
      <div className="absolute top-16 right-4 z-10"> {/* Kept existing positioning */}
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
      
      {/* Zoom controls (existing from your file, positioned absolutely) */}
      <div className="absolute bottom-16 right-4 z-10 flex flex-col space-y-2"> {/* Kept existing positioning */}
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
