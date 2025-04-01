
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Bell, 
  Settings, 
  Save, 
  RefreshCw, 
  Info, 
  MapPin, 
  SlidersHorizontal,
} from 'lucide-react';

// Define schema for form validation
const preferencesSchema = z.object({
  maxDistance: z.number().min(1).max(100),
  ageRange: z.object({
    min: z.number().min(18).max(100),
    max: z.number().min(18).max(100),
  }),
  showMeToUsers: z.boolean(),
  notificationPreferences: z.object({
    messages: z.boolean(),
    matches: z.boolean(),
    likes: z.boolean(),
    app: z.boolean(),
  }),
  preferredLocations: z.array(z.string()),
  matchingPriorities: z.object({
    interests: z.number().min(1).max(10),
    personality: z.number().min(1).max(10),
    location: z.number().min(1).max(10),
    age: z.number().min(1).max(10),
    writingStyle: z.number().min(1).max(10),
  }),
});

type PreferencesFormValues = z.infer<typeof preferencesSchema>;

const UserPreferences: React.FC = () => {
  const { currentUser, updatePreferences } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newLocation, setNewLocation] = useState('');
  const [activeTab, setActiveTab] = useState('matching');
  
  // Set default values from user preferences or defaults
  const defaultValues: PreferencesFormValues = {
    maxDistance: currentUser?.preferences?.maxDistance || 50,
    ageRange: {
      min: currentUser?.preferences?.ageRange?.min || 18,
      max: currentUser?.preferences?.ageRange?.max || 50,
    },
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
      personality: currentUser?.preferences?.matchingPriorities?.personality || 5,
      location: currentUser?.preferences?.matchingPriorities?.location || 5,
      age: currentUser?.preferences?.matchingPriorities?.age || 5,
      writingStyle: currentUser?.preferences?.matchingPriorities?.writingStyle || 5,
    },
  };
  
  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues,
  });
  
  const addLocation = () => {
    if (!newLocation.trim()) return;
    
    const currentLocations = form.getValues().preferredLocations || [];
    
    // Check if location already exists
    if (currentLocations.includes(newLocation.trim())) {
      toast.error("This location is already in your list");
      return;
    }
    
    form.setValue('preferredLocations', [...currentLocations, newLocation.trim()]);
    setNewLocation('');
  };
  
  const removeLocation = (location: string) => {
    const currentLocations = form.getValues().preferredLocations || [];
    form.setValue(
      'preferredLocations', 
      currentLocations.filter(loc => loc !== location)
    );
  };
  
  const onSubmit = async (data: PreferencesFormValues) => {
    setIsSubmitting(true);
    
    try {
      const success = await updatePreferences(data);
      if (success) {
        toast.success("Preferences updated successfully");
      } else {
        toast.error("Failed to update preferences");
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast.error("An error occurred while updating preferences");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="matching">Matching Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <TabsContent value="matching" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-love-500" />
                    Location Settings
                  </CardTitle>
                  <CardDescription>
                    Configure your location preferences and distance settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="maxDistance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Distance (miles)</FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <Slider
                              min={1}
                              max={100}
                              step={1}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                            />
                            <div className="flex justify-between">
                              <span className="text-xs text-muted-foreground">1 mile</span>
                              <span className="text-sm font-medium">{field.value} miles</span>
                              <span className="text-xs text-muted-foreground">100 miles</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          This is the maximum distance for potential matches
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-3">
                    <FormLabel>Preferred Locations</FormLabel>
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder="Add a city or location"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" onClick={addLocation}>
                        Add
                      </Button>
                    </div>
                    <FormDescription>
                      Add locations where you'd prefer to find matches
                    </FormDescription>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {form.watch('preferredLocations').map((location) => (
                        <Badge 
                          key={location} 
                          variant="secondary"
                          className="flex items-center gap-1 py-1.5"
                        >
                          <MapPin className="h-3 w-3" />
                          {location}
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => removeLocation(location)}
                          >
                            <span className="sr-only">Remove</span>
                            <span className="text-xs">×</span>
                          </Button>
                        </Badge>
                      ))}
                      
                      {form.watch('preferredLocations').length === 0 && (
                        <p className="text-sm text-muted-foreground italic">
                          No preferred locations added yet
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="showMeToUsers"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Show me in discover
                          </FormLabel>
                          <FormDescription>
                            When disabled, you won't appear in other users' discover feed
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
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-love-500" />
                    Matching Priorities
                  </CardTitle>
                  <CardDescription>
                    Adjust how important each factor is for your matching preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="ageRange"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age Range</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-4">
                              <Input
                                type="number"
                                min={18}
                                max={100}
                                placeholder="Min age"
                                value={field.value.min}
                                onChange={(e) => 
                                  field.onChange({ 
                                    ...field.value, 
                                    min: parseInt(e.target.value) || 18 
                                  })
                                }
                                className="w-24"
                              />
                              <span>to</span>
                              <Input
                                type="number"
                                min={18}
                                max={100}
                                placeholder="Max age"
                                value={field.value.max}
                                onChange={(e) => 
                                  field.onChange({ 
                                    ...field.value, 
                                    max: parseInt(e.target.value) || 50 
                                  })
                                }
                                className="w-24"
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            The age range of potential matches
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="priorities">
                        <AccordionTrigger>Matching Priorities</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
                          {[
                            { name: 'interests', label: 'Shared Interests', description: 'Importance of having similar interests' },
                            { name: 'personality', label: 'Personality Compatibility', description: 'Importance of personality types matching' },
                            { name: 'location', label: 'Location', description: 'Importance of being close to each other' },
                            { name: 'age', label: 'Age', description: 'Importance of age compatibility' },
                            { name: 'writingStyle', label: 'Communication Style', description: 'Importance of similar communication patterns' },
                          ].map((priority) => (
                            <FormField
                              key={priority.name}
                              control={form.control}
                              name={`matchingPriorities.${priority.name}` as any}
                              render={({ field }) => (
                                <FormItem>
                                  <div className="mb-2 flex justify-between">
                                    <FormLabel>{priority.label}</FormLabel>
                                    <span className="text-sm font-medium">
                                      {field.value}/10
                                    </span>
                                  </div>
                                  <FormControl>
                                    <Slider
                                      min={1}
                                      max={10}
                                      step={1}
                                      value={[field.value]}
                                      onValueChange={(value) => field.onChange(value[0])}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    {priority.description}
                                  </FormDescription>
                                </FormItem>
                              )}
                            />
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-love-500" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Control which notifications you receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'messages', label: 'New Messages', description: 'Get notified when you receive new messages' },
                    { name: 'matches', label: 'New Matches', description: 'Get notified when you have new matches' },
                    { name: 'likes', label: 'Likes', description: 'Get notified when someone likes your profile' },
                    { name: 'app', label: 'App Updates', description: 'Get notified about new features and updates' },
                  ].map((notification) => (
                    <FormField
                      key={notification.name}
                      control={form.control}
                      name={`notificationPreferences.${notification.name}` as any}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              {notification.label}
                            </FormLabel>
                            <FormDescription>
                              {notification.description}
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
                  ))}
                </CardContent>
              </Card>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset All Notification Settings
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reset all your notification preferences to their default settings.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        form.setValue('notificationPreferences', {
                          messages: true,
                          matches: true,
                          likes: true,
                          app: true,
                        });
                        toast.success("Notification settings reset to defaults");
                      }}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TabsContent>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-gradient-love"
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default UserPreferences;
