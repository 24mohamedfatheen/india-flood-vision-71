
import React from 'react';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import FloodMap from './FloodMap';

const Map: React.FC<{ 
  selectedRegion: string; 
  className?: string;
  aspectRatio?: number;
  selectedState?: string;
  selectedDistrict?: string;
}> = ({ 
  selectedRegion, 
  className = "",
  aspectRatio = 16/9,
  selectedState,
  selectedDistrict
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <AspectRatio ratio={aspectRatio} className="w-full">
        <div className="w-full h-full">
          <FloodMap />
        </div>
      </AspectRatio>
      
      <div className="absolute bottom-4 right-4 z-10">
        <Link to="/evacuation-plan">
          <Button className="bg-red-600 hover:bg-red-700 text-white shadow-lg">
            <Navigation className="mr-2 h-4 w-4" />
            Emergency Evacuation Plan
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Map;
