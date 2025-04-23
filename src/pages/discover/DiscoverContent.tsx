
import React, { useState } from 'react';
import SwipeableCard from '@/components/card/SwipeableCard';
import { UserWithCoordinates } from '@/types/user'; 
import NoMatchesCard from './NoMatchesCard';
import ActionButtons from '@/components/card/ActionButtons';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Sparkles, Verified } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import ProfileSkeleton from '@/components/discover/ProfileSkeleton';
import useAnalytics from '@/hooks/useAnalytics';

interface DiscoverContentProps {
  profiles: UserWithCoordinates[];
  onSwipe: (id: string, direction: 'left' | 'right') => void;
}

const DiscoverContent: React.FC<DiscoverContentProps> = ({ profiles, onSwipe }) => {
  const navigate = useNavigate();
  const { trackSwipe, trackMatch } = useAnalytics();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Format profiles to be compatible with SwipeableCard
  const formattedProfiles = profiles.map(profile => ({
    id: profile.id,
    name: profile.name,
    age: profile.age,
    bio: profile.bio,
    image: profile.photos?.[0] || 'https://via.placeholder.com/400x600?text=No+Photo',
    location: profile.location,
    distance: profile.distance,
    traits: profile.personalityTraits || [],
    verified: profile.verificationStatus === 'verified',
    allPhotos: profile.photos || []
  }));

  const renderCard = (profile: any) => {
    return (
      <div className="h-full w-full flex flex-col relative group">
        <div 
          className="h-full w-full bg-cover bg-center absolute inset-0 rounded-xl overflow-hidden" 
          style={{ backgroundImage: `url(${profile.image})` }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        </div>
        
        {/* Photo counter */}
        <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full select-none">
          <div className="flex items-center gap-1.5">
            <Camera size={14} className="text-white" />
            <span className="text-white text-sm font-medium">
              {profile.allPhotos.length} {profile.allPhotos.length === 1 ? 'Photo' : 'Photos'}
            </span>
          </div>
        </div>
        
        {/* Verification badge */}
        {profile.verified && (
          <div className="absolute top-4 left-4 select-none">
            <Badge className="bg-blue-500/80 backdrop-blur-sm text-white flex items-center gap-1.5 py-1.5" >
              <Verified size={14} className="text-white" />
              <span>Verified</span>
            </Badge>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10 select-none">
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
                    {displayDistance(profile)}
                  </span>
                </div>
              )}
              
            </div>
          </div>
          
          {/* Personality traits */}
          {profile.traits && profile.traits.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.traits.slice(0, 3).map((trait: string, index: number) => (
                <Badge key={index} className="bg-white/20 backdrop-blur-sm text-white cursor-default select-none">
                  {trait}
                </Badge>
              ))}
              {profile.traits.length > 3 && (
                <Badge className="bg-white/10 backdrop-blur-sm text-white/80 cursor-default select-none">
                  +{profile.traits.length - 3} more
                </Badge>
              )}
            </div>
          )}
          
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
      trackSwipe(currentProfile.id, 'right');
      onSwipe(currentProfile.id, 'right');
      
      // Random match chance (30%)
      if (Math.random() > 0.7) {
        trackMatch(currentProfile.id);
        // User feedback about match will be managed externally (toast in parent)
      }
    }
  };

  const handleSwipeLeft = () => {
    if (formattedProfiles && formattedProfiles.length > 0) {
      const currentProfile = formattedProfiles[0];
      trackSwipe(currentProfile.id, 'left');
      onSwipe(currentProfile.id, 'left');
    }
  };

  const handleViewProfile = () => {
    if (formattedProfiles && formattedProfiles.length > 0) {
      const currentProfile = formattedProfiles[0];
      navigate(`/profile/${currentProfile.id}`);
    }
  };

  if (!profiles || profiles.length === 0) {
    return <NoMatchesCard />;
  }

  const currentProfile = formattedProfiles[0];

  return (
    <div className="relative h-[600px] w-full max-w-md mx-auto">
      {isLoadingMore && <ProfileSkeleton />}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative h-full"
      >
        {currentProfile && (
          <SwipeableCard
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
            cardClassName="w-full overflow-hidden shadow-2xl rounded-xl border border-gray-200"
            profileId={currentProfile.id}
          >
            {renderCard(currentProfile)}
          </SwipeableCard>
        )}
      </motion.div>
      
      {/* Action buttons below the card */}
      <ActionButtons 
        profilesLength={profiles.length}
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        onViewProfile={handleViewProfile}
      />
    </div>
  );
};

export default DiscoverContent;

const displayDistance = (user: any) => {
  if (user.distance === undefined) return "Unknown distance";
  
  const dist = Math.round(user.distance);
  return `${dist} ${dist === 1 ? 'mile' : 'miles'} away`;
};

