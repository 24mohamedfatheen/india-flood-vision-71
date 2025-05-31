
import React, { useState } from 'react';
import { useReservoirData } from '../hooks/useReservoirData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { RefreshCw, Droplets, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const LiveReservoirData: React.FC = () => {
  const { processedReservoirs, isLoading, error, refetch, fetchByState } = useReservoirData();
  const [selectedState, setSelectedState] = useState<string>('all');

  const handleStateChange = async (state: string) => {
    setSelectedState(state);
    if (state === 'all') {
      await refetch();
    } else {
      await fetchByState(state);
    }
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'severe':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const uniqueStates = [...new Set(processedReservoirs.map(r => r.state))].filter(Boolean);

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Error Loading Reservoir Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Droplets className="mr-2 h-5 w-5 text-blue-500" />
              Live Reservoir Data
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={selectedState} onValueChange={handleStateChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {uniqueStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={refetch} 
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-3 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {processedReservoirs.length} reservoirs
                {selectedState !== 'all' && ` in ${selectedState}`}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {processedReservoirs.map((reservoir, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-sm line-clamp-2">
                            {reservoir.reservoir_name}
                          </h3>
                          <Badge 
                            variant="outline" 
                            className={`ml-2 ${getRiskBadgeColor(reservoir.risk_level)}`}
                          >
                            {reservoir.risk_level.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          {reservoir.district}, {reservoir.state}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-xs">Fill Level:</span>
                            <span className="text-xs font-medium">
                              {reservoir.percentage_full.toFixed(1)}%
                            </span>
                          </div>
                          
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all ${
                                reservoir.risk_level === 'severe' ? 'bg-red-500' :
                                reservoir.risk_level === 'high' ? 'bg-orange-500' :
                                reservoir.risk_level === 'medium' ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(reservoir.percentage_full, 100)}%` }}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center">
                              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                              <span>In: {reservoir.inflow.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center">
                              <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                              <span>Out: {reservoir.outflow.toLocaleString()}</span>
                            </div>
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            Updated: {new Date(reservoir.last_updated).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveReservoirData;
