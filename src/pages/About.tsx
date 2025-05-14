
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Info className="h-8 w-8 mr-2 text-blue-600" />
        <h1 className="text-3xl font-bold">About India Flood Vision</h1>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
            <CardDescription>Why we created this platform</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              India Flood Vision was established in 2023 with a mission to provide accurate, timely, and accessible flood information to the citizens of India. 
              We aim to save lives and minimize property damage by equipping people with the knowledge and tools they need before, during, and after flood events.
            </p>
            <p>
              Our platform combines real-time data from multiple government agencies, historical flood records, and predictive modeling 
              to create a comprehensive flood monitoring and prediction system that serves both the public and government agencies.
            </p>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Data Sources</CardTitle>
            <CardDescription>Where our information comes from</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              We rely on official data from authoritative sources to ensure the accuracy of our flood information:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Weather Services:</strong> Weather forecasts and rainfall data</li>
              <li><strong>Central Water Commission:</strong> River water levels and flow data</li>
              <li><strong>National Remote Sensing Centre:</strong> Satellite imagery for flood mapping</li>
              <li><strong>National Disaster Management Authority:</strong> Disaster management protocols and data</li>
              <li><strong>State Water Resources Departments:</strong> Local water body information and dam release schedules</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Team</CardTitle>
            <CardDescription>The people behind India Flood Vision</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              India Flood Vision is a collaborative project between hydrologists, data scientists, disaster management experts, and software developers:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Dr. Rajesh Sharma:</strong> Lead Hydrologist - 15+ years experience in flood modeling</li>
              <li><strong>Priya Patel:</strong> GIS Specialist - Expert in spatial analysis and flood mapping</li>
              <li><strong>Arjun Mehta:</strong> Data Scientist - Specializes in predictive modeling for natural disasters</li>
              <li><strong>Neha Gupta:</strong> Emergency Response Coordinator - 10+ years in disaster management</li>
              <li><strong>Vikram Singh:</strong> Technology Lead - Architect of the flood monitoring platform</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Government Affiliation</CardTitle>
            <CardDescription>Our relationship with official agencies</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              India Flood Vision operates in partnership with the National Disaster Management Authority (NDMA) and Ministry of Jal Shakti. 
              While we maintain independent operations, our emergency reporting system is directly connected to state and local disaster response teams 
              to ensure rapid action when floods threaten communities.
            </p>
            <p>
              All emergency reports submitted through our platform are simultaneously shared with the relevant local authorities, 
              district administration, and state emergency operation centers to coordinate effective response.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
