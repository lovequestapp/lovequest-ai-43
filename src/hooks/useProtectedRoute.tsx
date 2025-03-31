
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase, isSessionValid, refreshSession } from '@/lib/supabase';
import { useUser } from '@/context/UserContext';
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
  const location = useLocation();
  const { currentUser } = useUser();

  useEffect(() => {
    // Helper function to check auth status and redirect if needed
    const checkAuthAndRedirect = async () => {
      try {
        // First check if there's a valid session
        const isValid = await isSessionValid();
        
        if (requireAuth && !isValid) {
          // No valid session, redirect to login
          toast.error("Please log in to access this page");
          navigate(`/login?returnTo=${encodeURIComponent(location.pathname)}`);
          return false;
        }
        
        if (isValid) {
          // Session is valid, try to refresh if needed
          await refreshSession();
          
          if (adminOnly) {
            // Check user role if admin is required
            if (currentUser) {
              const role = currentUser.role || 'subscriber';
              setUserRole(role);
              
              if (role !== 'admin') {
                toast.error("You need admin privileges to access this page");
                navigate('/profile');
                return false;
              }
            } else {
              // We have a valid session but no user yet, we should wait for the user to load
              return true;
            }
          }
        }
        
        return isValid;
      } catch (error) {
        console.error("Auth check error:", error);
        return false;
      }
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
            toast.error("Your session has ended, please log in again");
            navigate(`/login?returnTo=${encodeURIComponent(location.pathname)}`);
          }, 0);
        }
      }
    );

    // Check for existing session and validity
    const initialAuthCheck = async () => {
      try {
        // First check session validity
        const isValid = await checkAuthAndRedirect();
        setIsAuth(isValid);
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
  }, [navigate, requireAuth, adminOnly, isLoading, location.pathname, currentUser]);

  return { isAuthenticated: isAuth, isLoading, userRole };
};
