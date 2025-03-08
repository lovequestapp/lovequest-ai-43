
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUser } from '@/context/UserContext';
import { Heart, Search, MessagesSquare, User, FileText, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const { currentUser } = useUser();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const isActive = (path: string) => location.pathname === path;
  
  const showHeader = currentUser !== null;
  
  if (!showHeader) return null;
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center font-display font-bold text-2xl text-rose-600"
        >
          <Heart className="h-6 w-6 text-rose-500 mr-2 fill-rose-500" />
          <span>LoveQuest</span>
        </Link>
        
        {isMobile ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
            
            {mobileMenuOpen && (
              <div className="fixed inset-0 top-14 z-50 bg-white shadow-lg p-4">
                <nav className="flex flex-col gap-2">
                  <Link 
                    to="/discover"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                      isActive('/discover') 
                        ? "bg-love-100 text-love-600" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Search className="h-4 w-4" />
                    <span>Discover</span>
                  </Link>
                  
                  <Link 
                    to="/explore"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                      isActive('/explore') 
                        ? "bg-love-100 text-love-600" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Explore</span>
                  </Link>
                  
                  <Link 
                    to="/messages"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                      isActive('/messages') 
                        ? "bg-love-100 text-love-600" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <MessagesSquare className="h-4 w-4" />
                    <span>Messages</span>
                  </Link>
                  
                  <Link 
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                      isActive('/profile') 
                        ? "bg-love-100 text-love-600" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </nav>
              </div>
            )}
          </>
        ) : (
          <nav className="flex items-center gap-6">
            <Link
              to="/discover"
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                isActive('/discover') 
                  ? "bg-love-100 text-love-600" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Search className="h-4 w-4" />
              <span>Discover</span>
            </Link>
            
            <Link
              to="/explore"
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                isActive('/explore') 
                  ? "bg-love-100 text-love-600" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <FileText className="h-4 w-4" />
              <span>Explore</span>
            </Link>
            
            <Link
              to="/messages"
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                isActive('/messages') 
                  ? "bg-love-100 text-love-600" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <MessagesSquare className="h-4 w-4" />
              <span>Messages</span>
            </Link>
            
            <Link
              to="/profile"
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                isActive('/profile') 
                  ? "bg-love-100 text-love-600" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
