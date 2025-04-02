
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface DiscoverFiltersProps {
  ageRange: [number, number];
  setAgeRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  distance: number;
  setDistance: React.Dispatch<React.SetStateAction<number>>;
  genderPreference: string;
  setGenderPreference: React.Dispatch<React.SetStateAction<string>>;
  interests: string[];
  setInterests: React.Dispatch<React.SetStateAction<string[]>>;
  onApplyFilters: () => void;
  onClose: () => void;
}

const DiscoverFilters: React.FC<DiscoverFiltersProps> = ({
  ageRange,
  setAgeRange,
  distance,
  setDistance,
  genderPreference,
  setGenderPreference,
  interests,
  setInterests,
  onApplyFilters,
  onClose
}) => {
  const interestOptions = [
    'Travel', 'Cooking', 'Reading', 'Movies', 'Music', 'Sports', 'Hiking',
    'Photography', 'Art', 'Gaming', 'Dancing', 'Yoga', 'Meditation', 'Fitness'
  ];
  
  const handleAddInterest = (interest: string) => {
    if (!interests.includes(interest)) {
      setInterests([...interests, interest]);
    }
  };
  
  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };
  
  return (
    <Card className="mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Filters</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-6">
          <div>
            <Label className="mb-2 block">Age Range: {ageRange[0]} - {ageRange[1]}</Label>
            <Slider
              min={18}
              max={80}
              step={1}
              value={ageRange}
              onValueChange={(value) => setAgeRange(value as [number, number])}
            />
          </div>
          
          <div>
            <Label className="mb-2 block">Maximum Distance: {distance} miles</Label>
            <Slider
              min={5}
              max={100}
              step={5}
              value={[distance]}
              onValueChange={(value) => setDistance(value[0])}
            />
          </div>
          
          <div>
            <Label className="mb-2 block">Gender Preference</Label>
            <RadioGroup 
              value={genderPreference} 
              onValueChange={setGenderPreference}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non-binary" id="non-binary" />
                <Label htmlFor="non-binary">Non-binary</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label className="mb-2 block">Interests</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {interests.map(interest => (
                <Badge key={interest} className="flex items-center gap-1">
                  {interest}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveInterest(interest)}
                  />
                </Badge>
              ))}
              {interests.length === 0 && (
                <span className="text-sm text-muted-foreground">No interests selected</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {interestOptions
                .filter(option => !interests.includes(option))
                .map(option => (
                  <Badge 
                    key={option} 
                    variant="outline" 
                    className="cursor-pointer"
                    onClick={() => handleAddInterest(option)}
                  >
                    {option}
                  </Badge>
                ))
              }
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button 
            variant="outline" 
            className="mr-2"
            onClick={() => {
              setAgeRange([18, 60]);
              setDistance(50);
              setGenderPreference('all');
              setInterests([]);
            }}
          >
            Reset
          </Button>
          <Button onClick={() => {
            onApplyFilters();
            onClose();
          }}>
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscoverFilters;
