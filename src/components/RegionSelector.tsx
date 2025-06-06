
import React, { useState, useEffect } from 'react';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';
import { fetchRainfallData } from '../services/imdApiService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useToast } from "../hooks/use-toast";
import { 
  resolveAllReservoirLocations, 
  getStatesFromResolvedLocations, 
  getDistrictsForState, 
  getCoordinatesForLocation,
  ResolvedLocation 
} from '../services/geocodingService';

interface RegionSelectorProps {
  selectedRegion: string;
  onRegionChange: (value: string) => void;
  onLocationData?: (data: { coordinates: [number, number], rainfall: any, state: string, district: string }) => void;
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
  const [resolvedLocations, setResolvedLocations] = useState<ResolvedLocation[]>([]);
  const [loadingLocations, setLoadingLocations] = useState<boolean>(true);
  const [loadingDistricts, setLoadingDistricts] = useState<boolean>(false);
  const [loadingRainfall, setLoadingRainfall] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resolutionProgress, setResolutionProgress] = useState<string>('');
  const { toast } = useToast();
  
  // Load and resolve all reservoir locations on component mount
  useEffect(() => {
    const loadResolvedLocations = async () => {
      setLoadingLocations(true);
      setErrorMessage(null);
      setResolutionProgress('Fetching reservoir data from Supabase...');
      
      try {
        console.log('🚀 Starting location resolution process...');
        const locations = await resolveAllReservoirLocations();
        
        if (locations.length === 0) {
          setErrorMessage("No reservoir locations could be resolved. Please check your internet connection.");
          setResolutionProgress('Failed to resolve locations');
          return;
        }
        
        setResolvedLocations(locations);
        const states = getStatesFromResolvedLocations(locations);
        setAvailableStates(states);
        setResolutionProgress(`Successfully resolved ${locations.length} reservoir locations`);
        
        console.log(`✅ Loaded ${locations.length} resolved locations across ${states.length} states`);
        
        toast({
          title: "Location Data Loaded",
          description: `Successfully resolved ${locations.length} reservoir locations across ${states.length} states`,
          duration: 5000,
        });
      } catch (error) {
        console.error('❌ Error loading resolved locations:', error);
        setErrorMessage("Failed to load reservoir location data. Please try refreshing the page.");
        setResolutionProgress('Error resolving locations');
        toast({
          title: "Error",
          description: "Failed to load reservoir location data",
          variant: "destructive"
        });
      } finally {
        setLoadingLocations(false);
      }
    };
    
    loadResolvedLocations();
  }, [toast]);

  // Load districts when state changes
  useEffect(() => {
    if (selectedState && resolvedLocations.length > 0) {
      setLoadingDistricts(true);
      setErrorMessage(null);
      
      try {
        const districts = getDistrictsForState(resolvedLocations, selectedState);
        setAvailableDistricts(districts);
        setSelectedDistrict(""); // Reset district selection
        
        if (districts.length === 0) {
          setErrorMessage(`No districts found for ${selectedState} with resolved reservoir data`);
        }
        
        console.log(`📍 Found ${districts.length} districts in ${selectedState}`);
      } catch (error) {
        console.error('❌ Error loading districts:', error);
        setErrorMessage("Failed to load districts for selected state");
      } finally {
        setLoadingDistricts(false);
      }
    } else {
      setAvailableDistricts([]);
      setSelectedDistrict("");
    }
  }, [selectedState, resolvedLocations]);

  // Handle state selection
  const handleStateChange = (value: string) => {
    console.log('State selected:', value);
    setSelectedState(value);
    setSelectedDistrict("");
    setAvailableDistricts([]);
  };
  
  // Handle district selection and fetch additional data
  const handleDistrictChange = async (value: string) => {
    setSelectedDistrict(value);
    console.log('District selected:', value);
    
    if (selectedState && value && resolvedLocations.length > 0) {
      setLoadingRainfall(true);
      setErrorMessage(null);
      
      try {
        // Get coordinates for the selected district
        const coordinates = getCoordinatesForLocation(resolvedLocations, selectedState, value);
        
        if (coordinates) {
          console.log(`📍 Found coordinates for ${value}, ${selectedState}:`, coordinates);
          
          // Fetch rainfall data for the coordinates
          const rainfallData = await fetchRainfallData(coordinates[0], coordinates[1]);
          
          // Pass location data to parent component
          if (onLocationData) {
            onLocationData({
              coordinates,
              rainfall: rainfallData,
              state: selectedState,
              district: value
            });
          }
          
          // Update selected region for compatibility
          const regionKey = value.toLowerCase().replace(/\s+/g, '');
          onRegionChange(regionKey);
          
          toast({
            title: "Location Selected",
            description: `${value}, ${selectedState} - Weather data loaded successfully`,
            duration: 3000
          });
        } else {
          setErrorMessage(`Could not find coordinates for ${value}, ${selectedState}`);
          toast({
            title: "Warning",
            description: "Could not find coordinates for selected district",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('❌ Error processing district selection:', error);
        setErrorMessage("Could not load weather data for selected location");
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
      
      {/* Loading Status */}
      {loadingLocations && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">Resolving Reservoir Locations</p>
              <p className="text-xs text-blue-700">{resolutionProgress}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-4 w-4 text-red-600 mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-xs text-red-700">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* State Selection */}
        <div>
          <label htmlFor="state-select" className="block text-sm font-medium mb-2 text-muted-foreground">
            Select a state:
          </label>
          <Select 
            value={selectedState} 
            onValueChange={handleStateChange} 
            disabled={loadingLocations || availableStates.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={
                loadingLocations ? "Resolving locations..." : 
                availableStates.length === 0 ? "No states available" :
                "Select a state"
              } />
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
            <p className="text-xs text-gray-500 mt-1">{availableStates.length} states with reservoir data</p>
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
                    Live reservoir and weather data loaded for this location
                  </p>
                </div>
                {loadingRainfall && (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                )}
              </div>
            </div>
          )}
          
          {!loadingLocations && resolvedLocations.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
              <p className="text-sm text-green-800">
                ✅ Successfully loaded {resolvedLocations.length} reservoir locations across {availableStates.length} states
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
