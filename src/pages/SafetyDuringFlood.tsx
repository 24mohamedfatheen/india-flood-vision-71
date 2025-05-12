
import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';

const SafetyDuringFlood = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Shield className="h-8 w-8 mr-2 text-amber-600" />
        <h1 className="text-3xl font-bold">During a Flood: Safety Guidelines</h1>
      </div>
      
      <div className="max-w-3xl mx-auto prose">
        <div className="relative mb-8">
          <img 
            src="/lovable-uploads/433dcfbf-0d9c-4d28-878e-b79404f107d2.png" 
            alt="Flash flood warning sign" 
            className="w-full h-64 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Critical Warning</h3>
              <p className="text-red-700">
                If you are advised to evacuate by authorities, do so immediately. 
                Do not wait or delay. Your safety is the top priority.
              </p>
            </div>
          </div>
        </div>
        
        <p className="lead">
          During a flood, conditions can change rapidly. Follow these guidelines to protect yourself and your family
          when flooding is occurring in your area.
        </p>
        
        <h2>Stay Informed</h2>
        <ul>
          <li>Monitor local news, weather reports, and emergency channels continuously</li>
          <li>Follow instructions from local authorities</li>
          <li>Be alert for flood warnings and evacuation notices</li>
          <li>Keep your emergency contact information handy</li>
        </ul>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <img 
            src="/lovable-uploads/29383ae2-2cf4-4fb9-af97-1b47cbf424b7.png" 
            alt="Evacuation route map example" 
            className="w-full h-56 object-cover rounded-lg"
          />
          <div>
            <h2 className="text-2xl font-bold text-red-600 mb-3">EVACUATION SAFETY</h2>
            <ul>
              <li>If ordered to evacuate, do so immediately</li>
              <li>Follow recommended evacuation routes – shortcuts may be blocked</li>
              <li>Do not drive around barricades – they are placed for your safety</li>
              <li>Take only essential items and your emergency kit</li>
              <li>Secure your home if you have time: lock doors, windows, shut off utilities</li>
              <li>Do not return to your home until authorities say it is safe</li>
            </ul>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-amber-600 mb-3">IF YOU CANNOT EVACUATE</h2>
        <ul>
          <li>Move to the highest level of the building</li>
          <li>Stay away from windows and doors</li>
          <li>Do NOT go into a closed attic, as you may become trapped by rising floodwater</li>
          <li>Go onto the roof only if necessary and signal for help</li>
          <li>Use the Emergency Report feature on this website to alert authorities of your location</li>
        </ul>
        
        <h2 className="text-red-600">AVOID FLOODWATERS</h2>
        <ul>
          <li>Never attempt to walk, swim, or drive through floodwater</li>
          <li>Just 15 cm of fast-moving water can knock you off your feet</li>
          <li>30 cm of water is enough to float a vehicle</li>
          <li>60 cm of flowing water can sweep away most vehicles, including SUVs</li>
          <li>Floodwater may be contaminated with sewage, chemicals, and debris</li>
          <li>There may be hidden dangers beneath the surface (sharp objects, holes, electrical wires)</li>
        </ul>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <h2>If You're in a Vehicle</h2>
            <ul>
              <li>Turn around, don't drown! Never drive through flooded roads</li>
              <li>If your vehicle stalls in rising water, abandon it immediately and move to higher ground</li>
              <li>Be especially cautious at night when it's harder to see flood dangers</li>
            </ul>
          </div>
          <img 
            src="/lovable-uploads/d6e192bf-00ce-41a2-a5dd-ae580e638b4f.png" 
            alt="Contaminated water warning" 
            className="w-full h-56 object-cover rounded-lg"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <img 
            src="/lovable-uploads/f0786497-0f3d-498d-8197-d7c5d7f0a8fd.png" 
            alt="Power outage safety diagram" 
            className="w-full h-56 object-cover rounded-lg"
          />
          <div>
            <h2 className="text-2xl font-bold text-blue-600 mb-3">POWER AND UTILITIES</h2>
            <ul>
              <li>If you smell gas or suspect a leak, turn off the main gas valve and evacuate immediately</li>
              <li>Switch off electricity at the main panel if the area is flooded or about to flood</li>
              <li>Never touch electrical equipment if you are wet or standing in water</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-amber-50 p-4 border-l-4 border-amber-500 my-6">
          <h3 className="text-amber-800">Remember:</h3>
          <p className="mb-0 text-amber-700">
            Your safety is more important than your possessions. Do not risk your life to save material items.
            If you need urgent assistance, use the Emergency Report feature or call the national emergency number 112.
          </p>
        </div>
        
        <div className="flex justify-center my-8">
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 w-full max-w-md">
            <h3 className="text-center mb-2 font-bold">Emergency Kit Essentials</h3>
            <img 
              src="/lovable-uploads/d5181fca-17bd-420a-b0e9-603e8a8691f0.png" 
              alt="First aid kit supplies" 
              className="w-full h-48 object-contain mb-4"
            />
            <ul className="text-sm">
              <li>First aid supplies and medications</li>
              <li>Drinking water and non-perishable food</li>
              <li>Flashlights and batteries</li>
              <li>Radio (battery-powered or hand crank)</li>
              <li>Important documents in waterproof container</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyDuringFlood;
