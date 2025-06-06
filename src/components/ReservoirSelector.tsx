
import React, { useState, useEffect } from 'react';
import { MapPin, Loader2, AlertCircle, Database } from 'lucide-react';
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
  getReservoirsForLocation,
  getLocationForReservoir,
  ResolvedLocation 
} from '../services/geocodingService';

interface ReservoirSelectorProps {
  selectedRegion: string;
  onRegionChange: (value: string) => void;
  onLocationData?: (data: { 
    coordinates: [number, number], 
    rainfall: any, 
    state: string, 
    district: string,
    reservoirName: string
  }) => void;
}

const ReservoirSelector: React.FC<ReservoirSelectorProps> = ({ 
  selectedRegion, 
  onRegionChange, 
  onLocationData 
}) => {
  const [selectedReservoir, setSelectedReservoir] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [availableReservoirs, setAvailableReservoirs] = useState<ResolvedLocation[]>([]);
  const [allResolvedLocations, setAllResolvedLocations] = useState<ResolvedLocation[]>([]);
  const [loadingLocations, setLoadingLocations] = useState<boolean>(true);
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
        
        setAllResolvedLocations(locations);
        setAvailableReservoirs(locations);
        const states = getStatesFromResolvedLocations(locations);
        setAvailableStates(states);
        setResolutionProgress(`Successfully resolved ${locations.length} reservoir locations`);
        
        console.log(`✅ Loaded ${locations.length} resolved locations across ${states.length} states`);
        
        toast({
          title: "Reservoir Data Loaded",
          description: `Successfully resolved ${locations.length} reservoir locations from Supabase`,
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

  // Update districts when state changes
  useEffect(() => {
    if (selectedState && selectedState !== "all-states" && allResolvedLocations.length > 0) {
      const districts = getDistrictsForState(allResolvedLocations, selectedState);
      setAvailableDistricts(districts);
      setSelectedDistrict(""); // Reset district selection
      
      // Update available reservoirs based on state
      const reservoirsInState = getReservoirsForLocation(allResolvedLocations, selectedState);
      setAvailableReservoirs(reservoirsInState);
      
      console.log(`📍 Found ${districts.length} districts and ${reservoirsInState.length} reservoirs in ${selectedState}`);
    } else {
      setAvailableDistricts([]);
      setSelectedDistrict("");
      setAvailableReservoirs(allResolvedLocations);
    }
  }, [selectedState, allResolvedLocations]);

  // Update reservoirs when district changes
  useEffect(() => {
    if (selectedDistrict && selectedDistrict !== "all-districts" && selectedState && selectedState !== "all-states" && allResolvedLocations.length > 0) {
      const reservoirsInDistrict = getReservoirsForLocation(allResolvedLocations, selectedState, selectedDistrict);
      setAvailableReservoirs(reservoirsInDistrict);
      setSelectedReservoir(""); // Reset reservoir selection
      
      console.log(`🏞️ Found ${reservoirsInDistrict.length} reservoirs in ${selectedDistrict}, ${selectedState}`);
    } else if (selectedState && selectedState !== "all-states" && !selectedDistrict) {
      const reservoirsInState = getReservoirsForLocation(allResolvedLocations, selectedState);
      setAvailableReservoirs(reservoirsInState);
    } else if (!selectedState || selectedState === "all-states") {
      setAvailableReservoirs(allResolvedLocations);
    }
  }, [selectedDistrict, selectedState, allResolvedLocations]);

  // Handle state selection
  const handleStateChange = (value: string) => {
    console.log('State selected:', value);
    if (value === "all-states") {
      setSelectedState("");
    } else {
      setSelectedState(value);
    }
    setSelectedDistrict("");
    setSelectedReservoir("");
  };
  
  // Handle district selection
  const handleDistrictChange = (value: string) => {
    if (value === "all-districts") {
      setSelectedDistrict("");
    } else {
      setSelectedDistrict(value);
    }
    setSelectedReservoir("");
    console.log('District selected:', value);
  };

  // Handle reservoir selection and fetch additional data
  const handleReservoirChange = async (value: string) => {
    setSelectedReservoir(value);
    console.log('Reservoir selected:', value);
    
    if (value && allResolvedLocations.length > 0) {
      setLoadingRainfall(true);
      setErrorMessage(null);
      
      try {
        // Get location data for the selected reservoir
        const locationData = getLocationForReservoir(allResolvedLocations, value);
        
        if (locationData) {
          console.log(`📍 Found location data for ${value}:`, locationData);
          
          // Update state and district based on reservoir selection
          setSelectedState(locationData.state);
          setSelectedDistrict(locationData.district);
          
          // Fetch rainfall data for the coordinates
          const rainfallData = await fetchRainfallData(locationData.coordinates[0], locationData.coordinates[1]);
          
          // Pass location data to parent component
          if (onLocationData) {
            onLocationData({
              coordinates: locationData.coordinates,
              rainfall: rainfallData,
              state: locationData.state,
              district: locationData.district,
              reservoirName: value
            });
          }
          
          // Update selected region for compatibility
          const regionKey = value.toLowerCase().replace(/\s+/g, '');
          onRegionChange(regionKey);
          
          toast({
            title: "Reservoir Selected",
            description: `${value} in ${locationData.district}, ${locationData.state} - Weather data loaded`,
            duration: 3000
          });
        } else {
          setErrorMessage(`Could not find location data for ${value}`);
          toast({
            title: "Warning",
            description: "Could not find location data for selected reservoir",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('❌ Error processing reservoir selection:', error);
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
        <Database className="mr-2 h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Select Reservoir</h2>
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
      
      <div className="grid grid-cols-1 gap-4">
        {/* Primary Reservoir Selection */}
        <div>
          <label htmlFor="reservoir-select" className="block text-sm font-medium mb-2 text-muted-foreground">
            Select a reservoir:
          </label>
          <Select 
            value={selectedReservoir} 
            onValueChange={handleReservoirChange} 
            disabled={loadingLocations || availableReservoirs.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={
                loadingLocations ? "Loading reservoirs..." : 
                availableReservoirs.length === 0 ? "No reservoirs available" :
                "Select a reservoir"
              } />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50 max-h-60 overflow-y-auto">
              {availableReservoirs.map((reservoir) => (
                <SelectItem key={reservoir.reservoirName} value={reservoir.reservoirName} className="hover:bg-gray-100">
                  <div>
                    <div className="font-medium">{reservoir.reservoirName}</div>
                    <div className="text-xs text-gray-500">{reservoir.district}, {reservoir.state}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {availableReservoirs.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {availableReservoirs.length} reservoir{availableReservoirs.length !== 1 ? 's' : ''} available
              {selectedState && ` in ${selectedState}`}
              {selectedDistrict && `, ${selectedDistrict}`}
            </p>
          )}
        </div>

        {/* Secondary Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* State Filter */}
          <div>
            <label htmlFor="state-select" className="block text-sm font-medium mb-2 text-muted-foreground">
              Filter by state (optional):
            </label>
            <Select 
              value={selectedState || "all-states"} 
              onValueChange={handleStateChange} 
              disabled={loadingLocations || availableStates.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={
                  loadingLocations ? "Loading states..." : 
                  availableStates.length === 0 ? "No states available" :
                  "All states"
                } />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                <SelectItem value="all-states" className="hover:bg-gray-100">All states</SelectItem>
                {availableStates.map((state) => (
                  <SelectItem key={state} value={state} className="hover:bg-gray-100">
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* District Filter */}
          <div>
            <label htmlFor="district-select" className="block text-sm font-medium mb-2 text-muted-foreground">
              Filter by district (optional):
            </label>
            <Select 
              value={selectedDistrict || "all-districts"} 
              onValueChange={handleDistrictChange}
              disabled={!selectedState || selectedState === "all-states" || availableDistricts.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={
                  !selectedState || selectedState === "all-states" ? "Select state first" :
                  availableDistricts.length === 0 ? "No districts available" :
                  "All districts"
                } />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                <SelectItem value="all-districts" className="hover:bg-gray-100">All districts</SelectItem>
                {availableDistricts.map((district) => (
                  <SelectItem key={district} value={district} className="hover:bg-gray-100">
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Status Information */}
        {selectedReservoir && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">
                  Selected: {selectedReservoir}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Location: {selectedDistrict}, {selectedState}
                </p>
                <p className="text-xs text-blue-700">
                  Live reservoir and weather data loaded for this location
                </p>
              </div>
              {loadingRainfall && (
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              )}
            </div>
          </div>
        )}
        
        {!loadingLocations && allResolvedLocations.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              ✅ Successfully loaded {allResolvedLocations.length} reservoir locations from Supabase across {availableStates.length} states
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservoirSelector;
