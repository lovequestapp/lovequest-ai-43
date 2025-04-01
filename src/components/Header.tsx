import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { 
  User, 
  Wallet, 
  LogOut, 
  Heart, 
  Menu as MenuIcon,
  X
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const { currentUser, logout } = useUser();
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    setSheetOpen(false);
  };
  
  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Heart size={20} className="text-love-500 fill-love-500" />
          <span className="text-xl font-display text-black">LoveQuest</span>
        </Link>
        
        {isMobile ? (
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-5 w-5" />
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
                {currentUser ? (
                  <>
                    <div className="flex items-center gap-3 mb-6 p-4 bg-love-50 rounded-lg border border-love-100">
                      <Avatar className="h-14 w-14 border-2 border-love-100">
                        <AvatarImage src={currentUser.photos?.[0] || ''} alt={currentUser.name} />
                        <AvatarFallback className="bg-gradient-to-br from-love-200 to-love-400 text-white">
                          {currentUser.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-love-900">{currentUser.name}</p>
                        <p className="text-xs text-gray-500">{currentUser.email}</p>
                        {currentUser.premiumStatus !== 'basic' && (
                          <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            {currentUser.premiumStatus.charAt(0).toUpperCase() + currentUser.premiumStatus.slice(1)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <Link to="/discover" className="flex items-center gap-3 px-2 py-3 rounded-md hover:bg-love-50 text-gray-700 hover:text-love-700 transition-colors">
                      <Heart size={20} className="text-love-500" />
                      <span className="font-medium">Discover</span>
                    </Link>
                    
                    <Link to="/matches" className="flex items-center gap-3 px-2 py-3 rounded-md hover:bg-love-50 text-gray-700 hover:text-love-700 transition-colors">
                      <User size={20} className="text-love-500" />
                      <span className="font-medium">Matches</span>
                    </Link>
                    
                    <Link to="/messages" className="flex items-center gap-3 px-2 py-3 rounded-md hover:bg-love-50 text-gray-700 hover:text-love-700 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-love-500"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                      <span className="font-medium">Messages</span>
                    </Link>
                    
                    <Link to="/user-profile" className="flex items-center gap-3 px-2 py-3 rounded-md hover:bg-love-50 text-gray-700 hover:text-love-700 transition-colors">
                      <User size={20} className="text-love-500" />
                      <span className="font-medium">My Profile</span>
                    </Link>
                    
                    <Link to="/user-profile?tab=monetize" className="flex items-center gap-3 px-2 py-3 rounded-md hover:bg-love-50 text-gray-700 hover:text-love-700 transition-colors">
                      <Wallet size={20} className="text-love-500" />
                      <span className="font-medium">Monetization</span>
                    </Link>
                    
                    {currentUser.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-3 px-2 py-3 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        <span className="font-medium">Admin Dashboard</span>
                      </Link>
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
                  </>
                ) : (
                  <>
                    <Link to="/login" className="flex items-center gap-3 px-2 py-3 rounded-md hover:bg-love-50 text-gray-700 hover:text-love-700 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-love-500"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                      <span className="font-medium">Log in</span>
                    </Link>
                    
                    <div className="mt-2">
                      <Link to="/register">
                        <Button className="w-full bg-gradient-to-r from-love-500 to-love-600 hover:opacity-90">
                          Create an Account
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <nav>
            <ul className="flex items-center space-x-6">
              {currentUser ? (
                <>
                  <li>
                    <Link to="/discover" className="text-gray-700 hover:text-love-600">
                      Discover
                    </Link>
                  </li>
                  <li>
                    <Link to="/matches" className="text-gray-700 hover:text-love-600">
                      Matches
                    </Link>
                  </li>
                  <li>
                    <Link to="/messages" className="text-gray-700 hover:text-love-600">
                      Messages
                    </Link>
                  </li>
                  <li>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={currentUser.photos?.[0] || ''} alt={currentUser.name} />
                            <AvatarFallback className="bg-love-100 text-love-800">
                              {currentUser.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {currentUser.email}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/user-profile" className="cursor-pointer flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            <span>My Profile</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/user-profile?tab=monetize" className="cursor-pointer flex items-center">
                            <Wallet className="mr-2 h-4 w-4" />
                            <span>Monetization</span>
                          </Link>
                        </DropdownMenuItem>
                        {currentUser.role === 'admin' && (
                          <DropdownMenuItem asChild>
                            <Link to="/admin" className="cursor-pointer">
                              Admin Dashboard
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer text-red-600 focus:text-red-600 flex items-center"
                          onClick={logout}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="text-gray-700 hover:text-love-600">
                      Log in
                    </Link>
                  </li>
                  <li>
                    <Link to="/register">
                      <Button className="bg-gradient-love hover:opacity-90">Sign up</Button>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
