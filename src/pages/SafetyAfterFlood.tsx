
import React from 'react';
import { Shield } from 'lucide-react';

const SafetyAfterFlood = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Shield className="h-8 w-8 mr-2 text-green-600" />
        <h1 className="text-3xl font-bold">After a Flood: Recovery Guidelines</h1>
      </div>
      
      <div className="max-w-3xl mx-auto prose">
        <p className="lead">
          After floodwaters recede, dangers still exist. Follow these guidelines to stay safe during the recovery phase
          and minimize additional damage to your property and health.
        </p>
        
        <h2>Returning Home</h2>
        <ul>
          <li>Do not return home until authorities say it is safe</li>
          <li>Be alert for extended flooding and debris on roads</li>
          <li>Use caution when entering buildings; there may be hidden damage</li>
          <li>Wear sturdy shoes and protective clothing during cleanup</li>
          <li>Take photographs of damage for insurance claims before cleanup begins</li>
        </ul>
        
        <h2>Health and Safety Precautions</h2>
        <ul>
          <li>Avoid floodwater as it may be contaminated with sewage, oil, chemicals, or other substances</li>
          <li>Wash hands thoroughly with soap and clean water after contact with floodwater</li>
          <li>Do not allow children to play in floodwater areas</li>
          <li>Discard food that has come in contact with floodwater, including canned goods</li>
          <li>Use bottled, boiled, or treated water until your water supply is tested and found safe</li>
          <li>Avoid mosquito bites by using repellent and wearing long sleeves and pants</li>
        </ul>
        
        <h2>Building Safety</h2>
        <ul>
          <li>Check for structural damage before entering your home</li>
          <li>Turn off the main power until an electrician can inspect your system for safety</li>
          <li>Check for gas leaks - if you smell gas or hear a hissing noise, leave immediately and call for help</li>
          <li>Check for water and sewage system damage - avoid using tap water until safety is confirmed</li>
          <li>Clean and disinfect everything that got wet using a bleach solution</li>
          <li>Remove all porous materials that have been wet for more than 48 hours (drywall, carpeting, etc.)</li>
        </ul>
        
        <h2>Preventing Mold</h2>
        <ul>
          <li>Clean wet items and surfaces with disinfectant</li>
          <li>Remove and discard items that cannot be washed and disinfected (mattresses, carpeting, stuffed toys)</li>
          <li>Remove drywall and insulation that has been contaminated</li>
          <li>Run fans and dehumidifiers to reduce moisture</li>
          <li>Open doors and windows to allow fresh air to circulate when possible</li>
        </ul>
        
        <h2>Documentation and Recovery Assistance</h2>
        <ul>
          <li>Document all damage with photographs and detailed notes</li>
          <li>Contact your insurance agent as soon as possible to start the claims process</li>
          <li>Keep receipts for all cleanup and repair costs</li>
          <li>Register with disaster relief services if available in your area</li>
          <li>Apply for disaster assistance if your area has been declared a disaster zone</li>
        </ul>
        
        <div className="bg-green-50 p-4 border-l-4 border-green-500 my-6">
          <h3 className="text-green-800">Remember:</h3>
          <p className="mb-0 text-green-700">
            Recovery takes time. Take care of your physical and mental health during this process.
            Seek help if you feel overwhelmed. Community resources are often available to assist during recovery.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SafetyAfterFlood;
