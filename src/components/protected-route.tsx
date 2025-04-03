
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  moderatorOnly?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  adminOnly = false,
  moderatorOnly = false 
}: ProtectedRouteProps) => {
  const { loading, authenticated, user } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Short timeout to ensure auth state is fully initialized
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [loading]);

  // Show loading state
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verifying your login...</p>
        </div>
      </div>
    );
  }

  // User is not authenticated
  if (!authenticated) {
    // Only show toast on initial page load, not on redirects
    if (!location.pathname.includes('login')) {
      toast.error('Please login to continue', {
        description: 'You need to be logged in to access this page'
      });
    }
    
    return (
      <Navigate 
        to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} 
        replace 
      />
    );
  }

  // Check for admin-only routes
  if (adminOnly && user?.role !== 'admin') {
    toast.error('Access denied', {
      description: 'You need administrator privileges to access this page'
    });
    
    return (
      <Navigate 
        to="/discover" 
        replace 
      />
    );
  }

  // Check for moderator-only routes
  if (moderatorOnly && user?.role !== 'admin' && user?.role !== 'moderator') {
    toast.error('Access denied', {
      description: 'You need moderator privileges to access this page'
    });
    
    return (
      <Navigate 
        to="/discover" 
        replace 
      />
    );
  }

  // User is authenticated and has the right permissions
  return <>{children}</>;
};

export default ProtectedRoute;
