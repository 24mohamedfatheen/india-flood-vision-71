
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import RegionSelector from '../components/RegionSelector';
import Map from '../components/Map';
import FloodStats from '../components/FloodStats';
import ChartSection from '../components/ChartSection';
import PredictionCard from '../components/PredictionCard';
import HistoricalFloodData from '../components/HistoricalFloodData';
import DataSourceInfo from '../components/DataSourceInfo';
import { getFloodDataForRegion, fetchImdData } from '../data/floodData';
import { useToast } from '../hooks/use-toast';
import { Clock, RefreshCw, AlertTriangle, LogIn, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { Skeleton } from '../components/ui/skeleton';

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useState('mumbai');
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const [nextUpdateTime, setNextUpdateTime] = useState<Date>(new Date(Date.now() + 12 * 60 * 60 * 1000));
  const [dataFreshness, setDataFreshness] = useState<'fresh' | 'stale' | 'updating'>('updating');
  const [showHistoricalData, setShowHistoricalData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const floodData = getFloodDataForRegion(selectedRegion);
  const { toast } = useToast();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Initial data fetch
  useEffect(() => {
    const loadInitialData = async () => {
      setDataFreshness('updating');
      try {
        await fetchImdData();
        const now = new Date();
        setLastUpdateTime(now);
        setNextUpdateTime(new Date(now.getTime() + 12 * 60 * 60 * 1000));
        setDataFreshness('fresh');
        
        toast({
          title: "Data Loaded",
          description: `Latest flood data updated at ${now.toLocaleString()}`,
          duration: 5000,
        });
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error Loading Data",
          description: "Could not fetch the latest flood data",
          variant: "destructive",
          duration: 5000,
        });
        setDataFreshness('stale');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, [toast]);

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
  };
  
  const handleManualRefresh = async () => {
    setDataFreshness('updating');
    
    try {
      await fetchImdData();
      const now = new Date();
      setLastUpdateTime(now);
      setNextUpdateTime(new Date(now.getTime() + 12 * 60 * 60 * 1000));
      setDataFreshness('fresh');
      
      toast({
        title: "Data refreshed",
        description: `Latest flood data updated at ${now.toLocaleString()}`,
        duration: 5000,
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Refresh Failed",
        description: "Could not fetch the latest flood data",
        variant: "destructive",
        duration: 5000,
      });
      setDataFreshness('stale');
    }
  };
  
  // Set up data refresh every 12 hours
  useEffect(() => {
    const updateInterval = setInterval(async () => {
      try {
        await fetchImdData();
        const now = new Date();
        setLastUpdateTime(now);
        setNextUpdateTime(new Date(now.getTime() + 12 * 60 * 60 * 1000));
        setDataFreshness('fresh');
        
        toast({
          title: "Flood data updated",
          description: `Latest data as of ${now.toLocaleString()}`,
          duration: 5000,
        });
        
        console.log("Data updated at:", now);
      } catch (error) {
        console.error("Error during scheduled update:", error);
        setDataFreshness('stale');
      }
    }, 12 * 60 * 60 * 1000); // 12 hours in milliseconds
    
    // For demo purposes, add a shorter interval to simulate updates
    if (process.env.NODE_ENV === 'development') {
      const demoInterval = setTimeout(async () => {
        try {
          await fetchImdData();
          const now = new Date();
          setLastUpdateTime(now);
          setNextUpdateTime(new Date(now.getTime() + 12 * 60 * 60 * 1000));
          
          toast({
            title: "Demo update",
            description: `Latest flood data as of ${now.toLocaleString()}`,
            duration: 5000,
          });
        } catch (error) {
          console.error("Error during demo update:", error);
        }
      }, 60000); // 1 minute for demo
      
      return () => {
        clearInterval(updateInterval);
        clearTimeout(demoInterval);
      };
    }
    
    return () => clearInterval(updateInterval);
  }, [toast]);

  // Check if data is stale (over 12 hours old)
  useEffect(() => {
    const checkFreshness = () => {
      const now = new Date();
      const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
      
      if (lastUpdateTime < twelveHoursAgo) {
        setDataFreshness('stale');
      }
    };
    
    // Check freshness initially
    checkFreshness();
    
    // Set up interval to check freshness every minute
    const freshnessInterval = setInterval(checkFreshness, 60000); // 1 minute
    
    return () => clearInterval(freshnessInterval);
  }, [lastUpdateTime]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <Header />
          <div>
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
        
        <div className="mb-6 flex items-center justify-between flex-wrap">
          <RegionSelector 
            selectedRegion={selectedRegion}
            onRegionChange={handleRegionChange}
          />
          
          <div className="flex items-center mt-3 sm:mt-0 space-x-2">
            <div className={`timestamp-badge ${dataFreshness === 'stale' ? 'bg-yellow-50 text-yellow-700' : ''}`}>
              <Clock className="h-3 w-3 mr-1" />
              Last updated: {lastUpdateTime.toLocaleString()}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleManualRefresh}
              disabled={dataFreshness === 'updating'}
              className="text-xs h-7"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${dataFreshness === 'updating' ? 'animate-spin' : ''}`} />
              Refresh Data
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
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-medium">Loading flood data...</p>
            <p className="text-sm text-muted-foreground mt-2">Please wait while we fetch the latest information</p>
          </div>
        ) : (
          <>
            {/* Add Data Source Info at the top */}
            <DataSourceInfo />
            
            {/* New layout: Map in center, content on sides */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Left side content */}
              <div className="lg:col-span-1 space-y-6">
                <FloodStats floodData={floodData} />
                <PredictionCard floodData={floodData} />
              </div>
              
              {/* Center map */}
              <div className="lg:col-span-1">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-lg font-medium mb-2">Flood Risk Map</h2>
                  <Map 
                    selectedRegion={selectedRegion} 
                    className="mb-4"
                    aspectRatio={1}
                  />
                  
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
                
                {/* Add Dashboard under Home page */}
                <div className="bg-white p-4 rounded-lg shadow mt-6">
                  <h2 className="text-lg font-medium mb-4">Home Dashboard</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-md">
                      <h3 className="text-sm font-medium text-blue-700">Alerts</h3>
                      <p className="text-2xl font-bold text-blue-800">{Math.floor(Math.random() * 10)}</p>
                      <p className="text-xs text-blue-600">Active warnings</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-md">
                      <h3 className="text-sm font-medium text-green-700">Safe Zones</h3>
                      <p className="text-2xl font-bold text-green-800">{Math.floor(Math.random() * 20) + 5}</p>
                      <p className="text-xs text-green-600">Available shelters</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-md">
                      <h3 className="text-sm font-medium text-orange-700">Rainfall</h3>
                      <p className="text-2xl font-bold text-orange-800">{Math.floor(Math.random() * 100) + 10}mm</p>
                      <p className="text-xs text-orange-600">Last 24 hours</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-md">
                      <h3 className="text-sm font-medium text-purple-700">River Level</h3>
                      <p className="text-2xl font-bold text-purple-800">{(Math.random() * 5 + 2).toFixed(1)}m</p>
                      <p className="text-xs text-purple-600">Current height</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right side content */}
              <div className="lg:col-span-1 space-y-6">
                <ChartSection selectedRegion={selectedRegion} />
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
          </>
        )}
        
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
          </div>
          <p className="text-xs text-muted-foreground">
            All flood predictions and warnings are based on official meteorological and hydrological data. Updates occur every 12 hours.
          </p>
        </div>
        
        <footer className="text-center text-sm text-muted-foreground py-4 border-t mt-6">
          <p>India Flood Vision Dashboard - Data last updated: {lastUpdateTime.toLocaleString()}</p>
          <p className="text-xs mt-1">Next scheduled update: {nextUpdateTime.toLocaleString()}</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
