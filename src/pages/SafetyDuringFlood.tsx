
import React from 'react';
import { Shield, AlertTriangle, AlertCircle, Navigation, Droplets, HomeIcon, PhoneCall } from 'lucide-react';
import { motion } from 'framer-motion';

const SafetyDuringFlood = () => {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center mb-8"
        >
          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg mr-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">During a Flood: Safety Guidelines</h1>
            <p className="text-orange-700 mt-1">Critical actions to take when flooding is occurring</p>
          </div>
        </motion.div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="relative h-64">
              <img 
                src="/lovable-uploads/433dcfbf-0d9c-4d28-878e-b79404f107d2.png" 
                alt="Flash flood warning sign" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <p className="text-xl font-medium max-w-2xl">
                  During a flood, conditions can change rapidly. Follow these critical guidelines to protect yourself and your family.
                </p>
              </div>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-red-50 border-l-4 border-red-600 rounded-r-xl p-6 mb-8"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold text-red-800">Critical Warning</h3>
                <p className="text-red-700 text-lg">
                  If you are advised to evacuate by authorities, do so immediately. 
                  Do not wait or delay. Your safety is the top priority.
                </p>
              </div>
            </div>
          </motion.div>
          
          <div className="prose prose-lg max-w-none">            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-md p-6 mb-8 border-l-4 border-blue-600"
            >
              <div className="flex items-center mb-4">
                <AlertCircle className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-blue-800 m-0">Stay Informed</h2>
              </div>
              
              <ul className="space-y-3 pl-0 list-none">
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  </div>
                  <span>Monitor local news, weather reports, and emergency channels continuously</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  </div>
                  <span>Follow instructions from local authorities</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  </div>
                  <span>Be alert for flood warnings and evacuation notices</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  </div>
                  <span>Keep your emergency contact information handy</span>
                </li>
              </ul>
              
              <div className="flex flex-col md:flex-row md:items-center bg-blue-50 rounded-xl p-4 mt-6">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 flex justify-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <PhoneCall className="h-6 w-6 text-blue-700" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-blue-800">Emergency Contacts</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center">
                      <span className="font-medium text-blue-700">National Emergency:</span>
                      <span className="ml-2">112</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-blue-700">Flood Control Room:</span>
                      <span className="ml-2">1800-180-1551</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <img 
                  src="/lovable-uploads/29383ae2-2cf4-4fb9-af97-1b47cbf424b7.png" 
                  alt="Evacuation route map example" 
                  className="w-full h-64 object-cover rounded-xl shadow-md"
                />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-md p-6"
              >
                <div className="flex items-center">
                  <Navigation className="h-7 w-7 text-red-600 mr-2" />
                  <h2 className="text-2xl font-bold text-red-800">EVACUATION SAFETY</h2>
                </div>
                <div className="w-16 h-1 bg-red-300 my-3"></div>
                
                <ul className="space-y-3 pl-0 list-none mt-4">
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-red-200 flex items-center justify-center mr-3 mt-1">
                      <div className="h-2 w-2 rounded-full bg-red-600"></div>
                    </div>
                    <span>If ordered to evacuate, do so immediately</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-red-200 flex items-center justify-center mr-3 mt-1">
                      <div className="h-2 w-2 rounded-full bg-red-600"></div>
                    </div>
                    <span>Follow recommended evacuation routes – shortcuts may be blocked</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-red-200 flex items-center justify-center mr-3 mt-1">
                      <div className="h-2 w-2 rounded-full bg-red-600"></div>
                    </div>
                    <span>Do not drive around barricades – they are placed for your safety</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-red-200 flex items-center justify-center mr-3 mt-1">
                      <div className="h-2 w-2 rounded-full bg-red-600"></div>
                    </div>
                    <span>Take only essential items and your emergency kit</span>
                  </li>
                </ul>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-2xl shadow-md p-6 mb-8 border-l-4 border-amber-500"
            >
              <div className="flex items-center mb-3">
                <HomeIcon className="h-8 w-8 text-amber-600 mr-3" />
                <h2 className="text-2xl font-bold text-amber-800 m-0">IF YOU CANNOT EVACUATE</h2>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-xl mb-4">
                <ul className="space-y-3 pl-0 list-none">
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-amber-200 flex items-center justify-center mr-3 mt-1">
                      <div className="h-2 w-2 rounded-full bg-amber-600"></div>
                    </div>
                    <span>Move to the highest level of the building</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-amber-200 flex items-center justify-center mr-3 mt-1">
                      <div className="h-2 w-2 rounded-full bg-amber-600"></div>
                    </div>
                    <span>Stay away from windows and doors</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-amber-200 flex items-center justify-center mr-3 mt-1">
                      <div className="h-2 w-2 rounded-full bg-amber-600"></div>
                    </div>
                    <span>Do NOT go into a closed attic, as you may become trapped by rising floodwater</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-amber-200 flex items-center justify-center mr-3 mt-1">
                      <div className="h-2 w-2 rounded-full bg-amber-600"></div>
                    </div>
                    <span>Go onto the roof only if necessary and signal for help</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex justify-center">
                <button className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Use Emergency Report Feature
                </button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-2xl shadow-md p-6 mb-8 border-l-4 border-red-600"
            >
              <div className="flex items-center mb-4">
                <Droplets className="h-8 w-8 text-red-600 mr-3" />
                <h2 className="text-2xl font-bold text-red-800 m-0">AVOID FLOODWATERS</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <ul className="space-y-3 pl-0 list-none">
                    <li className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-3 mt-1" />
                      <span>Never attempt to walk, swim, or drive through floodwater</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-3 mt-1" />
                      <span>Just 15 cm of fast-moving water can knock you off your feet</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-3 mt-1" />
                      <span>30 cm of water is enough to float a vehicle</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-3 mt-1" />
                      <span>60 cm of flowing water can sweep away most vehicles, including SUVs</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5">
                  <h3 className="font-bold text-red-800 mb-3">Hidden Dangers</h3>
                  <p className="mb-3">Floodwater may contain:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 shadow-sm flex items-center space-x-2">
                      <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Sewage & Chemicals</span>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm flex items-center space-x-2">
                      <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Dangerous Debris</span>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm flex items-center space-x-2">
                      <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Hidden Sharp Objects</span>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm flex items-center space-x-2">
                      <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Electrical Hazards</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-100 border border-red-200 rounded-xl p-4 mt-6 flex">
                <div className="bg-red-600 text-white p-3 rounded-lg mr-4 flex-shrink-0">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="font-bold text-red-800 text-lg">Turn Around, Don't Drown!®</h4>
                  <p className="text-red-700 m-0">
                    This national campaign warns people of the hazards of walking or driving through flood waters.
                    Never attempt to cross flooded roads or streams.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-600"
              >
                <h2 className="text-xl font-bold text-blue-800 mb-4">If You're in a Vehicle</h2>
                <ul className="space-y-3 pl-0 list-none">
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                      <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    </div>
                    <span>Turn around, don't drown! Never drive through flooded roads</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                      <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    </div>
                    <span>If your vehicle stalls in rising water, abandon it immediately and move to higher ground</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                      <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    </div>
                    <span>Be especially cautious at night when it's harder to see flood dangers</span>
                  </li>
                </ul>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <img 
                  src="/lovable-uploads/d6e192bf-00ce-41a2-a5dd-ae580e638b4f.png" 
                  alt="Contaminated water warning" 
                  className="w-full h-full object-cover rounded-xl shadow-md"
                />
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <img 
                  src="/lovable-uploads/f0786497-0f3d-498d-8197-d7c5d7f0a8fd.png" 
                  alt="Power outage safety diagram" 
                  className="w-full h-full object-cover rounded-xl shadow-md"
                />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6"
              >
                <div className="flex items-center">
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    className="h-7 w-7 text-blue-700 mr-2"
                  >
                    <path d="M12 2v6M5 12H2M7 19l-3 3M17 19l3 3M22 12h-3M12 22v-2M7 5l-3-3M17 5l3-3" />
                  </svg>
                  <h2 className="text-2xl font-bold text-blue-800">POWER AND UTILITIES</h2>
                </div>
                <div className="w-16 h-1 bg-blue-300 my-3"></div>
                
                <ul className="space-y-3 pl-0 list-none mt-4">
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-blue-200 flex items-center justify-center mr-3 mt-1">
                      <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    </div>
                    <span>If you smell gas or suspect a leak, turn off the main gas valve and evacuate immediately</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-blue-200 flex items-center justify-center mr-3 mt-1">
                      <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    </div>
                    <span>Switch off electricity at the main panel if the area is flooded or about to flood</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-blue-200 flex items-center justify-center mr-3 mt-1">
                      <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    </div>
                    <span>Never touch electrical equipment if you are wet or standing in water</span>
                  </li>
                </ul>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-8 shadow-lg text-white mb-8"
            >
              <div className="flex items-center mb-2">
                <AlertCircle className="h-7 w-7 text-amber-200 mr-3" />
                <h3 className="text-2xl font-bold">Remember:</h3>
              </div>
              <p className="mb-0 text-amber-50 text-lg">
                Your safety is more important than your possessions. Do not risk your life to save material items.
                If you need urgent assistance, use the Emergency Report feature or call the national emergency number 112.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="flex justify-center mb-8"
            >
              <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
                <h3 className="text-center text-xl font-bold text-blue-800 mb-4">Emergency Kit Essentials</h3>
                <img 
                  src="/lovable-uploads/d5181fca-17bd-420a-b0e9-603e8a8691f0.png" 
                  alt="First aid kit supplies" 
                  className="w-full h-48 object-contain mb-4"
                />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <span className="font-medium text-blue-800">First aid supplies</span>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <span className="font-medium text-blue-800">Drinking water</span>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <span className="font-medium text-blue-800">Flashlights & batteries</span>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <span className="font-medium text-blue-800">Battery radio</span>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <span className="font-medium text-blue-800">Important documents</span>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <span className="font-medium text-blue-800">Non-perishable food</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyDuringFlood;
