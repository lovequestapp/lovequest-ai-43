
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home, Compass, MessageSquare, Users, User, ShoppingBag, BookOpen } from 'lucide-react';

interface NavItemsProps {
  isAuthenticated: boolean;
  isMobile?: boolean;
  closeDrawer?: () => void;
}

const NavItems = ({ isAuthenticated, isMobile = false, closeDrawer = () => {} }: NavItemsProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Common navigation items for all users
  const COMMON_NAV_ITEMS = [
    { name: 'Home', path: '/', icon: <Home className="h-4 w-4 mr-2" /> },
    { name: 'Blog', path: '/blog', icon: <BookOpen className="h-4 w-4 mr-2" /> },
  ];

  // Navigation items for authenticated users
  const AUTH_NAV_ITEMS = [
    { name: 'Discover', path: '/discover', icon: <Compass className="h-4 w-4 mr-2" /> },
    { name: 'Messages', path: '/messages', icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    { name: 'Matches', path: '/matches', icon: <Users className="h-4 w-4 mr-2" /> },
    { name: 'Profile', path: '/user-profile', icon: <User className="h-4 w-4 mr-2" /> },
    { name: 'Shop', path: '/shop', icon: <ShoppingBag className="h-4 w-4 mr-2" /> },
  ];

  // Dynamic nav items based on authentication status
  const NAV_ITEMS = [
    ...COMMON_NAV_ITEMS,
    ...(isAuthenticated ? AUTH_NAV_ITEMS : [])
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      closeDrawer();
    }
  };

  return (
    <>
      {NAV_ITEMS.map((item) => (
        <Button 
          key={item.path}
          variant={location.pathname === item.path ? "default" : "ghost"} 
          className={`
            flex items-center 
            ${location.pathname === item.path 
              ? 'bg-love-500 hover:bg-love-600 dark:bg-love-600 dark:hover:bg-love-700' 
              : 'dark:text-slate-200'}
            ${isMobile ? 'w-full justify-start' : ''}
          `}
          onClick={() => handleNavigation(item.path)}
        >
          {item.icon}
          {item.name}
        </Button>
      ))}
    </>
  );
};

export default NavItems;
