
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group';
import { 
  Switch 
} from '@/components/ui/switch';
import { 
  Badge 
} from '@/components/ui/badge';
import { 
  X, 
  Plus, 
  MapPin, 
  SliderHorizontal,
} from 'lucide-react';

// Define schema for form validation
const preferencesSchema = z.object({
  maxDistance: z.number().min(1).max(500),
  ageRange: z.object({
    min: z.number().min(18).max(100),
    max: z.number().min(18).max(100),
  }).refine(data => data.min <= data.max, {
    message: "Minimum age must be less than maximum age",
    path: ["min"],
  }),
  interestedIn: z.array(z.enum(['male', 'female', 'non-binary'])).min(1, "Select at least one gender"),
  showMeToUsers: z.boolean(),
  notificationPreferences: z.object({
    messages: z.boolean(),
    matches: z.boolean(),
    likes: z.boolean(),
    app: z.boolean(),
  }),
  preferredLocations: z.array(z.string()).optional(),
  matchingPriorities: z.object({
    interests: z.number().min(1).max(5),
    personality: z.number().min(1).max(5),
    location: z.number().min(1).max(5),
    age: z.number().min(1).max(5),
    writingStyle: z.number().min(1).max(5),
  }),
});

type PreferencesFormValues = z.infer<typeof preferencesSchema>;

