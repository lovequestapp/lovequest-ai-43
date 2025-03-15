
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';

/**
 * Hook to protect routes that require authentication
 * @param options - Configuration options
 * @param options.requireAuth - Whether to require authentication (default: true)
 */
export const useProtectedRoute = (options: { requireAuth?: boolean } = {}) => {
  const { requireAuth = true } = options;
  const { currentUser, isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated, but only redirect if requireAuth is true
    if (requireAuth && !isAuthenticated()) {
      toast.error("Please log in to access this page");
      navigate('/login');
    }
  }, [currentUser, isAuthenticated, navigate, requireAuth]);

  return { isAuthenticated: isAuthenticated() };
};
