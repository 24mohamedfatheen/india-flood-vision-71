
import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { getAllStates, getDistrictsForState, floodData, fetchImdData } from '../data/floodData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface RegionSelectorProps {
  selectedRegion: string;
  onRegionChange: (value: string) => void;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ selectedRegion, onRegionChange }) => {
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  
  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchImdData();
        setAvailableStates(getAllStates());
        setDataLoaded(true);
        console.log('RegionSelector: Data loaded, available states:', getAllStates().length);
      } catch (error) {
        console.error('Error loading region data:', error);
      }
    };

    loadData();
  }, []);

  // When a state is selected, update the available districts
  useEffect(() => {
    if (selectedState && dataLoaded) {
      const districts = getDistrictsForState(selectedState);
      setAvailableDistricts(districts);
      console.log(`Districts for ${selectedState}:`, districts.length);
      
      // Reset district selection when state changes
      setSelectedDistrict("");
    }
  }, [selectedState, dataLoaded]);

  // Handle state selection
  const handleStateChange = (value: string) => {
    setSelectedState(value);
  };
  
  // Handle district selection
  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    
    // Find the matching region in the flood data
    const matchingRegion = floodData.find(data => 
      data.region.toLowerCase() === value.toLowerCase() && 
      data.state.toLowerCase() === selectedState.toLowerCase()
    );
    
    if (matchingRegion) {
      onRegionChange(matchingRegion.region);
    }
  };

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
            Select a state from live data:
          </label>
          <Select value={selectedState} onValueChange={handleStateChange} disabled={!dataLoaded}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={dataLoaded ? "Select a state" : "Loading states..."} />
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
        
        {/* District Selection - only shown if a state is selected */}
        {selectedState && (
          <div>
            <label htmlFor="district-select" className="block text-sm font-medium mb-2 text-muted-foreground">
              Select a district:
            </label>
            <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
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
        )}
        
        {/* Data status indicator */}
        <div className="md:col-span-2">
          <div className="text-sm text-muted-foreground">
            {dataLoaded ? (
              <>
                <span className="text-green-600">✓</span> Live data loaded: {floodData.length} regions with flood monitoring data
              </>
            ) : (
              <>
                <span className="text-yellow-600">⟳</span> Loading live flood data from Supabase...
              </>
            )}
          </div>
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
