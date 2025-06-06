
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { Clock, RefreshCw, AlertTriangle, LogIn, LogOut, Database } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { useAuth } from '../context/AuthContext';
import { imdApiService, IMDRegionData } from '../services/imdApiService';
import Header from '../components/Header';
import RegionSelector from '../components/RegionSelector';
import Map from '../components/map/Map';
import MapControls from '../components/map/MapControls';
import FloodStats from '../components/FloodStats';
import ChartSection from '../components/ChartSection';
import PredictionCard from '../components/PredictionCard';
import HistoricalFloodData from '../components/HistoricalFloodData';
import CursorAiIndicator from '../components/CursorAiIndicator';

const Index = () => {
  // Centralized state management
  const [aggregatedFloodData, setAggregatedFloodData] = useState<IMDRegionData[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<L.LatLngExpression>([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState<number>(5);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const [nextUpdateTime, setNextUpdateTime] = useState<Date>(new Date(Date.now() + 12 * 60 * 60 * 1000));
  const [dataFreshness, setDataFreshness] = useState<'fresh' | 'stale' | 'updating'>('updating');
  const [showHistoricalData, setShowHistoricalData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Data fetching
  const loadFloodData = useCallback(async (forceRefresh = false) => {
    setDataFreshness('updating');
    if (forceRefresh) {
      setIsRefreshing(true);
    }
    setError(null);

    try {
      const data = await imdApiService.fetchAggregatedFloodData();
      setAggregatedFloodData(data);

      // Set initial map/dropdown state if no selection exists
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
      const errorMessage = `Could not fetch the latest flood data: ${error.message || "Unknown error"}. Please ensure your Supabase connection and data ingestion are correct.`;
      setError(errorMessage);
      toast({
        title: forceRefresh ? "Refresh Failed" : "Error Loading Data",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
      setDataFreshness('stale');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedState, selectedDistrict, toast]);

  // Initial data fetch and geolocation
  useEffect(() => {
    loadFloodData(false);

    // Geolocation
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (err) => {
          console.warn(`Geolocation Error(${err.code}): ${err.message}. User location will not be displayed on map.`);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }, [loadFloodData]);

  // Derived data for UI
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

  const displayRegionData = useMemo(() => {
    return aggregatedFloodData.find(d => 
      d.district === selectedDistrict && d.state === selectedState
    ) || (aggregatedFloodData.length > 0 ? aggregatedFloodData[0] : null);
  }, [selectedDistrict, selectedState, aggregatedFloodData]);

  const totalRegionsWithData = useMemo(() => {
    return aggregatedFloodData.length;
  }, [aggregatedFloodData]);

  // Event handlers
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
    
    const districtDataForZoom = aggregatedFloodData.find(d => 
      d.district === district && d.state === selectedState
    );
    if (districtDataForZoom) {
      setMapCenter(districtDataForZoom.coordinates);
      setMapZoom(10);
    } else {
      setMapCenter([20.5937, 78.9629]);
      setMapZoom(5);
    }
  }, [aggregatedFloodData, selectedState]);

  const handleZoomIn = useCallback(() => {
    if (mapInstance) mapInstance.zoomIn();
  }, [mapInstance]);

  const handleZoomOut = useCallback(() => {
    if (mapInstance) mapInstance.zoomOut();
  }, [mapInstance]);

  const handleResetView = useCallback(() => {
    if (mapInstance) {
      mapInstance.setView([20.5937, 78.9629], 5, { animate: true });
    }
  }, [mapInstance]);

  const toggleLayerVisibility = useCallback((layerId: string) => {
    console.log(`Toggle layer visibility for: ${layerId} (Feature not implemented yet for markers)`);
  }, []);

  const handleManualRefresh = useCallback(async () => {
    if (isRefreshing) return;
    console.log('Manual refresh triggered');
    await loadFloodData(true);
  }, [isRefreshing, loadFloodData]);

  // Automatic refresh setup
  useEffect(() => {
    const updateInterval = setInterval(() => {
      loadFloodData(true);
    }, 12 * 60 * 60 * 1000); // 12 hours

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

  // Data freshness check
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
    const freshnessInterval = setInterval(checkFreshness, 60000); // 1 minute

    return () => clearInterval(freshnessInterval);
  }, [lastUpdateTime, dataFreshness]);

  // Loading UI
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

  // Error UI
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-red-50 text-red-800 p-8 rounded-lg shadow-xl mx-auto max-w-lg text-center border-2 border-red-300">
        <AlertTriangle size={64} className="mb-6 text-red-600" />
        <p className="text-2xl font-bold mb-3">Application Loading Error</p>
        <p className="text-lg mb-6">{error}</p>
        <Button onClick={() => loadFloodData(true)} className="bg-red-600 hover:bg-red-700 text-white">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry Loading Data
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header with auth */}
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
        
        {/* Region Selector */}
        <RegionSelector 
          selectedState={selectedState}
          setSelectedState={handleStateChange}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={handleDistrictChange}
          availableStates={availableStates}
          availableDistricts={availableDistricts}
        />
        
        {/* Map with controls */}
        <div className="mb-6 relative h-96">
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
            setMapInstance={setMapInstance}
          />
          <MapControls 
            map={mapInstance}
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            handleResetView={handleResetView}
            toggleLayerVisibility={toggleLayerVisibility}
          />
        </div>
        
        {/* Timestamps and refresh controls */}
        <div className="mb-6 flex items-center justify-between flex-wrap">
          <div className="flex items-center mt-3 sm:mt-0 space-x-2">
            <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${dataFreshness === 'stale' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-50 text-gray-700'}`}>
              <Clock className="h-3 w-3 mr-1" />
              Last updated: {lastUpdateTime.toLocaleString()}
            </div>
            {totalRegionsWithData > 0 && (
              <div className="flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
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
        
        {/* Data freshness warning */}
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

        {/* Main content sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            <FloodStats floodData={displayRegionData} />
            <ChartSection selectedRegion={selectedDistrict || 'mumbai'} />
            <PredictionCard floodData={displayRegionData} />
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
                    Analyzing {totalRegionsWithData} reservoir conditions in real-time
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    Last sync: {lastUpdateTime.toLocaleTimeString()}
                  </p>
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
        
        {/* Historical data toggle */}
        <div className="mb-4">
          <Button 
            variant="outline"
            onClick={() => setShowHistoricalData(!showHistoricalData)}
            className="w-full"
          >
            {showHistoricalData ? "Hide Historical Data" : "Show Historical Flood Data (2015-2025)"}
          </Button>
        </div>
        
        {/* Historical data section */}
        {showHistoricalData && <HistoricalFloodData />}
        
        {/* Footer */}
        <div className="text-center text-sm rounded-lg bg-white p-4 shadow-sm mb-6">
          <h3 className="font-medium mb-2">Official Data Sources</h3>
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            <a href="https://mausam.imd.gov.in/" target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-blue-100 rounded text-xs hover:bg-blue-200">
              Weather Services
            </a>
            <a href="https://cwc.gov.in/" target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200">
              Water Resources
            </a>
            <a href="https://ndma.gov.in/" target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200">
              Disaster Management
            </a>
            <a href="https://cursor.ai/" target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-indigo-100 rounded text-xs hover:bg-indigo-200">
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
