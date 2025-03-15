
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, MessageCircle, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileToolbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isActive = (path: string) => {
    if (path === '/discover' && (currentPath === '/discover' || currentPath.startsWith('/profiles'))) {
      return true;
    }
    if (path === '/messages' && (currentPath === '/messages' || currentPath.startsWith('/messages/'))) {
      return true;
    }
    return currentPath === path;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        <Link 
          to="/discover" 
          className={cn(
            "flex flex-col items-center justify-center w-1/3 py-2 transition-colors",
            isActive('/discover') 
              ? "text-love-500" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Heart size={22} className={cn(isActive('/discover') ? "fill-love-500" : "")} />
          <span className="text-xs mt-1 font-medium">Matches</span>
        </Link>
        
        <Link 
          to="/messages" 
          className={cn(
            "flex flex-col items-center justify-center w-1/3 py-2 transition-colors",
            isActive('/messages') 
              ? "text-love-500" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <MessageCircle size={22} className={cn(isActive('/messages') ? "fill-love-500" : "")} />
          <span className="text-xs mt-1 font-medium">Messages</span>
        </Link>
        
        <Link 
          to="/explore" 
          className={cn(
            "flex flex-col items-center justify-center w-1/3 py-2 transition-colors",
            isActive('/explore') 
              ? "text-love-500" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Calendar size={22} className={cn(isActive('/explore') ? "fill-love-500" : "")} />
          <span className="text-xs mt-1 font-medium">Dates</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileToolbar;
