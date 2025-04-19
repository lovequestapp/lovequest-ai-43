
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';

interface UseProtectedRouteProps {
  requireAuth?: boolean;
  requiredRole?: 'admin' | 'moderator' | 'subscriber' | 'vip' | 'trial';
  requiredSubscription?: 'standard' | 'unlimited' | 'vip' | 'admin';
  redirectPath?: string;
}

export const useProtectedRoute = ({
  requireAuth = true,
  requiredRole,
  requiredSubscription,
  redirectPath = '/login'
}: UseProtectedRouteProps = {}) => {
  const { currentUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userSubscription, setUserSubscription] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check if we have a session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          if (requireAuth) {
            navigate(redirectPath);
          }
          return;
        }
        
        const isAuthenticated = !!data.session;
        
        if (requireAuth && !isAuthenticated) {
          // User is not authenticated but needs to be
          navigate(redirectPath);
          return;
        }
        
        // If authentication check passes but we need to verify role or subscription
        if (isAuthenticated && (requiredRole || requiredSubscription)) {
          // Use currentUser if it's already loaded
          if (currentUser) {
            setUserRole(currentUser.role);
            setUserSubscription(currentUser.premiumStatus);
            
            // Check role requirements
            if (requiredRole && currentUser.role !== requiredRole) {
              navigate('/');
              return;
            }
            
            // Check subscription requirements
            if (requiredSubscription && currentUser.premiumStatus !== requiredSubscription) {
              navigate('/pricing');
              return;
            }
          } else {
            // Fetch user profile if currentUser is not available
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('role, premium_status')
              .eq('id', data.session?.user.id)
              .single();
              
            if (profileError) {
              console.error("Profile fetch error:", profileError);
              return;
            }
              
            if (profileData) {
              setUserRole(profileData.role);
              
              // Convert old premium status to new format if needed
              let premiumStatus = profileData.premium_status;
              if (premiumStatus === 'basic') premiumStatus = 'standard';
              if (premiumStatus === 'premium') premiumStatus = 'unlimited';
              if (premiumStatus === 'trial') premiumStatus = 'standard';
              
              setUserSubscription(premiumStatus);
              
              // Check role requirements
              if (requiredRole && profileData.role !== requiredRole) {
                navigate('/');
                return;
              }
              
              // Check subscription requirements
              if (requiredSubscription && premiumStatus !== requiredSubscription) {
                navigate('/pricing');
                return;
              }
            }
          }
        }
      } catch (error) {
        console.error('Protected route check error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [currentUser, navigate, redirectPath, requireAuth, requiredRole, requiredSubscription]);
  
  return {
    isAuthenticated: !!currentUser,
    isLoading,
    userRole,
    userSubscription
  };
};
