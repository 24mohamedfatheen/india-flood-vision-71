
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { imdApiService, IMDRegionData } from '../services/imdApiService';
import { AlertCircle, MapPin, LocateFixed, CircleDot } from 'lucide-react';

// Leaflet Default Icon Fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// MapRecenter Component
const MapRecenter: React.FC<{ center: L.LatLngExpression, zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center[0] !== 0 || center[1] !== 0) { 
      map.flyTo(center, zoom, { animate: true, duration: 1 });
    }
  }, [center, zoom, map]);
  return null;
};

const FloodVision: React.FC = () => {
  const [aggregatedFloodData, setAggregatedFloodData] = useState<IMDRegionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<L.LatLngExpression>([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState<number>(5);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  // Data Fetching and Initial Map Setup
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        console.log('🚀 Starting to fetch aggregated flood data...');
        const data = await imdApiService.fetchAggregatedFloodData();
        console.log('📊 Received aggregated flood data:', data);
        setAggregatedFloodData(data);

        if (data.length > 0) {
          const defaultRegion = data.find(d => 
            d.district.toLowerCase().includes('mumbai') || 
            d.district.toLowerCase().includes('delhi') ||
            d.district.toLowerCase().includes('pune')
          ) || data[0];

          if (defaultRegion) {
            setSelectedState(defaultRegion.state);
            setSelectedDistrict(defaultRegion.district);
            setMapCenter(defaultRegion.coordinates);
            setMapZoom(9);
          }
        }
      } catch (err: any) {
        console.error("❌ Error loading initial aggregated flood data:", err);
        setError(`Failed to load initial flood data: ${err.message || 'Unknown error'}. Please ensure your Supabase data ingestion is complete and check your browser console for details.`);
      } finally {
        setLoading(false);
      }
    };

    const loadGeoJsonData = async () => {
      try {
        // For now, we'll create a simple placeholder GeoJSON structure
        // In a real implementation, you would load the actual districts GeoJSON file
        console.log('📍 Note: Using placeholder GeoJSON data. To use real district boundaries, download the GeoJSON file as instructed.');
        setGeoJsonData({
          type: "FeatureCollection",
          features: [] // Empty for now - real GeoJSON would have district polygons
        });
      } catch (err) {
        console.error("❌ Error loading GeoJSON data:", err);
      }
    };

    loadInitialData();
    loadGeoJsonData();

    // Geolocation for User's Current Position
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          console.log("📍 User current location fetched:", [position.coords.latitude, position.coords.longitude]);
        },
        (err) => {
          console.warn(`⚠️ Geolocation Error(${err.code}): ${err.message}. User location will not be displayed on map.`);
        }
      );
    } else {
      console.log("🚫 Geolocation is not supported by this browser.");
    }
  }, []);

  // Dynamic Dropdown Options
  const availableStates = useMemo(() => {
    const states = new Set<string>();
    aggregatedFloodData.forEach(d => states.add(d.state));
    return Array.from(states).sort();
  }, [aggregatedFloodData]);

  const availableDistricts = useMemo(() => {
    const districts = new Set<string>();
    aggregatedFloodData
      .filter(d => d.state === selectedState)
      .forEach(d => districts.add(d.district));
    return Array.from(districts).sort();
  }, [aggregatedFloodData, selectedState]);

  // Dropdown Event Handlers
  const handleStateChange = useCallback((state: string) => {
    setSelectedState(state);
    setSelectedDistrict('');
    const stateDataForZoom = aggregatedFloodData.find(d => d.state === state);
    if (stateDataForZoom) {
      setMapCenter(stateDataForZoom.coordinates);
      setMapZoom(7);
    } else {
      setMapCenter([20.5937, 78.9629]);
      setMapZoom(5);
    }
  }, [aggregatedFloodData]);

  const handleDistrictChange = useCallback((district: string) => {
    setSelectedDistrict(district);
    const districtDataForZoom = aggregatedFloodData.find(d => d.district === district && d.state === selectedState);
    if (districtDataForZoom) {
      setMapCenter(districtDataForZoom.coordinates);
      setMapZoom(10);
    } else {
      setMapCenter([20.5937, 78.9629]);
      setMapZoom(5);
    }
  }, [aggregatedFloodData, selectedState]);

  // Map Styling for Choropleth Layer
  const getFeatureStyle = useCallback((feature: L.GeoJSON.Feature) => {
    const geoJsonDistrictName = feature.properties?.NAME_2 || feature.properties?.district || feature.properties?.name || '';
    const geoJsonStateName = feature.properties?.NAME_1 || feature.properties?.state || '';

    const data = aggregatedFloodData.find(d =>
      d.district.toLowerCase() === geoJsonDistrictName.toLowerCase() &&
      d.state.toLowerCase() === geoJsonStateName.toLowerCase()
    );

    let color = '#E0E0E0'; // Default light gray
    if (data) {
      switch (data.floodRiskLevel) {
        case 'low':
          color = '#8BC34A'; // Light Green
          break;
        case 'medium':
          color = '#FFEB3B'; // Yellow
          break;
        case 'high':
          color = '#FF9800'; // Orange
          break;
        case 'severe':
          color = '#F44336'; // Red
          break;
        default:
          color = '#E0E0E0';
      }
    }

    const isSelected = selectedDistrict.toLowerCase() === geoJsonDistrictName.toLowerCase() &&
                       selectedState.toLowerCase() === geoJsonStateName.toLowerCase();

    return {
      fillColor: color,
      weight: isSelected ? 3 : 1,
      opacity: 1,
      color: isSelected ? '#333' : 'white',
      dashArray: isSelected ? '3' : '',
      fillOpacity: isSelected ? 0.9 : 0.7
    };
  }, [aggregatedFloodData, selectedDistrict, selectedState]);

  // Map Interaction Logic
  const onEachFeature = useCallback((feature: L.GeoJSON.Feature, layer: L.Layer) => {
    if (feature.properties) {
      const districtName = feature.properties.NAME_2 || feature.properties.district || feature.properties.name || 'Unknown District';
      const stateName = feature.properties.NAME_1 || feature.properties.state || 'Unknown State';
      
      const data = aggregatedFloodData.find(d =>
        d.district.toLowerCase() === districtName.toLowerCase() &&
        d.state.toLowerCase() === stateName.toLowerCase()
      );

      const popupContent = `
        <div style="font-family: 'Inter', sans-serif; font-size: 14px; color: #333; padding: 5px;">
          <strong style="font-size: 16px;">${districtName}, ${stateName}</strong><br/>
          ${data ? `
            <div style="margin-top: 5px;">
                Risk Level: <strong style="color: ${getFeatureStyle(feature).fillColor};">${data.floodRiskLevel.toUpperCase()}</strong>
            </div>
            <div style="margin-top: 5px;">
                Reservoir % Full: ${data.reservoirPercentage ? `<span style="font-weight: bold;">${data.reservoirPercentage.toFixed(1)}%</span>` : 'N/A'}<br/>
                Inflow (Cusecs): ${data.inflowCusecs ? `<span style="font-weight: bold;">${data.inflowCusecs.toLocaleString()}</span>` : 'N/A'}<br/>
                Outflow (Cusecs): ${data.outflowCusecs ? `<span style="font-weight: bold;">${data.outflowCusecs.toLocaleString()}</span>` : 'N/A'}<br/>
                Last Updated: ${data.lastUpdated ? new Date(data.lastUpdated).toLocaleDateString() : 'N/A'}
            </div>
          ` : '<p style="color: #666; font-style: italic;">No detailed flood data available for this region.</p>'}
        </div>
      `;
      layer.bindPopup(popupContent);

      layer.on({
        click: (e) => {
          setSelectedState(stateName);
          setSelectedDistrict(districtName);
        },
        mouseover: (e) => {
          const target = e.target;
          target.setStyle({
            weight: 3,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.9
          });
          target.bringToFront();
        },
        mouseout: (e) => {
          const currentDistrictName = feature.properties?.NAME_2 || feature.properties?.district || feature.properties?.name || '';
          const currentStateName = feature.properties?.NAME_1 || feature.properties?.state || '';
          if (currentDistrictName.toLowerCase() !== selectedDistrict.toLowerCase() ||
              currentStateName.toLowerCase() !== selectedState.toLowerCase()) {
            e.target.setStyle(getFeatureStyle(feature));
          } else {
            e.target.setStyle({
              weight: 3,
              color: '#333',
              dashArray: '3',
              fillOpacity: 0.7
            });
          }
        },
      });
    }
  }, [aggregatedFloodData, selectedDistrict, selectedState, getFeatureStyle]);

  // Loading and Error States
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-lg text-gray-700 animate-pulse">Loading flood data and map boundaries. Please wait...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-red-50 text-red-800 p-8 rounded-lg shadow-xl mx-auto max-w-lg text-center border-2 border-red-300">
        <AlertCircle size={64} className="mb-6 text-red-600" />
        <p className="text-2xl font-bold mb-3">Data Loading Error</p>
        <p className="text-lg mb-6">{error}</p>
        <p className="text-sm text-gray-700">
          This could be due to network issues, Supabase API key misconfiguration,
          or problems with the data ingestion process.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-8 px-8 py-4 bg-red-700 text-white font-semibold rounded-lg shadow-lg hover:bg-red-800 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-300"
        >
          Retry Loading Data
        </button>
      </div>
    );
  }
  
  const displayRegionData = aggregatedFloodData.find(d => d.district === selectedDistrict && d.state === selectedState) || 
                            (aggregatedFloodData.length > 0 ? aggregatedFloodData[0] : null);

  return (
    <div className="container mx-auto p-4 md:p-8 font-inter antialiased bg-gray-50"> 
      
      {/* Header Section */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-gray-900 leading-tight">
        <span className="text-blue-700">India Flood</span> Vision
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto text-lg">
        Comprehensive real-time insights into reservoir levels and flood risk across India.
      </p>

      {/* Region Selection Dropdowns */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <MapPin className="text-gray-500 flex-shrink-0" size={20} />
          <label htmlFor="state-select" className="sr-only">Select a State</label>
          <Select value={selectedState} onValueChange={handleStateChange}>
            <SelectTrigger id="state-select" className="w-full md:w-[250px] h-12 rounded-xl shadow-sm border border-gray-300 bg-white text-gray-800 text-base focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out hover:border-blue-400">
              <SelectValue placeholder="Select a State" />
            </SelectTrigger>
            <SelectContent className="max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-[999]"> 
              {availableStates.length === 0 ? (
                <SelectItem disabled value="">No States Available</SelectItem>
              ) : (
                availableStates.map(state => (
                  <SelectItem key={state} value={state} className="py-2 px-4 hover:bg-blue-50 focus:bg-blue-100 cursor-pointer text-gray-800 text-base">{state}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <LocateFixed className="text-gray-500 flex-shrink-0" size={20} />
          <label htmlFor="district-select" className="sr-only">Select a District</label>
          <Select value={selectedDistrict} onValueChange={handleDistrictChange} disabled={!selectedState || availableDistricts.length === 0}>
            <SelectTrigger id="district-select" className="w-full md:w-[250px] h-12 rounded-xl shadow-sm border border-gray-300 bg-white text-gray-800 text-base focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out hover:border-blue-400">
              <SelectValue placeholder="Select a District" />
            </SelectTrigger>
            <SelectContent className="max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-[999]"> 
              {availableDistricts.length === 0 ? (
                <SelectItem disabled value="">Select a State first</SelectItem>
              ) : (
                availableDistricts.map(district => (
                  <SelectItem key={district} value={district} className="py-2 px-4 hover:bg-blue-50 focus:bg-blue-100 cursor-pointer text-gray-800 text-base">{district}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Map Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 md:p-5 mb-8 h-[600px] w-full border border-gray-200 flex items-center justify-center">
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          className="h-full w-full rounded-lg" 
          zoomControl={true} 
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapRecenter center={mapCenter} zoom={mapZoom} />

          {/* Choropleth layer for districts using GeoJSON data */}
          {geoJsonData && geoJsonData.features && geoJsonData.features.length > 0 && (
            <GeoJSON
              data={geoJsonData}
              style={getFeatureStyle}
              onEachFeature={onEachFeature as any}
            />
          )}

          {/* Marker for user's current location */}
          {userLocation && (
            <L.Marker 
              position={userLocation} 
              icon={L.divIcon({
                className: 'my-custom-user-location-pin',
                iconSize: [30, 30],
                html: `<div class="relative w-full h-full bg-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-pulse">
                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-dot text-white"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/></svg>
                       </div>`, 
                iconAnchor: [15, 15]
              })}
            >
              <L.Popup>
                <div style={{fontFamily: 'Inter, sans-serif', fontSize: '14px'}}>
                  <strong>Your Current Location</strong><br/>
                  Detected by browser.
                </div>
              </L.Popup>
            </L.Marker>
          )}

        </MapContainer>
      </div>

      {/* Information Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <div className="flex flex-col flood-card p-6 bg-white border border-gray-200 rounded-xl shadow-md min-h-[180px]">
          <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center space-x-2">
            <MapPin className="text-gray-600" size={22} /><span>Location & Risk Info</span>
          </h2>
          {displayRegionData ? (
            <div className="space-y-2 text-gray-700 text-base">
              <p><strong>State:</strong> {displayRegionData.state}</p>
              <p><strong>District:</strong> {displayRegionData.district}</p>
              <p><strong>Risk Level:</strong> <span className={`font-bold ${
                displayRegionData.floodRiskLevel === 'severe' ? 'text-red-600' :
                displayRegionData.floodRiskLevel === 'high' ? 'text-orange-600' :
                displayRegionData.floodRiskLevel === 'medium' ? 'text-yellow-600' :
                'text-green-600'
              }`}>{displayRegionData.floodRiskLevel.toUpperCase()}</span></p>
              <p><strong>Reservoir % Full:</strong> {displayRegionData.reservoirPercentage ? `${displayRegionData.reservoirPercentage.toFixed(1)}%` : 'N/A'}</p>
              <p><strong>Inflow:</strong> {displayRegionData.inflowCusecs ? `${displayRegionData.inflowCusecs.toLocaleString()} cusecs` : 'N/A'}</p>
            </div>
          ) : (
            <p className="text-gray-500 italic mt-auto">Select a region or wait for data to load.</p>
          )}
        </div>
      </div>

      {/* Emergency Evacuation Plan Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mt-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Emergency Evacuation Plan</h2>
        <p className="text-gray-700 mb-4">
          This section will provide evacuation routes and essential information.
          Currently, it displays data from the selected region.
        </p>
        {displayRegionData && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Current Region Status: {displayRegionData.district}, {displayRegionData.state}</h3>
            <p className="text-gray-600">Risk Level: <span className={`font-bold ${
              displayRegionData.floodRiskLevel === 'severe' ? 'text-red-600' :
              displayRegionData.floodRiskLevel === 'high' ? 'text-orange-600' :
              displayRegionData.floodRiskLevel === 'medium' ? 'text-yellow-600' :
              'text-green-600'
            }`}>{displayRegionData.floodRiskLevel.toUpperCase()}</span></p>
            <p className="text-gray-600">Last Updated: {displayRegionData.lastUpdated ? new Date(displayRegionData.lastUpdated).toLocaleDateString() : 'N/A'}</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default FloodVision;
