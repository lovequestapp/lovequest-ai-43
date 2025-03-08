
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, User, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const isMobile = useIsMobile();

  const NavItems = () => (
    <>
      <NavLink 
        to="/discover" 
        className={({ isActive }) => 
          `flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
            isActive 
              ? 'bg-love-100 text-love-700' 
              : 'hover:bg-love-50 hover:text-love-600'
          }`
        }
      >
        <Heart size={20} className="text-love-500" />
        <span className="font-medium">Discover</span>
      </NavLink>
      
      <NavLink 
        to="/messages" 
        className={({ isActive }) => 
          `flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
            isActive 
              ? 'bg-love-100 text-love-700' 
              : 'hover:bg-love-50 hover:text-love-600'
          }`
        }
      >
        <MessageCircle size={20} className="text-love-500" />
        <span className="font-medium">Messages</span>
      </NavLink>
      
      <NavLink 
        to="/profile" 
        className={({ isActive }) => 
          `flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
            isActive 
              ? 'bg-love-100 text-love-700' 
              : 'hover:bg-love-50 hover:text-love-600'
          }`
        }
      >
        <User size={20} className="text-love-500" />
        <span className="font-medium">Profile</span>
      </NavLink>
    </>
  );

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-love-100 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <Heart size={28} className="text-love-500 animate-pulse-heart" />
          <h1 className="text-2xl font-display font-bold bg-gradient-love text-transparent bg-clip-text">
            LoveQuest
          </h1>
        </NavLink>
        
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                <NavItems />
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="flex items-center gap-2">
            <NavItems />
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
