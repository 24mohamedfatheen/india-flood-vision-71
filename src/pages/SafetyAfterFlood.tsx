
import React from 'react';
import { Shield, Camera, AlertTriangle, Droplets, Waves, Fan, FileCheck, Receipt, HelpingHand } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from '@/components/Header';

const SafetyAfterFlood = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Shield className="h-8 w-8 mr-2 text-green-600" />
          <h1 className="text-3xl font-bold">After a Flood: Recovery Guidelines</h1>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <p className="lead text-lg mb-8">
            After floodwaters recede, dangers still exist. Follow these guidelines to stay safe during the recovery phase
            and minimize additional damage to your property and health.
          </p>
          
          <img 
            src="/lovable-uploads/2c3135ff-5c7a-4d32-af90-fc130e9a6bbc.png" 
            alt="Safe return after flood" 
            className="w-32 h-32 mx-auto my-6"
          />
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="returning-home">
              <AccordionTrigger className="text-xl font-semibold">
                <div className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-yellow-600" />
                  Returning Home
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Do not return home until authorities say it is safe</li>
                      <li>Be alert for extended flooding and debris on roads</li>
                      <li>Use caution when entering buildings; there may be hidden damage</li>
                      <li>Wear sturdy shoes and protective clothing during cleanup</li>
                      <li>Take photographs of damage for insurance claims before cleanup begins</li>
                    </ul>
                  </div>
                  <div className="flex justify-center">
                    <img 
                      src="/lovable-uploads/af814f76-c775-4787-8101-424b034b8dd1.png" 
                      alt="Protective clothing for flood cleanup" 
                      className="rounded-lg max-h-60 object-cover shadow-md" 
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="health-safety">
              <AccordionTrigger className="text-xl font-semibold">
                <div className="flex items-center">
                  <Droplets className="mr-2 h-5 w-5 text-blue-600" />
                  Health and Safety Precautions
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Avoid floodwater as it may be contaminated with sewage, oil, chemicals, or other substances</li>
                      <li>Wash hands thoroughly with soap and clean water after contact with floodwater</li>
                      <li>Do not allow children to play in floodwater areas</li>
                      <li>Discard food that has come in contact with floodwater, including canned goods</li>
                      <li>Use bottled, boiled, or treated water until your water supply is tested and found safe</li>
                      <li>Avoid mosquito bites by using repellent and wearing long sleeves and pants</li>
                    </ul>
                  </div>
                  <div className="flex justify-center">
                    <img 
                      src="/lovable-uploads/91360f94-3d53-414b-8fdd-b75a20cdf17a.png" 
                      alt="People collecting safe water after flood" 
                      className="rounded-lg max-h-60 object-cover shadow-md" 
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <img 
                    src="/lovable-uploads/5ce7cd7e-0ba7-451e-92c4-f77bbda1f1e2.png" 
                    alt="Preventing mosquito bites after flood" 
                    className="rounded-lg max-h-60 object-cover shadow-md" 
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="building-safety">
              <AccordionTrigger className="text-xl font-semibold">
                <div className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
                  Building Safety
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Check for structural damage before entering your home</li>
                      <li>Turn off the main power until an electrician can inspect your system for safety</li>
                      <li>Check for gas leaks - if you smell gas or hear a hissing noise, leave immediately and call for help</li>
                      <li>Check for water and sewage system damage - avoid using tap water until safety is confirmed</li>
                      <li>Clean and disinfect everything that got wet using a bleach solution</li>
                      <li>Remove all porous materials that have been wet for more than 48 hours (drywall, carpeting, etc.)</li>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-4">
                    <img 
                      src="/lovable-uploads/cda899ee-5aef-4342-8875-3760f8a561cf.png" 
                      alt="Turn off power after flood" 
                      className="rounded-lg w-full object-cover shadow-md" 
                    />
                    <img 
                      src="/lovable-uploads/c9a96d2b-7dd4-431d-8c79-14956bba8c1a.png" 
                      alt="Check for gas leaks after flood" 
                      className="rounded-lg w-full object-cover shadow-md" 
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <img 
                    src="/lovable-uploads/12a7a3ff-2b79-4bdd-b90e-7fff046f445a.png" 
                    alt="Flood damaged living room" 
                    className="rounded-lg max-w-md object-cover shadow-md" 
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="preventing-mold">
              <AccordionTrigger className="text-xl font-semibold">
                <div className="flex items-center">
                  <Fan className="mr-2 h-5 w-5 text-purple-600" />
                  Preventing Mold
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Clean wet items and surfaces with disinfectant</li>
                      <li>Remove and discard items that cannot be washed and disinfected (mattresses, carpeting, stuffed toys)</li>
                      <li>Remove drywall and insulation that has been contaminated</li>
                      <li>Run fans and dehumidifiers to reduce moisture</li>
                      <li>Open doors and windows to allow fresh air to circulate when possible</li>
                    </ul>
                  </div>
                  <div className="flex justify-center">
                    <img 
                      src="/lovable-uploads/fbdc07d5-bac4-48ee-be60-42a9d67f566c.png" 
                      alt="Removing contaminated drywall and insulation" 
                      className="rounded-lg max-h-60 object-cover shadow-md" 
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="documentation">
              <AccordionTrigger className="text-xl font-semibold">
                <div className="flex items-center">
                  <Camera className="mr-2 h-5 w-5 text-indigo-600" />
                  Documentation and Recovery Assistance
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Document all damage with photographs and detailed notes</li>
                      <li>Contact your insurance agent as soon as possible to start the claims process</li>
                      <li>Keep receipts for all cleanup and repair costs</li>
                      <li>Register with disaster relief services if available in your area</li>
                      <li>Apply for disaster assistance if your area has been declared a disaster zone</li>
                    </ul>
                  </div>
                  <div className="flex justify-center">
                    <img 
                      src="/lovable-uploads/0efd338a-2b79-450b-9099-e57c1a1e4b9d.png" 
                      alt="Disaster relief registration" 
                      className="rounded-lg max-h-60 object-cover shadow-md" 
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <img 
                    src="/lovable-uploads/29470f06-b6c7-485f-8964-2704e982343b.png" 
                    alt="Home flood damage overview" 
                    className="rounded-lg max-w-md object-cover shadow-md" 
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="bg-green-50 p-6 border-l-4 border-green-500 my-8 rounded-r-md">
            <h3 className="text-green-800 text-xl font-medium mb-2">Remember:</h3>
            <p className="text-green-700">
              Recovery takes time. Take care of your physical and mental health during this process.
              Seek help if you feel overwhelmed. Community resources are often available to assist during recovery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyAfterFlood;
