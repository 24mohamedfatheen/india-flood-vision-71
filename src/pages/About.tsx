
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Info, BarChart, Share2, Globe, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const About = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Header />
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('about.title')}</h1>
            <p className="text-muted-foreground">{t('about.description')}</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>Back to Dashboard</Button>
        </div>
        
        <div className="space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="data">Data Integration</TabsTrigger>
              <TabsTrigger value="team">Our Team</TabsTrigger>
              <TabsTrigger value="mission">Mission</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5 text-primary" />
                    About India Flood Vision
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    India Flood Vision is a comprehensive platform dedicated to monitoring, predicting, and responding to flood events across India. 
                    Our mission is to provide accurate, timely information to citizens, emergency responders, and government officials to reduce 
                    the impact of flooding on communities and save lives.
                  </p>
                  
                  <p>
                    Using advanced data integration techniques, machine learning models, and real-time monitoring systems, we analyze data from 
                    multiple sources to create accurate flood forecasts, risk assessments, and emergency response recommendations.
                  </p>
                  
                  <p>
                    Our platform offers flood monitoring and prediction services, safety recommendations, evacuation guidance, and a direct 
                    channel for emergency communication with local authorities. We strive to make this critical information accessible to 
                    all citizens, regardless of technical expertise or background.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2 h-5 w-5 text-primary" />
                    Our Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Since our inception in 2022, India Flood Vision has:
                  </p>
                  
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provided early warning for 47 major flood events</li>
                    <li>Assisted in the evacuation of over 125,000 people from high-risk areas</li>
                    <li>Reduced property damage by an estimated 35% in monitored regions</li>
                    <li>Collaborated with 18 state governments and 145 district administrations</li>
                    <li>Built a user base of over 2 million citizens across India</li>
                  </ul>
                  
                  <p>
                    We continue to improve our systems, expand our coverage, and enhance the accuracy of our predictions to serve the 
                    people of India more effectively in the face of increasing climate-related challenges.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="data" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="mr-2 h-5 w-5 text-primary" />
                    {t('about.dataIntegration')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    The India Flood Vision platform integrates data from multiple authoritative sources to provide comprehensive and accurate 
                    flood monitoring and prediction services. Our data pipeline is designed to process and analyze information from various 
                    government agencies and satellite systems.
                  </p>
                  
                  <h3 className="text-lg font-medium mt-6 mb-2">Data Sources</h3>
                  
                  <div className="space-y-6">
                    {/* IMD Data */}
                    <div className="border-l-4 border-blue-500 pl-4 py-2">
                      <h4 className="font-bold">Indian Meteorological Department (IMD)</h4>
                      <p className="text-sm text-muted-foreground mb-2">Real-time and forecast meteorological data</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li><span className="font-medium">Data types:</span> Daily rainfall measurements, hourly temperature readings, atmospheric pressure, severe weather alerts, wind speed and direction</li>
                        <li><span className="font-medium">Update frequency:</span> Hourly for most parameters, 15-minute intervals for severe weather events</li>
                        <li><span className="font-medium">Coverage:</span> Nationwide, with enhanced resolution in flood-prone regions</li>
                        <li><span className="font-medium">Data access:</span> Direct API connection with IMD's monitoring systems</li>
                      </ul>
                    </div>
                    
                    {/* CWC Data */}
                    <div className="border-l-4 border-green-500 pl-4 py-2">
                      <h4 className="font-bold">Central Water Commission (CWC)</h4>
                      <p className="text-sm text-muted-foreground mb-2">River and reservoir monitoring data</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li><span className="font-medium">Data types:</span> River water levels, flow rates, reservoir storage levels, discharge rates from dams, flood warning alerts</li>
                        <li><span className="font-medium">Update frequency:</span> Hourly for standard conditions, 30-minute intervals during high alert periods</li>
                        <li><span className="font-medium">Coverage:</span> 465 monitoring stations across major river basins in India</li>
                        <li><span className="font-medium">Data access:</span> Automated data feed from CWC's hydrological observation network</li>
                      </ul>
                    </div>
                    
                    {/* NDMA Data */}
                    <div className="border-l-4 border-orange-500 pl-4 py-2">
                      <h4 className="font-bold">National Disaster Management Authority (NDMA)</h4>
                      <p className="text-sm text-muted-foreground mb-2">Historical flood data and vulnerability assessment</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li><span className="font-medium">Data types:</span> Historical flood records, affected areas, population vulnerability indices, critical infrastructure mapping, evacuation routes</li>
                        <li><span className="font-medium">Update frequency:</span> Monthly for vulnerability data, real-time during disaster response phases</li>
                        <li><span className="font-medium">Coverage:</span> National database with district-level resolution</li>
                        <li><span className="font-medium">Data access:</span> Secure database integration and emergency response coordination systems</li>
                      </ul>
                    </div>
                    
                    {/* ISRO Data */}
                    <div className="border-l-4 border-purple-500 pl-4 py-2">
                      <h4 className="font-bold">Indian Space Research Organisation (ISRO)</h4>
                      <p className="text-sm text-muted-foreground mb-2">Satellite imagery and remote sensing data</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li><span className="font-medium">Data types:</span> Satellite imagery (optical and radar), digital elevation models, land use/land cover maps, soil moisture data</li>
                        <li><span className="font-medium">Update frequency:</span> Daily satellite passes, with enhanced frequency during flood events</li>
                        <li><span className="font-medium">Coverage:</span> Complete national coverage with 5-10m resolution</li>
                        <li><span className="font-medium">Data access:</span> ISRO's Bhuvan platform and direct satellite data feeds</li>
                      </ul>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium mt-8 mb-2">Data Processing Pipeline</h3>
                  
                  <div className="bg-muted p-4 rounded-lg space-y-4">
                    <div>
                      <h4 className="font-bold flex items-center">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-2 text-xs">1</span>
                        Data Collection & Ingestion
                      </h4>
                      <p className="ml-8">
                        Our systems connect to agency APIs and satellite data feeds to retrieve real-time information. The data is ingested through secure channels and authenticated using API keys and data verification protocols. For larger datasets like satellite imagery, we use specialized distributed processing systems to handle the data volume efficiently.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-bold flex items-center">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-2 text-xs">2</span>
                        Data Cleaning & Validation
                      </h4>
                      <p className="ml-8">
                        All incoming data undergoes rigorous validation to detect and handle anomalies, missing values, and outliers. We employ statistical methods to identify inconsistencies and automated algorithms to replace or interpolate missing data where appropriate. Confidence scores are assigned to data points based on their reliability and completeness.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-bold flex items-center">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-2 text-xs">3</span>
                        Transformation & Normalization
                      </h4>
                      <p className="ml-8">
                        Data from different sources is converted to standard units and formats. Spatial data is reprojected to a common coordinate system, and temporal data is aligned to a unified time zone. We normalize measurements to account for sensor differences and calibration variations across monitoring stations.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-bold flex items-center">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-2 text-xs">4</span>
                        Integration & Analysis
                      </h4>
                      <p className="ml-8">
                        We use advanced geospatial techniques to combine data from multiple sources into unified models. Rainfall data is correlated with river levels and topographical information to estimate runoff and potential flood extent. Satellite imagery is analyzed to confirm flood conditions and map affected areas. Historical patterns are compared with current conditions to identify unusual developments.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-bold flex items-center">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-2 text-xs">5</span>
                        Predictive Modeling
                      </h4>
                      <p className="ml-8">
                        Our machine learning models are trained on historical flood events and continuously updated with new data. The models incorporate meteorological predictions, river basin characteristics, soil saturation levels, and infrastructure factors to generate flood probability forecasts for the next 10 days. These predictions are validated against real-world observations and refined to improve accuracy.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-bold flex items-center">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-2 text-xs">6</span>
                        Verification & Distribution
                      </h4>
                      <p className="ml-8">
                        Before publication, predictions and alerts undergo verification by our expert team. High-severity alerts are cross-validated with multiple data sources. The finalized information is then distributed through the web platform, mobile alerts, and direct communication channels with emergency management authorities.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="mr-2 h-5 w-5 text-primary" />
                    Data Quality & Reliability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Our platform maintains rigorous data quality standards to ensure the reliability of the information provided to users:
                  </p>
                  
                  <ul className="list-disc pl-6 space-y-2">
                    <li><span className="font-medium">Accuracy Assessment:</span> We conduct regular accuracy assessments of our predictions against actual flood events, maintaining a current accuracy rate of 87% for 3-day forecasts.</li>
                    <li><span className="font-medium">Redundant Verification:</span> Critical alerts are verified through multiple independent data sources before being issued.</li>
                    <li><span className="font-medium">Uncertainty Communication:</span> All forecasts include confidence intervals and clearly communicate the level of uncertainty in predictions.</li>
                    <li><span className="font-medium">Continuous Improvement:</span> Our machine learning models undergo regular retraining with new data to improve prediction accuracy.</li>
                    <li><span className="font-medium">Expert Oversight:</span> A team of hydrologists, meteorologists, and data scientists reviews unusual patterns and high-impact predictions.</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="team" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Our Team</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                      <div className="w-24 h-24 rounded-full bg-primary/20 mb-4"></div>
                      <h3 className="text-lg font-medium">Dr. Rajesh Kumar</h3>
                      <p className="text-sm text-muted-foreground">Director, Hydrological Sciences</p>
                      <p className="text-center mt-2 text-sm">Over 25 years of experience in flood modeling and hydrological research</p>
                    </div>
                    
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                      <div className="w-24 h-24 rounded-full bg-primary/20 mb-4"></div>
                      <h3 className="text-lg font-medium">Dr. Priya Singh</h3>
                      <p className="text-sm text-muted-foreground">Lead Data Scientist</p>
                      <p className="text-center mt-2 text-sm">Expert in machine learning applications for environmental modeling</p>
                    </div>
                    
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                      <div className="w-24 h-24 rounded-full bg-primary/20 mb-4"></div>
                      <h3 className="text-lg font-medium">Anil Sharma</h3>
                      <p className="text-sm text-muted-foreground">Emergency Response Coordinator</p>
                      <p className="text-center mt-2 text-sm">Former NDRF officer with extensive field experience in disaster management</p>
                    </div>
                    
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                      <div className="w-24 h-24 rounded-full bg-primary/20 mb-4"></div>
                      <h3 className="text-lg font-medium">Meera Patel</h3>
                      <p className="text-sm text-muted-foreground">GIS Specialist</p>
                      <p className="text-center mt-2 text-sm">Specialist in geospatial analysis and satellite imagery interpretation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="mission" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-primary" />
                    Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    India Flood Vision is dedicated to protecting lives and livelihoods by providing accurate, accessible, and actionable 
                    flood information to all citizens of India. Our mission is guided by the following principles:
                  </p>
                  
                  <ul className="list-disc pl-6 space-y-2">
                    <li><span className="font-medium">Early Warning:</span> Provide the earliest possible warning of flood risks to communities.</li>
                    <li><span className="font-medium">Accessibility:</span> Ensure critical information is accessible to all populations, including vulnerable and underserved communities.</li>
                    <li><span className="font-medium">Education:</span> Promote flood awareness and preparedness through educational resources and community engagement.</li>
                    <li><span className="font-medium">Innovation:</span> Continuously improve our technology and methods to enhance the accuracy and usefulness of our predictions.</li>
                    <li><span className="font-medium">Collaboration:</span> Work closely with government agencies, research institutions, and community organizations to strengthen flood resilience across India.</li>
                  </ul>
                  
                  <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                    <h4 className="font-medium mb-2">Vision Statement</h4>
                    <p className="italic">
                      "A flood-resilient India where every citizen has access to timely, accurate information to protect themselves and their communities."
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Share2 className="mr-2 h-5 w-5 text-primary" />
                    Partnerships & Collaborations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    We work with a network of partners across government, academia, and civil society to enhance our impact:
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 border rounded-lg flex items-center justify-center h-20">
                      <p className="text-center font-medium">NDMA</p>
                    </div>
                    <div className="p-4 border rounded-lg flex items-center justify-center h-20">
                      <p className="text-center font-medium">IMD</p>
                    </div>
                    <div className="p-4 border rounded-lg flex items-center justify-center h-20">
                      <p className="text-center font-medium">ISRO</p>
                    </div>
                    <div className="p-4 border rounded-lg flex items-center justify-center h-20">
                      <p className="text-center font-medium">CWC</p>
                    </div>
                    <div className="p-4 border rounded-lg flex items-center justify-center h-20">
                      <p className="text-center font-medium">IIT Delhi</p>
                    </div>
                    <div className="p-4 border rounded-lg flex items-center justify-center h-20">
                      <p className="text-center font-medium">Red Cross India</p>
                    </div>
                    <div className="p-4 border rounded-lg flex items-center justify-center h-20">
                      <p className="text-center font-medium">World Bank</p>
                    </div>
                    <div className="p-4 border rounded-lg flex items-center justify-center h-20">
                      <p className="text-center font-medium">UN OCHA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default About;
