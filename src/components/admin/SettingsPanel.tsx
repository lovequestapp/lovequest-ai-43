
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Shield, Mail, Bell, Database, Server } from "lucide-react";

const SettingsPanel = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    siteName: "LoveQuest",
    allowRegistration: true,
    requireEmailVerification: true,
    maintenanceMode: false,
    maxPhotosPerProfile: 6,
    maxActiveMatches: 50,
    emailNotifications: {
      newMatches: true,
      messages: true,
      systemUpdates: false
    },
    moderationSettings: {
      autoModerateMessages: true,
      moderationLevel: "medium",
      blockExplicitContent: true
    }
  });
  
  const handleSaveSettings = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast.success("Settings saved successfully");
    }, 800);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-love-800">Settings</h2>
        <Button 
          onClick={handleSaveSettings} 
          disabled={saving}
          className="bg-love-600 hover:bg-love-700"
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="general" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="moderation" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Moderation</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-1">
            <Server className="h-4 w-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage basic application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Application Name</Label>
                <Input 
                  id="site-name" 
                  value={settings.siteName} 
                  onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-photos">Maximum Photos Per Profile</Label>
                <Select 
                  value={settings.maxPhotosPerProfile.toString()} 
                  onValueChange={(value) => setSettings({...settings, maxPhotosPerProfile: parseInt(value)})}
                >
                  <SelectTrigger id="max-photos">
                    <SelectValue placeholder="Select a limit" />
                  </SelectTrigger>
                  <SelectContent>
                    {[3, 4, 5, 6, 8, 10].map(value => (
                      <SelectItem key={value} value={value.toString()}>{value}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-matches">Maximum Active Matches</Label>
                <Select 
                  value={settings.maxActiveMatches.toString()} 
                  onValueChange={(value) => setSettings({...settings, maxActiveMatches: parseInt(value)})}
                >
                  <SelectTrigger id="max-matches">
                    <SelectValue placeholder="Select a limit" />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 20, 30, 50, 100, 'Unlimited'].map(value => (
                      <SelectItem key={value} value={value.toString()}>{value}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allow-registration">Allow New Registrations</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable new user registration
                  </p>
                </div>
                <Switch 
                  id="allow-registration" 
                  checked={settings.allowRegistration}
                  onCheckedChange={(checked) => setSettings({...settings, allowRegistration: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-verification">Require Email Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Users must verify their email before using the app
                  </p>
                </div>
                <Switch 
                  id="email-verification" 
                  checked={settings.requireEmailVerification}
                  onCheckedChange={(checked) => setSettings({...settings, requireEmailVerification: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage email and push notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications-matches">New Match Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send email notifications for new matches
                  </p>
                </div>
                <Switch 
                  id="notifications-matches" 
                  checked={settings.emailNotifications.newMatches}
                  onCheckedChange={(checked) => setSettings({
                    ...settings, 
                    emailNotifications: {
                      ...settings.emailNotifications,
                      newMatches: checked
                    }
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications-messages">Message Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send email notifications for new messages
                  </p>
                </div>
                <Switch 
                  id="notifications-messages" 
                  checked={settings.emailNotifications.messages}
                  onCheckedChange={(checked) => setSettings({
                    ...settings, 
                    emailNotifications: {
                      ...settings.emailNotifications,
                      messages: checked
                    }
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications-system">System Update Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send email notifications for system updates
                  </p>
                </div>
                <Switch 
                  id="notifications-system" 
                  checked={settings.emailNotifications.systemUpdates}
                  onCheckedChange={(checked) => setSettings({
                    ...settings, 
                    emailNotifications: {
                      ...settings.emailNotifications,
                      systemUpdates: checked
                    }
                  })}
                />
              </div>
              
              <div className="space-y-2 pt-4">
                <Label htmlFor="notification-template">Email Template</Label>
                <Textarea 
                  id="notification-template" 
                  placeholder="Enter the HTML template for email notifications..."
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  Use {"{username}"}, {"{matchName}"}, and {"{appName}"} as placeholders in your template.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="moderation">
          <Card>
            <CardHeader>
              <CardTitle>Moderation Settings</CardTitle>
              <CardDescription>Configure content moderation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-moderate">Auto-Moderate Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically scan and flag inappropriate content
                  </p>
                </div>
                <Switch 
                  id="auto-moderate" 
                  checked={settings.moderationSettings.autoModerateMessages}
                  onCheckedChange={(checked) => setSettings({
                    ...settings, 
                    moderationSettings: {
                      ...settings.moderationSettings,
                      autoModerateMessages: checked
                    }
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="moderation-level">Moderation Strictness</Label>
                <Select 
                  value={settings.moderationSettings.moderationLevel} 
                  onValueChange={(value) => setSettings({
                    ...settings, 
                    moderationSettings: {
                      ...settings.moderationSettings,
                      moderationLevel: value
                    }
                  })}
                >
                  <SelectTrigger id="moderation-level">
                    <SelectValue placeholder="Select moderation level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Flag only severe violations</SelectItem>
                    <SelectItem value="medium">Medium - Balanced approach</SelectItem>
                    <SelectItem value="high">High - Strict moderation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="block-explicit">Block Explicit Content</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically block messages with explicit content
                  </p>
                </div>
                <Switch 
                  id="block-explicit" 
                  checked={settings.moderationSettings.blockExplicitContent}
                  onCheckedChange={(checked) => setSettings({
                    ...settings, 
                    moderationSettings: {
                      ...settings.moderationSettings,
                      blockExplicitContent: checked
                    }
                  })}
                />
              </div>
              
              <div className="space-y-2 pt-4">
                <Label htmlFor="banned-words">Banned Words List</Label>
                <Textarea 
                  id="banned-words" 
                  placeholder="Enter words separated by commas..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Messages containing these words will be automatically flagged for review.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system and maintenance settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Put the site in maintenance mode (only admins can access)
                  </p>
                </div>
                <Switch 
                  id="maintenance-mode" 
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maintenance-message">Maintenance Message</Label>
                <Textarea 
                  id="maintenance-message" 
                  placeholder="Enter the maintenance message to display to users..."
                  rows={3}
                />
              </div>
              
              <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline">
                  <Database className="mr-2 h-4 w-4" />
                  Backup Database
                </Button>
                
                <Button variant="outline">
                  <Server className="mr-2 h-4 w-4" />
                  Clear Cache
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <h4 className="text-sm font-semibold mb-2">System Information</h4>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p>App Version: 1.0.0</p>
                <p>Database Status: Connected</p>
                <p>Last Backup: Never</p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPanel;
