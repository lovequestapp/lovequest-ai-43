
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

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

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // User is not authenticated
  if (!authenticated) {
    return (
      <Navigate 
        to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} 
        replace 
      />
    );
  }

  // Check for admin-only routes
  if (adminOnly && user?.role !== 'admin') {
    return (
      <Navigate 
        to="/discover" 
        replace 
      />
    );
  }

  // Check for moderator-only routes
  if (moderatorOnly && user?.role !== 'admin' && user?.role !== 'moderator') {
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
