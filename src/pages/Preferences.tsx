
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/context/UserContext';
import { Layout } from '@/components/layout';
import { toast } from 'sonner';

const Preferences = () => {
  const { currentUser, updatePreferences } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Preference states
  const [distanceRange, setDistanceRange] = useState<number[]>([50]);
  const [ageRange, setAgeRange] = useState<number[]>([18, 45]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [messagePreview, setMessagePreview] = useState(true);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("english");
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Load user preferences
    setDistanceRange([currentUser?.preferences?.maxDistance || 50]);
    setAgeRange([
      currentUser?.preferences?.ageRange?.[0] || 18, 
      currentUser?.preferences?.ageRange?.[1] || 45
    ]);
    setNotificationsEnabled(currentUser?.preferences?.notificationsEnabled !== false);
    setMessagePreview(currentUser?.preferences?.messagePreview !== false);
    setTheme(currentUser?.preferences?.theme || 'light');
    setLanguage(currentUser?.preferences?.language || 'english');
  }, [currentUser, navigate]);
  
  const handleSavePreferences = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      await updatePreferences({
        maxDistance: distanceRange[0],
        ageRange: [ageRange[0], ageRange[1]],
        notificationsEnabled,
        messagePreview,
        theme,
        language
      });
      
      toast.success("Preferences saved successfully");
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error("Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Preferences</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Discovery Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Maximum Distance: {distanceRange[0]} miles</Label>
                <Slider
                  value={distanceRange}
                  onValueChange={setDistanceRange}
                  max={100}
                  step={5}
                />
              </div>
              
              <div className="space-y-3">
                <Label>Age Range: {ageRange[0]} - {ageRange[1]}</Label>
                <Slider
                  value={ageRange}
                  onValueChange={setAgeRange}
                  min={18}
                  max={80}
                  step={1}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications" className="font-medium">Push Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications for matches and messages</p>
                </div>
                <Switch 
                  id="notifications" 
                  checked={notificationsEnabled} 
                  onCheckedChange={setNotificationsEnabled} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="previews" className="font-medium">Message Previews</Label>
                  <p className="text-sm text-gray-500">Show message content in notifications</p>
                </div>
                <Switch 
                  id="previews" 
                  checked={messagePreview} 
                  onCheckedChange={setMessagePreview} 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>App Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme" className="font-medium">Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System Default</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language" className="font-medium">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button onClick={handleSavePreferences} disabled={loading}>
              {loading ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Preferences;