const UserPreferences: React.FC = () => {
  const { currentUser, updateProfile } = useUser();
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<string[]>([]);
  const [newLocation, setNewLocation] = useState('');
  
  // Set default form values based on current user preferences or reasonable defaults
  const defaultValues: PreferencesFormValues = {
    maxDistance: currentUser?.preferences?.maxDistance || 50,
    ageRange: {
      min: currentUser?.preferences?.ageRange?.min || 18,
      max: currentUser?.preferences?.ageRange?.max || 50,
    },
    interestedIn: currentUser?.interestedIn || ['female', 'male', 'non-binary'],
    showMeToUsers: currentUser?.preferences?.showMeToUsers !== false,
    notificationPreferences: {
      messages: currentUser?.preferences?.notificationPreferences?.messages !== false,
      matches: currentUser?.preferences?.notificationPreferences?.matches !== false,
      likes: currentUser?.preferences?.notificationPreferences?.likes !== false,
      app: currentUser?.preferences?.notificationPreferences?.app !== false,
    },
    preferredLocations: currentUser?.preferences?.preferredLocations || [],
    matchingPriorities: {
      interests: currentUser?.preferences?.matchingPriorities?.interests || 5,
      personality: currentUser?.preferences?.matchingPriorities?.personality || 4,
      location: currentUser?.preferences?.matchingPriorities?.location || 3,
      age: currentUser?.preferences?.matchingPriorities?.age || 2,
      writingStyle: currentUser?.preferences?.matchingPriorities?.writingStyle || 4,
    },
  };
  
  // Initialize the form
  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues,
  });
  
  // Load existing locations from user preferences
  useEffect(() => {
    if (currentUser?.preferences?.preferredLocations) {
      setLocations(currentUser.preferences.preferredLocations);
    }
  }, [currentUser]);
  
  // Handle form submission
  const onSubmit = async (data: PreferencesFormValues) => {
    setLoading(true);
    
    try {
      // Include the locations from state
      const updatedData = {
        ...data,
        preferredLocations: locations,
      };
      
      // Update user profile with new preferences
      await updateProfile({
        interestedIn: data.interestedIn,
        preferences: {
          maxDistance: data.maxDistance,
          ageRange: data.ageRange,
          showMeToUsers: data.showMeToUsers,
          notificationPreferences: data.notificationPreferences,
          preferredLocations: locations,
          matchingPriorities: data.matchingPriorities,
        }
      });
      
      toast.success("Preferences updated successfully!");
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast.error("Failed to update preferences. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // Add a new location
  const handleAddLocation = () => {
    if (newLocation.trim() && !locations.includes(newLocation.trim())) {
      setLocations([...locations, newLocation.trim()]);
      setNewLocation('');
    } else if (locations.includes(newLocation.trim())) {
      toast.error("This location is already in your list.");
    }
  };
  
  // Remove a location
  const handleRemoveLocation = (locationToRemove: string) => {
    setLocations(locations.filter(location => location !== locationToRemove));
  };
  
  // Handle keydown for location input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLocation();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-display">Matching Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Distance Preference */}
            <FormField
              control={form.control}
              name="maxDistance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Distance (km)</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        value={[field.value]}
                        min={1}
                        max={500}
                        step={1}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">1 km</span>
                        <span className="text-sm font-medium">{field.value} km</span>
                        <span className="text-xs text-muted-foreground">500 km</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Age Range Preference */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ageRange.min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={18}
                        max={100}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ageRange.max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={18}
                        max={100}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Gender Preference */}
            <FormField
              control={form.control}
              name="interestedIn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interested In</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="male"
                          checked={field.value.includes('male')}
                          onChange={(e) => {
                            const updatedValue = e.target.checked 
                              ? [...field.value, 'male']
                              : field.value.filter(val => val !== 'male');
                            field.onChange(updatedValue);
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-love-600 focus:ring-love-500"
                        />
                        <label htmlFor="male" className="text-sm font-medium text-gray-700">Male</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="female"
                          checked={field.value.includes('female')}
                          onChange={(e) => {
                            const updatedValue = e.target.checked 
                              ? [...field.value, 'female']
                              : field.value.filter(val => val !== 'female');
                            field.onChange(updatedValue);
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-love-600 focus:ring-love-500"
                        />
                        <label htmlFor="female" className="text-sm font-medium text-gray-700">Female</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="non-binary"
                          checked={field.value.includes('non-binary')}
                          onChange={(e) => {
                            const updatedValue = e.target.checked 
                              ? [...field.value, 'non-binary']
                              : field.value.filter(val => val !== 'non-binary');
                            field.onChange(updatedValue);
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-love-600 focus:ring-love-500"
                        />
                        <label htmlFor="non-binary" className="text-sm font-medium text-gray-700">Non-binary</label>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Profile Visibility */}
            <FormField
              control={form.control}
              name="showMeToUsers"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Show My Profile to Others</FormLabel>
                    <FormDescription>
                      When disabled, your profile won't be visible to other users
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Notification Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notification Preferences</h3>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="notificationPreferences.messages"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <FormLabel className="text-base">Messages</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notificationPreferences.matches"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <FormLabel className="text-base">New Matches</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notificationPreferences.likes"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <FormLabel className="text-base">Likes & Gifts</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notificationPreferences.app"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <FormLabel className="text-base">App Updates</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Preferred Locations */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Preferred Locations</h3>
              <div className="flex items-center space-x-2">
                <Input
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a city or region"
                  className="flex-1"
                  icon={<MapPin size={18} />}
                  iconPosition="left"
                />
                <Button 
                  type="button" 
                  onClick={handleAddLocation}
                  variant="outline"
                  className="flex items-center"
                >
                  <Plus size={18} />
                  <span className="ml-1">Add</span>
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {locations.map((location, index) => (
                  <Badge key={`${location}-${index}`} variant="secondary" className="px-3 py-1">
                    <MapPin size={14} className="mr-1" />
                    {location}
                    <button 
                      type="button"
                      onClick={() => handleRemoveLocation(location)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
                {locations.length === 0 && (
                  <p className="text-sm text-muted-foreground">No preferred locations added.</p>
                )}
              </div>
            </div>

            {/* Matching Priorities */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Matching Priorities</h3>
              <p className="text-sm text-muted-foreground">Rank the importance of each factor in your matches (1-5)</p>
              
              <FormField
                control={form.control}
                name="matchingPriorities.interests"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Common Interests</FormLabel>
                      <span className="text-sm font-medium">{field.value}</span>
                    </div>
                    <FormControl>
                      <Slider
                        value={[field.value]}
                        min={1}
                        max={5}
                        step={1}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="matchingPriorities.personality"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Personality Compatibility</FormLabel>
                      <span className="text-sm font-medium">{field.value}</span>
                    </div>
                    <FormControl>
                      <Slider
                        value={[field.value]}
                        min={1}
                        max={5}
                        step={1}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="matchingPriorities.location"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Location Proximity</FormLabel>
                      <span className="text-sm font-medium">{field.value}</span>
                    </div>
                    <FormControl>
                      <Slider
                        value={[field.value]}
                        min={1}
                        max={5}
                        step={1}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="matchingPriorities.age"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Age Compatibility</FormLabel>
                      <span className="text-sm font-medium">{field.value}</span>
                    </div>
                    <FormControl>
                      <Slider
                        value={[field.value]}
                        min={1}
                        max={5}
                        step={1}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="matchingPriorities.writingStyle"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Writing Style Similarity</FormLabel>
                      <span className="text-sm font-medium">{field.value}</span>
                    </div>
                    <FormControl>
                      <Slider
                        value={[field.value]}
                        min={1}
                        max={5}
                        step={1}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto bg-gradient-to-r from-love-500 to-love-600 text-white hover:opacity-90"
              >
                {loading ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserPreferences;
