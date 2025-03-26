
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  X,
  Sparkles,
  Crown,
  Globe,
  MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardContentProps {
  profile: any;
  index: number;
}

const CardContent: React.FC<CardContentProps> = ({ profile, index }) => {
  return (
    <>
      {/* Boost badge if profile is boosted */}
      {profile?.isBoosted && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className={`py-1 px-3 flex items-center gap-1 ${
            profile.boostLevel === 'super' 
              ? 'bg-amber-500 text-amber-950 border-amber-600' 
              : profile.boostLevel === 'international'
                ? 'bg-purple-500 text-white'
                : profile.boostLevel === 'local'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gradient-love text-white'
          }`}>
            {profile.boostLevel === 'super' ? (
              <Crown size={14} className="mr-1" />
            ) : profile.boostLevel === 'international' ? (
              <Globe size={14} className="mr-1" />
            ) : profile.boostLevel === 'local' ? (
              <MapPin size={14} className="mr-1" />
            ) : (
              <Sparkles size={14} className="mr-1" />
            )}
            {profile.boostLevel === 'super' ? 'Super Popular' : 
              profile.boostLevel === 'international' ? 'International Boost' :
              profile.boostLevel === 'local' ? 'Local Boost' : 'Popular'}
          </Badge>
        </div>
      )}
      
      {/* Card content overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white rounded-b-[16px]">
        <h3 className="text-2xl font-semibold font-display">
          {profile?.name}, {profile?.age}
        </h3>
        
        <div className="flex items-center text-white/80 mb-2">
          <MapPin size={14} className="mr-1" />
          <span className="text-sm">{profile?.location}</span>
        </div>
        
        {profile?.compatibilityScore && (
          <div className="mb-3">
            <div className="flex items-center gap-1 text-sm">
              <Sparkles size={14} className="text-love-300" />
              <span className="font-medium">Match: {profile.compatibilityScore}%</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-1.5 mt-1">
              <div 
                className="bg-gradient-to-r from-love-400 to-love-600 h-1.5 rounded-full" 
                style={{ width: `${profile.compatibilityScore}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Interests tags */}
        {profile?.interests && profile.interests.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {profile.interests.slice(0, 3).map((interest: string, idx: number) => (
              <Badge 
                key={idx} 
                variant="secondary" 
                className="bg-white/10 border-0 text-white/90 text-xs"
              >
                {interest}
              </Badge>
            ))}
            {profile.interests.length > 3 && (
              <Badge variant="secondary" className="bg-white/10 border-0 text-white/90 text-xs">
                +{profile.interests.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CardContent;
