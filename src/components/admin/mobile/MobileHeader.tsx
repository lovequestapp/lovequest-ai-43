
import React from 'react';
import { Menu, Heart } from 'lucide-react';

interface MobileHeaderProps {
  setMenuOpen: (open: boolean) => void;
}

const MobileHeader = ({ setMenuOpen }: MobileHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 w-full bg-white/80 backdrop-blur-md shadow-md border-b border-love-100 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-love flex items-center justify-center shadow-md">
            <Heart className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-love-800 truncate-text">Admin Dashboard</h1>
        </div>
        <button 
          onClick={() => setMenuOpen(true)}
          className="p-2 rounded-full hover:bg-love-50/50 text-love-700"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default MobileHeader;
