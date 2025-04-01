
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
            <SheetContent side="right" className="w-[80%] sm:w-[350px]">
              <SheetHeader className="border-b pb-4">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="py-4 flex flex-col gap-2">
                {currentUser ? (
                  <>
                    <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-md">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={currentUser.photos?.[0] || ''} alt={currentUser.name} />
                        <AvatarFallback className="bg-love-100 text-love-800">
                          {currentUser.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{currentUser.name}</p>
                        <p className="text-xs text-gray-500">{currentUser.email}</p>
                      </div>
                    </div>
                    <Button 
                      asChild 
                      variant="ghost" 
                      className="justify-start" 
                      onClick={() => setSheetOpen(false)}
                    >
                      <Link to="/discover">Discover</Link>
                    </Button>
                    <Button 
                      asChild 
                      variant="ghost" 
                      className="justify-start" 
                      onClick={() => setSheetOpen(false)}
                    >
                      <Link to="/matches">Matches</Link>
                    </Button>
                    <Button 
                      asChild 
                      variant="ghost" 
                      className="justify-start" 
                      onClick={() => setSheetOpen(false)}
                    >
                      <Link to="/messages">Messages</Link>
                    </Button>
                    <Button 
                      asChild 
                      variant="ghost" 
                      className="justify-start" 
                      onClick={() => setSheetOpen(false)}
                    >
                      <Link to="/user-profile">My Profile</Link>
                    </Button>
                    <Button 
                      asChild 
                      variant="ghost" 
                      className="justify-start" 
                      onClick={() => setSheetOpen(false)}
                    >
                      <Link to="/user-profile?tab=monetize">Monetization</Link>
                    </Button>
                    {currentUser.role === 'admin' && (
                      <Button 
                        asChild 
                        variant="ghost" 
                        className="justify-start" 
                        onClick={() => setSheetOpen(false)}
                      >
                        <Link to="/admin">Admin Dashboard</Link>
                      </Button>
                    )}
                    <div className="mt-4 pt-4 border-t">
                      <Button 
                        variant="destructive" 
                        className="w-full gap-2"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                        <span>Log out</span>
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Button 
                      asChild 
                      variant="ghost" 
                      className="justify-start" 
                      onClick={() => setSheetOpen(false)}
                    >
                      <Link to="/login">Log in</Link>
                    </Button>
                    <Button 
                      asChild 
                      className="mt-2 bg-gradient-love hover:opacity-90" 
                      onClick={() => setSheetOpen(false)}
                    >
                      <Link to="/register">Sign up</Link>
                    </Button>
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
