
import React, { useState, useEffect } from 'react';
import { fetchReservoirData } from '../services/dataSourcesService';
import { ReservoirData } from '../types/reservoirData';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from './ui/table';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Droplet, RefreshCw, AlertTriangle } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';

interface ReservoirLevelsTableProps {
  refreshInterval?: number; // in milliseconds
  maxDisplay?: number; // maximum number of reservoirs to display
}

const ReservoirLevelsTable: React.FC<ReservoirLevelsTableProps> = ({
  refreshInterval = 300000, // 5 minutes by default
  maxDisplay = 10
}) => {
  const [reservoirData, setReservoirData] = useState<ReservoirData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Function to fetch data
  const fetchData = async () => {
    try {
      const data = await fetchReservoirData();
      if (data) {
        setReservoirData(data);
        setLastUpdated(new Date());
        setError(null);
      } else {
        setError("Failed to load reservoir data");
      }
    } catch (err) {
      setError(`Error loading reservoir data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch data on component mount and set up interval
  useEffect(() => {
    fetchData();
    
    // Set up interval for periodic updates
    const intervalId = setInterval(fetchData, refreshInterval);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [refreshInterval]);
  
  // Format date safely
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, 'MMM dd, yyyy, h:mm a') : dateString;
    } catch (error) {
      // If parsing fails, return the original string
      return dateString;
    }
  };
  
  // Get water level status
  const getWaterLevelStatus = (percentFull?: number) => {
    if (percentFull === undefined) return 'unknown';
    if (percentFull > 90) return 'critical';
    if (percentFull > 75) return 'high';
    if (percentFull > 50) return 'medium';
    if (percentFull > 25) return 'normal';
    return 'low';
  };
  
  // Get badge for water level status
  const getWaterLevelBadge = (status: string) => {
    switch (status) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Medium</Badge>;
      case 'normal':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Normal</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Droplet className="h-5 w-5 mr-2 text-blue-500" />
            Reservoir Water Levels
          </CardTitle>
          <div className="flex items-center space-x-2">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
                Last updated: {format(lastUpdated, 'MMM dd, h:mm a')}
              </span>
            )}
            <button 
              onClick={() => { setLoading(true); fetchData(); }}
              className="p-1 rounded-full hover:bg-gray-100"
              disabled={loading}
              title="Refresh data"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-blue-500' : 'text-gray-400'}`} />
            </button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading && !reservoirData && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {!loading && !error && reservoirData && reservoirData.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            No reservoir data available
          </div>
        )}
        
        {reservoirData && reservoirData.length > 0 && (
          <div className="overflow-auto max-h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reservoir Name</TableHead>
                  <TableHead>Water Level</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservoirData.slice(0, maxDisplay).map((reservoir, index) => {
                  const status = getWaterLevelStatus(reservoir.percentFull);
                  return (
                    <TableRow key={`${reservoir.reservoirName}-${index}`}>
                      <TableCell className="font-medium">{reservoir.reservoirName}</TableCell>
                      <TableCell>
                        {reservoir.waterLevel !== null ? 
                          `${reservoir.waterLevel.toFixed(2)} m` : 
                          'N/A'}
                      </TableCell>
                      <TableCell>
                        {reservoir.capacity ? 
                          `${reservoir.capacity.toFixed(2)} m³ (${reservoir.percentFull?.toFixed(1)}%)` : 
                          'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        {getWaterLevelBadge(status)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 text-xs text-muted-foreground">
        <p>
          Data sourced from reservoir monitoring stations. Updates every {refreshInterval / 60000} minutes.
        </p>
      </CardFooter>
    </Card>
  );
};

export default ReservoirLevelsTable;
