import React, { useState } from 'react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Award, BellRing, Filter, Fingerprint, Flag, Globe, HeartHandshake, Lock, Shield, Users, Vegan } from 'lucide-react';
import { useTestMode } from '@/context/TestModeContext';

const AppSettings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const { isTestMode, toggleTestMode } = useTestMode();
  
  const handleReset = () => {
    toast.error("This action requires additional confirmation", {
      description: "Please contact your database administrator to perform this action."
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-love-800">App Settings</h2>
          <p className="text-love-600">Configure your dating app's global settings</p>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="matching">Matching</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <div className="mt-4 space-y-4">
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-love-600" />
                  <span>Global App Settings</span>
                </CardTitle>
                <CardDescription>Configure general app behavior and appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="app-name">App Name</Label>
                      <Input id="app-name" defaultValue="LoveQuest" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="app-description">App Description</Label>
                      <Textarea 
                        id="app-description" 
                        rows={3}
                        defaultValue="Find your perfect match with our AI-powered dating app"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">Temporarily disable the app for maintenance</p>
                      </div>
                      <Switch id="maintenance-mode" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">New User Registration</Label>
                        <p className="text-sm text-muted-foreground">Allow new users to register</p>
                      </div>
                      <Switch id="allow-registration" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">Free Trials</Label>
                        <p className="text-sm text-muted-foreground">Allow free premium trials for new users</p>
                      </div>
                      <Switch id="allow-trials" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-lg bg-love-50">
                      <div className="space-y-0.5">
                        <Label className="text-base font-semibold flex items-center gap-2">
                          <Users className="h-4 w-4 text-love-600" />
                          Test Mode
                        </Label>
                        <p className="text-sm text-love-700">
                          Enable demo profiles for testing ({isTestMode ? 'Enabled' : 'Disabled'})
                        </p>
                      </div>
                      <Switch 
                        id="test-mode" 
                        checked={isTestMode}
                        onCheckedChange={toggleTestMode}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HeartHandshake className="h-5 w-5 text-love-600" />
                  <span>Monetization Settings</span>
                </CardTitle>
                <CardDescription>Configure pricing and subscription options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="premium-price">Premium Subscription Price ($)</Label>
                      <Input id="premium-price" type="number" defaultValue="9.99" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="vip-price">VIP Subscription Price ($)</Label>
                      <Input id="vip-price" type="number" defaultValue="19.99" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="trial-days">Free Trial Duration (days)</Label>
                      <Input id="trial-days" type="number" defaultValue="7" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">Enable Gifting</Label>
                        <p className="text-sm text-muted-foreground">Allow users to send virtual gifts</p>
                      </div>
                      <Switch id="enable-gifting" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">Enable Boosts</Label>
                        <p className="text-sm text-muted-foreground">Allow users to boost their profiles</p>
                      </div>
                      <Switch id="enable-boosts" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">Enable Referral Rewards</Label>
                        <p className="text-sm text-muted-foreground">Reward users for referring friends</p>
                      </div>
                      <Switch id="enable-referrals" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span>Danger Zone</span>
                </CardTitle>
                <CardDescription>Destructive actions that should be used with caution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-red-200 p-4 rounded-lg bg-red-50">
                    <h3 className="text-red-700 font-medium mb-2">Reset All User Data</h3>
                    <p className="text-sm text-red-600 mb-4">This will permanently delete all user accounts and their data. This action cannot be undone.</p>
                    <Button variant="destructive" size="sm" onClick={handleReset}>
                      Reset User Data
                    </Button>
                  </div>
                  
                  <div className="border border-red-200 p-4 rounded-lg bg-red-50">
                    <h3 className="text-red-700 font-medium mb-2">Reset App Settings</h3>
                    <p className="text-sm text-red-600 mb-4">This will reset all app settings to their default values. This action cannot be undone.</p>
                    <Button variant="destructive" size="sm" onClick={handleReset}>
                      Reset App Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="matching" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-love-600" />
                  <span>Matching Algorithm Settings</span>
                </CardTitle>
                <CardDescription>Configure how users are matched with each other</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="default-distance">Default Maximum Distance (miles)</Label>
                      <Input id="default-distance" type="number" defaultValue="50" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="default-age-min">Default Minimum Age</Label>
                      <Input id="default-age-min" type="number" defaultValue="18" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="default-age-max">Default Maximum Age</Label>
                      <Input id="default-age-max" type="number" defaultValue="99" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Matching Priority Weights</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Interests</span>
                          <Input className="w-20" type="number" defaultValue="5" min="1" max="10" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Location</span>
                          <Input className="w-20" type="number" defaultValue="4" min="1" max="10" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Age</span>
                          <Input className="w-20" type="number" defaultValue="3" min="1" max="10" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Personality</span>
                          <Input className="w-20" type="number" defaultValue="5" min="1" max="10" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label>Matching Features</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">Location-Based Matching</Label>
                        <p className="text-sm text-muted-foreground">Match users based on proximity</p>
                      </div>
                      <Switch id="location-matching" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">Interest-Based Matching</Label>
                        <p className="text-sm text-muted-foreground">Match users with similar interests</p>
                      </div>
                      <Switch id="interest-matching" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">Personality Matching</Label>
                        <p className="text-sm text-muted-foreground">Match users with compatible personalities</p>
                      </div>
                      <Switch id="personality-matching" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">AI-Enhanced Matching</Label>
                        <p className="text-sm text-muted-foreground">Use AI to improve match quality</p>
                      </div>
                      <Switch id="ai-matching" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-love-600" />
                  <span>Content Filtering</span>
                </CardTitle>
                <CardDescription>Configure content filtering and moderation settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">Profanity Filter</Label>
                        <p className="text-sm text-muted-foreground">Filter out profanity in messages and profiles</p>
                      </div>
                      <Switch id="profanity-filter" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">Image Moderation</Label>
                        <p className="text-sm text-muted-foreground">Automatically review uploaded images</p>
                      </div>
                      <Switch id="image-moderation" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">AI Content Moderation</Label>
                        <p className="text-sm text-muted-foreground">Use AI to detect inappropriate content</p>
                      </div>
                      <Switch id="ai-moderation" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">User Reporting</Label>
                        <p className="text-sm text-muted-foreground">Allow users to report inappropriate content</p>
                      </div>
                      <Switch id="user-reporting" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellRing className="h-5 w-5 text-love-600" />
                  <span>Notification Settings</span>
                </CardTitle>
                <CardDescription>Configure how and when notifications are sent to users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Send notifications via email</p>
                      </div>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Send push notifications to mobile devices</p>
                      </div>
                      <Switch id="push-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">In-App Notifications</Label>
                        <p className="text-sm text-muted-foreground">Show notifications within the app</p>
                      </div>
                      <Switch id="in-app-notifications" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Notification Types</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border p-3 rounded-lg">
                          <span className="text-sm">New Matches</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between border p-3 rounded-lg">
                          <span className="text-sm">New Messages</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between border p-3 rounded-lg">
                          <span className="text-sm">Profile Likes</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between border p-3 rounded-lg">
                          <span className="text-sm">Gifts Received</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between border p-3 rounded-lg">
                          <span className="text-sm">System Announcements</span>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="quiet-hours-start">Quiet Hours</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quiet-hours-start" className="text-sm">Start Time</Label>
                      <Input id="quiet-hours-start" type="time" defaultValue="22:00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quiet-hours-end" className="text-sm">End Time</Label>
                      <Input id="quiet-hours-end" type="time" defaultValue="08:00" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-love-600" />
                  <span>Security Settings</span>
                </CardTitle>
                <CardDescription>Configure security and privacy settings for your app</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                      </div>
                      <Switch id="two-factor-auth" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">Password Complexity</Label>
                        <p className="text-sm text-muted-foreground">Require strong passwords</p>
                      </div>
                      <Switch id="password-complexity" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">Account Verification</Label>
                        <p className="text-sm text-muted-foreground">Require email verification</p>
                      </div>
                      <Switch id="account-verification" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">Data Encryption</Label>
                        <p className="text-sm text-muted-foreground">Encrypt sensitive user data</p>
                      </div>
                      <Switch id="data-encryption" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">Login Attempt Limits</Label>
                        <p className="text-sm text-muted-foreground">Limit failed login attempts</p>
                      </div>
                      <Switch id="login-limits" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Input id="session-timeout" type="number" defaultValue="60" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label>Privacy Settings</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">Profile Privacy</Label>
                        <p className="text-sm text-muted-foreground">Allow users to control profile visibility</p>
                      </div>
                      <Switch id="profile-privacy" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">Location Privacy</Label>
                        <p className="text-sm text-muted-foreground">Allow users to hide exact location</p>
                      </div>
                      <Switch id="location-privacy" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">Activity Status</Label>
                        <p className="text-sm text-muted-foreground">Allow users to hide online status</p>
                      </div>
                      <Switch id="activity-status" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">Data Deletion</Label>
                        <p className="text-sm text-muted-foreground">Allow users to delete their data</p>
                      </div>
                      <Switch id="data-deletion" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fingerprint className="h-5 w-5 text-love-600" />
                  <span>Authentication Providers</span>
                </CardTitle>
                <CardDescription>Configure third-party authentication providers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">Google Authentication</Label>
                        <p className="text-sm text-muted-foreground">Allow sign in with Google</p>
                      </div>
                      <Switch id="google-auth" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">Facebook Authentication</Label>
                        <p className="text-sm text-muted-foreground">Allow sign in with Facebook</p>
                      </div>
                      <Switch id="facebook-auth" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">Apple Authentication</Label>
                        <p className="text-sm text-muted-foreground">Allow sign in with Apple</p>
                      </div>
                      <Switch id="apple-auth" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">Phone Authentication</Label>
                        <p className="text-sm text-muted-foreground">Allow sign in with phone number</p>
                      </div>
                      <Switch id="phone-auth" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AppSettings;
