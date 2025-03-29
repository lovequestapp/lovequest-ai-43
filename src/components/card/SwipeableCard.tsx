
import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
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

  // Properly typed useDrag implementation
  const bindDrag = useDrag(({ down, movement: [mx], direction: [xDir], velocity }) => {
    // Convert velocity to a numeric value if it's a Vector2
    const velocityValue = getVelocityValue(velocity);
    const trigger = velocityValue > 0.2; // Velocity threshold for quick swipes
    
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
        controls.start({ x: 0, rotate: 0 });
      }
    } else {
      // While dragging - use rotate instead of rotation
      controls.start({ 
        x: mx, 
        rotate: mx / 20,
        transition: { duration: 0 } 
      });
    }
  }, {
    filterTaps: true,
    axis: 'x',
    initial: () => [0, 0]
  });

  // Extract the gesture handler props from the bind result
  const gestureProps = bindDrag();
  
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
      // Apply only the specific gesture props needed for motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={(e, info) => {
        const { offset, velocity } = info;
        if (offset.x > threshold || velocity.x > 0.2) {
          onSwipeRight && onSwipeRight();
        } else if (offset.x < -threshold || velocity.x < -0.2) {
          onSwipeLeft && onSwipeLeft();
        }
      }}
    >
      <Card className={`h-full ${cardClassName}`}>
        {children}
      </Card>
    </motion.div>
  );
};

export default SwipeableCard;
