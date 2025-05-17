
import React from 'react';
import { CloudRain } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground py-4 px-4 md:px-6 mb-6 rounded-lg shadow-sm">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <CloudRain className="mr-2 h-8 w-8" />
          <h1 className="text-2xl font-bold">India Flood Vision</h1>
        </div>
        <div className="text-sm md:text-base">
          <p className="font-medium">Real-time flood monitoring and prediction</p>
          <p className="text-primary-foreground/80 text-xs md:text-sm">Last updated: May 8, 2025</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
