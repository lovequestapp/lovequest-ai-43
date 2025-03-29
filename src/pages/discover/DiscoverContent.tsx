
import React, { useState } from 'react';
import SwipeableCard from '@/components/card/SwipeableCard';
import { UserWithCoordinates } from '@/types/user'; 
import NoMatchesCard from './NoMatchesCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, X, Info, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <div className="h-full w-full flex flex-col relative">
        <div 
          className="h-full w-full bg-cover bg-center absolute inset-0" 
          style={{ backgroundImage: `url(${profile.image})` }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-2xl font-bold tracking-tight">
                {profile.name}, {profile.age}
              </h3>
              <div className="flex items-center gap-1 mt-1 text-white/90">
                <MapPin size={14} />
                <span className="text-sm">{profile.location}</span>
              </div>
              {profile.distance && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Sparkles size={14} className="text-amber-400" />
                  <span className="text-sm text-white/80">
                    {Math.round(profile.distance)} miles away
                  </span>
                </div>
              )}
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="bg-white/10 backdrop-blur-sm h-10 w-10 rounded-full flex items-center justify-center cursor-pointer"
            >
              <Info size={20} className="text-white" />
            </motion.div>
          </div>
          
          <div className="mt-4 bg-black/30 backdrop-blur-sm p-3 rounded-lg">
            <p className="text-sm text-white/90 line-clamp-3">{profile.bio}</p>
          </div>
        </div>
      </div>
    );
  };

  const handleSwipeRight = () => {
    if (formattedProfiles && formattedProfiles.length > 0) {
      const currentProfile = formattedProfiles[0];
      onSwipe(currentProfile.id, 'right');
    }
  };

  const handleSwipeLeft = () => {
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
    <div className="relative h-[600px] w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative h-full"
      >
        {currentProfile && (
          <SwipeableCard
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
            cardClassName="w-full overflow-hidden shadow-2xl"
            profileId={currentProfile.id}
          >
            {renderCard(currentProfile)}
          </SwipeableCard>
        )}
      </motion.div>
      
      {/* Action buttons below the card */}
      <div className="absolute bottom-[-70px] left-0 right-0 flex justify-center gap-6">
        <Button 
          variant="outline"
          className="h-14 w-14 rounded-full bg-white border-gray-200 shadow-lg hover:bg-red-50 hover:border-red-200 transition-all duration-300"
          onClick={handleSwipeLeft}
        >
          <X size={24} className="text-red-500" />
        </Button>
        
        <Button 
          className="h-14 w-14 rounded-full bg-gradient-love hover:opacity-90 shadow-lg transition-all duration-300"
          onClick={handleSwipeRight}
        >
          <Heart size={24} />
        </Button>
      </div>
    </div>
  );
};

export default DiscoverContent;
