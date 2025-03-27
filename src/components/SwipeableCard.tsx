
import React, { useState } from 'react';
import { useSprings, animated, to as interpolate } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import CardContent from './card/CardContent';
import ActionButtons from './card/ActionButtons';
import SwipeHints from './card/SwipeHints';
import { to, from, trans, getVelocityValue } from './card/CardAnimation';

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
    // Convert Vector2 velocity to number by checking its magnitude
    const velocityValue = getVelocityValue(velocity);
    const trigger = velocityValue > 0.2; // Minimum velocity to trigger swipe
    const dir = xDir < 0 ? -1 : 1; // Direction is either left or right
    
    if (!active && trigger) {
      gone.add(index);
      const profile = profiles[index];
      // Only call onSwipe if we have a valid profile and onSwipe is a function
      if (profile && profile.id && typeof onSwipe === 'function') {
        onSwipe(profile.id, dir > 0 ? 'right' : 'left');
      }
    }
    
    api.start(i => {
      if (index !== i) return;
      const isGone = gone.has(index);
      
      // When a card is gone, fly it out
      const x = isGone ? (200 + window.innerWidth) * dir : active ? mx : 0;
      
      // Ensure numeric operation by explicitly converting mx to number
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

  const handleButtonSwipe = (direction: 'left' | 'right') => {
    // Only proceed if there are profiles to swipe
    if (!profiles || profiles.length === 0) return;
    
    const index = 0; // Always handle the top card
    const dir = direction === 'left' ? -1 : 1;
    gone.add(index);
    
    // First update the UI animation
    api.start(i => {
      if (index !== i) return;
      const x = (200 + window.innerWidth) * dir;
      const rot = dir * 10;
      
      return {
        x,
        rot,
        scale: 1,
        delay: undefined,
        config: { friction: 50, tension: 200 },
      };
    });
    
    // Then call onSwipe separately (make sure to check if the profile exists)
    if (profiles && profiles.length > 0 && profiles[index] && profiles[index].id) {
      // We need to explicitly call onSwipe as a function with the correct parameters
      if (typeof onSwipe === 'function') {
        onSwipe(profiles[index].id, direction);
      }
    }
    
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
      <SwipeHints />
      
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
            <CardContent profile={profiles[i]} index={i} />
          </animated.div>
        </animated.div>
      ))}
      
      <ActionButtons 
        profilesLength={profiles.length} 
        onSwipeLeft={() => handleButtonSwipe('left')}
        onSwipeRight={() => handleButtonSwipe('right')}
      />
    </div>
  );
};

export default SwipeableCard;
