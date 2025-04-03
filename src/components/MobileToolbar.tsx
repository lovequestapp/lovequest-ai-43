
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Calendar, LayoutDashboard, LogOut, LogIn, User, Home, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/context/UserContext';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

const MobileToolbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { currentUser, logout, isAuthenticated } = useUser();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate('/login');
  };
  
  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') {
      return true;
    }
    if (path === '/discover' && (currentPath === '/discover' || currentPath.startsWith('/discover'))) {
      return true;
    }
    if (path === '/matches' && (currentPath === '/matches' || currentPath.startsWith('/profile'))) {
      return true;
    }
    if (path === '/messages' && (currentPath === '/messages' || currentPath.startsWith('/messages/'))) {
      return true;
    }
    if (path === '/dates' && currentPath === '/dates') {
      return true;
    }
    if (path === '/admin' && currentPath === '/admin') {
      return true;
    }
    if (path === '/user-profile' && currentPath === '/user-profile') {
      return true;
    }
    if (path === '/login' && currentPath === '/login') {
      return true;
    }
    return currentPath === path;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:hidden">
      <div className="flex justify-around items-center h-16 px-2 pb-safe-bottom">
        {isAuthenticated ? (
          // Authenticated user navigation
          <>
            <Link 
              to="/" 
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2 transition-colors",
                isActive('/') 
                  ? "text-love-500" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Home size={22} className={cn(isActive('/') ? "fill-love-500" : "")} />
              <span className="text-xs mt-1 font-medium">Home</span>
            </Link>
            
            <Link 
              to="/discover" 
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2 transition-colors",
                isActive('/discover') 
                  ? "text-love-500" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Compass size={22} className={cn(isActive('/discover') ? "fill-love-500" : "")} />
              <span className="text-xs mt-1 font-medium">Discover</span>
            </Link>
            
            <Link 
              to="/matches" 
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2 transition-colors",
                isActive('/matches') 
                  ? "text-love-500" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Heart size={22} className={cn(isActive('/matches') ? "fill-love-500" : "")} />
              <span className="text-xs mt-1 font-medium">Matches</span>
            </Link>
            
            <Link 
              to="/messages" 
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2 transition-colors",
                isActive('/messages') 
                  ? "text-love-500" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <MessageCircle size={22} className={cn(isActive('/messages') ? "fill-love-500" : "")} />
              <span className="text-xs mt-1 font-medium">Messages</span>
            </Link>
            
            <Link 
              to="/user-profile" 
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2 transition-colors",
                isActive('/user-profile') 
                  ? "text-love-500" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <User size={22} className={cn(isActive('/user-profile') ? "fill-love-500" : "")} />
              <span className="text-xs mt-1 font-medium">Profile</span>
            </Link>
            
            {currentUser?.role === 'admin' && (
              <Link 
                to="/admin" 
                className={cn(
                  "flex flex-col items-center justify-center flex-1 py-2 transition-colors",
                  isActive('/admin') 
                    ? "text-love-500" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutDashboard size={22} className={cn(isActive('/admin') ? "fill-love-500" : "")} />
                <span className="text-xs mt-1 font-medium">Admin</span>
              </Link>
            )}
          </>
        ) : (
          // Non-authenticated user navigation
          <>
            <Link 
              to="/" 
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2 transition-colors",
                isActive('/') 
                  ? "text-love-500" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Home size={22} className={cn(isActive('/') ? "fill-love-500" : "")} />
              <span className="text-xs mt-1 font-medium">Home</span>
            </Link>
            
            <Link 
              to="/discover" 
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2 transition-colors",
                isActive('/discover') 
                  ? "text-love-500" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Compass size={22} className={cn(isActive('/discover') ? "fill-love-500" : "")} />
              <span className="text-xs mt-1 font-medium">Discover</span>
            </Link>
            
            <Link 
              to="/login" 
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2 transition-colors",
                isActive('/login') 
                  ? "text-love-500" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LogIn size={22} className={cn(isActive('/login') ? "fill-love-500" : "")} />
              <span className="text-xs mt-1 font-medium">Login</span>
            </Link>
            
            <Link 
              to="/register" 
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2 transition-colors",
                isActive('/register') 
                  ? "text-love-500" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <User size={22} className={cn(isActive('/register') ? "fill-love-500" : "")} />
              <span className="text-xs mt-1 font-medium">Register</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileToolbar;
