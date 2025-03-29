
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
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
  
  if (!currentUser) {
    toast.error('Please log in to access this page');
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && currentUser.role !== 'admin') {
    toast.error('You need admin privileges to access this page');
    return <Navigate to="/profile" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
