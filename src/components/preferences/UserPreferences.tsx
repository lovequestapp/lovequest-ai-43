
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { X, Plus, User, Bell, MapPin, Sliders } from "lucide-react";
import { useUser } from '@/context/UserContext';
import { type UserPreferences } from '@/types/user';

const UserPreferencesComponent = () => {
  const { currentUser, updatePreferences } = useUser();
  const [preferences, setPreferences] = useState<UserPreferences>({
    maxDistance: 50,
    ageRange: {
      min: 18,
      max: 60
    },
    notificationsEnabled: true,
    messagePreview: true,
    theme: 'light',
    language: 'en',
    showMeToUsers: true,
    notificationPreferences: {
      messages: true,
      matches: true,
      likes: true,
      app: true
    },
    preferredLocations: [],
    matchingPriorities: {
      distance: 25,
      interests: 25,
      personality: 25,
      age: 25
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [newLocation, setNewLocation] = useState('');
  const [ageRange, setAgeRange] = useState<[number, number]>([
    preferences.ageRange?.min || 18,
    preferences.ageRange?.max || 60
  ]);
  
  useEffect(() => {
    if (currentUser?.preferences) {
      setPreferences({
        ...preferences,
        ...currentUser.preferences,
      });
      
      if (currentUser.preferences.ageRange) {
        setAgeRange([
          currentUser.preferences.ageRange.min,
          currentUser.preferences.ageRange.max
        ]);
      }
    }
  }, [currentUser]);
  
  const handleToggleShowMe = () => {
    setPreferences({
      ...preferences,
      showMeToUsers: !preferences.showMeToUsers
    });
  };
  
  const handleToggleNotification = (type: keyof UserPreferences['notificationPreferences']) => {
    setPreferences({
      ...preferences,
      notificationPreferences: {
        ...preferences.notificationPreferences!,
        [type]: !preferences.notificationPreferences![type]
      }
    });
  };
  
  const handleAddLocation = () => {
    if (newLocation.trim() && !preferences.preferredLocations?.includes(newLocation.trim())) {
      setPreferences({
        ...preferences,
        preferredLocations: [...(preferences.preferredLocations || []), newLocation.trim()]
      });
      setNewLocation('');
    }
  };
  
  const handleRemoveLocation = (location: string) => {
    setPreferences({
      ...preferences,
      preferredLocations: preferences.preferredLocations?.filter(l => l !== location)
    });
  };
  
  const handleMatchingPriorityChange = (type: keyof UserPreferences['matchingPriorities'], value: number) => {
    if (!preferences.matchingPriorities) {
      return;
    }
    
    setPreferences({
      ...preferences,
      matchingPriorities: {
        ...preferences.matchingPriorities,
        [type]: value
      }
    });
  };
  
  const handleSavePreferences = async () => {
    setLoading(true);
    
    // Update the age range
    const updatedPreferences: Partial<UserPreferences> = {
      maxDistance: preferences.maxDistance,
      ageRange: {
        min: ageRange[0],
        max: ageRange[1]
      },
      notificationsEnabled: preferences.notificationsEnabled,
      messagePreview: preferences.messagePreview,
      theme: preferences.theme,
      language: preferences.language,
      showMeToUsers: preferences.showMeToUsers,
      notificationPreferences: preferences.notificationPreferences,
      preferredLocations: preferences.preferredLocations,
      matchingPriorities: {
        distance: preferences.matchingPriorities?.distance || 25,
        interests: preferences.matchingPriorities?.interests || 25,
        personality: preferences.matchingPriorities?.personality || 25,
        age: preferences.matchingPriorities?.age || 25
      }
    };
    
    try {
      const success = await updatePreferences(updatedPreferences);
      if (success) {
        toast.success("Preferences saved successfully!");
      } else {
        toast.error("Failed to save preferences");
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("An error occurred while saving preferences");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Profile Visibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Show Me to Others</h4>
              <p className="text-sm text-muted-foreground">
                When disabled, you won't appear in discovery or search results
              </p>
            </div>
            <Switch 
              checked={preferences.showMeToUsers} 
              onCheckedChange={handleToggleShowMe}
            />
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <h4 className="font-medium mb-4">Age Preference</h4>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Age Range</span>
                  <span className="text-sm font-medium">{ageRange[0]} - {ageRange[1]}</span>
                </div>
                <Slider
                  value={ageRange}
                  min={18}
                  max={80}
                  step={1}
                  onValueChange={(newRange) => setAgeRange(newRange as [number, number])}
                />
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <h4 className="font-medium mb-4">Distance Preference</h4>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Maximum Distance</span>
                  <span className="text-sm font-medium">{preferences.maxDistance} miles</span>
                </div>
                <Slider
                  value={[preferences.maxDistance || 50]}
                  min={5}
                  max={100}
                  step={5}
                  onValueChange={(value) => setPreferences({...preferences, maxDistance: value[0]})}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Preferred Locations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Add locations you're interested in to improve your matches
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {preferences.preferredLocations?.map((location) => (
                <Badge key={location} className="flex gap-1 items-center">
                  {location}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveLocation(location)} 
                  />
                </Badge>
              ))}
              {!preferences.preferredLocations?.length && (
                <span className="text-sm text-muted-foreground">No preferred locations added</span>
              )}
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Add a location..."
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddLocation()}
              />
              <Button type="button" size="sm" onClick={handleAddLocation}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notify-messages">Messages</Label>
            <Switch 
              id="notify-messages" 
              checked={preferences.notificationPreferences?.messages} 
              onCheckedChange={() => handleToggleNotification('messages')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notify-matches">Matches</Label>
            <Switch 
              id="notify-matches" 
              checked={preferences.notificationPreferences?.matches} 
              onCheckedChange={() => handleToggleNotification('matches')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notify-likes">Likes</Label>
            <Switch 
              id="notify-likes" 
              checked={preferences.notificationPreferences?.likes} 
              onCheckedChange={() => handleToggleNotification('likes')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notify-app">App Updates</Label>
            <Switch 
              id="notify-app" 
              checked={preferences.notificationPreferences?.app} 
              onCheckedChange={() => handleToggleNotification('app')}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sliders className="mr-2 h-5 w-5" />
            Matching Priorities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Distance</span>
              <span className="text-sm font-medium">{preferences.matchingPriorities?.distance}%</span>
            </div>
            <Slider
              value={[preferences.matchingPriorities?.distance || 25]}
              min={0}
              max={100}
              step={5}
              onValueChange={(value) => handleMatchingPriorityChange('distance', value[0])}
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Interests</span>
              <span className="text-sm font-medium">{preferences.matchingPriorities?.interests}%</span>
            </div>
            <Slider
              value={[preferences.matchingPriorities?.interests || 25]}
              min={0}
              max={100}
              step={5}
              onValueChange={(value) => handleMatchingPriorityChange('interests', value[0])}
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Personality</span>
              <span className="text-sm font-medium">{preferences.matchingPriorities?.personality}%</span>
            </div>
            <Slider
              value={[preferences.matchingPriorities?.personality || 25]}
              min={0}
              max={100}
              step={5}
              onValueChange={(value) => handleMatchingPriorityChange('personality', value[0])}
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Age</span>
              <span className="text-sm font-medium">{preferences.matchingPriorities?.age}%</span>
            </div>
            <Slider
              value={[preferences.matchingPriorities?.age || 25]}
              min={0}
              max={100}
              step={5}
              onValueChange={(value) => handleMatchingPriorityChange('age', value[0])}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSavePreferences} 
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
};

export default UserPreferencesComponent;
