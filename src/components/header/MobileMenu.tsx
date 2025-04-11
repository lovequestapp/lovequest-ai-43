
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useUser } from '@/context/UserContext';
import { Menu, X, Heart, LogOut } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import NavItems from './NavItems';

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MobileMenu = ({ open, onOpenChange }: MobileMenuProps) => {
  const { currentUser, logout, isAuthenticated } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden ml-2"
        >
          <Menu size={24} />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-white dark:bg-slate-900">
        <DrawerHeader className="border-b border-love-100 dark:border-slate-800">
          <DrawerTitle className="font-display text-love-600 dark:text-love-400 flex items-center">
            <Heart className="h-5 w-5 text-love-500 mr-2" />
            LoveQuest Menu
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 py-3">
          <div className="space-y-2">
            <NavItems isAuthenticated={isAuthenticated} isMobile={true} closeDrawer={() => onOpenChange(false)} />
            
            {!isAuthenticated && (
              <div className="pt-4 mt-4 border-t border-love-100 dark:border-slate-800 space-y-2">
                <Button 
                  className="w-full bg-love-500 hover:bg-love-600"
                  onClick={() => {
                    navigate('/register');
                    onOpenChange(false);
                  }}
                >
                  Sign Up
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-love-200"
                  onClick={() => {
                    navigate('/login');
                    onOpenChange(false);
                  }}
                >
                  Log In
                </Button>
              </div>
            )}

            {isAuthenticated && (
              <div className="pt-4 mt-4 border-t border-love-100 dark:border-slate-800">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-rose-500"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </div>
            )}
          </div>
        </div>
        <DrawerClose className="absolute top-4 right-4">
          <Button variant="ghost" size="icon">
            <X className="h-4 w-4" />
          </Button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileMenu;
