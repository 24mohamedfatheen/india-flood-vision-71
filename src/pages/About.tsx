
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Database, CloudRain, BarChart3, Layers } from 'lucide-react';
import Header from '@/components/Header';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      
      <div className="flex items-center mb-6">
        <Info className="h-8 w-8 mr-2 text-blue-600" />
        <h1 className="text-3xl font-bold">About India Flood Vision</h1>
      </div>
      
      <div className="max-w-4xl mx-auto">
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
          <CardHeader className="flex flex-row items-center space-x-2">
            <Database className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle>Data Integration and Sources</CardTitle>
              <CardDescription>How we collect and process our flood prediction data</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <CloudRain className="h-5 w-5 mr-2 text-blue-600" />
                India Meteorological Department (IMD)
              </h3>
              <p className="mb-3">
                We directly integrate with IMD's real-time weather data API to access the most up-to-date meteorological information:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Rainfall Data:</strong> Hourly and daily precipitation measurements from over 3,500 automated weather stations across India</li>
                <li><strong>Weather Forecasts:</strong> Short-term (1-3 days) and medium-term (3-7 days) weather predictions including rainfall probability and intensity</li>
                <li><strong>Monsoon Tracking:</strong> Real-time monsoon progression data and seasonal outlook forecasts</li>
                <li><strong>Weather Warnings:</strong> Official meteorological warnings for heavy rainfall, cyclones, and other extreme weather events</li>
                <li><strong>Historical Weather Records:</strong> Past rainfall patterns and extreme weather events dating back 50 years</li>
              </ul>
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-700">
                  Data from IMD is processed hourly through our validation pipeline to ensure accuracy and reliability. Anomalies are automatically flagged for human review.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Layers className="h-5 w-5 mr-2 text-blue-600" />
                Central Water Commission (CWC)
              </h3>
              <p className="mb-3">
                Our platform integrates comprehensive hydrological data from the CWC's network of monitoring stations:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>River Level Data:</strong> Real-time water levels from over 900 hydrological observation stations across major river basins</li>
                <li><strong>Flow Rate Measurements:</strong> Current discharge volumes and flow speeds for all major rivers and tributaries</li>
                <li><strong>Dam Operation Schedules:</strong> Planned water releases from major dams and their potential downstream impacts</li>
                <li><strong>Reservoir Levels:</strong> Current storage capacity and historical trends for 91 major reservoirs</li>
                <li><strong>Flood Forecasting:</strong> Level forecasts for key river points based on upstream conditions and expected rainfall</li>
              </ul>
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-700">
                  River level data is updated every 3 hours during normal conditions and every 30 minutes during flood situations to provide near real-time monitoring of developing flood conditions.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                National Disaster Management Authority (NDMA)
              </h3>
              <p className="mb-3">
                We incorporate critical disaster management information and historical flood records from NDMA:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Historical Flood Records:</strong> Detailed documentation of past flood events including extent, duration, and impact assessment</li>
                <li><strong>Vulnerability Maps:</strong> District and sub-district level flood vulnerability assessments based on multiple risk factors</li>
                <li><strong>Disaster Response Guidelines:</strong> Official protocols for flood preparedness, evacuation procedures, and emergency response</li>
                <li><strong>Relief Camp Locations:</strong> Database of designated emergency shelters and relief facilities with capacity information</li>
                <li><strong>Damage Assessment Reports:</strong> Post-flood analysis of affected areas to improve prediction accuracy</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">
                Indian Space Research Organisation (ISRO)
              </h3>
              <p className="mb-3">
                We leverage satellite imagery and remote sensing data from ISRO to enhance our flood monitoring and prediction capabilities:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Satellite Imagery:</strong> Near-real-time imagery from RISAT, Cartosat, and Resourcesat satellites for flood extent mapping</li>
                <li><strong>Land Cover Analysis:</strong> Detailed terrain and land use data to assess water absorption capacity and runoff patterns</li>
                <li><strong>Digital Elevation Models:</strong> High-resolution topographic data to determine natural water flow paths and flood-prone areas</li>
                <li><strong>Soil Moisture Data:</strong> Remote sensing measurements of ground saturation levels to predict additional water absorption capacity</li>
                <li><strong>Snow Cover Monitoring:</strong> For northern regions, snow accumulation and melt rate monitoring for spring flood forecasting</li>
              </ul>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-3">Data Processing Pipeline</h3>
              <p className="mb-4">
                Our sophisticated data processing pipeline ensures that information from these diverse sources is effectively transformed into accurate and actionable flood predictions:
              </p>
              <ol className="list-decimal pl-6 space-y-3 mb-4">
                <li>
                  <strong>Data Collection:</strong> Automated APIs and data feeds continuously pull information from all official sources at scheduled intervals based on update frequency.
                </li>
                <li>
                  <strong>Validation & Cleaning:</strong> Raw data undergoes rigorous validation checks to identify anomalies, inconsistencies, and missing values. Automated correction algorithms address common issues, while significant anomalies are flagged for human review.
                </li>
                <li>
                  <strong>Normalization:</strong> Data from different sources is standardized into consistent formats, units, and coordinate systems to enable integration.
                </li>
                <li>
                  <strong>Integration:</strong> Our proprietary data fusion algorithms combine meteorological, hydrological, geographical, and historical information into a unified dataset for each geographical region.
                </li>
                <li>
                  <strong>Model Input Preparation:</strong> The integrated data is transformed into feature vectors optimized for our predictive models, including temporal alignment of different data streams.
                </li>
                <li>
                  <strong>Predictive Modeling:</strong> Our ensemble of machine learning models processes the prepared data to generate flood probability forecasts, risk assessments, and expected inundation mapping.
                </li>
                <li>
                  <strong>Verification & Calibration:</strong> Predictions are continuously compared against actual outcomes to refine model parameters and improve accuracy over time.
                </li>
              </ol>
              
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <h4 className="font-medium text-blue-800 mb-2">Core Algorithms and Techniques</h4>
                <p className="text-sm text-blue-700 mb-2">
                  Our platform employs a sophisticated suite of algorithms to transform raw data into actionable flood predictions:
                </p>
                <ul className="list-disc pl-5 text-sm text-blue-700">
                  <li>Hydrological modeling using MIKE SHE and HEC-RAS frameworks</li>
                  <li>Machine learning prediction through ensemble methods (Random Forest, XGBoost, and LSTM networks)</li>
                  <li>Geospatial analysis with QGIS and custom Python libraries for terrain-based flow analysis</li>
                  <li>Time series forecasting with ARIMA and Prophet models for river level predictions</li>
                  <li>Bayesian network models for uncertainty quantification in predictions</li>
                  <li>Computer vision algorithms for satellite imagery interpretation and flood extent mapping</li>
                </ul>
              </div>
              
              <p className="font-medium">
                Through this comprehensive integration of data sources and advanced processing techniques, India Flood Vision delivers highly accurate, localized flood predictions to help communities prepare for and respond to flooding events across the country.
              </p>
            </div>
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
