
import React, { useState, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { fetchStatesFromReservoirs, fetchDistrictsForState, getDistrictCoordinates, fetchRainfallData } from '../services/imdApiService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useToast } from "../hooks/use-toast";

interface RegionSelectorProps {
  selectedRegion: string;
  onRegionChange: (value: string) => void;
  onLocationData?: (data: { coordinates: [number, number], rainfall: any }) => void;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ 
  selectedRegion, 
  onRegionChange, 
  onLocationData 
}) => {
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState<boolean>(true);
  const [loadingDistricts, setLoadingDistricts] = useState<boolean>(false);
  const [loadingRainfall, setLoadingRainfall] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Load states on component mount
  useEffect(() => {
    const loadStates = async () => {
      setLoadingStates(true);
      try {
        const states = await fetchStatesFromReservoirs();
        setAvailableStates(states);
      } catch (error) {
        console.error('Error loading states:', error);
        toast({
          title: "Error",
          description: "Failed to load states from database",
          variant: "destructive"
        });
      } finally {
        setLoadingStates(false);
      }
    };
    
    loadStates();
  }, [toast]);

  // Load districts when state changes
  useEffect(() => {
    if (selectedState) {
      const loadDistricts = async () => {
        setLoadingDistricts(true);
        try {
          const districts = await fetchDistrictsForState(selectedState);
          setAvailableDistricts(districts);
          setSelectedDistrict(""); // Reset district selection
        } catch (error) {
          console.error('Error loading districts:', error);
          toast({
            title: "Error",
            description: "Failed to load districts for selected state",
            variant: "destructive"
          });
        } finally {
          setLoadingDistricts(false);
        }
      };
      
      loadDistricts();
    } else {
      setAvailableDistricts([]);
      setSelectedDistrict("");
    }
  }, [selectedState, toast]);

  // Handle state selection
  const handleStateChange = (value: string) => {
    setSelectedState(value);
    console.log('State selected:', value);
  };
  
  // Handle district selection and fetch additional data
  const handleDistrictChange = async (value: string) => {
    setSelectedDistrict(value);
    console.log('District selected:', value);
    
    if (selectedState && value) {
      setLoadingRainfall(true);
      
      try {
        // Get coordinates for the district
        const coordinates = await getDistrictCoordinates(selectedState, value);
        
        if (coordinates) {
          // Fetch rainfall data for the coordinates
          const rainfallData = await fetchRainfallData(coordinates[0], coordinates[1]);
          
          // Pass location data to parent component
          if (onLocationData) {
            onLocationData({
              coordinates,
              rainfall: rainfallData
            });
          }
          
          // Update selected region for compatibility with existing system
          onRegionChange(value.toLowerCase().replace(/\s+/g, ''));
          
          toast({
            title: "Location Selected",
            description: `${value}, ${selectedState} - Weather data loaded`,
            duration: 3000
          });
        } else {
          toast({
            title: "Warning",
            description: "Could not find coordinates for selected district",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error processing district selection:', error);
        toast({
          title: "Error",
          description: "Failed to load weather data for selected location",
          variant: "destructive"
        });
      } finally {
        setLoadingRainfall(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg border border-border p-4 shadow-sm mb-6">
      <div className="flex items-center mb-4">
        <MapPin className="mr-2 h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Select Location</h2>
        {loadingRainfall && (
          <div className="ml-2 flex items-center">
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
            <span className="text-sm text-muted-foreground">Loading weather data...</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* State Selection */}
        <div>
          <label htmlFor="state-select" className="block text-sm font-medium mb-2 text-muted-foreground">
            Select a state in India:
          </label>
          <Select value={selectedState} onValueChange={handleStateChange} disabled={loadingStates}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={loadingStates ? "Loading states..." : "Select a state"} />
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
            onValueChange={handleDistrictChange}
            disabled={!selectedState || loadingDistricts}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={
                !selectedState ? "Select a state first" :
                loadingDistricts ? "Loading districts..." :
                "Select a district"
              } />
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
        
        {/* Status Information */}
        <div className="md:col-span-2 mt-4">
          {selectedState && selectedDistrict && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    Selected: {selectedDistrict}, {selectedState}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Real-time reservoir and weather data will be loaded for this location
                  </p>
                </div>
                {loadingRainfall && (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Risk Level Legend */}
        <div className="flex items-center justify-center md:justify-end md:col-span-2 mt-4">
          <div className="flex items-center mr-4">
            <span className="inline-block w-3 h-3 rounded-full bg-flood-safe mr-2"></span>
            <span className="text-xs">Low Risk</span>
          </div>
          <div className="flex items-center mr-4">
            <span className="inline-block w-3 h-3 rounded-full bg-flood-warning mr-2"></span>
            <span className="text-xs">Medium Risk</span>
          </div>
          <div className="flex items-center mr-4">
            <span className="inline-block w-3 h-3 rounded-full bg-flood-danger mr-2"></span>
            <span className="text-xs">High Risk</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-red-600 mr-2"></span>
            <span className="text-xs">Severe Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionSelector;
