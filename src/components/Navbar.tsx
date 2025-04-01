
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useUser } from '@/context/UserContext';
import { Heart, MessageCircle, Search, User, LogOut, Menu, Crown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useUser();
  
  const isActive = (path: string) => {
    return location.pathname === path;
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
              <div className="md:hidden flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate("/matches")}
                  className={isActive("/matches") ? "bg-love-100 text-love-700" : ""}
                >
                  <Search className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate("/messages")}
                  className={isActive("/messages") ? "bg-love-100 text-love-700" : ""}
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
              </div>
              
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
