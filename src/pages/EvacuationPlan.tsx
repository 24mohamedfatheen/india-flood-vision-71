
import React, { useState, useEffect } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, AlertTriangle, MapPin, Navigation, Phone, Clock, Route, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';

interface SafeLocation {
  name: string;
  lat: number;
  lng: number;
  district: string;
  type: string;
}

const EvacuationPlan = () => {
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isInIndia, setIsInIndia] = useState<boolean | null>(null);
  const [nearestSafeLocation, setNearestSafeLocation] = useState<SafeLocation | null>(null);

  // Hardcoded safe locations by major districts in India
  const safeLocations: SafeLocation[] = [
    { name: "Mumbai Disaster Management HQ", lat: 19.0760, lng: 72.8777, district: "Mumbai", type: "Emergency Center" },
    { name: "Delhi Relief Center", lat: 28.6139, lng: 77.2090, district: "Delhi", type: "Relief Center" },
    { name: "Chennai Flood Control Room", lat: 13.0827, lng: 80.2707, district: "Chennai", type: "Control Room" },
    { name: "Kolkata Emergency Services", lat: 22.5726, lng: 88.3639, district: "Kolkata", type: "Emergency Center" },
    { name: "Bangalore Emergency Operations", lat: 12.9716, lng: 77.5946, district: "Bangalore", type: "Operations Center" },
    { name: "Hyderabad Disaster Cell", lat: 17.3850, lng: 78.4867, district: "Hyderabad", type: "Disaster Cell" },
    { name: "Pune Emergency Shelter", lat: 18.5204, lng: 73.8567, district: "Pune", type: "Emergency Shelter" },
    { name: "Ahmedabad Relief Station", lat: 23.0225, lng: 72.5714, district: "Ahmedabad", type: "Relief Station" },
    { name: "Jaipur Emergency Center", lat: 26.9124, lng: 75.7873, district: "Jaipur", type: "Emergency Center" },
    { name: "Lucknow Disaster Management", lat: 26.8467, lng: 80.9462, district: "Lucknow", type: "Disaster Management" }
  ];

  useEffect(() => {
    // Get user's geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          console.log('User location detected:', latitude, longitude);
          setUserLocation({ lat: latitude, lng: longitude });
          
          // Check if location is in India and find nearest safe location
          checkLocationAndFindSafeZone(latitude, longitude);
        },
        error => {
          console.error("Error getting location:", error);
          setError("Unable to get your current location. Please enable location services and reload the page.");
          setIsLoading(false);
        },
        {
          timeout: 10000,
          enableHighAccuracy: true
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setIsLoading(false);
    }
  }, []);

  const checkLocationAndFindSafeZone = async (latitude: number, longitude: number) => {
    try {
      // Simple bounds check for India (approximate)
      const isInIndianBounds = 
        latitude >= 6.0 && latitude <= 37.0 && 
        longitude >= 68.0 && longitude <= 97.0;
      
      setIsInIndia(isInIndianBounds);
      
      if (isInIndianBounds) {
        // Find nearest safe location
        let nearest = safeLocations[0];
        let minDistance = calculateDistance(latitude, longitude, nearest.lat, nearest.lng);
        
        safeLocations.forEach(location => {
          const distance = calculateDistance(latitude, longitude, location.lat, location.lng);
          if (distance < minDistance) {
            minDistance = distance;
            nearest = location;
          }
        });
        
        setNearestSafeLocation(nearest);
        setLocationName(`Near ${nearest.district}`);
        
        console.log('Nearest safe location:', nearest);
      } else {
        setLocationName("Outside India");
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error processing location:", error);
      setError("Unable to process your location. Please try again later.");
      setIsLoading(false);
    }
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  // Generate Google Maps evacuation route URL
  const getEvacuationRouteUrl = (): string => {
    if (!userLocation || !nearestSafeLocation) return '#';
    
    return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${nearestSafeLocation.lat},${nearestSafeLocation.lng}&travelmode=driving`;
  };

  // Sample emergency contacts
  const emergencyContacts = [
    { name: "National Disaster Response Force", phone: "108" },
    { name: "Police Emergency", phone: "100" },
    { name: "Fire Services", phone: "101" },
    { name: "Ambulance Services", phone: "108" },
    { name: "Local Disaster Management Cell", phone: "1916" }
  ];

  // Sample essential items
  const essentialItems = [
    "Drinking water (at least 3 liters per person)",
    "Non-perishable food items",
    "Medications and first aid kit",
    "Important documents in waterproof container",
    "Mobile phone with charger and power bank",
    "Battery-operated torch and extra batteries",
    "Warm clothes and blankets",
    "Cash in small denominations",
    "Whistle to signal for help"
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Shield className="h-8 w-8 mr-2 text-blue-600" />
            <h1 className="text-3xl font-bold">Emergency Evacuation Plan</h1>
          </div>
          <div className="text-center p-10">
            <Skeleton className="h-8 w-1/2 mx-auto mb-4" />
            <Skeleton className="h-40 w-full mx-auto mb-6" />
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <p className="mt-4 text-gray-600">Getting your location and generating evacuation plan...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Shield className="h-8 w-8 mr-2 text-blue-600" />
            <h1 className="text-3xl font-bold">Emergency Evacuation Plan</h1>
          </div>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
            <div className="flex">
              <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mr-3" />
              <div>
                <h3 className="text-red-800 font-medium">Location Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (isInIndia === false) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Shield className="h-8 w-8 mr-2 text-blue-600" />
            <h1 className="text-3xl font-bold">Emergency Evacuation Plan</h1>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-6">
            <div className="flex">
              <AlertTriangle className="h-6 w-6 text-yellow-500 flex-shrink-0 mr-3" />
              <div>
                <h3 className="text-yellow-800 font-medium">Location Outside Service Area</h3>
                <p className="text-yellow-700">This service is currently only available for locations within India.</p>
              </div>
            </div>
          </div>
          <p className="mb-4">
            Please contact your local emergency services for evacuation information.
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Shield className="h-8 w-8 mr-3 text-blue-600" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Emergency Evacuation Plan</h1>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{locationName}</span>
                </div>
              </div>
            </div>
            <div className="bg-red-100 p-2 px-4 rounded-full flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <span className="font-medium text-red-700">Emergency Plan - For Immediate Use</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column (2/3 width) - Evacuation details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Nearest Safe Location */}
            {nearestSafeLocation && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-green-600 text-white p-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Navigation className="h-5 w-5 mr-2" />
                    Nearest Safe Location
                  </h2>
                </div>
                <div className="p-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <h3 className="font-bold text-lg text-green-800">{nearestSafeLocation.name}</h3>
                    <p className="text-green-700">Type: {nearestSafeLocation.type}</p>
                    <p className="text-green-700">District: {nearestSafeLocation.district}</p>
                  </div>
                  
                  <div className="mb-4">
                    <a 
                      href={getEvacuationRouteUrl()} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors font-semibold"
                    >
                      <Navigation className="h-5 w-5 mr-2" />
                      Open Evacuation Route in Google Maps
                    </a>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Instructions:</strong> Click the button above to get turn-by-turn directions from your current location to the nearest emergency center. Follow the route carefully and avoid flooded roads.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* If unable to evacuate */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-red-600 text-white p-4">
                <h2 className="text-xl font-semibold">If You Cannot Evacuate</h2>
              </div>
              <div className="p-6">
                <ol className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-red-100 rounded-full p-1 mr-3 mt-0.5">
                      <ArrowRight className="h-4 w-4 text-red-700" />
                    </div>
                    <span><strong>Move to higher ground:</strong> If possible, move to the highest floor or level of your building.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-red-100 rounded-full p-1 mr-3 mt-0.5">
                      <ArrowRight className="h-4 w-4 text-red-700" />
                    </div>
                    <span><strong>Signal for help:</strong> Use bright clothing, flashlights, or whistles to signal your location to rescuers.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-red-100 rounded-full p-1 mr-3 mt-0.5">
                      <ArrowRight className="h-4 w-4 text-red-700" />
                    </div>
                    <span><strong>Call for emergency assistance:</strong> Contact the emergency numbers listed below.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-red-100 rounded-full p-1 mr-3 mt-0.5">
                      <ArrowRight className="h-4 w-4 text-red-700" />
                    </div>
                    <span><strong>Avoid flood waters:</strong> Never attempt to walk, swim, or drive through flood waters.</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* Essential Items */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-green-600 text-white p-4">
                <h2 className="text-xl font-semibold">Essential Items to Take</h2>
              </div>
              <div className="p-6">
                <ul className="space-y-2">
                  {essentialItems.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right column (1/3 width) - Emergency contacts and info */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Emergency Contacts */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-purple-600 text-white p-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Emergency Contacts
                </h2>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {emergencyContacts.map((contact, index) => (
                    <li key={index} className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="font-medium text-sm">{contact.name}</span>
                      <a 
                        href={`tel:${contact.phone}`} 
                        className="bg-purple-100 text-purple-800 py-1 px-3 rounded-full font-semibold hover:bg-purple-200 transition-colors text-sm"
                      >
                        {contact.phone}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h2 className="text-lg font-semibold text-blue-800 mb-3">Important Notes</h2>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 mr-2 mt-0.5">
                    <Check className="h-4 w-4 text-blue-700" />
                  </div>
                  <span className="text-sm">Follow official instructions from emergency services at all times.</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 mr-2 mt-0.5">
                    <Check className="h-4 w-4 text-blue-700" />
                  </div>
                  <span className="text-sm">This plan is based on current information and may change based on flood conditions.</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 mr-2 mt-0.5">
                    <Check className="h-4 w-4 text-blue-700" />
                  </div>
                  <span className="text-sm">Help others if it is safe to do so, especially elderly and disabled people.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <Button 
            onClick={() => window.print()} 
            className="bg-blue-600 hover:bg-blue-700"
          >
            Print Evacuation Plan
          </Button>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
          >
            Refresh Location
          </Button>
        </div>

        <div className="text-center text-gray-500 text-sm mt-6">
          <p>This evacuation plan was generated based on your current location and may not reflect real-time flood conditions.</p>
          <p>Always follow instructions from local authorities and emergency services.</p>
        </div>
      </div>
    </div>
  );
};

export default EvacuationPlan;
