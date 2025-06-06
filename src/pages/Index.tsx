// src/pages/Index.tsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet'; // Needed for L.LatLngExpression type in map state
import { useToast } from '../hooks/use-toast';
import { Clock, RefreshCw, AlertTriangle, LogIn, LogOut, Database, MapPin } from 'lucide-react'; // Added MapPin for displayRegionData panel

// Import your existing components
import Header from '../components/Header';
// import RegionSelector from '../components/RegionSelector'; // This component's functionality is moved to MapControls
import Map from '../components/map/Map'; // Correct path to your Map component
import MapControls from '../components/map/MapControls'; // Correct path to your MapControls component
import FloodStats from '../components/FloodStats';
import ChartSection from '../components/ChartSection';
import PredictionCard from '../components/PredictionCard';
import HistoricalFloodData from '../components/HistoricalFloodData';
import CursorAiIndicator from '../components/CursorAiIndicator';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton'; // Assuming this is also a shadcn/ui component
import { useAuth } from '../context/AuthContext'; // Your authentication context

// Import the new comprehensive data service
import { imdApiService, IMDRegionData } from './../services/imdApiService'; 

const Index = () => {
  // --- New State for Map and Aggregated Data ---
  const [aggregatedFloodData, setAggregatedFloodData] = useState<IMDRegionData[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<L.LatLngExpression>([20.5937, 78.9629]); // Default center of India
  const [mapZoom, setMapZoom] = useState<number>(5); // Default zoom level
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null); // To hold the Leaflet map instance

  // --- Existing States ---
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const [nextUpdateTime, setNextUpdateTime] = useState<Date>(new Date(Date.now() + 12 * 60 * 60 * 1000));
  const [dataFreshness, setDataFreshness] = useState<'fresh' | 'stale' | 'updating'>('updating');
  const [showHistoricalData, setShowHistoricalData] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Overall page loading
  const [isRefreshing, setIsRefreshing] = useState(false); // Manual refresh specific
  
  // Removed: currentFloodData, floodData (from data/floodData), useReservoirFloodData
  // because imdApiService now handles all fetching and aggregation.

  const { toast } = useToast();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // --- Data Fetching Logic (Unified for Aggregated Data) ---
  const loadFloodData = useCallback(async (forceRefresh = false) => {
    setDataFreshness('updating'); // Always set to updating when fetch starts
    if (forceRefresh) {
      setIsRefreshing(true);
    }
    
    try {
      // Call the comprehensive imdApiService to fetch all aggregated data
      const data = await imdApiService.fetchAggregatedFloodData();
      setAggregatedFloodData(data); // Update the main aggregated data state

      // Set initial map view and dropdowns if data is available and not already set
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
        description: `Could not fetch the latest flood data: ${error.message || 'Unknown error'}`,
        variant: "destructive",
        duration: 5000,
      });
      setDataFreshness('stale');
    } finally {
      setIsLoading(false); // Overall loading done
      setIsRefreshing(false); // Refreshing state done
    }
  }, [selectedState, selectedDistrict, toast]); // Dependencies: ensure state changes trigger re-fetch

  // Initial data fetch on component mount
  useEffect(() => {
    loadFloodData(false);

    // --- Geolocation for User's Current Position ---
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (err) => {
          console.warn(`Geolocation Error(${err.code}): ${err.message}. User location will not be displayed on map.`);
        },
        {enableHighAccuracy: true, timeout: 5000, maximumAge: 0} // Request high accuracy, timeout after 5s
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, [loadFloodData]); // Dependency: loadFloodData to ensure it runs only once correctly

  // --- Dynamic Dropdown Options (Memoized) ---
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

  // --- Dropdown Event Handlers (for MapControls) ---
  // These now also update the map's center and zoom
  const handleStateChange = useCallback((state: string) => {
    setSelectedState(state);
    setSelectedDistrict(''); // Reset district when state changes
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

  // --- Map Control Button Handlers (for MapControls) ---
  const handleZoomIn = useCallback(() => {
    if (mapInstance) mapInstance.zoomIn();
  }, [mapInstance]);

  const handleZoomOut = useCallback(() => {
    if (mapInstance) mapInstance.zoomOut();
  }, [mapInstance]);

  const handleResetView = useCallback(() => {
    if (mapInstance) mapInstance.setView([20.5937, 78.9629], 5, { animate: true });
  }, [mapInstance]);

  // Placeholder for toggleLayerVisibility for MapControls buttons
  const toggleLayerVisibility = useCallback((layerId: string) => {
    console.log(`Toggle layer visibility for: ${layerId} (Feature not implemented yet for markers)`);
    // This function can be expanded later if you add overlay layers for markers.
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
    }, 12 * 60 * 60 * 1000); // 12 hours in milliseconds
    
    // For demo purposes, add a shorter interval to simulate updates (dev mode only)
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: adding demo interval');
      const demoInterval = setTimeout(() => {
        loadFloodData(true);
      }, 60000); // 1 minute for demo
      
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
      } else if (dataFreshness !== 'updating') { // If not updating, set back to fresh if within 12 hours
        setDataFreshness('fresh');
      }
    };
    
    checkFreshness(); // Check freshness initially
    const freshnessInterval = setInterval(checkFreshness, 60000); // Check every minute
    
    return () => clearInterval(freshnessInterval);
  }, [lastUpdateTime, dataFreshness]);

  // --- Derived data for info panels ---
  // This will be passed to FloodStats, PredictionCard, etc.
  const displayRegionData = useMemo(() => {
    return aggregatedFloodData.find(d => 
      d.district === selectedDistrict && d.state === selectedState
    ) || (aggregatedFloodData.length > 0 ? aggregatedFloodData[0] : null);
  }, [selectedDistrict, selectedState, aggregatedFloodData]);

  // Accessing reservoirCount from imdApiService (can be derived from aggregatedFloodData)
  const totalReservoirCount = useMemo(() => {
    // A simple way to count unique reservoir-level entries in the raw data if needed
    // For aggregatedFloodData, it's a count of districts, not individual reservoirs.
    // So for 'live reservoir count', we should refine imdApiService or adjust this display.
    // For now, let's just show how many districts have aggregated data.
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
        
        {/* Region Selector (now integrated into MapControls component, remove direct usage here) */}
        {/* <RegionSelector 
          selectedRegion={selectedRegion}
          onRegionChange={handleRegionChange}
        /> */}
        
        {/* Map and MapControls Section */}
        <div className="mb-6 relative"> {/* Added relative positioning for MapControls absolute positioning */}
          <Map 
            selectedState={selectedState}
            setSelectedState={setSelectedState} 
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict} 
            mapCenter={mapCenter}
            setMapCenter={setMapCenter}
            mapZoom={mapZoom}
            setMapZoom={setMapZoom}
            aggregatedFloodData={aggregatedFloodData}
            userLocation={userLocation}
            setMapInstance={setMapInstance} // Pass the setter for the map instance
          />
          {/* MapControls now placed inside the map container's parent for absolute positioning to work */}
          <MapControls 
            selectedState={selectedState}
            setSelectedState={handleStateChange} // Use the combined handler
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={handleDistrictChange} // Use the combined handler
            availableStates={availableStates}
            availableDistricts={availableDistricts}
            map={mapInstance} // Pass the Leaflet map instance to MapControls
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            handleResetView={handleResetView}
            toggleLayerVisibility={toggleLayerVisibility}
          />
        </div>
        
        {/* Data freshness and refresh button */}
        <div className="mb-6 flex items-center justify-between flex-wrap">
          <div className="flex items-center mt-3 sm:mt-0 space-x-2">
            <div className={`timestamp-badge ${dataFreshness === 'stale' ? 'bg-yellow-50 text-yellow-700' : ''}`}>
              <Clock className="h-3 w-3 mr-1" />
              Last updated: {lastUpdateTime.toLocaleString()}
            </div>
            {/* Show total districts with data as 'live reservoir' count, instead of actual reservoir count */}
            {totalReservoirCount > 0 && (
              <div className="timestamp-badge bg-blue-50 text-blue-700">
                <Database className="h-3 w-3 mr-1" />
                Live: {totalReservoirCount} regions
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

        {/* Removed reservoirError check, as imdApiService handles its own errors now */}
        {/* The overall `error` state now covers data fetching issues */}

        {/* Updated layout: content sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Left side content */}
            {/* Pass displayRegionData to FloodStats and PredictionCard */}
            <FloodStats floodData={displayRegionData} />
            <ChartSection selectedRegion={selectedDistrict} /> {/* ChartSection likely uses district name */}
            <PredictionCard floodData={displayRegionData} />
          </div>
            
          {/* Right side content - additional info, no map here anymore */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-2">Flood Risk Information</h2>
                
              {totalReservoirCount > 0 && (
                <div className="mb-4 p-2 bg-blue-50 rounded">
                  <p className="text-xs text-blue-700 font-medium">
                    ✓ Live Data Active
                  </p>
                  <p className="text-xs text-blue-600">
                    Analyzing {totalReservoirCount} regions with reservoir conditions
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
