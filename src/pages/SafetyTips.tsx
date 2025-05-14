
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, Heart, PowerOff, Droplets, Home, Users, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

const SafetyTips = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-blue-50 to-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center mb-8"
      >
        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg mr-4">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Flood Safety Tips</h1>
          <p className="text-blue-700 mt-1">Essential guidelines for before, during, and after flooding</p>
        </div>
      </motion.div>
      
      <p className="text-lg mb-10 max-w-3xl mx-auto text-gray-700">
        Being prepared before, during, and after a flood can save lives and protect property. 
        Review our comprehensive safety guides to ensure you and your loved ones stay safe during flood events.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <motion.div 
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="overflow-hidden h-full border-t-4 border-t-blue-500 shadow-lg">
            <div className="relative h-52 overflow-hidden">
              <img 
                src="/lovable-uploads/5f3d8cc2-d84d-4f19-a9fa-dbb2aa7c7fa5.png" 
                alt="Family emergency plan" 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-5 w-full">
                  <Home className="h-8 w-8 text-white mb-2" />
                  <h3 className="text-white text-2xl font-bold font-display">Before a Flood</h3>
                  <div className="w-16 h-1 bg-blue-500 mt-2"></div>
                </div>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-blue-700">Preparation Measures</CardTitle>
              <CardDescription>Critical steps to take before flooding occurs</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  </div>
                  <span>Create an emergency plan for your household</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  </div>
                  <span>Prepare an emergency kit with essentials</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  </div>
                  <span>Know your evacuation routes</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  </div>
                  <span>Install check valves in plumbing</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link 
                to="/safety/before-flood" 
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                Read complete guide
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="overflow-hidden h-full border-t-4 border-t-orange-500 shadow-lg">
            <div className="relative h-52 overflow-hidden">
              <img 
                src="/lovable-uploads/433dcfbf-0d9c-4d28-878e-b79404f107d2.png" 
                alt="Flash flood warning sign" 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-5 w-full">
                  <Droplets className="h-8 w-8 text-white mb-2" />
                  <h3 className="text-white text-2xl font-bold font-display">During a Flood</h3>
                  <div className="w-16 h-1 bg-orange-500 mt-2"></div>
                </div>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-orange-700">Critical Actions</CardTitle>
              <CardDescription>Essential steps during flood situations</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center mr-2 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-orange-600"></div>
                  </div>
                  <span>Stay informed through official channels</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center mr-2 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-orange-600"></div>
                  </div>
                  <span>Evacuate if told to do so</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center mr-2 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-orange-600"></div>
                  </div>
                  <span>Avoid walking or driving through flood waters</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center mr-2 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-orange-600"></div>
                  </div>
                  <span>Disconnect utilities if safe to do so</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link 
                to="/safety/during-flood" 
                className="text-orange-600 hover:text-orange-800 font-medium flex items-center"
              >
                Read complete guide
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="overflow-hidden h-full border-t-4 border-t-green-500 shadow-lg">
            <div className="relative h-52 overflow-hidden">
              <img 
                src="/lovable-uploads/d6e192bf-00ce-41a2-a5dd-ae580e638b4f.png" 
                alt="Contaminated water warning" 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-5 w-full">
                  <Users className="h-8 w-8 text-white mb-2" />
                  <h3 className="text-white text-2xl font-bold font-display">After a Flood</h3>
                  <div className="w-16 h-1 bg-green-500 mt-2"></div>
                </div>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-green-700">Recovery Guidelines</CardTitle>
              <CardDescription>Steps to safely recover after flooding</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-green-600"></div>
                  </div>
                  <span>Avoid flood water as it may be contaminated</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-green-600"></div>
                  </div>
                  <span>Check for structural damage before entering</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-green-600"></div>
                  </div>
                  <span>Clean and disinfect everything that got wet</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-green-600"></div>
                  </div>
                  <span>Document damage for insurance purposes</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link 
                to="/safety/after-flood" 
                className="text-green-600 hover:text-green-800 font-medium flex items-center"
              >
                Read complete guide
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
      
      <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
        <h2 className="text-2xl font-bold text-center mb-8 font-display text-blue-800">Essential Flood Safety Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 shadow-sm"
          >
            <div className="flex justify-center mb-4">
              <div className="relative">
                <img 
                  src="/lovable-uploads/4d70bdd8-3e5a-4a99-a5af-5ef057b5e66e.png" 
                  alt="First aid kit" 
                  className="w-28 h-28 object-contain"
                />
                <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md">
                  <Heart className="h-5 w-5 text-red-500" />
                </div>
              </div>
            </div>
            <h3 className="text-center text-lg font-bold text-blue-800">Emergency Kit</h3>
            <p className="text-center text-sm text-gray-600 mt-2">Keep a well-stocked emergency kit ready for evacuation</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 shadow-sm"
          >
            <div className="flex justify-center mb-4">
              <div className="relative">
                <img 
                  src="/lovable-uploads/29383ae2-2cf4-4fb9-af97-1b47cbf424b7.png" 
                  alt="Evacuation route map" 
                  className="w-28 h-28 object-contain"
                />
                <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md">
                  <Navigation className="h-5 w-5 text-orange-500" />
                </div>
              </div>
            </div>
            <h3 className="text-center text-lg font-bold text-orange-800">Evacuation Routes</h3>
            <p className="text-center text-sm text-gray-600 mt-2">Know multiple evacuation routes from your area</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 shadow-sm"
          >
            <div className="flex justify-center mb-4">
              <div className="relative">
                <img 
                  src="/lovable-uploads/f0786497-0f3d-498d-8197-d7c5d7f0a8fd.png" 
                  alt="Power outage safety" 
                  className="w-28 h-28 object-contain"
                />
                <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md">
                  <PowerOff className="h-5 w-5 text-purple-500" />
                </div>
              </div>
            </div>
            <h3 className="text-center text-lg font-bold text-purple-800">Power Outage Safety</h3>
            <p className="text-center text-sm text-gray-600 mt-2">Prepare for and safely handle power outages</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 shadow-sm"
          >
            <div className="flex justify-center mb-4">
              <div className="relative">
                <img 
                  src="/lovable-uploads/d5181fca-17bd-420a-b0e9-603e8a8691f0.png" 
                  alt="First aid kit supplies" 
                  className="w-28 h-28 object-contain"
                />
                <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md">
                  <Heart className="h-5 w-5 text-red-500" />
                </div>
              </div>
            </div>
            <h3 className="text-center text-lg font-bold text-green-800">First Aid</h3>
            <p className="text-center text-sm text-gray-600 mt-2">Learn essential first aid skills for emergencies</p>
          </motion.div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-8 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-full h-full">
            <path fill="currentColor" d="M96 352L271 44l176 308z" />
          </svg>
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <AlertTriangle className="h-12 w-12 text-yellow-300 mr-4" />
            <h2 className="text-3xl font-bold font-display">Emergency Alert Signup</h2>
          </div>
          <p className="text-center text-blue-100 max-w-lg mx-auto mb-6">
            Receive timely flood alerts and warnings directly to your phone or email. 
            Stay informed about potential flood risks in your area.
          </p>
          <div className="flex justify-center">
            <Link 
              to="/emergency"
              className="px-6 py-3 bg-white text-blue-700 rounded-lg font-bold shadow-lg hover:bg-blue-50 transition-colors"
            >
              Sign Up for Alerts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyTips;
