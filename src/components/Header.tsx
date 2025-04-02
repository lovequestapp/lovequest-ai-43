
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from '@/context/UserContext';
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
  ShoppingBag
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

const Header = () => {
  const { currentUser, logout, isAuthenticated } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const NAV_ITEMS = [
    { name: 'Discover', path: '/discover', icon: <Compass className="h-4 w-4 mr-2" /> },
    { name: 'Matches', path: '/matches', icon: <Heart className="h-4 w-4 mr-2" /> },
    { name: 'Messages', path: '/messages', icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    { name: 'Explore', path: '/explore', icon: <Users className="h-4 w-4 mr-2" /> },
    { name: 'Blog', path: '/blog', icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { name: 'Shop', path: '/shop', icon: <ShoppingBag className="h-4 w-4 mr-2" /> }
  ];

  return (
    <header className="border-b py-3 px-4 bg-love-50/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <h1 className="text-lg md:text-xl font-bold text-love-600 font-display">MatchCupid</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {isAuthenticated && (
            <NavigationMenu>
              <NavigationMenuList>
                {NAV_ITEMS.map((item) => (
                  <NavigationMenuItem key={item.path}>
                    <Link to={item.path}>
                      <Button 
                        variant={location.pathname === item.path ? "default" : "ghost"} 
                        className="flex items-center"
                      >
                        {item.icon}
                        {item.name}
                      </Button>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </nav>

        <div className="flex items-center">
          {isAuthenticated ? (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full relative">
                    <Bell size={20} />
                    <Badge className="bg-love-500 absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">3</Badge>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-2">
                  <div className="text-sm font-semibold py-2 px-4 border-b">Notifications</div>
                  <div className="py-2">
                    <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer rounded-md">
                      <p className="text-sm font-medium">You have a new match!</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer rounded-md">
                      <p className="text-sm font-medium">John sent you a message</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer rounded-md">
                      <p className="text-sm font-medium">Your profile has been viewed 10 times</p>
                      <p className="text-xs text-muted-foreground">3 hours ago</p>
                    </div>
                  </div>
                  <div className="border-t pt-2 pb-1 px-4">
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
                      <AvatarFallback className="bg-love-100 text-love-800">
                        {currentUser?.name?.substring(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block font-medium">{currentUser?.name}</span>
                    <ChevronDown size={16} />
                    {(currentUser?.role === 'admin' || currentUser?.role === 'moderator') && (
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-love-500 rounded-full border-2 border-white"></div>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-56 p-2">
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
                      onClick={() => navigate('/shop')}
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      <span>Gift Shop</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="flex justify-start items-center h-10"
                      onClick={() => navigate('/preferences')}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Preferences</span>
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
                      className="flex justify-start items-center text-rose-500 hover:text-rose-600 hover:bg-rose-50 h-10"
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
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Log In
              </Button>
              <Button onClick={() => navigate('/register')}>
                Sign Up
              </Button>
            </div>
          )}

          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden ml-2"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 bg-white z-40 flex flex-col p-4 md:hidden transform transition-transform",
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex justify-between items-center mb-8 pt-2">
          <h2 className="text-lg font-bold text-love-600">Menu</h2>
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            <X size={24} />
          </Button>
        </div>

        <nav className="flex flex-col gap-2">
          {isAuthenticated && NAV_ITEMS.map(item => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "default" : "ghost"}
              className="justify-start h-12"
              onClick={() => {
                navigate(item.path);
                setIsMenuOpen(false);
              }}
            >
              {item.icon}
              {item.name}
            </Button>
          ))}

          {isAuthenticated ? (
            <>
              <div className="border-t my-4"></div>
              <Button
                variant="ghost"
                className="justify-start h-12"
                onClick={() => {
                  navigate('/user-profile');
                  setIsMenuOpen(false);
                }}
              >
                <User className="h-4 w-4 mr-2" />
                Your Profile
              </Button>
              <Button
                variant="ghost"
                className="justify-start h-12"
                onClick={() => {
                  navigate('/preferences');
                  setIsMenuOpen(false);
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Preferences
              </Button>
              {(currentUser?.role === 'admin' || currentUser?.role === 'moderator') && (
                <Button
                  variant="ghost"
                  className="justify-start h-12"
                  onClick={() => {
                    navigate('/admin');
                    setIsMenuOpen(false);
                  }}
                >
                  <span className="mr-2 h-4 w-4 text-love-500 font-bold">A</span>
                  Admin Panel
                </Button>
              )}
              <Button
                variant="ghost"
                className="justify-start h-12 text-rose-500"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </>
          ) : (
            <>
              <div className="border-t my-4"></div>
              <Button
                variant="outline"
                className="justify-center h-12 mb-2"
                onClick={() => {
                  navigate('/login');
                  setIsMenuOpen(false);
                }}
              >
                Log In
              </Button>
              <Button
                className="justify-center h-12"
                onClick={() => {
                  navigate('/register');
                  setIsMenuOpen(false);
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
