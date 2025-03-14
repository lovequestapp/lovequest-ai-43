
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';

/**
 * Hook to protect routes that require authentication
 */
export const useProtectedRoute = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      toast.error("Please log in to access this page");
      navigate('/signup');
    }
  }, [currentUser, navigate]);

  return { isAuthenticated: !!currentUser };
};
