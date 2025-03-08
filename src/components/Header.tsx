
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Heart, MessageCircle, User, Search, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUser } from '@/context/UserContext';

const Header = () => {
  const location = useLocation();
  const { currentUser } = useUser();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="border-b border-love-100 py-4 px-4 bg-white sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <NavLink 
          to="/" 
          className="flex items-center gap-2 font-display font-bold text-xl"
        >
          <Heart className="h-6 w-6 text-love-500 fill-love-500" />
          <span className="hidden sm:inline">DateQuest</span>
        </NavLink>
        
        <nav className="flex items-center gap-2">
          <NavLink 
            to="/discover" 
            className={cn(
              "p-2 rounded-full hover:bg-love-50 transition-colors",
              isActive('/discover') && "bg-love-50 text-love-500"
            )}
          >
            <Search className="h-5 w-5" />
          </NavLink>
          
          <NavLink 
            to="/messages" 
            className={cn(
              "p-2 rounded-full hover:bg-love-50 transition-colors",
              isActive('/messages') && "bg-love-50 text-love-500"
            )}
          >
            <MessageCircle className="h-5 w-5" />
          </NavLink>
          
          <NavLink 
            to="/profile" 
            className={cn(
              "p-2 rounded-full hover:bg-love-50 transition-colors",
              isActive('/profile') && "bg-love-50 text-love-500"
            )}
          >
            <User className="h-5 w-5" />
          </NavLink>
          
          {!currentUser && (
            <NavLink to="/signup">
              <Button size="sm" className="bg-love-500 hover:bg-love-600 ml-2">
                <LogIn className="h-4 w-4 mr-1" />
                <span>Sign Up</span>
              </Button>
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
