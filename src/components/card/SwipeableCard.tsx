
import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Card } from '../ui/card';
import { getVelocityValue } from './CardAnimation';

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

  return (
    <motion.div
      animate={controls}
      whileTap={{ scale: 0.97 }}
      exit={{ x: exitX, opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'relative',
        height: '100%',
        touchAction: 'none'
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={(e, info) => {
        const { offset, velocity } = info;
        
        // If dragged beyond threshold or with enough velocity
        if (offset.x > threshold || velocity.x > 0.2) {
          setExitX(windowWidth * 1.5);
          controls.start({ x: windowWidth * 1.5, rotate: 10 });
          onSwipeRight && onSwipeRight();
        } else if (offset.x < -threshold || velocity.x < -0.2) {
          setExitX(-windowWidth * 1.5);
          controls.start({ x: -windowWidth * 1.5, rotate: -10 });
          onSwipeLeft && onSwipeLeft();
        } else {
          // Return to center if not dragged enough
          controls.start({ x: 0, rotate: 0 });
        }
      }}
      // Add drag tracking for visual feedback during drag
      onDrag={(e, info) => {
        controls.set({ 
          x: info.offset.x, 
          rotate: info.offset.x / 20 
        });
      }}
    >
      <Card className={`h-full ${cardClassName}`}>
        {children}
      </Card>
    </motion.div>
  );
};

export default SwipeableCard;
