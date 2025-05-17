
import React from 'react';
import { Database, MapPin, RefreshCw, Clock } from 'lucide-react';
import { Separator } from './ui/separator';

const DataSourceInfo = () => {
  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
      <h2 className="text-lg font-medium flex items-center mb-2">
        <Database className="mr-2 h-5 w-5 text-primary" />
        About Our Data
      </h2>
      
      <p className="text-sm text-muted-foreground mb-3">
        The India Flood Vision Dashboard pulls data directly from official meteorological APIs. 
        This data is organized by states and districts to provide localized flood information and warnings.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
        <div>
          <h3 className="text-sm font-medium mb-1 flex items-center">
            <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
            Data Organization
          </h3>
          <ul className="text-xs text-muted-foreground list-disc pl-5">
            <li>State: Administrative state in India</li>
            <li>District: Specific district within the state</li>
            <li>Region: Urban center or area within the district</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-1 flex items-center">
            <RefreshCw className="mr-1 h-4 w-4 text-muted-foreground" />
            Data Refresh Schedule
          </h3>
          <ul className="text-xs text-muted-foreground list-disc pl-5">
            <li>Automatic updates every 12 hours</li>
            <li>Manual refresh available</li>
            <li>Last updated timestamp shown in dashboard</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-1 flex items-center">
            <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
            Update Frequency
          </h3>
          <ul className="text-xs text-muted-foreground list-disc pl-5">
            <li>Every 12 hours with real-time manual refresh capability</li>
            <li>Coverage for 17 major urban centers across India</li>
          </ul>
        </div>
      </div>
      
      <Separator className="my-3" />
      
      <div className="text-xs text-muted-foreground">
        <h3 className="font-medium mb-1">Data Flow Architecture</h3>
        <div className="flex items-center justify-center text-center">
          <div className="space-y-1">
            <div className="bg-blue-50 px-2 py-1 rounded">Weather Data API</div>
            <div className="text-muted-foreground">⬇</div>
            <div className="bg-blue-50 px-2 py-1 rounded">Data Processing Layer</div>
            <div className="text-xs opacity-70">(State | District | Data)</div>
            <div className="text-muted-foreground">⬇</div>
            <div className="bg-blue-50 px-2 py-1 rounded">Dashboard Visualization</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSourceInfo;
