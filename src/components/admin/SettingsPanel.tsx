
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const SettingsPanel = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [matchingThreshold, setMatchingThreshold] = useState("70");
  const [moderationType, setModerationType] = useState("automated");

  const handleSaveSettings = () => {
    toast.success("Settings updated successfully");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-love-800">System Settings</h2>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure application-wide settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenance-mode" className="font-medium">Maintenance Mode</Label>
                <p className="text-sm text-gray-500">Temporarily disable the site for maintenance</p>
              </div>
              <Switch 
                id="maintenance-mode" 
                checked={maintenanceMode} 
                onCheckedChange={setMaintenanceMode} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                <p className="text-sm text-gray-500">Send email notifications to users</p>
              </div>
              <Switch 
                id="email-notifications" 
                checked={emailNotifications} 
                onCheckedChange={setEmailNotifications} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="matching-threshold" className="font-medium">Matching Threshold (%)</Label>
              <Input 
                id="matching-threshold" 
                type="number" 
                value={matchingThreshold} 
                onChange={(e) => setMatchingThreshold(e.target.value)}
                min="0"
                max="100"
              />
              <p className="text-sm text-gray-500">Minimum compatibility score for suggesting matches</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Moderation Settings</CardTitle>
            <CardDescription>Configure content moderation options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="moderation-type" className="font-medium">Moderation Type</Label>
              <Select value={moderationType} onValueChange={setModerationType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select moderation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automated">Automated</SelectItem>
                  <SelectItem value="manual">Manual Review</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="profanity-filter" className="font-medium">Profanity Filter</Label>
                <p className="text-sm text-gray-500">Automatically flag content with profanity</p>
              </div>
              <Switch id="profanity-filter" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="image-scanning" className="font-medium">Image Scanning</Label>
                <p className="text-sm text-gray-500">Automatically scan uploaded images for inappropriate content</p>
              </div>
              <Switch id="image-scanning" defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
