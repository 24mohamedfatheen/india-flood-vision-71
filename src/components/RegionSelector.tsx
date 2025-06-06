// src/components/RegionSelector.tsx
// This component provides the State and District selection dropdowns,
// populating options dynamically from data passed via props.

import React from 'react';
import { MapPin, LocateFixed } from 'lucide-react'; // Added LocateFixed icon for district dropdown
// Import UI components for dropdowns from your local shadcn/ui setup
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Define the props for the RegionSelector component
interface RegionSelectorProps {
  // These props will be provided by the parent component (Index.tsx)
  selectedState: string;
  setSelectedState: (value: string) => void; // Callback to update selected state in parent
  selectedDistrict: string;
  setSelectedDistrict: (value: string) => void; // Callback to update selected district in parent
  availableStates: string[]; // List of unique states from aggregated data
  availableDistricts: string[]; // List of unique districts (filtered by selected state) from aggregated data
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ 
  selectedState, 
  setSelectedState, 
  selectedDistrict, 
  setSelectedDistrict, 
  availableStates, 
  availableDistricts 
}) => {
  // The state management for selectedState and selectedDistrict now happens in Index.tsx
  // and is passed down as props. No internal state for these is needed here.

  return (
    // This div provides the layout and styling for the dropdowns
    <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100 mx-auto max-w-2xl z-10 relative">
      {/* State Selection Dropdown */}
      <div className="flex items-center space-x-3 w-full md:w-auto">
        <MapPin className="text-gray-500 flex-shrink-0" size={20} />
        <label htmlFor="state-select" className="sr-only">Select a State</label>
        <Select 
          value={selectedState} 
          onValueChange={setSelectedState} // Directly use the setter from props
        >
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
      
      {/* District Selection Dropdown - only enabled if a state is selected and districts are available */}
      <div className="flex items-center space-x-3 w-full md:w-auto">
        <LocateFixed className="text-gray-500 flex-shrink-0" size={20} />
        <label htmlFor="district-select" className="sr-only">Select a District</label>
        <Select 
          value={selectedDistrict} 
          onValueChange={setSelectedDistrict} // Directly use the setter from props
          disabled={!selectedState || availableDistricts.length === 0} // Disable if no state selected or no districts
        >
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

      {/* The original <select> and risk legend below are removed,
          as the new structure uses the shadcn/ui Select components
          and the risk legend is handled by Index.tsx/FloodStats. */}
    </div>
  );
};

export default RegionSelector;
