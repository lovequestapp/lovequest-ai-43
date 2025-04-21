
import React from 'react';
import LocationSelector from '@/components/profile-setup/LocationSelector';
import InterestsForm from '@/components/profile-setup/InterestsForm';

interface LocationInterestsStepProps {
  location: string;
  interests: string[];
  onLocationSelect: (location: string) => void;
  onInterestSelect: (interest: string) => void;
}

const LocationInterestsStep: React.FC<LocationInterestsStepProps> = ({
  location,
  interests,
  onLocationSelect,
  onInterestSelect,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Where are you located?</h3>
      <LocationSelector location={location} onLocationSelect={onLocationSelect} />
      <InterestsForm interests={interests} onInterestSelect={onInterestSelect} />
    </div>
  );
};

export default LocationInterestsStep;

