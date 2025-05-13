
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const IMDSourceInfo = () => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
      <h2 className="text-lg font-semibold mb-3 text-primary">IMD Data Source Integration</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-md font-medium mb-2">About the Data Source</h3>
          <p className="text-sm text-muted-foreground mb-3">
            The India Flood Vision Dashboard now pulls data directly from the India Meteorological Department (IMD) APIs. 
            This data is organized by states and districts to provide localized flood information and warnings.
          </p>
          
          <h4 className="text-sm font-medium mb-1">Data Organization</h4>
          <p className="text-sm text-muted-foreground mb-3">
            All flood information is now structured according to:
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground mb-4">
            <li>State: Administrative state in India</li>
            <li>District: Specific district within the state</li>
            <li>Region: Urban center or area within the district</li>
          </ul>
          
          <div className="bg-blue-50 p-3 rounded-md mb-4">
            <h4 className="text-sm font-medium text-blue-700 mb-1">IMD Data Refresh Schedule</h4>
            <p className="text-xs text-blue-600">
              • Automatic updates every 12 hours<br />
              • Manual refresh available<br />
              • Last updated timestamp shown in dashboard
            </p>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium mb-2">Data Flow Architecture</h3>
          <div className="border border-border p-2 rounded-md mb-4">
            <AspectRatio ratio={16/9} className="bg-muted">
              <div className="h-full w-full flex flex-col">
                <div className="bg-blue-100 text-blue-800 font-medium text-sm p-2 text-center border-b border-blue-200">
                  IMD Data API
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-2 gap-2">
                  <div className="w-3/4 h-2 bg-blue-200 rounded"></div>
                  <div className="w-3/4 h-2 bg-blue-200 rounded"></div>
                  <div className="w-3/4 h-2 bg-blue-200 rounded"></div>
                </div>
                <div className="flex justify-center">
                  <div className="bg-blue-50 border border-blue-200 w-8 h-8 flex items-center justify-center rounded-full text-blue-500">⬇</div>
                </div>
                <div className="bg-green-100 text-green-800 font-medium text-sm p-2 text-center border-t border-green-200">
                  Data Processing Layer
                </div>
                <div className="flex-1 flex items-center justify-center p-1">
                  <div className="grid grid-cols-3 gap-1 w-full">
                    <div className="bg-green-50 text-green-700 text-xs p-1 rounded border border-green-200 text-center">State</div>
                    <div className="bg-green-50 text-green-700 text-xs p-1 rounded border border-green-200 text-center">District</div>
                    <div className="bg-green-50 text-green-700 text-xs p-1 rounded border border-green-200 text-center">Data</div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="bg-green-50 border border-green-200 w-8 h-8 flex items-center justify-center rounded-full text-green-500">⬇</div>
                </div>
                <div className="bg-purple-100 text-purple-800 font-medium text-sm p-2 text-center">
                  Dashboard Visualization
                </div>
              </div>
            </AspectRatio>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-50 p-3 rounded-md">
              <h4 className="text-xs font-medium text-green-700 mb-1">Data Coverage</h4>
              <p className="text-xs text-green-600">
                17 major urban centers across India with detailed district-level metrics
              </p>
            </div>
            <div className="bg-amber-50 p-3 rounded-md">
              <h4 className="text-xs font-medium text-amber-700 mb-1">Update Frequency</h4>
              <p className="text-xs text-amber-600">
                Every 12 hours with real-time manual refresh capability
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IMDSourceInfo;
