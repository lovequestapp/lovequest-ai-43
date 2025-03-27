
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

/**
 * Hook to protect routes that require authentication
 * @param options - Configuration options
 * @param options.requireAuth - Whether to require authentication (default: true)
 */
export const useProtectedRoute = (options: { requireAuth?: boolean } = {}) => {
  const { requireAuth = true } = options;
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, !!session);
        const isAuthenticated = !!session;
        setIsAuth(isAuthenticated);
        
        if (requireAuth && !isAuthenticated && !isLoading) {
          // Use setTimeout to avoid potential auth deadlocks
          setTimeout(() => {
            toast.error("Please log in to access this page");
            navigate('/login');
          }, 0);
        }
      }
    );

    // THEN check for existing session
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log("Current session:", data.session);
        setIsAuth(!!data.session);
        
        if (requireAuth && !data.session) {
          toast.error("Please log in to access this page");
          navigate('/login');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoading(false);
        
        if (requireAuth) {
          toast.error("Authentication error occurred");
          navigate('/login');
        }
      }
    };

    // Initial auth check
    checkAuth();

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, requireAuth, isLoading]);

  return { isAuthenticated: isAuth, isLoading };
};
