
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { isSessionValid } from '@/lib/supabase';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { currentUser } = useUser();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isSessionActive, setIsSessionActive] = useState(false);
  
  useEffect(() => {
    const checkSession = async () => {
      const sessionValid = await isSessionValid();
      setIsSessionActive(sessionValid);
      setIsChecking(false);
    };
    
    checkSession();
  }, []);
  
  // Show loading state while checking session
  if (isChecking) {
    return <div className="flex justify-center items-center h-screen">
      <p className="text-love-600">Checking your session...</p>
    </div>;
  }
  
  // If there's no user in context but session is active, we might be in a refresh state
  // In this case, we'll allow the App.tsx useEffect to handle loading the user
  if (!currentUser && isSessionActive) {
    return <div className="flex justify-center items-center h-screen">
      <p className="text-love-600">Loading your profile...</p>
    </div>;
  }
  
  // No user and no session, redirect to login
  if (!currentUser) {
    toast.error('Please log in to access this page');
    // Save the current location to redirect back after login
    return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
  }
  
  // Check admin access if required
  if (adminOnly && currentUser.role !== 'admin') {
    toast.error('You need admin privileges to access this page');
    return <Navigate to="/profile" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
