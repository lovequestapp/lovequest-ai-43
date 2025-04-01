
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type GenderType = 'male' | 'female' | 'non-binary';

interface BasicInfoFormProps {
  profileData: {
    name: string;
    age: number;
    location: string;
    gender: string;
    interestedIn: string[];
  };
  handleProfileDataChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleGenderInterestChange: (interest: 'male' | 'female' | 'non-binary') => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ 
  profileData, 
  handleProfileDataChange, 
  handleGenderInterestChange 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Basic Information</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name"
            name="name"
            value={profileData.name}
            onChange={handleProfileDataChange}
            placeholder="Enter your full name"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input 
              id="age"
              name="age"
              type="number"
              min={18}
              value={profileData.age}
              onChange={handleProfileDataChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location"
              name="location"
              value={profileData.location}
              onChange={handleProfileDataChange}
              placeholder="City, Country"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <select
            id="gender"
            name="gender"
            value={profileData.gender}
            onChange={handleProfileDataChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-love-500 focus:border-love-500 sm:text-sm rounded-md"
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label>Interested In (select all that apply)</Label>
          <div className="flex flex-wrap gap-2">
            {['male', 'female', 'non-binary'].map((gender) => (
              <Button
                key={gender}
                type="button"
                variant={profileData.interestedIn.includes(gender as any) ? "default" : "outline"}
                onClick={() => handleGenderInterestChange(gender as 'male' | 'female' | 'non-binary')}
                className="capitalize"
              >
                {gender}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;
