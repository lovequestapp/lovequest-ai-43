
import React from 'react';
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
import { User, Wallet, LogOut, Heart } from 'lucide-react';

const Header = () => {
  const { currentUser, logout } = useUser();
  
  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Heart size={20} className="text-love-500 fill-love-500" />
          <span className="text-2xl font-display font-bold text-love-600">LoveQuest</span>
        </Link>
        
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
      </div>
    </header>
  );
};

export default Header;
