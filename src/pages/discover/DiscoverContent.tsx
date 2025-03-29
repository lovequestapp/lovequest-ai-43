
import React, { useState } from 'react';
import SwipeableCard from '@/components/card/SwipeableCard';
import { UserWithCoordinates } from '@/types/user'; 
import NoMatchesCard from './NoMatchesCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, X, Info } from 'lucide-react';

interface DiscoverContentProps {
  profiles: UserWithCoordinates[];
  onSwipe: (id: string, direction: 'left' | 'right') => void;
}

const DiscoverContent: React.FC<DiscoverContentProps> = ({ profiles, onSwipe }) => {
  // Format profiles to be compatible with SwipeableCard
  const formattedProfiles = profiles.map(profile => ({
    id: profile.id,
    name: profile.name,
    age: profile.age,
    bio: profile.bio,
    image: profile.photos?.[0] || 'https://via.placeholder.com/400x600?text=No+Photo',
    location: profile.location,
    distance: profile.distance
  }));

  const renderCard = (profile: any) => {
    return (
      <div className="h-full w-full flex flex-col">
        <div 
          className="h-3/4 bg-cover bg-center" 
          style={{ backgroundImage: `url(${profile.image})` }}
        >
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-white text-xl font-semibold">{profile.name}, {profile.age}</h3>
            <p className="text-white/80 text-sm">{profile.location}</p>
            {profile.distance && (
              <span className="text-white/60 text-xs">
                {Math.round(profile.distance)} miles away
              </span>
            )}
          </div>
        </div>
        <div className="p-4 h-1/4 overflow-auto">
          <p className="text-gray-700 text-sm">{profile.bio}</p>
        </div>
      </div>
    );
  };

  // Modify the functions to match the SwipeableCard component's expectations
  const handleSwipeRight = () => {
    // Since we're only displaying one profile at a time,
    // we can safely get the current (first) profile from formattedProfiles
    if (formattedProfiles && formattedProfiles.length > 0) {
      const currentProfile = formattedProfiles[0];
      onSwipe(currentProfile.id, 'right');
    }
  };

  const handleSwipeLeft = () => {
    // Since we're only displaying one profile at a time,
    // we can safely get the current (first) profile from formattedProfiles
    if (formattedProfiles && formattedProfiles.length > 0) {
      const currentProfile = formattedProfiles[0];
      onSwipe(currentProfile.id, 'left');
    }
  };

  // Show placeholder when no profiles are available
  if (!profiles || profiles.length === 0) {
    return <NoMatchesCard />;
  }

  // Use the current profile for the card
  const currentProfile = formattedProfiles[0];

  return (
    <div className="relative h-[600px] w-full flex justify-center items-center">
      {currentProfile && (
        <SwipeableCard
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
          cardClassName="w-full max-w-sm overflow-hidden"
        >
          {renderCard(currentProfile)}
        </SwipeableCard>
      )}
    </div>
  );
};

export default DiscoverContent;
