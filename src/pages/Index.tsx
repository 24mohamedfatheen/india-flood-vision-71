
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import RegionSelector from '../components/RegionSelector';
import Map from '../components/Map';
import FloodStats from '../components/FloodStats';
import ChartSection from '../components/ChartSection';
import PredictionCard from '../components/PredictionCard';
import HistoricalFloodData from '../components/HistoricalFloodData';
import { getFloodDataForRegion } from '../data/floodData';
import { useToast } from '../hooks/use-toast';
import { Clock, RefreshCw, AlertTriangle, LogIn, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useState('mumbai');
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const [nextUpdateTime, setNextUpdateTime] = useState<Date>(new Date(Date.now() + 12 * 60 * 60 * 1000));
  const [dataFreshness, setDataFreshness] = useState<'fresh' | 'stale' | 'updating'>('fresh');
  const [showHistoricalData, setShowHistoricalData] = useState(false);
  const floodData = getFloodDataForRegion(selectedRegion);
  const { toast } = useToast();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
  };
  
  const handleManualRefresh = () => {
    setDataFreshness('updating');
    
    // Simulate a data refresh
    setTimeout(() => {
      const now = new Date();
      setLastUpdateTime(now);
      setNextUpdateTime(new Date(now.getTime() + 12 * 60 * 60 * 1000));
      setDataFreshness('fresh');
      
      toast({
        title: "Data refreshed",
        description: `Latest flood data updated at ${now.toLocaleString()}`,
        duration: 5000,
      });
    }, 1500); // Simulate network delay
  };
  
  // Set up data refresh every 12 hours
  useEffect(() => {
    // Initial data load
    setLastUpdateTime(new Date());
    setNextUpdateTime(new Date(Date.now() + 12 * 60 * 60 * 1000));
    
    // Set interval for updates (every 12 hours)
    const updateInterval = setInterval(() => {
      // In a real app, you would fetch fresh data here
      const now = new Date();
      setLastUpdateTime(now);
      setNextUpdateTime(new Date(now.getTime() + 12 * 60 * 60 * 1000));
      setDataFreshness('fresh');
      
      // Show toast notification when data is updated
      toast({
        title: "Flood data updated",
        description: `Latest data as of ${now.toLocaleString()}`,
        duration: 5000,
      });
      
      console.log("Data updated at:", now);
    }, 12 * 60 * 60 * 1000); // 12 hours in milliseconds
    
    // For demo purposes, add a shorter interval to simulate updates
    if (process.env.NODE_ENV === 'development') {
      const demoInterval = setTimeout(() => {
        const now = new Date();
        setLastUpdateTime(now);
        setNextUpdateTime(new Date(now.getTime() + 12 * 60 * 60 * 1000));
        
        toast({
          title: "Demo update",
          description: `Latest flood data as of ${now.toLocaleString()}`,
          duration: 5000,
        });
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
              Refresh
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
        
        <Map selectedRegion={selectedRegion} />
        
        <FloodStats floodData={floodData} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <ChartSection selectedRegion={selectedRegion} />
          </div>
          <div>
            <PredictionCard floodData={floodData} />
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
            <a href="https://mausam.imd.gov.in/" target="_blank" rel="noopener noreferrer" className="data-source-badge">
              IMD (India Meteorological Department)
            </a>
            <a href="https://cwc.gov.in/" target="_blank" rel="noopener noreferrer" className="data-source-badge">
              CWC (Central Water Commission)
            </a>
            <a href="https://ndma.gov.in/" target="_blank" rel="noopener noreferrer" className="data-source-badge">
              NDMA (National Disaster Management Authority)
            </a>
            <a href="https://chennaimetrowater.tn.gov.in/" target="_blank" rel="noopener noreferrer" className="data-source-badge">
              CMWSSB (Chennai Water Supply)
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            All flood predictions and warnings are based on data from these official sources. Updates occur every 12 hours.
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
