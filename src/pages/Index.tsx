
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import RegionSelector from '../components/RegionSelector';
import Map from '../components/Map';
import FloodStats from '../components/FloodStats';
import ChartSection from '../components/ChartSection';
import PredictionCard from '../components/PredictionCard';
import { getFloodDataForRegion } from '../data/floodData';
import { useToast } from '../hooks/use-toast';

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useState('mumbai');
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const floodData = getFloodDataForRegion(selectedRegion);
  const { toast } = useToast();

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
  };
  
  // Set up data refresh every 12 hours
  useEffect(() => {
    // Initial data load
    setLastUpdateTime(new Date());
    
    // Set interval for updates (every 12 hours)
    const updateInterval = setInterval(() => {
      // In a real app, you would fetch fresh data here
      const now = new Date();
      setLastUpdateTime(now);
      
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Header />
        
        <RegionSelector 
          selectedRegion={selectedRegion}
          onRegionChange={handleRegionChange}
        />
        
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
        
        <footer className="text-center text-sm text-muted-foreground py-4 border-t mt-6">
          <p>India Flood Vision Dashboard - Data last updated: {lastUpdateTime.toLocaleString()}</p>
          <p className="text-xs mt-1">Live data updates every 12 hours</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
