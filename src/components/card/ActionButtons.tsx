
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Heart, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface ActionButtonsProps {
  profilesLength: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onViewProfile?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  profilesLength, 
  onSwipeLeft, 
  onSwipeRight,
  onViewProfile
}) => {
  if (profilesLength === 0) return null;
  
  return (
    <div className="absolute -bottom-20 left-0 right-0 flex justify-center gap-4 mt-6">
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-full border-2 border-gray-300 bg-white shadow-md"
          onClick={onSwipeLeft}
        >
          <X className="h-6 w-6 text-gray-500" />
        </Button>
      </motion.div>
      
      {onViewProfile && (
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full border-2 border-blue-300 bg-white shadow-md"
            onClick={onViewProfile}
          >
            <Info className="h-6 w-6 text-blue-500" />
          </Button>
        </motion.div>
      )}
      
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="icon"
          className="h-14 w-14 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 shadow-md"
          onClick={onSwipeRight}
        >
          <Heart className="h-6 w-6 text-white" />
        </Button>
      </motion.div>
    </div>
  );
};

export default ActionButtons;
