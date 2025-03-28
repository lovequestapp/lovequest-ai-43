
import React, { useState } from 'react';
import { useSprings, animated, useSpring } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CardContent from './CardContent';
import SwipeHints from './SwipeHints';

// Define a helper function for transform interpolations
const to = (x: number, y: number): string => `translate3d(${x}px,${y}px,0)`;
const toRot = (rot: number, scale: number): string => `rotate(${rot}deg) scale(${scale})`;

interface SwipeableCardProps {
  profiles: any[];
  onSwipe: (profileId: string, direction: 'left' | 'right') => void;
}

export default function SwipeableCard({ profiles, onSwipe }: SwipeableCardProps) {
  const [gone] = useState(() => new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [showNoMatches, setShowNoMatches] = useState(false);
  
  const [hints] = useState({
    swipeRight: "Swipe right if you're interested",
    swipeLeft: "Swipe left to pass",
  });

  const [props, api] = useSprings(profiles.length, i => ({
    x: 0,
    y: 0,
    scale: 1,
    rot: 0,
    delay: i * 100,
  }));
  
  const fadeInOut = useSpring({
    opacity: showHints ? 1 : 0,
    config: { duration: 200 },
  });

  // Check if we should show the tutorial (first card, first time)
  React.useEffect(() => {
    if (currentIndex === 0 && profiles.length > 0) {
      const timer = setTimeout(() => {
        setShowHints(true);
        setTimeout(() => {
          setShowHints(false);
        }, 3000);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex, profiles.length]);

  // Check if we're out of profiles
  React.useEffect(() => {
    if (currentIndex >= profiles.length && profiles.length > 0) {
      setShowNoMatches(true);
    } else {
      setShowNoMatches(false);
    }
  }, [currentIndex, profiles.length]);

  const bind = useDrag(({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
    // Fix TS2365: Handle velocity as a number or extract magnitude from Vector2
    const velocityValue = typeof velocity === 'number' ? velocity : Math.sqrt(velocity[0] * velocity[0] + velocity[1] * velocity[1]);
    const trigger = velocityValue > 0.2;
    const dir = xDir < 0 ? -1 : 1;
    
    if (!down && trigger) {
      gone.add(index);
      
      // Store the profile ID locally first
      const profileId = profiles[index]?.id;
      
      // Call onSwipe only if it's a function and we have a valid profile ID
      if (typeof onSwipe === 'function' && profileId) {
        onSwipe(profileId, dir > 0 ? 'right' : 'left');
      }
      
      setCurrentIndex(prev => prev + 1);
    }
    
    api.start(i => {
      if (index !== i) return;
      const isGone = gone.has(index);
      const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0;
      // Fix TS2363: Handle velocity calculation properly
      const rot = mx / 100 + (isGone ? dir * 10 * velocityValue : 0);
      const scale = down ? 1.05 : 1;
      
      return {
        x,
        rot,
        scale,
        delay: undefined,
        config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
      };
    });
  });

  const handleButtonSwipe = (direction: 'left' | 'right') => {
    if (currentIndex < profiles.length) {
      // Store the profile ID locally first
      const profileId = profiles[currentIndex]?.id;
      
      // Update the card animation
      api.start(i => {
        if (i !== currentIndex) return;
        
        gone.add(currentIndex);
        const x = direction === 'right' ? 500 : -500;
        
        return {
          x,
          rot: direction === 'right' ? 10 : -10,
          delay: undefined,
        };
      });
      
      // Call onSwipe only if it's a function and we have a valid profile ID
      if (typeof onSwipe === 'function' && profileId) {
        onSwipe(profileId, direction);
      }
      
      // Update the current index
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Show loading state if no profiles
  if (!profiles || profiles.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h3 className="text-xl font-medium mb-2">Loading profiles...</h3>
          <p className="text-muted-foreground">Please wait while we find matches for you</p>
        </div>
      </div>
    );
  }

  // Show no more matches state
  if (showNoMatches) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h3 className="text-xl font-medium mb-2">You've seen all profiles</h3>
          <p className="text-muted-foreground">Check back soon for new matches</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[70vh] w-full max-w-md mx-auto">
      {props.map(({ x, y, rot, scale }, i) => {
        // Only render cards that are current or next few
        if (i < currentIndex || i >= currentIndex + 3) return null;
        
        return (
          <animated.div
            key={profiles[i].id}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              willChange: 'transform',
              transform: to(x.get(), y.get()),
              zIndex: profiles.length - i,
            }}
          >
            <animated.div
              {...bind(i)}
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                willChange: 'transform',
                borderRadius: '10px',
                transformOrigin: 'center center',
                transform: toRot(rot.get(), scale.get()),
                boxShadow: '0 12px 20px -10px rgba(0, 0, 0, 0.2)',
                touchAction: 'none',
              }}
            >
              <CardContent profile={profiles[i]} index={i} />
              
              {showHints && i === currentIndex && (
                <animated.div style={fadeInOut}>
                  <SwipeHints hints={hints} />
                </animated.div>
              )}
            </animated.div>
          </animated.div>
        );
      })}

      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-6">
        <Button 
          variant="outline" 
          size="lg" 
          className="h-14 w-14 rounded-full border-2"
          onClick={() => handleButtonSwipe('left')}
          disabled={currentIndex >= profiles.length}
        >
          <X className="h-6 w-6 text-destructive" />
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          className="h-14 w-14 rounded-full border-2"
          onClick={() => handleButtonSwipe('right')}
          disabled={currentIndex >= profiles.length}
        >
          <Check className="h-6 w-6 text-green-500" />
        </Button>
      </div>
    </div>
  );
}
