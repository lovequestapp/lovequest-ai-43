
import React from 'react';
import { Home, Users, BarChart2, Settings } from 'lucide-react';
import BottomNavItem from './BottomNavItem';

interface MobileBottomNavProps {
  activeTab: string;
  location: any;
  navigate: (path: string) => void;
  handleTabChange: (tab: string) => void;
}

const MobileBottomNav = ({ activeTab, location, navigate, handleTabChange }: MobileBottomNavProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg border-t border-love-100 z-40">
      <div className="flex justify-around items-center">
        <BottomNavItem 
          icon={<Home className="h-5 w-5" />} 
          label="Home" 
          active={location.pathname === '/admin'} 
          onClick={() => navigate('/admin')}
        />
        <BottomNavItem 
          icon={<Users className="h-5 w-5" />} 
          label="Users" 
          active={activeTab === 'users'}
          onClick={() => handleTabChange('users')}
        />
        <BottomNavItem 
          icon={<BarChart2 className="h-5 w-5" />} 
          label="Stats" 
          active={activeTab === 'analytics'}
          onClick={() => handleTabChange('analytics')}
        />
        <BottomNavItem 
          icon={<Settings className="h-5 w-5" />} 
          label="Settings" 
          active={activeTab === 'settings'}
          onClick={() => handleTabChange('settings')}
        />
      </div>
    </div>
  );
};

export default MobileBottomNav;
