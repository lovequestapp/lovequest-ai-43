
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, X } from 'lucide-react';

interface ActionButtonsProps {
  profilesLength: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  profilesLength,
  onSwipeLeft,
  onSwipeRight
}) => {
  if (profilesLength === 0) return null;
  
  return (
    <div className="absolute bottom-[-70px] left-0 right-0 flex justify-center gap-6">
      <Button 
        variant="outline"
        className="h-12 w-12 sm:h-14 sm:w-16 bg-white border-gray-200 shadow-md hover:bg-gray-100"
        onClick={onSwipeLeft}
      >
        <X size={24} className="text-gray-500" />
      </Button>
      
      <Button 
        className="h-12 w-12 sm:h-14 sm:w-16 bg-gradient-love hover:opacity-90 shadow-md"
        onClick={onSwipeRight}
      >
        <Heart size={24} />
      </Button>
    </div>
  );
};

export default ActionButtons;
