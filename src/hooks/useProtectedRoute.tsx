
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';

/**
 * Hook to protect routes that require authentication
 */
export const useProtectedRoute = () => {
  const { currentUser, isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      toast.error("Please log in to access this page");
      navigate('/login');
    }
  }, [currentUser, isAuthenticated, navigate]);

  return { isAuthenticated: !!currentUser };
};
