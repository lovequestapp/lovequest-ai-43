
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserPreferences } from '@/types/user';

interface DiscoverFiltersProps {
  preferences: Partial<UserPreferences>;
  onPreferencesChange: (preferences: Partial<UserPreferences>) => void;
  onApplyFilters: () => void;
  className?: string;
}

const DiscoverFilters: React.FC<DiscoverFiltersProps> = ({
  preferences,
  onPreferencesChange,
  onApplyFilters,
  className,
}) => {
  const handleMaxDistanceChange = (value: number[]) => {
    onPreferencesChange({ ...preferences, maxDistance: value[0] });
  };

  const handleAgeRangeChange = (value: number[]) => {
    onPreferencesChange({
      ...preferences,
      ageRange: { min: value[0], max: value[1] },
    });
  };

  const handleSwitchChange = (checked: boolean, key: keyof UserPreferences) => {
    onPreferencesChange({ ...preferences, [key]: checked });
  };

  const handlePriorityChange = (value: number[], key: keyof Required<UserPreferences>['matchingPriorities']) => {
    const currentPriorities = preferences.matchingPriorities || {
      distance: 5,
      interests: 5,
      personality: 5,
      age: 5,
    };
    
    onPreferencesChange({
      ...preferences,
      matchingPriorities: {
        ...currentPriorities,
        [key]: value[0],
      },
    });
  };

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="distance">Maximum Distance: {preferences.maxDistance || 50} miles</Label>
            <Slider
              id="distance"
              defaultValue={[preferences.maxDistance || 50]}
              min={5}
              max={100}
              step={5}
              onValueChange={handleMaxDistanceChange}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Age Range: {preferences.ageRange?.min || 18} - {preferences.ageRange?.max || 50} years</Label>
            <Slider
              defaultValue={[preferences.ageRange?.min || 18, preferences.ageRange?.max || 50]}
              min={18}
              max={80}
              step={1}
              onValueChange={handleAgeRangeChange}
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="notifications"
                checked={preferences.notificationsEnabled}
                onCheckedChange={(checked) => handleSwitchChange(checked, 'notificationsEnabled')}
              />
              <Label htmlFor="notifications">Notifications</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="showMe"
                checked={preferences.showMeToUsers}
                onCheckedChange={(checked) => handleSwitchChange(checked, 'showMeToUsers')}
              />
              <Label htmlFor="showMe">Show Me to Users</Label>
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Matching Priorities</Label>
            
            <div className="space-y-4">
              <div>
                <Label className="text-xs">Distance: {preferences.matchingPriorities?.distance || 5}</Label>
                <Slider
                  defaultValue={[preferences.matchingPriorities?.distance || 5]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => handlePriorityChange(value, 'distance')}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label className="text-xs">Interests: {preferences.matchingPriorities?.interests || 5}</Label>
                <Slider
                  defaultValue={[preferences.matchingPriorities?.interests || 5]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => handlePriorityChange(value, 'interests')}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label className="text-xs">Personality: {preferences.matchingPriorities?.personality || 5}</Label>
                <Slider
                  defaultValue={[preferences.matchingPriorities?.personality || 5]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => handlePriorityChange(value, 'personality')}
                  className="mt-1"
                />
              </div>
              
              {/* Removed the duplicate age slider from here */}
            </div>
          </div>

          <div className="pt-2">
            <Button onClick={onApplyFilters} className="w-full">Apply Filters</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscoverFilters;
