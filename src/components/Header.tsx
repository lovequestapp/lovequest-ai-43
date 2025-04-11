
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  User,
  X,
  Heart,
  Compass,
  Users,
  BookOpen,
  Home,
  ShoppingBag,
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { currentUser, logout, isAuthenticated } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Common navigation items for all users
  const COMMON_NAV_ITEMS = [
    { name: 'Home', path: '/', icon: <Home className="h-4 w-4 mr-2" /> },
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

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    closeDrawer();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    closeDrawer();
  };

  return (
    <header className="border-b py-3 px-4 bg-white shadow-sm sticky top-0 z-50 dark:bg-slate-900/90 dark:border-slate-800">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center mr-auto">
          <Heart className="h-6 w-6 text-love-500 mr-2" />
          <h1 className="text-lg md:text-xl font-bold text-love-600 dark:text-love-400 font-display">LoveQuest</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {NAV_ITEMS.map((item) => (
            <Button 
              key={item.path}
              variant={location.pathname === item.path ? "default" : "ghost"} 
              className={`flex items-center ${location.pathname === item.path ? 'bg-love-500 hover:bg-love-600 dark:bg-love-600 dark:hover:bg-love-700' : 'dark:text-slate-200'}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {item.name}
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full relative">
                    <Bell size={20} />
                    <Badge className="bg-love-500 absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">3</Badge>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-2 dark:bg-slate-900 dark:border-slate-800">
                  <div className="text-sm font-semibold py-2 px-4 border-b dark:border-slate-700">Notifications</div>
                  <div className="py-2">
                    <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer rounded-md">
                      <p className="text-sm font-medium">You have a new match!</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer rounded-md">
                      <p className="text-sm font-medium">John sent you a message</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer rounded-md">
                      <p className="text-sm font-medium">Your profile has been viewed 10 times</p>
                      <p className="text-xs text-muted-foreground">3 hours ago</p>
                    </div>
                  </div>
                  <div className="border-t pt-2 pb-1 px-4 dark:border-slate-700">
                    <Button variant="link" className="w-full justify-center text-xs h-8">
                      View all notifications
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

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
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" className="hover:bg-love-50" onClick={() => navigate('/login')}>
                Log In
              </Button>
              <Button className="bg-love-500 hover:bg-love-600" onClick={() => navigate('/register')}>
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
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
                  {/* Common navigation items */}
                  {COMMON_NAV_ITEMS.map((item) => (
                    <Button
                      key={item.path}
                      variant={location.pathname === item.path ? "default" : "ghost"}
                      className={`w-full justify-start ${location.pathname === item.path ? 'bg-love-500 hover:bg-love-600' : 'hover:bg-love-50'}`}
                      onClick={() => handleNavigation(item.path)}
                    >
                      {item.icon}
                      {item.name}
                    </Button>
                  ))}
                  
                  {/* Only show auth-specific nav items to authenticated users */}
                  {isAuthenticated && AUTH_NAV_ITEMS.map((item) => (
                    <Button
                      key={item.path}
                      variant={location.pathname === item.path ? "default" : "ghost"}
                      className={`w-full justify-start ${location.pathname === item.path ? 'bg-love-500 hover:bg-love-600' : 'hover:bg-love-50'}`}
                      onClick={() => handleNavigation(item.path)}
                    >
                      {item.icon}
                      {item.name}
                    </Button>
                  ))}
                  
                  {!isAuthenticated && (
                    <div className="pt-4 mt-4 border-t border-love-100 dark:border-slate-800 space-y-2">
                      <Button 
                        className="w-full bg-love-500 hover:bg-love-600"
                        onClick={() => handleNavigation('/register')}
                      >
                        Sign Up
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full border-love-200"
                        onClick={() => handleNavigation('/login')}
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
        </div>
      </div>
    </header>
  );
};

export default Header;
