
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, MessageCircle, Calendar, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/context/UserContext';

const MobileToolbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { currentUser } = useUser();
  
  const isActive = (path: string) => {
    if (path === '/matches' && (currentPath === '/matches' || currentPath.startsWith('/profile'))) {
      return true;
    }
    if (path === '/messages' && (currentPath === '/messages' || currentPath.startsWith('/messages/'))) {
      return true;
    }
    if (path === '/dates' && currentPath === '/dates') {
      return true;
    }
    if (path === '/admin' && currentPath === '/admin') {
      return true;
    }
    return currentPath === path;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:hidden">
      <div className="flex justify-around items-center h-16 px-2 pb-safe-bottom">
        <Link 
          to="/matches" 
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-2 transition-colors",
            isActive('/matches') 
              ? "text-love-500" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Heart size={22} className={cn(isActive('/matches') ? "fill-love-500" : "")} />
          <span className="text-xs mt-1 font-medium">Matches</span>
        </Link>
        
        <Link 
          to="/messages" 
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-2 transition-colors",
            isActive('/messages') 
              ? "text-love-500" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <MessageCircle size={22} className={cn(isActive('/messages') ? "fill-love-500" : "")} />
          <span className="text-xs mt-1 font-medium">Messages</span>
        </Link>
        
        <Link 
          to="/dates" 
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-2 transition-colors",
            isActive('/dates') 
              ? "text-love-500" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Calendar size={22} className={cn(isActive('/dates') ? "fill-love-500" : "")} />
          <span className="text-xs mt-1 font-medium">Dates</span>
        </Link>
        
        {currentUser?.role === 'admin' && (
          <Link 
            to="/admin" 
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-2 transition-colors",
              isActive('/admin') 
                ? "text-love-500" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutDashboard size={22} className={cn(isActive('/admin') ? "fill-love-500" : "")} />
            <span className="text-xs mt-1 font-medium">Admin</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileToolbar;
