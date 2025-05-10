
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

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
        <Card className="hover:shadow-lg transition-shadow">
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
        
        <Card className="hover:shadow-lg transition-shadow">
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
        
        <Card className="hover:shadow-lg transition-shadow">
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
    </div>
  );
};

export default SafetyTips;
