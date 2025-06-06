
import React from 'react';
import { MapPin, LocateFixed } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface RegionSelectorProps {
  selectedState: string;
  setSelectedState: (value: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (value: string) => void;
  availableStates: string[];
  availableDistricts: string[];
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ 
  selectedState, 
  setSelectedState, 
  selectedDistrict, 
  setSelectedDistrict, 
  availableStates, 
  availableDistricts 
}) => {
  return (
    <div className="bg-white rounded-lg border border-border p-4 shadow-sm mb-6">
      <div className="flex items-center mb-4">
        <MapPin className="mr-2 h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Select Region</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* State Selection */}
        <div>
          <label htmlFor="state-select" className="block text-sm font-medium mb-2 text-muted-foreground">
            Select a state in India:
          </label>
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent>
              {availableStates.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* District Selection */}
        <div>
          <label htmlFor="district-select" className="block text-sm font-medium mb-2 text-muted-foreground">
            Select a district:
          </label>
          <Select 
            value={selectedDistrict} 
            onValueChange={setSelectedDistrict}
            disabled={!selectedState || availableDistricts.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a district" />
            </SelectTrigger>
            <SelectContent>
              {availableDistricts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-center md:justify-end md:col-span-2 mt-4">
          <div className="flex items-center mr-4">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            <span className="text-xs">Low Risk</span>
          </div>
          <div className="flex items-center mr-4">
            <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
            <span className="text-xs">Medium Risk</span>
          </div>
          <div className="flex items-center mr-4">
            <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
            <span className="text-xs">High Risk</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
            <span className="text-xs">Severe Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionSelector;
