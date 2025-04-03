
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  danger?: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, active = false, danger = false, onClick }: NavItemProps) => (
  <div 
    className={cn(
      "flex items-center p-3 rounded-lg mb-1.5 cursor-pointer transition-all duration-200",
      active ? "bg-gradient-to-r from-love-500 to-passion-500 text-white shadow-md shadow-love-200" : 
      danger ? "text-red-600 hover:bg-red-50" :
      "hover:bg-love-50 text-love-800"
    )}
    onClick={onClick}
  >
    <div className={cn("mr-3", active ? "text-white" : danger ? "text-red-500" : "text-love-600")}>{icon}</div>
    <span className={cn(active ? "font-medium" : "")}>{label}</span>
    <ChevronRight className={cn("h-4 w-4 ml-auto", active ? "text-white" : danger ? "text-red-400" : "text-love-400")} />
  </div>
);

export default NavItem;
