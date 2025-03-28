
import React, { useState, useEffect, useRef } from 'react';
import { useSprings, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface SwipeableCardProps {
  profiles: any[];
  onSwipe: (profileId: string, direction: 'left' | 'right') => void;
}

export default function SwipeableCard({ profiles, onSwipe }: SwipeableCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gone] = useState<Set<number>>(() => new Set());
  const [props, api] = useSprings(profiles.length, i => ({
    x: 0,
    y: 0,
    scale: 1,
    rot: 0,
    delay: i * 100,
  }));
  
  // Reset when profiles change
  useEffect(() => {
    setCurrentIndex(0);
    gone.clear();
    api.start(i => ({
      x: 0,
      y: 0,
      scale: 1,
      rot: 0,
      delay: i * 100,
    }));
  }, [profiles, api]);
  
  const handleSwipe = (index: number, direction: number) => {
    // Mark as gone
    gone.add(index);
    
    // Call the onSwipe callback with the profile ID and direction
    if (typeof onSwipe === 'function' && profiles[index]) {
      const profileId = profiles[index].id;
      onSwipe(profileId, direction > 0 ? 'right' : 'left');
    }
    
    // Update the current index
    setCurrentIndex(prevIndex => {
      const nextIndex = prevIndex + 1;
      return nextIndex >= profiles.length ? prevIndex : nextIndex;
    });
  };
  
  const bind = useDrag(
    ({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
      const trigger = velocity > 0.2;
      const dir = xDir < 0 ? -1 : 1;
      
      if (!down && trigger) {
        handleSwipe(index, dir);
      }
      
      api.start(i => {
        if (index !== i) return;
        
        const isGone = gone.has(index);
        const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0;
        const rot = mx / 100 + (isGone ? dir * 10 * velocity : 0);
        const scale = down ? 1.05 : 1;
        
        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
        };
      });
    }
  );
  
  if (profiles.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">No more profiles</h3>
          <p className="text-muted-foreground">Check back later for new matches</p>
        </div>
      </div>
    );
  }
  
  const handleButtonSwipe = (direction: 'left' | 'right') => {
    if (currentIndex < profiles.length) {
      // Store the profile ID locally first
      const profileId = profiles[currentIndex]?.id;
      
      // Update UI
      api.start(i => {
        if (i !== currentIndex) return;
        const x = direction === 'right' ? 500 : -500;
        gone.add(currentIndex);
        return { x, rot: direction === 'right' ? 10 : -10, delay: undefined };
      });
      
      // Call onSwipe only if it's a function and we have a valid profile ID
      if (typeof onSwipe === 'function' && profileId) {
        onSwipe(profileId, direction);
      }
      
      // Update current index
      setCurrentIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        return nextIndex >= profiles.length ? prevIndex : nextIndex;
      });
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md h-[60vh]">
        {props.map(({ x, y, rot, scale }, i) => {
          const profile = profiles[i];
          if (!profile) return null;
          
          // Show only if it's one of the next 3 cards
          if (i < currentIndex || i > currentIndex + 2) return null;
          
          return (
            <animated.div 
              key={profile.id} 
              style={{ 
                transform: to([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`),
                position: 'absolute', 
                width: '100%',
                height: '100%',
                willChange: 'transform',
                zIndex: profiles.length - i,
              }}
            >
              <animated.div
                {...bind(i)}
                style={{
                  transform: to([rot, scale], (rot, scale) => `rotate(${rot}deg) scale(${scale})`),
                  backgroundImage: `url(${profile.photos?.[0] || '/placeholder.svg'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  width: '100%',
                  height: '100%',
                  borderRadius: '10px',
                  willChange: 'transform',
                  boxShadow: '0 12px 20px -10px rgba(0, 0, 0, 0.2)',
                }}
              >
                <Card className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white rounded-b-lg rounded-t-none border-0 overflow-hidden">
                  <CardContent className="p-4">
                    <h3 className="text-xl font-semibold mb-1">{profile.name || 'Anonymous'}, {profile.age || '?'}</h3>
                    <p className="text-sm opacity-90 line-clamp-1">{profile.bio || 'No bio yet'}</p>
                  </CardContent>
                </Card>
              </animated.div>
            </animated.div>
          );
        })}
      </div>
      
      <CardFooter className="flex justify-center space-x-4 w-full max-w-md pt-6">
        <Button 
          size="lg" 
          variant="outline" 
          className="h-14 w-14 rounded-full border-2 border-muted"
          onClick={() => handleButtonSwipe('left')}
          disabled={currentIndex >= profiles.length}
        >
          <X className="h-6 w-6 text-red-500" />
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          className="h-14 w-14 rounded-full border-2 border-muted"
          onClick={() => handleButtonSwipe('right')}
          disabled={currentIndex >= profiles.length}
        >
          <Check className="h-6 w-6 text-green-500" />
        </Button>
      </CardFooter>
    </div>
  );
}

function to(args: any[], fn: Function) {
  return args.length === 1
    ? fn(args[0])
    : fn(...args);
}
