
import React from 'react';
import { Shield } from 'lucide-react';

const SafetyBeforeFlood = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Shield className="h-8 w-8 mr-2 text-blue-600" />
        <h1 className="text-3xl font-bold">Before a Flood: Preparation Guide</h1>
      </div>
      
      <div className="max-w-3xl mx-auto prose">
        <p className="lead">
          Being prepared before a flood occurs is crucial to protecting yourself, your family, and your property. 
          Follow these guidelines to ensure you're ready well in advance of potential flooding.
        </p>
        
        <h2>Create an Emergency Plan</h2>
        <ul>
          <li>Develop a household evacuation plan with multiple routes to safety</li>
          <li>Establish a family communication plan and meeting points</li>
          <li>Designate an out-of-area contact person</li>
          <li>Plan for pets and livestock</li>
          <li>Practice your evacuation plan with all family members</li>
        </ul>
        
        <h2>Prepare an Emergency Kit</h2>
        <p>Your emergency kit should include:</p>
        <ul>
          <li>At least 3 days of non-perishable food</li>
          <li>3 liters of water per person per day</li>
          <li>First aid supplies and medications</li>
          <li>Battery-powered or hand-crank radio</li>
          <li>Flashlights and extra batteries</li>
          <li>Mobile phone with chargers and backup battery</li>
          <li>Important documents in waterproof container (IDs, insurance policies)</li>
          <li>Cash and emergency contact information</li>
          <li>Blankets and change of clothes</li>
        </ul>
        
        <h2>Know Your Risk</h2>
        <ul>
          <li>Learn about the flood risk in your area</li>
          <li>Understand flood warning terms: Watch vs. Warning</li>
          <li>Know your elevation level and if your property is in a flood-prone area</li>
          <li>Identify nearby streams, drainage channels, and other areas known to flood suddenly</li>
        </ul>
        
        <h2>Protect Your Home</h2>
        <ul>
          <li>Install check valves in plumbing to prevent floodwater backup</li>
          <li>Consider building barriers to stop floodwater from entering your home</li>
          <li>Seal basement walls with waterproofing compounds</li>
          <li>Elevate electrical switches, sockets, circuit breakers, and wiring</li>
          <li>Move valuable items and important documents to upper floors or higher shelves</li>
          <li>Consider flood insurance if you are in a flood-prone area</li>
        </ul>
        
        <h2>Stay Informed</h2>
        <ul>
          <li>Monitor local weather reports regularly</li>
          <li>Sign up for flood alerts from the India Meteorological Department</li>
          <li>Keep a battery-operated or hand-crank radio to receive emergency communications</li>
          <li>Follow local authorities' social media accounts for updates</li>
        </ul>
        
        <div className="bg-blue-50 p-4 border-l-4 border-blue-500 my-6">
          <h3 className="text-blue-800">Remember:</h3>
          <p className="mb-0 text-blue-700">
            Floods can happen anywhere, even in areas that have never flooded before. 
            Taking precautions now can save lives and minimize property damage later.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SafetyBeforeFlood;
