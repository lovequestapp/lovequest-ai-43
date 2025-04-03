
import React from 'react';
import { cn } from '@/lib/utils';

interface BottomNavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const BottomNavItem = ({ icon, label, active = false, onClick }: BottomNavItemProps) => (
  <button 
    className={cn(
      "flex flex-col items-center justify-center py-3 px-2 w-full transition-colors duration-200",
      active ? "text-love-600" : "text-gray-500 hover:text-love-400"
    )}
    onClick={onClick}
  >
    {icon}
    <span className="text-xs mt-1 truncate-text">{label}</span>
  </button>
);

export default BottomNavItem;
