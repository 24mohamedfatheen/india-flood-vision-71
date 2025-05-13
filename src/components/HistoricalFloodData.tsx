
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BarChart } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface StateFloodData {
  state: string;
  years: {
    year: string;
    affectedDistricts: string;
    population?: string;
    rivers: string;
  }[];
}

const historicalFloodData: StateFloodData[] = [
  {
    state: "Andhra Pradesh",
    years: [
      { year: "2018", affectedDistricts: "Not specified", rivers: "Not specified" },
      { year: "2019", affectedDistricts: "East Godavari, West Godavari", rivers: "Godavari" },
      { year: "2020", affectedDistricts: "Not specified", rivers: "Not specified" },
      { year: "2022", affectedDistricts: "East Godavari, Alluri Sitharama Raju, Kurnool", rivers: "Godavari, Sabari" },
      { year: "2024", affectedDistricts: "East Godavari, Alluri Sitharama Raju, Kakinada, NTR, Guntur, Prakasham", rivers: "Godavari, Sabari, Krishna, Budameru" }
    ]
  },
  {
    state: "Assam",
    years: [
      { year: "2015", affectedDistricts: "19 districts", population: "576,537", rivers: "Brahmaputra, Barak" },
      { year: "2016", affectedDistricts: "19 districts", population: "1,700,000+", rivers: "Brahmaputra, Barak" },
      { year: "2017", affectedDistricts: "25 districts", population: "3,320,000", rivers: "Brahmaputra, Barak" },
      { year: "2018", affectedDistricts: "Not specified", rivers: "Not specified" },
      { year: "2019", affectedDistricts: "18 districts", population: "4,300,000+", rivers: "Brahmaputra, Barak" },
      { year: "2020", affectedDistricts: "30 districts", population: "5,000,000+", rivers: "Brahmaputra, Barak" },
      { year: "2022", affectedDistricts: "35 districts", population: "9,000,000+", rivers: "Brahmaputra, Barak" },
      { year: "2023", affectedDistricts: "20 districts", rivers: "Brahmaputra, Barak" },
      { year: "2024", affectedDistricts: "30 districts", population: "2,450,000+", rivers: "Brahmaputra, Barak" }
    ]
  },
  {
    state: "Bihar",
    years: [
      { year: "2016", affectedDistricts: "12 districts", rivers: "Ganga, Koshi, Gandak, Bagmati, Mahananda" },
      { year: "2017", affectedDistricts: "18 districts", population: "12,680,000", rivers: "Ganga, Koshi, Gandak, Bagmati, Mahananda" },
      { year: "2018", affectedDistricts: "Not specified", rivers: "Ganga, Koshi, Gandak, Bagmati, Mahananda" },
      { year: "2019", affectedDistricts: "13 districts", population: "8,846,000", rivers: "Ganga, Koshi, Gandak, Bagmati, Mahananda" },
      { year: "2020", affectedDistricts: "16 districts", population: "760,000 (North Bihar)", rivers: "Ganga, Koshi, Gandak, Bagmati, Mahananda" },
      { year: "2021", affectedDistricts: "15 districts", population: "2,700,000", rivers: "Ganga, Koshi, Gandak, Bagmati, Mahananda" },
      { year: "2022", affectedDistricts: "29 districts (High to Moderate Hazard)", rivers: "Ganga, Koshi, Gandak, Bagmati, Mahananda" },
      { year: "2024", affectedDistricts: "13 districts", population: "1,757,000", rivers: "Ganga, Koshi, Gandak, Bagmati, Mahananda" }
    ]
  },
  {
    state: "Delhi",
    years: [
      { year: "2023", affectedDistricts: "North, North East, East and South East Delhi (near Red Fort, ITO, Kashmiri Gate, Civil Lines)", rivers: "Yamuna River" },
      { year: "2024", affectedDistricts: "Not specified", rivers: "Yamuna River" }
    ]
  }
];

const HistoricalFloodData: React.FC = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAllStates, setShowAllStates] = useState(false);

  const toggleState = (state: string) => {
    if (expanded === state) {
      setExpanded(null);
    } else {
      setExpanded(state);
    }
  };

  // Show only a few states by default
  const displayedStates = showAllStates 
    ? historicalFloodData 
    : historicalFloodData.slice(0, 2);

  return (
    <div className="flood-card mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <BarChart className="mr-2 h-5 w-5 text-primary" />
          Historical Flood Data (2015-2025)
        </h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                Data Source: NDMA
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Data compiled from National Disaster Management Authority and related sources</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="text-sm text-muted-foreground mb-4">
        <p>
          A state-wise analysis of flood occurrences in India from 2015 to 2025, highlighting affected districts, 
          population impact, and major rivers involved in flooding events.
        </p>
      </div>

      <div className="space-y-3">
        {displayedStates.map((stateData) => (
          <div key={stateData.state} className="border rounded-lg overflow-hidden">
            <div 
              className="flex justify-between items-center p-3 bg-muted cursor-pointer hover:bg-muted/80"
              onClick={() => toggleState(stateData.state)}
            >
              <h3 className="font-medium">{stateData.state}</h3>
              {expanded === stateData.state ? 
                <ChevronUp className="h-4 w-4" /> : 
                <ChevronDown className="h-4 w-4" />
              }
            </div>
            
            {expanded === stateData.state && (
              <div className="p-3 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Year</TableHead>
                      <TableHead>Affected Districts</TableHead>
                      {stateData.years.some(y => y.population) && 
                        <TableHead>Affected Population</TableHead>
                      }
                      <TableHead>Major Rivers</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stateData.years.map((yearData, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{yearData.year}</TableCell>
                        <TableCell>{yearData.affectedDistricts}</TableCell>
                        {stateData.years.some(y => y.population) && 
                          <TableCell>{yearData.population || "Not specified"}</TableCell>
                        }
                        <TableCell>{yearData.rivers}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        ))}
        
        {historicalFloodData.length > 2 && (
          <button 
            className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
            onClick={() => setShowAllStates(!showAllStates)}
          >
            {showAllStates ? "Show Less" : `Show All States (${historicalFloodData.length})`}
          </button>
        )}
      </div>
    </div>
  );
};

export default HistoricalFloodData;
