
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import PersonalityTraitSelector from '@/components/PersonalityTraitSelector';

interface AboutYouFormProps {
  profileData: {
    bio: string;
    personalityTraits: string[];
  };
  handleProfileDataChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handlePersonalityTraitSelect: (trait: string) => void;
}

const AboutYouForm: React.FC<AboutYouFormProps> = ({ 
  profileData, 
  handleProfileDataChange, 
  handlePersonalityTraitSelect 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">About You</h3>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea 
          id="bio"
          name="bio"
          value={profileData.bio}
          onChange={handleProfileDataChange}
          placeholder="Tell us about yourself, your interests, hobbies, and what you're looking for..."
          rows={6}
          required
        />
        <p className="text-xs text-muted-foreground">
          {profileData.bio.length}/500 characters 
          {profileData.bio.length < 20 && " (minimum 20 characters)"}
        </p>
      </div>
      
      <div className="space-y-2 pt-4">
        <Label>Personality Traits</Label>
        <PersonalityTraitSelector 
          selectedTraits={profileData.personalityTraits} 
          onSelectTrait={handlePersonalityTraitSelect} 
        />
      </div>
    </div>
  );
};

export default AboutYouForm;
