
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';
import authService from '@/services/auth';

/**
 * Hook to protect routes that require authentication
 * @param options - Configuration options
 * @param options.requireAuth - Whether to require authentication (default: true)
 * @param options.adminOnly - Whether to require admin role (default: false)
 * @param options.requiredSubscription - Required subscription level (default: undefined)
 */
export const useProtectedRoute = (options: { 
  requireAuth?: boolean; 
  adminOnly?: boolean;
  moderatorOnly?: boolean;
  requiredSubscription?: 'standard' | 'unlimited' | 'vip' | 'admin';
} = {}) => {
  const { 
    requireAuth = true, 
    adminOnly = false,
    moderatorOnly = false,
    requiredSubscription = undefined 
  } = options;
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userSubscription, setUserSubscription] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useUser();

  useEffect(() => {
    // Helper function to check auth status and redirect if needed
    const checkAuthAndRedirect = async () => {
      try {
        // First check if there's a valid session
        const isValid = await authService.isSessionValid();
        
        if (requireAuth && !isValid) {
          // No valid session, redirect to login
          toast.error("Please log in to access this page");
          navigate(`/login?returnTo=${encodeURIComponent(location.pathname)}`);
          return false;
        }
        
        if (isValid) {
          // Session is valid, try to refresh if needed
          await authService.refreshSession();
          
          // Check user role and subscription if needed
          if (adminOnly || moderatorOnly || requiredSubscription) {
            const { role, subscription } = await authService.checkUserRoleAndSubscription();
            setUserRole(role);
            setUserSubscription(subscription);
            
            if (adminOnly && role !== 'admin') {
              toast.error("You need admin privileges to access this page");
              navigate('/discover');
              return false;
            }
            
            if (moderatorOnly && role !== 'admin' && role !== 'moderator') {
              toast.error("You need moderator privileges to access this page");
              navigate('/discover');
              return false;
            }
            
            if (requiredSubscription) {
              const subscriptionLevels = {
                'standard': 0,
                'unlimited': 1,
                'vip': 2,
                'admin': 3
              };
              
              const userLevel = subscriptionLevels[subscription as keyof typeof subscriptionLevels] || 0;
              const requiredLevel = subscriptionLevels[requiredSubscription] || 0;
              
              if (userLevel < requiredLevel) {
                toast.error(`You need a ${requiredSubscription} subscription to access this page`);
                navigate('/user-profile?tab=monetize');
                return false;
              }
            }
          } else if (currentUser) {
            // Use currentUser data if available
            setUserRole(currentUser.role);
            setUserSubscription(currentUser.premiumStatus);
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
  }, [navigate, requireAuth, adminOnly, moderatorOnly, requiredSubscription, isLoading, location.pathname, currentUser]);

  return { 
    isAuthenticated: isAuth, 
    isLoading, 
    userRole,
    userSubscription
  };
};
