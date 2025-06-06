// src/pages/Index.tsx
// This is a consolidated version of the main dashboard page,
// designed to increase build stability by minimizing external component imports
// and handling Leaflet assets directly within this file.

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet'; // Import Leaflet core library for direct manipulation
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'; // React-Leaflet components
import { Clock, RefreshCw, AlertTriangle, LogIn, LogOut, Database, MapPin, ChevronDown, Check, LocateFixed, ZoomIn, ZoomOut, Layers, Map as MapIcon } from 'lucide-react'; // All necessary Lucide icons

// Import your existing UI components (assuming these are correctly implemented and their dependencies are met)
import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'; // Your shadcn/ui Select
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip'; // Your shadcn/ui Tooltip

// Your authentication context
import { useAuth } from '../context/AuthContext'; 

// Import the comprehensive data service
import { imdApiService, IMDRegionData } from './../services/imdApiService'; 

// --- Leaflet Default Icon Fix & CDN CSS Link (Critical for build stability) ---
// This ensures Leaflet's default marker icons display correctly without relying on local bundling.
// It also embeds Leaflet's CSS directly via a style tag for robustness.
// IMPORTANT: Place this outside the component, as it runs once when the module loads.
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Create a style tag to inject Leaflet's CSS directly into the document head.
// This is a workaround to ensure CSS loads even if traditional CSS imports fail in the build.
const createLeafletStyle = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    @import 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    /* Basic custom marker styles if needed, but inlined SVG in Map component is better */
    .custom-marker-icon {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;
  document.head.appendChild(style);
};
// Execute this once when the script loads
createLeafletStyle();

