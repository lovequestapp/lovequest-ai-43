
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useUser } from '@/context/UserContext';
import { Heart, MessageCircle, Search, User, LogOut, Menu, Crown, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { convertPremiumStatus } from '@/utils/subscription';
import SubscriptionBadge from './SubscriptionBadge';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useUser();
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = () => {
    logout();
    setSheetOpen(false);
  };
  
  return (
    <header className="border-b py-3 px-4 bg-white z-10">
      <div className="container max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-love-500 fill-love-500" />
            <span className="text-xl font-display text-black">LoveQuest</span>
          </Link>
        </div>
        
        {currentUser ? (
          <>
            {isMobile ? (
              <div className="flex items-center">
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[80%] sm:w-[350px] border-love-100">
                    <SheetHeader className="border-b pb-4">
                      <div className="flex justify-between items-center">
                        <SheetTitle className="text-love-800 font-display">LoveQuest Menu</SheetTitle>
                        <Button variant="ghost" size="icon" onClick={() => setSheetOpen(false)}>
                          <X size={18} />
                        </Button>
                      </div>
                    </SheetHeader>
                    <div className="py-6 flex flex-col gap-3">
                      <div className="flex items-center gap-3 mb-6 p-4 bg-love-50 rounded-lg border border-love-100">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-love-200 to-love-400 text-white flex items-center justify-center font-semibold">
                          {currentUser.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-love-900">{currentUser.name}</p>
                          <p className="text-xs text-gray-500">{currentUser.email}</p>
                          {currentUser.premiumStatus !== convertPremiumStatus('standard') && (
                            <SubscriptionBadge status={currentUser.premiumStatus} className="mt-1" />
                          )}
                        </div>
                      </div>
                      
                      <Button 
                        variant={isActive("/discover") ? "default" : "ghost"}
                        className={`justify-start ${isActive("/discover") 
                          ? "bg-love-500 hover:bg-love-600" 
                          : "hover:bg-love-50 hover:text-love-700"}`}
                        onClick={() => { navigate("/discover"); setSheetOpen(false); }}
                      >
                        <Heart size={18} className="mr-2" />
                        Discover
                      </Button>
                      
                      <Button 
                        variant={isActive("/matches") ? "default" : "ghost"}
                        className={`justify-start ${isActive("/matches") 
                          ? "bg-love-500 hover:bg-love-600" 
                          : "hover:bg-love-50 hover:text-love-700"}`}
                        onClick={() => { navigate("/matches"); setSheetOpen(false); }}
                      >
                        <User size={18} className="mr-2" />
                        Matches
                      </Button>
                      
                      <Button 
                        variant={isActive("/messages") ? "default" : "ghost"}
                        className={`justify-start ${isActive("/messages") 
                          ? "bg-love-500 hover:bg-love-600" 
                          : "hover:bg-love-50 hover:text-love-700"}`}
                        onClick={() => { navigate("/messages"); setSheetOpen(false); }}
                      >
                        <MessageCircle size={18} className="mr-2" />
                        Messages
                      </Button>
                      
                      <Button 
                        variant={isActive("/user-profile") ? "default" : "ghost"}
                        className={`justify-start ${isActive("/user-profile") 
                          ? "bg-love-500 hover:bg-love-600" 
                          : "hover:bg-love-50 hover:text-love-700"}`}
                        onClick={() => { navigate("/user-profile"); setSheetOpen(false); }}
                      >
                        <User size={18} className="mr-2" />
                        My Profile
                      </Button>
                      
                      <Button 
                        variant="ghost"
                        className="justify-start hover:bg-love-50 hover:text-love-700"
                        onClick={() => { navigate("/user-profile?tab=monetize"); setSheetOpen(false); }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                        Monetization
                      </Button>
                      
                      {currentUser.role === 'admin' && (
                        <Button 
                          variant={isActive("/admin") ? "default" : "ghost"}
                          className={`justify-start ${isActive("/admin") 
                            ? "bg-amber-500 hover:bg-amber-600" 
                            : "bg-amber-50 hover:bg-amber-100 text-amber-800"}`}
                          onClick={() => { navigate("/admin"); setSheetOpen(false); }}
                        >
                          <Crown size={18} className="mr-2" />
                          Admin Dashboard
                        </Button>
                      )}
                      
                      <div className="mt-6 pt-6 border-t border-love-100">
                        <Button 
                          variant="outline" 
                          className="w-full gap-2 border-rose-200 hover:bg-rose-50 text-rose-600"
                          onClick={handleLogout}
                        >
                          <LogOut size={16} />
                          <span>Log out</span>
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            ) : (
              <>
                <nav className="hidden md:flex items-center space-x-1">
                  <Button 
                    variant={isActive("/discover") ? "default" : "ghost"}
                    className={isActive("/discover") ? "bg-love-500 hover:bg-love-600" : ""}
                    onClick={() => navigate("/discover")}
                  >
                    Discover
                  </Button>
                  <Button 
                    variant={isActive("/matches") ? "default" : "ghost"}
                    className={isActive("/matches") ? "bg-love-500 hover:bg-love-600" : ""}
                    onClick={() => navigate("/matches")}
                  >
                    Matches
                  </Button>
                  <Button 
                    variant={isActive("/messages") ? "default" : "ghost"}
                    className={isActive("/messages") ? "bg-love-500 hover:bg-love-600" : ""}
                    onClick={() => navigate("/messages")}
                  >
                    Messages
                  </Button>
                </nav>
                
                <div className="flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className={isActive("/profile") ? "bg-love-100 text-love-700" : ""}
                      >
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 z-50 bg-white">
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">
                          {currentUser.name}
                          {currentUser.role === 'admin' && (
                            <span className="ml-2 text-xs px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                              Admin
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {currentUser.email}
                        </p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/user-profile" className="cursor-pointer">
                          Your Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/user-profile?tab=edit" className="cursor-pointer">
                          Edit Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/user-profile?tab=monetize" className="cursor-pointer">
                          Monetization
                        </Link>
                      </DropdownMenuItem>
                      
                      {currentUser.role === 'admin' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to="/admin" className="cursor-pointer flex items-center text-amber-700">
                              <Crown className="mr-2 h-4 w-4" />
                              <span>Admin Dashboard</span>
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                        onClick={() => logout()}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button 
              className="bg-love-500 hover:bg-love-600"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
