
import React, { useState } from 'react';
import Header from '../components/Header';
import RegionSelector from '../components/RegionSelector';
import Map from '../components/Map';
import FloodStats from '../components/FloodStats';
import ChartSection from '../components/ChartSection';
import PredictionCard from '../components/PredictionCard';
import { getFloodDataForRegion } from '../data/floodData';

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useState('mumbai');
  const floodData = getFloodDataForRegion(selectedRegion);

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
  };

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
          <p>India Flood Vision Dashboard - Data is simulated for demonstration purposes</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
