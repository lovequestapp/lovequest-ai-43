import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, ShieldCheck, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useUser();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const isPrimaryAdmin = currentUser?.email === 'hunainm.qureshi@gmail.com';
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <header className="py-4 border-b border-border sticky top-0 bg-background z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Heart size={24} className="text-love-500 fill-love-500" />
          <span className="font-display text-xl font-medium">LoveQuest</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-love-500 ${
                isActive('/') ? 'text-love-500' : 'text-foreground'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/discover" 
              className={`text-sm font-medium transition-colors hover:text-love-500 ${
                isActive('/discover') ? 'text-love-500' : 'text-foreground'
              }`}
            >
              Discover
            </Link>
            <Link 
              to="/explore" 
              className={`text-sm font-medium transition-colors hover:text-love-500 ${
                isActive('/explore') ? 'text-love-500' : 'text-foreground'
              }`}
            >
              Explore
            </Link>
            <Link 
              to="/messages" 
              className={`text-sm font-medium transition-colors hover:text-love-500 ${
                isActive('/messages') ? 'text-love-500' : 'text-foreground'
              }`}
            >
              Messages
            </Link>
            {isPrimaryAdmin && (
              <Link 
                to="/admin" 
                className={`text-sm font-medium transition-colors hover:text-love-500 flex items-center gap-1 ${
                  isActive('/admin') ? 'text-love-500' : 'text-foreground'
                }`}
              >
                <ShieldCheck size={16} />
                Admin
              </Link>
            )}
          </nav>
          
          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link to="/profile">
                  <Button variant="outline" className="rounded-full">
                    My Profile
                  </Button>
                </Link>
                <Button 
                  variant="love"
                  rounded="full"
                  className="flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button 
                    variant="glossy" 
                    rounded="full"
                    className="flex items-center gap-2"
                  >
                    <LogIn size={16} />
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button 
                    variant="love" 
                    rounded="full"
                    className="shadow-love"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        
        <div className="md:hidden">
          <Button variant="ghost" onClick={toggleMobileMenu} className="p-2" aria-label="Menu">
            {isMobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col gap-4">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors hover:text-love-500 ${
                  isActive('/') ? 'text-love-500' : 'text-foreground'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/discover" 
                className={`text-sm font-medium transition-colors hover:text-love-500 ${
                  isActive('/discover') ? 'text-love-500' : 'text-foreground'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Discover
              </Link>
              <Link 
                to="/explore" 
                className={`text-sm font-medium transition-colors hover:text-love-500 ${
                  isActive('/explore') ? 'text-love-500' : 'text-foreground'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Explore
              </Link>
              <Link 
                to="/messages" 
                className={`text-sm font-medium transition-colors hover:text-love-500 ${
                  isActive('/messages') ? 'text-love-500' : 'text-foreground'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Messages
              </Link>
              {isPrimaryAdmin && (
                <Link 
                  to="/admin" 
                  className={`text-sm font-medium transition-colors hover:text-love-500 flex items-center gap-1 ${
                    isActive('/admin') ? 'text-love-500' : 'text-foreground'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShieldCheck size={16} />
                  Admin
                </Link>
              )}
              
              <div className="flex flex-col gap-3 mt-2 pt-2 border-t border-border">
                {currentUser ? (
                  <>
                    <Link 
                      to="/profile" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full"
                    >
                      <Button variant="outline" className="w-full justify-center">
                        My Profile
                      </Button>
                    </Link>
                    <Button 
                      variant="love"
                      rounded="full"
                      className="flex items-center justify-center gap-2 w-full"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full"
                    >
                      <Button 
                        variant="glossy" 
                        rounded="full"
                        className="flex items-center justify-center gap-2 w-full"
                      >
                        <LogIn size={16} />
                        Sign In
                      </Button>
                    </Link>
                    <Link 
                      to="/signup" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full"
                    >
                      <Button 
                        variant="love" 
                        rounded="full"
                        className="w-full justify-center"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
