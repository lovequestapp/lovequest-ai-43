
import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import { Card } from '../ui/card';

interface SwipeableCardProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  children: React.ReactNode;
  cardClassName?: string;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({ 
  onSwipeLeft, 
  onSwipeRight, 
  children,
  cardClassName = ""
}) => {
  const [exitX, setExitX] = useState<number | null>(null);
  const controls = useAnimation();
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  const threshold = windowWidth * 0.3;

  // Fixed useDrag implementation to properly handle swipes
  const bindDrag = useDrag(({ down, movement: [mx], direction: [xDir], velocity }) => {
    const trigger = velocity > 0.2; // Velocity threshold for quick swipes
    
    if (!down) {
      // If released beyond threshold or with sufficient velocity
      if (mx > threshold || (trigger && xDir > 0)) {
        setExitX(windowWidth * 1.5);
        controls.start({ x: windowWidth * 1.5 });
        onSwipeRight && onSwipeRight();
      } else if (mx < -threshold || (trigger && xDir < 0)) {
        setExitX(-windowWidth * 1.5);
        controls.start({ x: -windowWidth * 1.5 });
        onSwipeLeft && onSwipeLeft();
      } else {
        controls.start({ x: 0, rotation: 0 });
      }
    } else {
      // While dragging
      controls.start({ 
        x: mx, 
        rotation: mx / 20,
        transition: { duration: 0 } 
      });
    }
  }, {
    filterTaps: true,
    axis: 'x',
    initial: () => [0, 0]
  });

  return (
    <motion.div
      animate={controls}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      whileTap={{ scale: 0.97 }}
      exit={{ x: exitX, opacity: 0 }}
      transition={{ duration: 0.5 }}
      {...bindDrag()}
      style={{
        position: 'relative',
        height: '100%',
        touchAction: 'none'
      }}
    >
      <Card className={`h-full ${cardClassName}`}>
        {children}
      </Card>
    </motion.div>
  );
};

export default SwipeableCard;
