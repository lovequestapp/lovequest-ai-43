
import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Card } from '../ui/card';
import { X, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useHapticFeedback from '@/hooks/useHapticFeedback';

interface SwipeableCardProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  children: React.ReactNode;
  cardClassName?: string;
  profileId?: string;
  allowNavigate?: boolean;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({ 
  onSwipeLeft, 
  onSwipeRight, 
  children,
  cardClassName = "",
  profileId,
  allowNavigate = true
}) => {
  const [exitX, setExitX] = useState<number | null>(null);
  const [showControls, setShowControls] = useState(false);
  const controls = useAnimation();
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  const threshold = windowWidth * 0.3;
  const navigate = useNavigate();
  
  // State variables to track current drag position for indicator visibility
  const [dragX, setDragX] = useState(0);

  const { triggerFeedback } = useHapticFeedback();

  const handleSwipeRight = () => {
    setExitX(windowWidth * 1.5);
    controls.start({ 
      x: windowWidth * 1.5, 
      rotate: 10,
      transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }
    });
    onSwipeRight && onSwipeRight();
    triggerFeedback(30); // light haptic vibration
  };

  const handleSwipeLeft = () => {
    setExitX(-windowWidth * 1.5);
    controls.start({ 
      x: -windowWidth * 1.5, 
      rotate: -10,
      transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }
    });
    onSwipeLeft && onSwipeLeft();
    triggerFeedback(30); // light haptic vibration
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation when clicking on action buttons
    if ((e.target as HTMLElement).closest('.card-action-button') || !allowNavigate) {
      return;
    }
    
    if (profileId && allowNavigate) {
      navigate(`/profile/${profileId}`);
    }
  };

  return (
    <motion.div
      animate={controls}
      initial={{ scale: 0.97, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      exit={{ x: exitX, opacity: 0 }}
      whileTap={{ scale: 0.985 }}
      whileHover={{ scale: 1.025 }}
      onHoverStart={() => setShowControls(true)}
      onHoverEnd={() => setShowControls(false)}
      style={{
        position: 'relative',
        height: '100%',
        touchAction: 'none',
        cursor: allowNavigate ? 'pointer' : 'default',
        perspective: '1200px'
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={(e, info) => {
        const { offset, velocity } = info;
        
        if (offset.x > threshold || velocity.x > 0.3) {
          handleSwipeRight();
        } else if (offset.x < -threshold || velocity.x < -0.3) {
          handleSwipeLeft();
        } else {
          controls.start({ x: 0, rotate: 0, filter: 'brightness(1)' });
        }
        
        // Reset drag position
        setDragX(0);
      }}
      onDrag={(e, info) => {
        const offsetX = info.offset.x;
        controls.set({ 
          x: offsetX, 
          rotate: offsetX / 18,
          filter: `brightness(${1 - Math.min(Math.abs(offsetX) / (windowWidth * 1.5) * 0.25, 0.25)})`
        });
        
        // Update drag position for indicators
        setDragX(offsetX);
      }}
      onClick={handleCardClick}
      className="will-change-transform will-change-opacity select-none"
    >
      {/* Card Action Buttons - Absolutely positioned on top of card */}
      <motion.div 
        className="absolute top-4 right-4 z-10 flex gap-2 card-action-buttons"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: showControls ? 1 : 0, scale: showControls ? 1 : 0.85 }}
        transition={{ duration: 0.25 }}
      >
        <button 
          className="card-action-button bg-white h-12 w-12 rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 border border-gray-200 transition-all duration-300"
          onClick={handleSwipeLeft}
          aria-label="Dislike"
          type="button"
        >
          <X size={24} className="text-red-500" />
        </button>
        <button 
          className="card-action-button bg-white h-12 w-12 rounded-full flex items-center justify-center shadow-lg hover:bg-green-50 border border-gray-200 transition-all duration-300"
          onClick={handleSwipeRight}
          aria-label="Like"
          type="button"
        >
          <Heart size={24} className="text-love-500" />
        </button>
      </motion.div>
      
      {/* Main card content with glass effect */}
      <Card className={`h-full overflow-hidden backdrop-blur-sm ${cardClassName}`}>
        <div className="h-full w-full relative overflow-hidden rounded-lg select-none">
          {children}
          
          {/* Swipe indicators */}
          <motion.div 
            className="absolute top-1/2 left-6 transform -translate-y-1/2 bg-red-500 text-white font-bold text-xl p-3 rounded-lg select-none"
            animate={{ 
              opacity: dragX < -50 ? 1 : 0,
              rotate: -30,
              scale: dragX < -100 ? 1.2 : 1
            }}
          >
            NOPE
          </motion.div>
          
          <motion.div 
            className="absolute top-1/2 right-6 transform -translate-y-1/2 bg-green-500 text-white font-bold text-xl p-3 rounded-lg select-none"
            animate={{ 
              opacity: dragX > 50 ? 1 : 0,
              rotate: 30,
              scale: dragX > 100 ? 1.2 : 1
            }}
          >
            LIKE
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default SwipeableCard;
