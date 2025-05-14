
import React from 'react';
import { Shield, CheckCircle, AlertCircle, Home, Package, Navigation, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const SafetyBeforeFlood = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
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
            <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Before a Flood: Preparation Guide</h1>
          </div>
        </motion.div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="relative h-64">
              <img 
                src="/lovable-uploads/5f3d8cc2-d84d-4f19-a9fa-dbb2aa7c7fa5.png" 
                alt="Family preparing for flood" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <p className="text-xl font-medium max-w-2xl">
                  Being prepared before a flood occurs is crucial to protecting yourself, your family, and your property.
                </p>
              </div>
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl text-blue-800 font-medium mb-8">
              Follow these guidelines to ensure you're ready well in advance of potential flooding.
            </p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-md p-6 mb-8 border-l-4 border-blue-600"
            >
              <div className="flex items-center mb-4">
                <Home className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-blue-800 m-0">Create an Emergency Plan</h2>
              </div>
              <ul className="space-y-3 pl-0 list-none">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Develop a household evacuation plan with multiple routes to safety</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Establish a family communication plan and meeting points</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Designate an out-of-area contact person</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Plan for pets and livestock</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Practice your evacuation plan with all family members</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-md p-6 mb-8 border-l-4 border-green-500"
            >
              <div className="flex items-center mb-4">
                <Package className="h-8 w-8 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-green-800 m-0">Prepare an Emergency Kit</h2>
              </div>
              
              <p>Your emergency kit should include:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-green-50 p-4 rounded-xl">
                  <h3 className="font-bold text-green-800 mb-3 text-lg">Water & Food</h3>
                  <ul className="space-y-2 pl-0 list-none">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span>3 liters of water per person per day</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span>At least 3 days of non-perishable food</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h3 className="font-bold text-blue-800 mb-3 text-lg">Medical & First Aid</h3>
                  <ul className="space-y-2 pl-0 list-none">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                      <span>First aid supplies and medications</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                      <span>Prescription medications and medical items</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-xl">
                  <h3 className="font-bold text-purple-800 mb-3 text-lg">Communication & Light</h3>
                  <ul className="space-y-2 pl-0 list-none">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-purple-500 mr-2 mt-1 flex-shrink-0" />
                      <span>Battery-powered or hand-crank radio</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-purple-500 mr-2 mt-1 flex-shrink-0" />
                      <span>Flashlights and extra batteries</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-purple-500 mr-2 mt-1 flex-shrink-0" />
                      <span>Mobile phone with chargers and backup battery</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-xl">
                  <h3 className="font-bold text-amber-800 mb-3 text-lg">Documentation & Money</h3>
                  <ul className="space-y-2 pl-0 list-none">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-amber-500 mr-2 mt-1 flex-shrink-0" />
                      <span>Important documents in waterproof container</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-amber-500 mr-2 mt-1 flex-shrink-0" />
                      <span>Cash and emergency contact information</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-amber-500 mr-2 mt-1 flex-shrink-0" />
                      <span>Copies of insurance policies and ID cards</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl mt-6">
                <div className="flex">
                  <AlertCircle className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">Pro Tip</h4>
                    <p className="text-blue-700 text-sm m-0">
                      Store your emergency kit in a designated place and make sure all family members know where it is. 
                      Keep a smaller version of the emergency kit in your vehicle.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-md p-6 mb-8 border-l-4 border-amber-500"
            >
              <div className="flex items-center mb-4">
                <AlertCircle className="h-8 w-8 text-amber-600 mr-3" />
                <h2 className="text-2xl font-bold text-amber-800 m-0">Know Your Risk</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ul className="space-y-3 pl-0 list-none">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-amber-500 mr-3 mt-1 flex-shrink-0" />
                      <span>Learn about the flood risk in your area</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-amber-500 mr-3 mt-1 flex-shrink-0" />
                      <span>Understand flood warning terms: Watch vs. Warning</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-amber-500 mr-3 mt-1 flex-shrink-0" />
                      <span>Know your elevation level and if your property is in a flood-prone area</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-amber-500 mr-3 mt-1 flex-shrink-0" />
                      <span>Identify nearby streams, drainage channels, and other areas known to flood suddenly</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5">
                  <h3 className="font-bold text-amber-800 mb-2 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" /> Understanding Flood Terms
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 border-l-4 border-yellow-400">
                      <h4 className="font-medium text-yellow-800 text-sm">Flood Watch</h4>
                      <p className="text-sm text-gray-600 m-0">Conditions are favorable for flooding. Be prepared to move to higher ground.</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border-l-4 border-red-500">
                      <h4 className="font-medium text-red-800 text-sm">Flood Warning</h4>
                      <p className="text-sm text-gray-600 m-0">Flooding is imminent or occurring. Take necessary precautions immediately.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-2xl shadow-md p-6 mb-8 border-l-4 border-purple-500"
            >
              <div className="flex items-center mb-4">
                <Home className="h-8 w-8 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-purple-800 m-0">Protect Your Home</h2>
              </div>
              <ul className="space-y-3 pl-0 list-none">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Install check valves in plumbing to prevent floodwater backup</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Consider building barriers to stop floodwater from entering your home</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Seal basement walls with waterproofing compounds</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Elevate electrical switches, sockets, circuit breakers, and wiring</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Move valuable items and important documents to upper floors or higher shelves</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Consider flood insurance if you are in a flood-prone area</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-2xl shadow-md p-6 mb-8 border-l-4 border-green-500"
            >
              <div className="flex items-center mb-4">
                <Bell className="h-8 w-8 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-green-800 m-0">Stay Informed</h2>
              </div>
              <ul className="space-y-3 pl-0 list-none">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Monitor local weather reports regularly</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Sign up for flood alerts from the India Meteorological Department</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Keep a battery-operated or hand-crank radio to receive emergency communications</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Follow local authorities' social media accounts for updates</span>
                </li>
              </ul>
              
              <div className="bg-green-50 rounded-xl p-4 mt-6 border border-green-100">
                <h4 className="font-bold text-green-800 mb-3 flex items-center">
                  <Bell className="h-5 w-5 mr-2" /> Official Alert Sources
                </h4>
                <div className="flex flex-wrap gap-2">
                  <a href="https://mausam.imd.gov.in/" target="_blank" rel="noopener noreferrer" 
                     className="bg-white px-3 py-2 rounded-lg text-sm text-blue-700 border border-blue-100 hover:bg-blue-50 transition-colors">
                    IMD Weather Alerts
                  </a>
                  <a href="https://ndma.gov.in/" target="_blank" rel="noopener noreferrer" 
                     className="bg-white px-3 py-2 rounded-lg text-sm text-blue-700 border border-blue-100 hover:bg-blue-50 transition-colors">
                    NDMA Alerts
                  </a>
                  <a href="#" 
                     className="bg-white px-3 py-2 rounded-lg text-sm text-blue-700 border border-blue-100 hover:bg-blue-50 transition-colors">
                    Local District Alerts
                  </a>
                  <a href="#" 
                     className="bg-white px-3 py-2 rounded-lg text-sm text-blue-700 border border-blue-100 hover:bg-blue-50 transition-colors">
                    SMS Alert Registration
                  </a>
                </div>
              </div>
            </motion.div>
            
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Remember:</h3>
                  <p className="mb-0 text-blue-100">
                    Floods can happen anywhere, even in areas that have never flooded before. 
                    Taking precautions now can save lives and minimize property damage later.
                  </p>
                </div>
                <Shield className="h-16 w-16 text-blue-300 flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyBeforeFlood;
