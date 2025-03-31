
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSessionValid, refreshSession } from '@/lib/supabase';
import { toast } from 'sonner';

/**
 * Hook to protect routes that require authentication
 * @param options - Configuration options
 * @param options.requireAuth - Whether to require authentication (default: true)
 * @param options.adminOnly - Whether to require admin role (default: false)
 */
export const useProtectedRoute = (options: { requireAuth?: boolean; adminOnly?: boolean } = {}) => {
  const { requireAuth = true, adminOnly = false } = options;
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Helper function to check auth status and redirect if needed
    const checkAuthAndRedirect = async () => {
      const isValid = await isSessionValid();
      
      if (requireAuth && !isValid) {
        toast.error("Please log in to access this page");
        navigate('/login');
        return false;
      }
      
      if (isValid && adminOnly) {
        // Check user role if admin is required
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();
          
          const role = profileData?.role || 'subscriber';
          setUserRole(role);
          
          if (role !== 'admin') {
            toast.error("You need admin privileges to access this page");
            navigate('/profile');
            return false;
          }
        }
      }
      
      return isValid;
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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
        
        // Try to refresh the session if we're signing in
        if (event === 'SIGNED_IN') {
          await refreshSession();
        }
      }
    );

    // Check for existing session and validity
    const initialAuthCheck = async () => {
      try {
        // First check session validity
        const isValid = await checkAuthAndRedirect();
        setIsAuth(isValid);
        
        // Attempt to refresh token if we have a session
        if (isValid) {
          await refreshSession();
        }
        
      } catch (error) {
        console.error('Auth check error:', error);
        if (requireAuth) {
          toast.error("Authentication error occurred");
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Initial auth check
    initialAuthCheck();

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, requireAuth, adminOnly, isLoading]);

  return { isAuthenticated: isAuth, isLoading, userRole };
};
