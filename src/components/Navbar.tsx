
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useUser } from '@/context/UserContext';
import { Heart, MessageCircle, Search, User, LogOut, Menu } from 'lucide-react';

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
            <span className="font-display text-xl hidden sm:inline font-semibold">LoveQuest</span>
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
                variant={isActive("/explore") ? "default" : "ghost"}
                className={isActive("/explore") ? "bg-love-500 hover:bg-love-600" : ""}
                onClick={() => navigate("/explore")}
              >
                Explore
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
                  onClick={() => navigate("/explore")}
                  className={isActive("/explore") ? "bg-love-100 text-love-700" : ""}
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
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate("/profile")}
                className={isActive("/profile") ? "bg-love-100 text-love-700" : ""}
              >
                <User className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => logout()}
              >
                <LogOut className="h-5 w-5" />
              </Button>
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
