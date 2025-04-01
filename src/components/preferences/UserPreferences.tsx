import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';
import { type UserPreferences as UserPreferencesType } from '@/types/user';
import { MapPin, Plus, X, Bell } from 'lucide-react';

const UserPreferences = () => {
  const { currentUser, updatePreferences } = useUser();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  
  // Default preferences
  const defaultPreferences: UserPreferencesType = {
    maxDistance: 50,
    ageRange: { min: 18, max: 50 },
    showMeToUsers: true,
    notificationPreferences: {
      messages: true,
      matches: true,
      likes: true,
      app: true
    },
    preferredLocations: [],
    matchingPriorities: {
      distance: 5,
      interests: 5,
      age: 5,
      personality: 5
    }
  };
  
  // Use current user preferences or defaults
  const [preferences, setPreferences] = useState<UserPreferencesType>(
    currentUser?.preferences || defaultPreferences
  );
  
  // Update preferences when user changes
  useEffect(() => {
    if (currentUser?.preferences) {
      setPreferences(currentUser.preferences);
    }
  }, [currentUser]);
  
  const handleDistanceChange = (value: number[]) => {
    setPreferences({
      ...preferences,
      maxDistance: value[0]
    });
  };
  
  const handleAgeRangeChange = (value: number[]) => {
    setPreferences({
      ...preferences,
      ageRange: {
        min: value[0],
        max: value[1]
      }
    });
  };
  
  const handleVisibilityChange = (value: boolean) => {
    setPreferences({
      ...preferences,
      showMeToUsers: value
    });
  };
  
  const handleNotificationChange = (key: keyof UserPreferencesType['notificationPreferences'], value: boolean) => {
    setPreferences({
      ...preferences,
      notificationPreferences: {
        ...preferences.notificationPreferences,
        [key]: value
      }
    });
  };
  
  const handleAddLocation = () => {
    if (locationInput.trim() && !preferences.preferredLocations.includes(locationInput.trim())) {
      setPreferences({
        ...preferences,
        preferredLocations: [...preferences.preferredLocations, locationInput.trim()]
      });
      setLocationInput('');
    }
  };
  
  const handleRemoveLocation = (location: string) => {
    setPreferences({
      ...preferences,
      preferredLocations: preferences.preferredLocations.filter(loc => loc !== location)
    });
  };
  
  const handlePriorityChange = (key: string, value: number) => {
    const updatedPriorities = { ...preferences.matchingPriorities, [key]: value };
    
    setPreferences({
      ...preferences,
      matchingPriorities: updatedPriorities
    });
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const success = await updatePreferences({
        maxDistance: preferences.maxDistance,
        ageRange: preferences.ageRange,
        showMeToUsers: preferences.showMeToUsers,
        notificationPreferences: preferences.notificationPreferences,
        preferredLocations: preferences.preferredLocations,
        matchingPriorities: {
          distance: preferences.matchingPriorities.distance,
          interests: preferences.matchingPriorities.interests,
          personality: preferences.matchingPriorities.personality,
          age: preferences.matchingPriorities.age
        }
      });
      
      if (success) {
        toast.success("Preferences saved successfully!");
      } else {
        throw new Error("Failed to save preferences");
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences");
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Discovery Preferences</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="max-distance">Maximum Distance</Label>
                  <span className="text-sm text-muted-foreground">{preferences.maxDistance} miles</span>
                </div>
                <Slider 
                  id="max-distance"
                  min={5} 
                  max={100} 
                  step={5} 
                  value={[preferences.maxDistance]} 
                  onValueChange={handleDistanceChange}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="age-range">Age Range</Label>
                  <span className="text-sm text-muted-foreground">
                    {preferences.ageRange.min} - {preferences.ageRange.max}
                  </span>
                </div>
                <Slider 
                  id="age-range"
                  min={18} 
                  max={80} 
                  step={1} 
                  value={[preferences.ageRange.min, preferences.ageRange.max]} 
                  onValueChange={handleAgeRangeChange}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-me">Show Me to Others</Label>
                  <p className="text-sm text-muted-foreground">
                    When disabled, you won't be shown to other users
                  </p>
                </div>
                <Switch 
                  id="show-me" 
                  checked={preferences.showMeToUsers}
                  onCheckedChange={handleVisibilityChange}
                />
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-love-500" />
                <span>Preferred Locations</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add cities or regions where you'd prefer to match with people
              </p>
              
              <div className="flex gap-2 mt-4">
                <Input 
                  placeholder="Add a city or region..." 
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handleAddLocation}
                  disabled={!locationInput.trim()}
                >
                  <Plus size={16} />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {preferences.preferredLocations.length > 0 ? (
                  preferences.preferredLocations.map((location, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="flex items-center gap-1 py-1.5 px-3"
                    >
                      <MapPin size={12} />
                      {location}
                      <button 
                        type="button" 
                        className="ml-1 text-muted-foreground hover:text-foreground"
                        onClick={() => handleRemoveLocation(location)}
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No preferred locations added</p>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5 text-love-500" />
                <span>Notification Preferences</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Control which notifications you receive
              </p>
              
              <div className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-messages">New Messages</Label>
                  <Switch 
                    id="notify-messages" 
                    checked={preferences.notificationPreferences.messages}
                    onCheckedChange={(value) => handleNotificationChange('messages', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-matches">New Matches</Label>
                  <Switch 
                    id="notify-matches" 
                    checked={preferences.notificationPreferences.matches}
                    onCheckedChange={(value) => handleNotificationChange('matches', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-likes">Profile Likes</Label>
                  <Switch 
                    id="notify-likes" 
                    checked={preferences.notificationPreferences.likes}
                    onCheckedChange={(value) => handleNotificationChange('likes', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-app">App Updates</Label>
                  <Switch 
                    id="notify-app" 
                    checked={preferences.notificationPreferences.app}
                    onCheckedChange={(value) => handleNotificationChange('app', value)}
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold">Matching Priorities</h3>
              <p className="text-sm text-muted-foreground">
                Adjust how much importance each factor has in finding your matches.
              </p>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="distance-priority">Distance</Label>
                    <span className="text-sm text-muted-foreground">{preferences.matchingPriorities.distance}</span>
                  </div>
                  <Slider 
                    id="distance-priority"
                    min={1} 
                    max={10} 
                    step={1} 
                    value={[preferences.matchingPriorities.distance]} 
                    onValueChange={(values) => handlePriorityChange('distance', values[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="interests-priority">Shared Interests</Label>
                    <span className="text-sm text-muted-foreground">{preferences.matchingPriorities.interests}</span>
                  </div>
                  <Slider 
                    id="interests-priority"
                    min={1} 
                    max={10} 
                    step={1} 
                    value={[preferences.matchingPriorities.interests]} 
                    onValueChange={(values) => handlePriorityChange('interests', values[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="personality-priority">Personality Match</Label>
                    <span className="text-sm text-muted-foreground">{preferences.matchingPriorities.personality}</span>
                  </div>
                  <Slider 
                    id="personality-priority"
                    min={1} 
                    max={10} 
                    step={1} 
                    value={[preferences.matchingPriorities.personality]} 
                    onValueChange={(values) => handlePriorityChange('personality', values[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="age-priority">Age Similarity</Label>
                    <span className="text-sm text-muted-foreground">{preferences.matchingPriorities.age}</span>
                  </div>
                  <Slider 
                    id="age-priority"
                    min={1} 
                    max={10} 
                    step={1} 
                    value={[preferences.matchingPriorities.age]} 
                    onValueChange={(values) => handlePriorityChange('age', values[0])}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-love hover:opacity-90"
            >
              {isSaving ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPreferences;
