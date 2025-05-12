
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, Heart, PowerOff } from 'lucide-react';

const SafetyTips = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Shield className="h-8 w-8 mr-2 text-blue-600" />
        <h1 className="text-3xl font-bold">Flood Safety Tips</h1>
      </div>
      
      <p className="text-lg mb-8">
        Being prepared before, during, and after a flood can save lives and protect property. 
        Review our comprehensive safety guides to ensure you and your loved ones stay safe.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow overflow-hidden">
          <div className="relative h-48 overflow-hidden">
            <img 
              src="/lovable-uploads/5f3d8cc2-d84d-4f19-a9fa-dbb2aa7c7fa5.png" 
              alt="Family emergency plan" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <h3 className="text-white text-xl font-bold p-4">Before a Flood</h3>
            </div>
          </div>
          <CardHeader>
            <CardTitle>Before a Flood</CardTitle>
            <CardDescription>Preparation measures</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Create an emergency plan for your household</li>
              <li>Prepare an emergency kit with essentials</li>
              <li>Know your evacuation routes</li>
              <li>Move valuable items to higher floors</li>
              <li>Install check valves in plumbing</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link to="/safety/before-flood" className="text-blue-600 hover:underline">Read more</Link>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow overflow-hidden">
          <div className="relative h-48 overflow-hidden">
            <img 
              src="/lovable-uploads/433dcfbf-0d9c-4d28-878e-b79404f107d2.png" 
              alt="Flash flood warning sign" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <h3 className="text-white text-xl font-bold p-4">During a Flood</h3>
            </div>
          </div>
          <CardHeader>
            <CardTitle>During a Flood</CardTitle>
            <CardDescription>Critical actions</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Stay informed through official channels</li>
              <li>Evacuate if told to do so</li>
              <li>Avoid walking or driving through flood waters</li>
              <li>Move to higher ground away from rivers</li>
              <li>Disconnect utilities if safe to do so</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link to="/safety/during-flood" className="text-blue-600 hover:underline">Read more</Link>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow overflow-hidden">
          <div className="relative h-48 overflow-hidden">
            <img 
              src="/lovable-uploads/d6e192bf-00ce-41a2-a5dd-ae580e638b4f.png" 
              alt="Contaminated water warning" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <h3 className="text-white text-xl font-bold p-4">After a Flood</h3>
            </div>
          </div>
          <CardHeader>
            <CardTitle>After a Flood</CardTitle>
            <CardDescription>Recovery guidelines</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Avoid flood water as it may be contaminated</li>
              <li>Check for structural damage before entering buildings</li>
              <li>Clean and disinfect everything that got wet</li>
              <li>Document damage for insurance purposes</li>
              <li>Watch for electrical hazards</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link to="/safety/after-flood" className="text-blue-600 hover:underline">Read more</Link>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow overflow-hidden">
          <div className="relative h-40 overflow-hidden">
            <img 
              src="/lovable-uploads/4d70bdd8-3e5a-4a99-a5af-5ef057b5e66e.png" 
              alt="First aid kit" 
              className="w-full h-full object-contain p-4"
            />
          </div>
          <CardHeader className="py-3">
            <CardTitle className="text-center">Emergency Kit</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Heart className="h-6 w-6 mx-auto mb-2 text-red-600" />
            <p className="text-sm">Keep a well-stocked emergency kit ready</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow overflow-hidden">
          <div className="relative h-40 overflow-hidden">
            <img 
              src="/lovable-uploads/29383ae2-2cf4-4fb9-af97-1b47cbf424b7.png" 
              alt="Evacuation route map" 
              className="w-full h-full object-contain p-4"
            />
          </div>
          <CardHeader className="py-3">
            <CardTitle className="text-center">Evacuation Routes</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-red-600" />
            <p className="text-sm">Know multiple evacuation routes</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow overflow-hidden">
          <div className="relative h-40 overflow-hidden">
            <img 
              src="/lovable-uploads/f0786497-0f3d-498d-8197-d7c5d7f0a8fd.png" 
              alt="Power outage safety" 
              className="w-full h-full object-contain p-4"
            />
          </div>
          <CardHeader className="py-3">
            <CardTitle className="text-center">Power Outage Safety</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <PowerOff className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <p className="text-sm">Handle power outages safely</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow overflow-hidden">
          <div className="relative h-40 overflow-hidden">
            <img 
              src="/lovable-uploads/d5181fca-17bd-420a-b0e9-603e8a8691f0.png" 
              alt="First aid kit supplies" 
              className="w-full h-full object-contain p-4"
            />
          </div>
          <CardHeader className="py-3">
            <CardTitle className="text-center">First Aid</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Heart className="h-6 w-6 mx-auto mb-2 text-red-600" />
            <p className="text-sm">Be prepared with first aid supplies</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SafetyTips;
