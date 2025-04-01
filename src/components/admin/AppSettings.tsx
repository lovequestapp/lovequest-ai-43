
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Database, Shield, TestTube, Save, RefreshCcw, Server } from "lucide-react";
import { useTestMode } from '@/context/TestModeContext';
import { toast } from 'sonner';

const AppSettings = () => {
  const { isTestMode, toggleTestMode, saveDemoSettings } = useTestMode();
  const [isUpdating, setIsUpdating] = useState(false);
  const [settings, setSettings] = useState({
    appName: "LoveQuest",
    apiUrl: "https://api.lovequest.app/v1",
    matchingAlgorithm: "preference-based",
    privacySettings: {
      dataRetention: 90,
      allowLocationTracking: true,
      anonymousMatchingEnabled: false,
    },
    testMode: isTestMode
  });

  const handleToggleTestMode = () => {
    toggleTestMode();
    setSettings(prev => ({
      ...prev,
      testMode: !prev.testMode
    }));
  };

  const handleSaveSettings = () => {
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      saveDemoSettings(settings);
      
      // Update test mode based on setting
      if (isTestMode !== settings.testMode) {
        toggleTestMode();
      }
      
      setIsUpdating(false);
      toast.success("Settings saved successfully");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-love-800">App Settings</h2>
          <p className="text-love-600">Configure application settings and parameters</p>
        </div>
        
        <Button 
          onClick={handleSaveSettings} 
          className="bg-love-600 hover:bg-love-700"
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-love-500" />
              General Settings
            </CardTitle>
            <CardDescription>Configure basic application settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="app-name">Application Name</Label>
              <Input 
                id="app-name" 
                value={settings.appName} 
                onChange={(e) => setSettings({...settings, appName: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api-url">API Base URL</Label>
              <Input 
                id="api-url" 
                value={settings.apiUrl} 
                onChange={(e) => setSettings({...settings, apiUrl: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="matching-algorithm">Matching Algorithm</Label>
              <select 
                id="matching-algorithm" 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={settings.matchingAlgorithm}
                onChange={(e) => setSettings({...settings, matchingAlgorithm: e.target.value})}
              >
                <option value="preference-based">Preference Based</option>
                <option value="compatibility-score">Compatibility Score</option>
                <option value="geographic">Geographic Proximity</option>
                <option value="hybrid">Hybrid (Multiple Factors)</option>
              </select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-love-500" />
              Privacy & Security
            </CardTitle>
            <CardDescription>Configure privacy and security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="data-retention">Data Retention Period (days)</Label>
              <Input 
                id="data-retention" 
                type="number" 
                value={settings.privacySettings.dataRetention}
                onChange={(e) => setSettings({
                  ...settings, 
                  privacySettings: {
                    ...settings.privacySettings,
                    dataRetention: parseInt(e.target.value)
                  }
                })}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="location-tracking" 
                checked={settings.privacySettings.allowLocationTracking}
                onCheckedChange={(checked) => setSettings({
                  ...settings, 
                  privacySettings: {
                    ...settings.privacySettings,
                    allowLocationTracking: checked
                  }
                })}
              />
              <Label htmlFor="location-tracking">Allow Location Tracking</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="anonymous-matching" 
                checked={settings.privacySettings.anonymousMatchingEnabled}
                onCheckedChange={(checked) => setSettings({
                  ...settings, 
                  privacySettings: {
                    ...settings.privacySettings,
                    anonymousMatchingEnabled: checked
                  }
                })}
              />
              <Label htmlFor="anonymous-matching">Enable Anonymous Matching</Label>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-amber-800">
            <TestTube className="h-5 w-5 mr-2 text-amber-600" />
            Test Mode Settings
          </CardTitle>
          <CardDescription className="text-amber-700">
            Configure test mode for development and testing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
            <div className="flex items-center space-x-2">
              <Switch 
                id="test-mode" 
                checked={settings.testMode}
                onCheckedChange={() => handleToggleTestMode()}
              />
              <div>
                <Label htmlFor="test-mode" className="font-medium">Test Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enable test mode with demo profiles and simulated features
                </p>
              </div>
            </div>
            
            <Badge 
              className={settings.testMode ? "bg-amber-500" : "bg-gray-500"}
            >
              {settings.testMode ? "Active" : "Inactive"}
            </Badge>
          </div>
          
          {settings.testMode && (
            <div className="p-3 bg-white rounded-md shadow-sm space-y-3">
              <h4 className="font-semibold text-amber-800 flex items-center">
                <Server className="h-4 w-4 mr-2 text-amber-600" />
                Test Environment
              </h4>
              <p className="text-sm text-amber-700">
                Demo profiles are active. These profiles will appear in matches and discovery features.
                You can interact with them as if they were real users.
              </p>
              <Separator className="bg-amber-200" />
              <div className="text-sm text-amber-800 flex items-center gap-2">
                <Badge className="bg-green-500">25 Demo Profiles</Badge>
                <span>•</span>
                <span>Test API: Enabled</span>
                <span>•</span>
                <span>Simulated Matching: Active</span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-amber-100 text-amber-800 text-sm rounded-b-lg">
          <p>
            ⚠️ Test mode is for development purposes only. All data created in test mode 
            is isolated from production data.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AppSettings;
