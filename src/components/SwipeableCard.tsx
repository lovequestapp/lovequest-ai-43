
import React, { useState } from 'react';
import { useSprings, animated, to as interpolate } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  X,
  Sparkles,
  Crown,
  Globe,
  MapPin,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

// Define the card styles and properties
const to = (i: number) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
});

const from = (_i: number) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });

// Transform when card is being dragged
const trans = (r: number, s: number) =>
  `perspective(1500px) rotateX(10deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;

export interface SwipeableCardProps {
  profiles: any[];
  onSwipe: (id: string, direction: 'left' | 'right') => void;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({ profiles, onSwipe }) => {
  const [gone] = useState(() => new Set());
  
  // Create a spring for each card
  const [props, api] = useSprings(profiles.length, i => ({
    ...to(i),
    from: from(i),
  }));

  // Create a drag handler for the cards
  const bind = useDrag(({ args: [index], active, movement: [mx], direction: [xDir], velocity }) => {
    // Fix #1: Convert Vector2 velocity to number by checking its magnitude
    const velocityValue = typeof velocity === 'number' ? velocity : Math.sqrt(velocity[0] * velocity[0] + velocity[1] * velocity[1]);
    const trigger = velocityValue > 0.2; // Minimum velocity to trigger swipe
    const dir = xDir < 0 ? -1 : 1; // Direction is either left or right
    
    if (!active && trigger) {
      gone.add(index);
      const profile = profiles[index];
      if (profile && profile.id) {
        onSwipe(profile.id, dir > 0 ? 'right' : 'left');
      }
    }
    
    api.start(i => {
      if (index !== i) return;
      const isGone = gone.has(index);
      
      // When a card is gone, fly it out
      const x = isGone ? (200 + window.innerWidth) * dir : active ? mx : 0;
      
      // Fix #2: Ensure numeric operation by explicitly converting mx to number
      const rot = (typeof mx === 'number' ? mx : 0) / 100 + (isGone ? dir * 10 * velocityValue : 0);
      
      // Scale up slightly when active
      const scale = active ? 1.05 : 1;
      
      return {
        x,
        rot,
        scale,
        delay: undefined,
        config: { friction: 50, tension: active ? 800 : isGone ? 200 : 500 },
      };
    });
    
    // If all cards are gone, reset
    if (!active && gone.size === profiles.length) {
      setTimeout(() => {
        gone.clear();
        api.start(i => to(i));
      }, 600);
    }
  });

  const handleButtonSwipe = (direction: 'left' | 'right', index: number) => {
    const dir = direction === 'left' ? -1 : 1;
    gone.add(index);
    
    // Fix #3: Make sure we correctly use the api.start method
    api.start(i => {
      if (index !== i) return;
      const x = (200 + window.innerWidth) * dir;
      const rot = dir * 10;
      
      // Call onSwipe separately from the animation, but only if the profile exists
      if (profiles && profiles.length > index && profiles[index] && profiles[index].id) {
        // Store the id before the animation to ensure it's available
        const profileId = profiles[index].id;
        // Call onSwipe with the stored id
        onSwipe(profileId, direction);
      }
      
      return {
        x,
        rot,
        scale: 1,
        delay: undefined,
        config: { friction: 50, tension: 200 },
      };
    });
    
    // If all cards are gone, reset
    if (gone.size === profiles.length) {
      setTimeout(() => {
        gone.clear();
        api.start(i => to(i));
      }, 600);
    }
  };
  
  return (
    <div className="relative w-full h-[60vh] flex items-center justify-center">
      {/* Swipe hint arrows */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4 text-muted-foreground/30 hidden md:block">
        <ArrowLeft size={32} />
        <div className="mt-2 text-xs font-medium text-center">PASS</div>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-4 text-love-400/30 hidden md:block">
        <ArrowRight size={32} />
        <div className="mt-2 text-xs font-medium text-center">LIKE</div>
      </div>
      
      {props.map(({ x, y, rot, scale }, i) => (
        <animated.div
          key={i}
          className="absolute w-[300px] md:w-[400px] h-[500px] will-change-transform touch-none"
          style={{ x, y }}
        >
          <animated.div
            {...bind(i)}
            style={{
              transform: interpolate([rot, scale], trans),
              backgroundImage: `url(${profiles[i]?.photos[0]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              height: '100%',
              borderRadius: '16px',
              boxShadow: '0 12px 25px -10px rgba(50, 50, 73, 0.4), 0 10px 10px -10px rgba(50, 50, 73, 0.3)',
              touchAction: 'none'
            }}
            className="relative cursor-grab active:cursor-grabbing"
          >
            {/* Boost badge if profile is boosted */}
            {profiles[i]?.isBoosted && (
              <div className="absolute top-3 right-3 z-10">
                <Badge className={`py-1 px-3 flex items-center gap-1 ${
                  profiles[i].boostLevel === 'super' 
                    ? 'bg-amber-500 text-amber-950 border-amber-600' 
                    : profiles[i].boostLevel === 'international'
                      ? 'bg-purple-500 text-white'
                      : profiles[i].boostLevel === 'local'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gradient-love text-white'
                }`}>
                  {profiles[i].boostLevel === 'super' ? (
                    <Crown size={14} className="mr-1" />
                  ) : profiles[i].boostLevel === 'international' ? (
                    <Globe size={14} className="mr-1" />
                  ) : profiles[i].boostLevel === 'local' ? (
                    <MapPin size={14} className="mr-1" />
                  ) : (
                    <Sparkles size={14} className="mr-1" />
                  )}
                  {profiles[i].boostLevel === 'super' ? 'Super Popular' : 
                    profiles[i].boostLevel === 'international' ? 'International Boost' :
                    profiles[i].boostLevel === 'local' ? 'Local Boost' : 'Popular'}
                </Badge>
              </div>
            )}
            
            {/* Card content overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white rounded-b-[16px]">
              <h3 className="text-2xl font-semibold font-display">
                {profiles[i]?.name}, {profiles[i]?.age}
              </h3>
              
              <div className="flex items-center text-white/80 mb-2">
                <MapPin size={14} className="mr-1" />
                <span className="text-sm">{profiles[i]?.location}</span>
              </div>
              
              {profiles[i]?.compatibilityScore && (
                <div className="mb-3">
                  <div className="flex items-center gap-1 text-sm">
                    <Sparkles size={14} className="text-love-300" />
                    <span className="font-medium">Match: {profiles[i].compatibilityScore}%</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-gradient-to-r from-love-400 to-love-600 h-1.5 rounded-full" 
                      style={{ width: `${profiles[i].compatibilityScore}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Interests tags */}
              {profiles[i]?.interests && profiles[i].interests.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {profiles[i].interests.slice(0, 3).map((interest: string, idx: number) => (
                    <Badge 
                      key={idx} 
                      variant="secondary" 
                      className="bg-white/10 border-0 text-white/90 text-xs"
                    >
                      {interest}
                    </Badge>
                  ))}
                  {profiles[i].interests.length > 3 && (
                    <Badge variant="secondary" className="bg-white/10 border-0 text-white/90 text-xs">
                      +{profiles[i].interests.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </animated.div>
        </animated.div>
      ))}
      
      {/* Action buttons - removing circular styles */}
      {profiles.length > 0 && (
        <div className="absolute bottom-[-70px] left-0 right-0 flex justify-center gap-6">
          <Button 
            variant="outline"
            className="h-12 w-12 sm:h-14 sm:w-16 bg-white border-gray-200 shadow-md hover:bg-gray-100"
            onClick={() => handleButtonSwipe('left', 0)}
          >
            <X size={24} className="text-gray-500" />
          </Button>
          
          <Button 
            className="h-12 w-12 sm:h-14 sm:w-16 bg-gradient-love hover:opacity-90 shadow-md"
            onClick={() => handleButtonSwipe('right', 0)}
          >
            <Heart size={24} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default SwipeableCard;
