
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

/**
 * Hook to handle authentication-based redirects
 * @param options Configuration options
 * @param options.redirectIfAuthenticated Redirect if user is authenticated
 * @param options.redirectIfUnauthenticated Redirect if user is not authenticated
 * @param options.authenticatedRedirectPath Path to redirect to if authenticated
 * @param options.unauthenticatedRedirectPath Path to redirect to if unauthenticated
 */
export const useAuthRedirect = ({
  redirectIfAuthenticated = false,
  redirectIfUnauthenticated = false,
  authenticatedRedirectPath = '/profile',
  unauthenticatedRedirectPath = '/login'
}: {
  redirectIfAuthenticated?: boolean;
  redirectIfUnauthenticated?: boolean;
  authenticatedRedirectPath?: string;
  unauthenticatedRedirectPath?: string;
}) => {
  const { loading, authenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    if (authenticated && redirectIfAuthenticated) {
      navigate(authenticatedRedirectPath);
    } else if (!authenticated && redirectIfUnauthenticated) {
      // Preserve the current path for redirection after login
      const currentPath = location.pathname;
      
      // Only append returnTo if we're not already on the login page
      const redirectPath = 
        currentPath !== '/login' 
          ? `${unauthenticatedRedirectPath}?returnTo=${encodeURIComponent(currentPath)}`
          : unauthenticatedRedirectPath;
          
      navigate(redirectPath);
    }
  }, [
    loading, 
    authenticated, 
    redirectIfAuthenticated, 
    redirectIfUnauthenticated,
    authenticatedRedirectPath,
    unauthenticatedRedirectPath,
    navigate,
    location.pathname
  ]);

  return { loading, authenticated };
};