const Index: React.FC = () => { 
  // --- States for Map and Aggregated Data ---
  const [aggregatedFloodData, setAggregatedFloodData] = useState<IMDRegionData[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<L.LatLngExpression>([20.5937, 78.9629]); 
  const [mapZoom, setMapZoom] = useState<number>(5); 
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null); // To hold the Leaflet map instance

  // --- Other Dashboard States ---
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const [nextUpdateTime, setNextUpdateTime] = useState<Date>(new Date(Date.now() + 12 * 60 * 60 * 1000));
  const [dataFreshness, setDataFreshness] = useState<'fresh' | 'stale' | 'updating'>('updating');
  const [showHistoricalData, setShowHistoricalData] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const [isRefreshing, setIsRefreshing] = useState(false); 
  
  const { toast } = useToast();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // --- MapRecenter Component (Inlined for build stability) ---
  // This helper component ensures the map's view updates programmatically.
  const MapRecenter: React.FC<{ center: L.LatLngExpression, zoom: number }> = ({ center, zoom }) => {
    const map = useMapEvents({ // useMapEvents is used here to get access to the map instance
      load: (e) => { // 'load' event fires when the map is initialized
        if (mapInstance === null) { // Set mapInstance only once
          setMapInstance(e.target);
        }
      },
    });
    useEffect(() => {
      if (map && (center[0] !== 0 || center[1] !== 0)) { 
        map.flyTo(center, zoom, { animate: true, duration: 1 }); 
      }
    }, [center, zoom, map]); 
    return null; 
  };

  // --- Data Fetching Logic ---
  const loadFloodData = useCallback(async (forceRefresh = false) => {
    setDataFreshness('updating'); 
    if (forceRefresh) {
      setIsRefreshing(true);
    }
    
    try {
      const data = await imdApiService.fetchAggregatedFloodData();
      setAggregatedFloodData(data); 

      if (data.length > 0 && (!selectedState || !selectedDistrict)) {
          const defaultRegion = data.find(d => 
              d.district.toLowerCase().includes('mumbai') || 
              d.district.toLowerCase().includes('delhi') ||
              d.district.toLowerCase().includes('pune')
          ) || data[0]; 

          if (defaultRegion) {
              setSelectedState(defaultRegion.state);
              setSelectedDistrict(defaultRegion.district);
              setMapCenter(defaultRegion.coordinates);
              setMapZoom(9);
          }
      }

      const now = new Date();
      setLastUpdateTime(now);
      setNextUpdateTime(new Date(now.getTime() + 12 * 60 * 60 * 1000));
      setDataFreshness('fresh');
      
      if (forceRefresh) {
        toast({
          title: "Data refreshed",
          description: `Latest flood data for ${data.length} regions updated at ${now.toLocaleString()}`,
          duration: 5000,
        });
      } else {
        toast({
          title: "Data Loaded",
          description: `Flood data for ${data.length} regions loaded at ${now.toLocaleString()}`,
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error("Error loading data:", error);
      toast({
        title: forceRefresh ? "Refresh Failed" : "Error Loading Data",
        description: `Could not fetch the latest flood data: ${error.message || 'Unknown error'}. Please ensure your Supabase connection and data ingestion are correct.`,
        variant: "destructive",
        duration: 5000,
      });
      setDataFreshness('stale');
    } finally {
      setIsLoading(false); 
      setIsRefreshing(false); 
    }
  }, [selectedState, selectedDistrict, toast]); 

  // Initial data fetch and geolocation on component mount
  useEffect(() => {
    loadFloodData(false);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (err) => {
          console.warn(`Geolocation Error(${err.code}): ${err.message}. User location will not be displayed on map.`);
        },
        {enableHighAccuracy: true, timeout: 5000, maximumAge: 0} 
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, [loadFloodData]); 

  // --- Dynamic Dropdown Options ---
  const availableStates = useMemo(() => {
    const states = new Set<string>();
    aggregatedFloodData.forEach(d => states.add(d.state));
    return Array.from(states).sort();
  }, [aggregatedFloodData]);

  const availableDistricts = useMemo(() => {
    const districts = new Set<string>();
    aggregatedFloodData
      .filter(d => d.state === selectedState)
      .forEach(d => districts.add(d.district));
    return Array.from(districts).sort();
  }, [aggregatedFloodData, selectedState]);

  // --- Dropdown Event Handlers ---
  const handleStateChange = useCallback((state: string) => {
    setSelectedState(state);
    setSelectedDistrict(''); 
    const stateDataForZoom = aggregatedFloodData.find(d => d.state === state);
    if (stateDataForZoom) {
      setMapCenter(stateDataForZoom.coordinates);
      setMapZoom(7); 
    } else {
        setMapCenter([20.5937, 78.9629]); 
        setMapZoom(5);
    }
  }, [aggregatedFloodData]);

  const handleDistrictChange = useCallback((district: string) => {
    setSelectedDistrict(district);
    const districtDataForZoom = aggregatedFloodData.find(d => d.district === district && d.state === selectedState);
    if (districtDataForZoom) {
      setMapCenter(districtDataForZoom.coordinates);
      setMapZoom(10); 
    } else {
        setMapCenter([20.5937, 78.9629]); 
        setMapZoom(5);
    }
  }, [aggregatedFloodData, selectedState]);

  // --- Map Control Button Handlers ---
  const handleZoomIn = useCallback(() => {
    if (mapInstance) mapInstance.zoomIn();
  }, [mapInstance]);

  const handleZoomOut = useCallback(() => {
    if (mapInstance) mapInstance.zoomOut();
  }, [mapInstance]);

  const handleResetView = useCallback(() => {
    if (mapInstance) mapInstance.setView([20.5937, 78.9629], 5, { animate: true });
  }, [mapInstance]);

  // Placeholder for toggleLayerVisibility 
  const toggleLayerVisibility = useCallback((layerId: string) => {
    console.log(`Toggle layer visibility for: ${layerId} (Feature not implemented yet for markers)`);
  }, []);

  // --- Manual Refresh Handler ---
  const handleManualRefresh = useCallback(async () => {
    if (isRefreshing) return; 
    console.log('Manual refresh triggered');
    await loadFloodData(true);
  }, [isRefreshing, loadFloodData]);
  
  // Set up data refresh every 12 hours
  useEffect(() => {
    const updateInterval = setInterval(() => {
      loadFloodData(true);
    }, 12 * 60 * 60 * 1000); 
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: adding demo interval');
      const demoInterval = setTimeout(() => {
        loadFloodData(true);
      }, 60000); 
      
      return () => {
        clearInterval(updateInterval);
        clearTimeout(demoInterval);
      };
    }
    return () => clearInterval(updateInterval);
  }, [loadFloodData]);

  // Check if data is stale (over 12 hours old)
  useEffect(() => {
    const checkFreshness = () => {
      const now = new Date();
      const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
      
      if (lastUpdateTime < twelveHoursAgo) {
        setDataFreshness('stale');
      } else if (dataFreshness !== 'updating') { 
        setDataFreshness('fresh');
      }
    };
    
    checkFreshness(); 
    const freshnessInterval = setInterval(checkFreshness, 60000); 
    
    return () => clearInterval(freshnessInterval);
  }, [lastUpdateTime, dataFreshness]);

  // --- Derived data for info panels ---
  const displayRegionData = useMemo(() => {
    return aggregatedFloodData.find(d => 
      d.district === selectedDistrict && d.state === selectedState
    ) || (aggregatedFloodData.length > 0 ? aggregatedFloodData[0] : null);
  }, [selectedDistrict, selectedState, aggregatedFloodData]);

  const totalRegionsWithData = useMemo(() => {
    return aggregatedFloodData.length; 
  }, [aggregatedFloodData]);


  // --- Render Logic ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium text-gray-700">Loading India Flood Vision data...</p>
        <p className="text-sm text-gray-500 mt-2">Analyzing live reservoir conditions and weather data</p>
        <Skeleton className="w-3/4 h-8 mt-4" />
        <Skeleton className="w-1/2 h-6 mt-2" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-red-50 text-red-800 p-8 rounded-lg shadow-xl mx-auto max-w-lg text-center border-2 border-red-300">
        <AlertTriangle size={64} className="mb-6 text-red-600" />
        <p className="text-2xl font-bold mb-3">Application Loading Error</p>
        <p className="text-lg mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-8 px-8 py-4 bg-red-700 text-white font-semibold rounded-lg shadow-lg hover:bg-red-800 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-300"
        >
          Retry Loading
        </button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          {/* Header Component */}
          {/* Assuming Header, CursorAiIndicator, Button, useAuth are correctly implemented */}
          <Header />
          <div className="flex items-center gap-2">
            <CursorAiIndicator />
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user?.username}
                  {user?.userType === 'admin' && (
                    <span className="ml-1 text-xs bg-red-100 text-red-600 px-1 py-0.5 rounded">Admin</span>
                  )}
                </span>
                {user?.userType === 'admin' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/admin')}
                    className="text-xs h-7"
                  >
                    Admin Panel
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className="text-xs h-7"
                >
                  <LogOut className="h-3 w-3 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/login')}
                className="text-xs h-7"
              >
                <LogIn className="h-3 w-3 mr-1" />
                Login
              </Button>
            )}
          </div>
        </div>
        
        {/* Region Selector (State/District Dropdowns) - INLINED */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100 mx-auto max-w-2xl z-10 relative">
          {/* State Selection Dropdown */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <MapPin className="text-gray-500 flex-shrink-0" size={20} />
            <label htmlFor="state-select" className="sr-only">Select a State</label>
            <Select value={selectedState} onValueChange={handleStateChange}>
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
            <Select value={selectedDistrict} onValueChange={handleDistrictChange} disabled={!selectedState || availableDistricts.length === 0}>
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

        {/* Main Map Section - INLINED MAP MARKER LOGIC */}
        <div className="bg-white rounded-xl shadow-lg p-3 md:p-5 mb-8 h-[600px] w-full border border-gray-200 flex items-center justify-center relative">
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            className="h-full w-full rounded-lg" 
            zoomControl={false} // Custom zoom controls will be provided
            scrollWheelZoom={true} 
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapRecenter center={mapCenter} zoom={mapZoom} />

            {/* Render Markers for Each Aggregated District Data Point - INLINED LOGIC FROM MapMarker.tsx */}
            {aggregatedFloodData.map((data, index) => (
              data.coordinates && ( 
                <Marker 
                  key={`${data.state}-${data.district}-${index}`} 
                  position={data.coordinates} 
                  icon={L.divIcon({
                    className: `custom-marker-icon ${data.floodRiskLevel}-risk ${
                      data.floodRiskLevel === 'severe' || data.floodRiskLevel === 'high' ? 'animate-pulse' : ''
                    }`, 
                    iconSize: [36, 36], 
                    html: `
                      <div class="relative flex items-center justify-center p-1 rounded-full shadow-lg" 
                           style="background-color: ${
                             data.floodRiskLevel === 'severe' ? '#F44336' : 
                             data.floodRiskLevel === 'high' ? '#FF9800' :   
                             data.floodRiskLevel === 'medium' ? '#FFEB3B' : 
                             '#8BC34A' 
                           };">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin text-white"><path d="M12 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/><path d="M19 10c0 7-7 12-7 12S5 17 5 10a7 7 0 0 1 14 0Z"/></svg>
                      </div>
                    `, 
                    iconAnchor: [18, 36], 
                    popupAnchor: [0, -30] 
                  })}
                  eventHandlers={{
                    click: () => {
                      setSelectedState(data.state);
                      setSelectedDistrict(data.district);
                      setMapCenter(data.coordinates);
                      setMapZoom(10); 
                    },
                  }}
                >
                  <Popup>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#333' }}>
                      <strong style={{ fontSize: '16px' }}>{data.district}, {data.state}</strong><br/>
                      <div style={{ marginTop: '5px' }}>
                          Risk Level: <strong style={{ color: 
                              data.floodRiskLevel === 'severe' ? '#F44336' : 
                              data.floodRiskLevel === 'high' ? '#FF9800' : 
                              data.floodRiskLevel === 'medium' ? '#FFEB3B' : 
                              '#8BC34A' 
                          }}>{data.floodRiskLevel.toUpperCase()}</strong>
                      </div>
                      <div style={{ marginTop: '5px' }}>
                          Reservoir % Full: {data.reservoirPercentage ? `<strong>${data.reservoirPercentage.toFixed(1)}%</strong>` : 'N/A'}<br/>
                          Inflow (Cusecs): {data.inflowCusecs ? `<strong>${data.inflowCusecs.toLocaleString()}</strong>` : 'N/A'}<br/>
                          Outflow (Cusecs): {data.outflowCusecs ? `<strong>${data.outflowCusecs.toLocaleString()}</strong>` : 'N/A'}<br/>
                          Last Updated: {data.lastUpdated ? new Date(data.lastUpdated).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )
            ))}

            {/* Marker for user's current location */}
            {userLocation && (
              <Marker position={userLocation} icon={L.divIcon({
                  className: 'my-custom-user-location-pin', 
                  iconSize: [30, 30], 
                  html: `<div class="relative w-full h-full bg-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-pulse">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-dot text-white"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/></svg>
                        </div>`, 
                  iconAnchor: [15, 15] 
              })}>
                <Popup>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>
                      <strong>Your Current Location</strong><br/>
                      Detected by browser.
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>

          {/* MapControls (Buttons) - INLINED */}
          <div className="absolute top-16 right-4 z-10 flex flex-col space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => toggleLayerVisibility('floodAreas')} className="bg-white/90 hover:bg-white">
                    <Layers className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Toggle flood areas</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
        </div>
        
        {/* Data freshness and refresh button */}
        <div className="mb-6 flex items-center justify-between flex-wrap">
          <div className="flex items-center mt-3 sm:mt-0 space-x-2">
            <div className={`timestamp-badge ${dataFreshness === 'stale' ? 'bg-yellow-50 text-yellow-700' : ''}`}>
              <Clock className="h-3 w-3 mr-1" />
              Last updated: {lastUpdateTime.toLocaleString()}
            </div>
            {totalRegionsWithData > 0 && (
              <div className="timestamp-badge bg-blue-50 text-blue-700">
                <Database className="h-3 w-3 mr-1" />
                Live: {totalRegionsWithData} regions
              </div>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleManualRefresh}
              disabled={dataFreshness === 'updating' || isRefreshing}
              className="text-xs h-7"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${(dataFreshness === 'updating' || isRefreshing) ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </div>
        </div>
        
        {dataFreshness === 'stale' && (
          <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 mr-2" />
              <div>
                <h3 className="font-medium text-yellow-800">Data may not be current</h3>
                <p className="text-sm text-yellow-700">
                  The flood data has not been updated in over 12 hours. The information displayed may not reflect the current situation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Pass displayRegionData to FloodStats and PredictionCard (assuming their props allow this) */}
            {/* You will need to ensure FloodStats, ChartSection, PredictionCard can handle IMDRegionData type */}
            {/* If ChartSection or others still expect `selectedRegion` as a string, pass selectedDistrict */}
            {/* For ChartSection: Assuming it needs a region string for data filtering/display */}
            {/* For FloodStats & PredictionCard: Assuming they can handle `IMDRegionData | null` */}
            <FloodStats floodData={displayRegionData as any} /> 
            <ChartSection selectedRegion={selectedDistrict} /> 
            <PredictionCard floodData={displayRegionData as any} />
          </div>
            
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-2">Flood Risk Information</h2>
                
              {totalRegionsWithData > 0 && (
                <div className="mb-4 p-2 bg-blue-50 rounded">
                  <p className="text-xs text-blue-700 font-medium">
                    ✓ Live Data Active
                  </p>
                  <p className="text-xs text-blue-600">
                    Analyzing {totalRegionsWithData} regions with reservoir conditions
                  </p>
                  {lastUpdateTime && (
                    <p className="text-xs text-blue-500 mt-1">
                      Last sync: {lastUpdateTime.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              )}
                
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Risk Levels</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                    <span>Low Risk</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></span>
                    <span>Medium Risk</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-orange-500 rounded-full mr-1"></span>
                    <span>High Risk</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-1"></span>
                    <span>Severe Risk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
            
        {/* Toggle button for historical flood data section */}
        <div className="mb-4">
          <Button 
            variant="outline"
            onClick={() => setShowHistoricalData(!showHistoricalData)}
            className="w-full"
          >
            {showHistoricalData ? "Hide Historical Data" : "Show Historical Flood Data (2015-2025)"}
          </Button>
        </div>
            
        {/* Historical Flood Data Section */}
        {/* Assuming HistoricalFloodData doesn't rely on selectedRegion/District in a complex way
            or can handle simple string prop. If it needs aggregated data, it needs its own fetch or props. */}
        {showHistoricalData && <HistoricalFloodData />}
            
        <div className="text-center text-sm rounded-lg bg-white p-4 shadow-sm mb-6">
          <h3 className="font-medium mb-2">Official Data Sources</h3>
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            <a href="https://mausam.imd.gov.in/" target="_blank" rel="noopener noreferrer" className="data-source-badge bg-blue-100">
              Weather Services
            </a>
            <a href="https://cwc.gov.in/" target="_blank" rel="noopener noreferrer" className="data-source-badge">
              Water Resources
            </a>
            <a href="https://ndma.gov.in/" target="_blank" rel="noopener noreferrer" className="data-source-badge">
              Disaster Management
            </a>
            <a href="https://chennaimetrowater.tn.gov.in/" target="_blank" rel="noopener noreferrer" className="data-source-badge">
              Chennai Water Supply
            </a>
            <a href="https://cursor.ai/" target="_blank" rel="noopener noreferrer" className="data-source-badge bg-indigo-100">
              Cursor AI
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            All flood predictions and warnings are based on official meteorological and hydrological data, enhanced with Cursor AI technology. Updates occur every 12 hours.
          </p>
        </div>
            
        <footer className="text-center text-sm text-muted-foreground py-4 border-t mt-6">
          <p>India Flood Vision Dashboard - Data last updated: {lastUpdateTime.toLocaleString()}</p>
          <p className="text-xs mt-1">Next scheduled update: {nextUpdateTime.toLocaleString()}</p>
          <p className="text-xs mt-1">Powered by Cursor AI technology</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
