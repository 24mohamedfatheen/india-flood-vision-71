
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
import { supabase } from '../integrations/supabase/client';

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Load states on component mount with improved null filtering
  useEffect(() => {
    const loadStates = async () => {
      setLoadingStates(true);
      setErrorMessage(null);
      try {
        console.log('Fetching states from Supabase...');
        const { data, error } = await supabase
          .from('indian_reservoir_levels')
          .select('state')
          .not('state', 'is', null)
          .neq('state', '')
          .order('state');
        
        console.log('Supabase response:', data, error);
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data && data.length > 0) {
          // Enhanced filtering to exclude null, empty, and whitespace-only values
          const uniqueStates = [...new Set(
            data
              .map((row) => row.state)
              .filter((state): state is string => 
                state !== null && 
                state !== undefined && 
                typeof state === 'string' && 
                state.trim().length > 0
              )
          )].sort();
          
          console.log('Filtered unique states:', uniqueStates);
          setAvailableStates(uniqueStates);
          
          if (uniqueStates.length === 0) {
            setErrorMessage("No valid states found in database");
          }
        } else {
          setErrorMessage("No states found in database");
        }
      } catch (error) {
        console.error('Error loading states:', error);
        setErrorMessage("Could not fetch states. Please try again.");
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

  // Load districts when state changes with improved filtering and cascading logic
  useEffect(() => {
    if (selectedState && selectedState.trim().length > 0) {
      const loadDistricts = async () => {
        setLoadingDistricts(true);
        setErrorMessage(null);
        try {
          console.log('Fetching districts for state:', selectedState);
          const { data, error } = await supabase
            .from('indian_reservoir_levels')
            .select('district')
            .eq('state', selectedState)
            .not('district', 'is', null)
            .neq('district', '')
            .order('district');
          
          console.log('Districts response:', data, error);
          
          if (error) {
            throw new Error(error.message);
          }
          
          if (data && data.length > 0) {
            // Enhanced filtering to exclude null, empty, and whitespace-only values
            const uniqueDistricts = [...new Set(
              data
                .map((row) => row.district)
                .filter((district): district is string => 
                  district !== null && 
                  district !== undefined && 
                  typeof district === 'string' && 
                  district.trim().length > 0
                )
            )].sort();
            
            console.log('Filtered unique districts:', uniqueDistricts);
            setAvailableDistricts(uniqueDistricts);
            
            if (uniqueDistricts.length === 0) {
              setErrorMessage(`No valid districts found for ${selectedState}`);
            }
          } else {
            setAvailableDistricts([]);
            setErrorMessage(`No districts found for ${selectedState}`);
          }
          
          // Reset district selection when state changes (cascading logic)
          setSelectedDistrict("");
        } catch (error) {
          console.error('Error loading districts:', error);
          setErrorMessage("Could not fetch districts. Please try again.");
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
      // Clear districts when no state is selected
      setAvailableDistricts([]);
      setSelectedDistrict("");
    }
  }, [selectedState, toast]);

  // Handle state selection with proper cascading
  const handleStateChange = (value: string) => {
    console.log('State selected:', value);
    setSelectedState(value);
    setSelectedDistrict(""); // Reset district when state changes
    setAvailableDistricts([]); // Clear districts list
  };
  
  // Handle district selection and fetch additional data
  const handleDistrictChange = async (value: string) => {
    setSelectedDistrict(value);
    console.log('District selected:', value);
    
    if (selectedState && value && selectedState.trim().length > 0 && value.trim().length > 0) {
      setLoadingRainfall(true);
      setErrorMessage(null);
      
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
          const regionKey = value.toLowerCase().replace(/\s+/g, '');
          onRegionChange(regionKey);
          
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
        setErrorMessage("Could not load weather data. Please try again.");
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
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}
      
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
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
              {availableStates.map((state) => (
                <SelectItem key={state} value={state} className="hover:bg-gray-100">
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {availableStates.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">{availableStates.length} states available</p>
          )}
        </div>
        
        {/* District Selection */}
        <div>
          <label htmlFor="district-select" className="block text-sm font-medium mb-2 text-muted-foreground">
            Select a district:
          </label>
          <Select 
            value={selectedDistrict} 
            onValueChange={handleDistrictChange}
            disabled={!selectedState || loadingDistricts || availableDistricts.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={
                !selectedState ? "Select a state first" :
                loadingDistricts ? "Loading districts..." :
                availableDistricts.length === 0 ? "No districts available" :
                "Select a district"
              } />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
              {availableDistricts.map((district) => (
                <SelectItem key={district} value={district} className="hover:bg-gray-100">
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedState && availableDistricts.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">{availableDistricts.length} districts in {selectedState}</p>
          )}
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
          
          {selectedState && !selectedDistrict && availableDistricts.length === 0 && !loadingDistricts && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                No districts found for {selectedState}. This state may have limited data in our current dataset.
              </p>
            </div>
          )}
        </div>
        
        {/* Risk Level Legend */}
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
            <span className="inline-block w-3 h-3 rounded-full bg-red-600 mr-2"></span>
            <span className="text-xs">Severe Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionSelector;
