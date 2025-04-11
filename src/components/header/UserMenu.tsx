
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from '@/context/UserContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ChevronDown,
  LogOut,
  Settings,
  User,
  ShoppingBag,
} from 'lucide-react';

const UserMenu = () => {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!currentUser) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 ml-2 relative">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser?.photos?.[0]} alt={currentUser?.name} />
            <AvatarFallback className="bg-love-100 text-love-800 dark:bg-love-900 dark:text-love-200">
              {currentUser?.name?.substring(0, 2).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:inline-block font-medium">{currentUser?.name}</span>
          <ChevronDown size={16} />
          {(currentUser?.role === 'admin' || currentUser?.role === 'moderator') && (
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-love-500 rounded-full border-2 border-white dark:border-slate-900"></div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-2 dark:bg-slate-900 dark:border-slate-800">
        <div className="grid gap-1">
          <Button 
            variant="ghost" 
            className="flex justify-start items-center h-10"
            onClick={() => navigate('/user-profile')}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Your Profile</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex justify-start items-center h-10"
            onClick={() => navigate('/preferences')}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Preferences</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex justify-start items-center h-10"
            onClick={() => navigate('/shop')}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            <span>Gift Shop</span>
          </Button>
          
          {(currentUser?.role === 'admin' || currentUser?.role === 'moderator') && (
            <Button 
              variant="ghost" 
              className="flex justify-start items-center h-10"
              onClick={() => navigate('/admin')}
            >
              <span className="mr-2 h-4 w-4 text-love-500 font-bold">A</span>
              <span>Admin Panel</span>
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            className="flex justify-start items-center text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 h-10"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log Out</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserMenu;
