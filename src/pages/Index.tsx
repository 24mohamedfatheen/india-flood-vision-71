
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ReservoirSelector from '../components/ReservoirSelector';
import Map from '../components/Map';
import FloodStats from '../components/FloodStats';
import ChartSection from '../components/ChartSection';
import PredictionCard from '../components/PredictionCard';
import HistoricalFloodData from '../components/HistoricalFloodData';
import { getFloodDataForRegion, fetchImdData, floodData } from '../data/floodData';
import { useReservoirFloodData } from '../hooks/useReservoirFloodData';
import { useToast } from '../hooks/use-toast';
import { Clock, RefreshCw, AlertTriangle, LogIn, LogOut, Database, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import CursorAiIndicator from '../components/CursorAiIndicator';

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useState('mumbai');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedReservoir, setSelectedReservoir] = useState<string>('');
  const [locationData, setLocationData] = useState<any>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const [nextUpdateTime, setNextUpdateTime] = useState<Date>(new Date(Date.now() + 12 * 60 * 60 * 1000));
  const [dataFreshness, setDataFreshness] = useState<'fresh' | 'stale' | 'updating'>('updating');
  const [showHistoricalData, setShowHistoricalData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentFloodData, setCurrentFloodData] = useState(floodData);
  
  const { toast } = useToast();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  // Use the reservoir flood data hook
  const { 
    isLoading: reservoirLoading, 
    error: reservoirError, 
    updateFloodDataWithReservoirs,
    lastUpdated: reservoirLastUpdated,
    reservoirCount
  } = useReservoirFloodData();

  // Get current region's flood data
  const floodDataForRegion = getFloodDataForRegion(selectedRegion);
  const enhancedFloodData = floodDataForRegion ? 
    updateFloodDataWithReservoirs([floodDataForRegion])[0] : null;

  // Handle location data from ReservoirSelector with enhanced data structure
  const handleLocationData = useCallback((data: { 
    coordinates: [number, number], 
    rainfall: any, 
    state: string, 
    district: string,
    reservoirName: string
  }) => {
    setLocationData(data);
    setSelectedState(data.state);
    setSelectedDistrict(data.district);
    setSelectedReservoir(data.reservoirName);
    console.log('📍 Location data updated:', data);
    
    // Trigger reactive updates for dependent components
    setDataFreshness('fresh');
    setLastUpdateTime(new Date());
    
    toast({
      title: "Reservoir Selected",
      description: `Now showing data for ${data.reservoirName} in ${data.district}, ${data.state}`,
      duration: 3000,
    });
  }, [toast]);

  // Handle region change
  const handleRegionChange = useCallback((region: string) => {
    setSelectedRegion(region);
  }, []);

  // Data fetching function with error handling
  const loadFloodData = useCallback(async (forceRefresh = false) => {
    const currentState = forceRefresh ? 'updating' : dataFreshness;
    setDataFreshness(currentState);
    
    if (forceRefresh) {
      setIsRefreshing(true);
    }
    
    try {
      await fetchImdData(forceRefresh);
      
      const updatedFloodData = updateFloodDataWithReservoirs(floodData);
      setCurrentFloodData(updatedFloodData);
      
      const now = new Date();
      setLastUpdateTime(now);
      setNextUpdateTime(new Date(now.getTime() + 12 * 60 * 60 * 1000));
      setDataFreshness('fresh');
      
      if (forceRefresh) {
        toast({
          title: "Data refreshed",
          description: `Latest flood data with ${reservoirCount} reservoir conditions updated at ${now.toLocaleString()}`,
          duration: 5000,
        });
      } else {
        toast({
          title: "Data Loaded",
          description: `Flood data with live reservoir conditions loaded at ${now.toLocaleString()}`,
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("❌ Error loading data:", error);
      toast({
        title: forceRefresh ? "Refresh Failed" : "Error Loading Data",
        description: "Could not fetch the latest flood and reservoir data. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      setDataFreshness('stale');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [toast, dataFreshness, updateFloodDataWithReservoirs, reservoirCount]);
  
  // Initial data fetch
  useEffect(() => {
    loadFloodData(false);
  }, [loadFloodData]);

  // Update flood data when reservoir data changes
  useEffect(() => {
    if (!reservoirLoading) {
      const updatedFloodData = updateFloodDataWithReservoirs(floodData);
      setCurrentFloodData(updatedFloodData);
    }
  }, [reservoirLoading, updateFloodDataWithReservoirs]);

  // Reactive updates when location data changes
  useEffect(() => {
    if (locationData) {
      console.log('🔄 Triggering reactive updates for location data:', locationData);
      setLastUpdateTime(new Date());
    }
  }, [locationData]);
  
  const handleManualRefresh = async () => {
    if (isRefreshing) return;
    
    console.log('🔄 Manual refresh triggered');
    await loadFloodData(true);
  };
  
  // Auto-refresh setup
  useEffect(() => {
    const updateInterval = setInterval(() => {
      loadFloodData(true);
    }, 12 * 60 * 60 * 1000);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Development mode: adding demo interval');
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

  // Check data freshness
  useEffect(() => {
    const checkFreshness = () => {
      const now = new Date();
      const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
      
      if (lastUpdateTime < twelveHoursAgo) {
        setDataFreshness('stale');
      }
    };
    
    checkFreshness();
    const freshnessInterval = setInterval(checkFreshness, 60000);
    
    return () => clearInterval(freshnessInterval);
  }, [lastUpdateTime]);

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
        
        {/* Enhanced Reservoir Selector with dynamic data */}
        <ReservoirSelector 
          selectedRegion={selectedRegion}
          onRegionChange={handleRegionChange}
          onLocationData={handleLocationData}
        />
        
        {/* Map positioned between selector and controls */}
        <div className="mb-6">
          <Map 
            selectedRegion={selectedRegion}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            className="w-full"
            aspectRatio={16/9}
          />
        </div>
        
        <div className="mb-6 flex items-center justify-between flex-wrap">
          <div className="flex items-center mt-3 sm:mt-0 space-x-2">
            <div className={`timestamp-badge ${dataFreshness === 'stale' ? 'bg-yellow-50 text-yellow-700' : ''}`}>
              <Clock className="h-3 w-3 mr-1" />
              Last updated: {lastUpdateTime.toLocaleString()}
            </div>
            {reservoirCount > 0 && (
              <div className="timestamp-badge bg-blue-50 text-blue-700">
                <Database className="h-3 w-3 mr-1" />
                Live: {reservoirCount} reservoirs
              </div>
            )}
            {locationData?.coordinates && (
              <div className="timestamp-badge bg-green-50 text-green-700">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="text-xs">{selectedReservoir}</span>
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

        {reservoirError && (
          <div className="mb-4 bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-orange-400 mt-0.5 mr-2" />
              <div>
                <h3 className="font-medium text-orange-800">Live reservoir data unavailable</h3>
                <p className="text-sm text-orange-700">
                  Using historical flood data. Live reservoir conditions could not be loaded.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-medium">Loading flood data...</p>
            <p className="text-sm text-muted-foreground mt-2">Analyzing live reservoir conditions and weather data</p>
          </div>
        ) : (
          <>
            {/* Clean Grid Layout for 4 Main Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Location Information & Current Conditions */}
              <div className="space-y-6">
                {enhancedFloodData ? (
                  <FloodStats floodData={enhancedFloodData} />
                ) : (
                  <div className="bg-white rounded-lg border p-6">
                    <h2 className="text-lg font-semibold mb-2">Location Information</h2>
                    {locationData ? (
                      <div>
                        <p className="text-gray-700 mb-2">🏞️ Selected Reservoir:</p>
                        <p className="font-medium">{selectedReservoir}</p>
                        <p className="text-sm text-gray-600 mt-1">{selectedDistrict}, {selectedState}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Coordinates: {locationData.coordinates[0].toFixed(4)}, {locationData.coordinates[1].toFixed(4)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500">Please select a reservoir to view flood data.</p>
                    )}
                  </div>
                )}
                
                {enhancedFloodData ? (
                  <PredictionCard floodData={enhancedFloodData} />
                ) : (
                  <div className="bg-white rounded-lg border p-6">
                    <h2 className="text-lg font-semibold mb-2">Current Conditions</h2>
                    <p className="text-gray-500">Select a reservoir to view current flood conditions.</p>
                  </div>
                )}
              </div>
              
              {/* Historical Rainfall & AI Flood Forecast */}
              <div className="space-y-6">
                <ChartSection 
                  selectedRegion={selectedRegion} 
                  locationData={locationData}
                />
              </div>
            </div>
            
            {/* Information Panel */}
            <div className="bg-white rounded-lg border p-6 mb-6">
              <h2 className="text-lg font-medium mb-4">Dynamic Flood Risk Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reservoirCount > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 font-medium">
                      ✓ Live Reservoir Data
                    </p>
                    <p className="text-xs text-blue-600">
                      Analyzing {reservoirCount} reservoir conditions from Supabase
                    </p>
                    {reservoirLastUpdated && (
                      <p className="text-xs text-blue-500 mt-1">
                        Last sync: {reservoirLastUpdated.toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                )}
                
                {locationData?.rainfall && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">
                      ✓ Weather Data Loaded
                    </p>
                    <p className="text-xs text-green-600">
                      Historical and forecast rainfall data for {selectedReservoir}
                    </p>
                  </div>
                )}
                
                {locationData && (
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-700 font-medium">
                      ✓ Location Resolved
                    </p>
                    <p className="text-xs text-purple-600">
                      {selectedReservoir} geocoded dynamically using OpenStreetMap
                    </p>
                  </div>
                )}
                
                <div className="p-4 bg-gray-50 rounded-lg">
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
            
            <div className="mb-4">
              <Button 
                variant="outline"
                onClick={() => setShowHistoricalData(!showHistoricalData)}
                className="w-full"
              >
                {showHistoricalData ? "Hide Historical Data" : "Show Historical Flood Data (2015-2025)"}
              </Button>
            </div>
            
            {showHistoricalData && <HistoricalFloodData />}
          </>
        )}
        
        <div className="text-center text-sm rounded-lg bg-white p-4 shadow-sm mb-6">
          <h3 className="font-medium mb-2">Dynamic Data Sources</h3>
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            <div className="data-source-badge bg-blue-100">
              Supabase (Reservoir Data)
            </div>
            <div className="data-source-badge">
              OpenStreetMap (Geocoding)
            </div>
            <div className="data-source-badge">
              Open-Meteo (Weather API)
            </div>
            <a href="https://mausam.imd.gov.in/" target="_blank" rel="noopener noreferrer" className="data-source-badge bg-blue-100">
              Weather Services
            </a>
            <a href="https://cwc.gov.in/" target="_blank" rel="noopener noreferrer" className="data-source-badge">
              Water Resources
            </a>
            <a href="https://ndma.gov.in/" target="_blank" rel="noopener noreferrer" className="data-source-badge">
              Disaster Management
            </a>
            <a href="https://cursor.ai/" target="_blank" rel="noopener noreferrer" className="data-source-badge bg-indigo-100">
              Cursor AI
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            All flood predictions are based on live reservoir data from Supabase, dynamically geocoded locations, and real-time weather APIs.
          </p>
        </div>
        
        <footer className="text-center text-sm text-muted-foreground py-4 border-t mt-6">
          <p>India Flood Vision Dashboard - Data last updated: {lastUpdateTime.toLocaleString()}</p>
          <p className="text-xs mt-1">Next scheduled update: {nextUpdateTime.toLocaleString()}</p>
          <p className="text-xs mt-1">Powered by dynamic location resolution and real-time APIs</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
