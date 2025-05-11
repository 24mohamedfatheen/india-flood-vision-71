
import React from 'react';
import { Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

const Settings = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Settings className="h-8 w-8 mr-2 text-blue-600" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Configure how you receive alerts and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive alerts via email</p>
              </div>
              <Switch id="email-notifications" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive alerts via SMS</p>
              </div>
              <Switch id="sms-notifications" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive push notifications</p>
              </div>
              <Switch id="push-notifications" defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Display Settings</CardTitle>
            <CardDescription>Customize your viewing experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <RadioGroup defaultValue="light">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">Light</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">Dark</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system">System</Label>
                </div>
              </RadioGroup>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="high-contrast">High Contrast Mode</Label>
                <p className="text-sm text-muted-foreground">For better readability</p>
              </div>
              <Switch id="high-contrast" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-refresh">Auto-refresh Data</Label>
                <p className="text-sm text-muted-foreground">Keep flood data current</p>
              </div>
              <Switch id="auto-refresh" defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Location Settings</CardTitle>
            <CardDescription>Configure your location preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="location-services">Location Services</Label>
                <p className="text-sm text-muted-foreground">Allow access to your location</p>
              </div>
              <Switch id="location-services" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="default-region">Default Region</Label>
                <p className="text-sm text-muted-foreground">Set your preferred region</p>
              </div>
              <Switch id="default-region" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="nearby-alerts">Nearby Flood Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive alerts for nearby areas</p>
              </div>
              <Switch id="nearby-alerts" defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
            <CardDescription>Manage your privacy preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="data-collection">Data Collection</Label>
                <p className="text-sm text-muted-foreground">Allow anonymous usage data</p>
              </div>
              <Switch id="data-collection" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="third-party">Third-party Sharing</Label>
                <p className="text-sm text-muted-foreground">Share data with partners</p>
              </div>
              <Switch id="third-party" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="remember-history">Remember Search History</Label>
                <p className="text-sm text-muted-foreground">Save your search history</p>
              </div>
              <Switch id="remember-history" defaultChecked />
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">Privacy settings last updated: {new Date().toLocaleDateString()}</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
