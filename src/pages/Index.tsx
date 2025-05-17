
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import RegionSelector from '../components/RegionSelector';
import Map from '../components/Map';
import FloodStats from '../components/FloodStats';
import ChartSection from '../components/ChartSection';
import PredictionCard from '../components/PredictionCard';
import HistoricalFloodData from '../components/HistoricalFloodData';
import DataSourceInfo from '../components/DataSourceInfo';
import { getFloodDataForRegion } from '../data/floodData';
import { LogIn, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useState('mumbai');
  const [showHistoricalData, setShowHistoricalData] = useState(false);
  const floodData = getFloodDataForRegion(selectedRegion);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
  };

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
        </div>
        
        {/* Add Data Source Info at the top */}
        <DataSourceInfo />
        
        {/* Map in the center */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Flood Risk Map</h2>
          <Map 
            selectedRegion={selectedRegion} 
            className="mb-4"
            aspectRatio={16/9}
          />
          
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Risk Levels</h3>
            <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
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
        
        {/* Content below the map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Left side content */}
            <FloodStats floodData={floodData} />
            <ChartSection selectedRegion={selectedRegion} />
          </div>
          
          {/* Right side content */}
          <div className="lg:col-span-1">
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
            All flood predictions and warnings are based on official meteorological and hydrological data.
          </p>
        </div>
        
        <footer className="text-center text-sm text-muted-foreground py-4 border-t mt-6">
          <p>India Flood Vision Dashboard</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
