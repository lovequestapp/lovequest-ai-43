
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, isAuthenticated } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      if (!isAuthenticated()) {
        toast.error("Please log in to access this page");
        navigate('/login', { replace: true });
      }
      setIsLoading(false);
    };

    // Add a small delay to ensure UserContext is properly initialized
    const timer = setTimeout(checkAuth, 500);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // Render children if authenticated
  if (currentUser) {
    return <>{children}</>;
  }
  
  // This is a fallback, the navigation should have happened in the useEffect
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
