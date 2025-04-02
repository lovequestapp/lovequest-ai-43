
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';

const SESSION_CHECK_INTERVAL = 5 * 60 * 1000; // Check session every 5 minutes
const SESSION_EXPIRY_WARNING = 10 * 60 * 1000; // Warn 10 minutes before expiry

export const useSessionManager = () => {
  const { currentUser, setCurrentUser } = useUser();
  const [isSessionValid, setIsSessionValid] = useState<boolean>(false);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<Date | null>(null);
  
  // Check if the session is valid and not expired
  const checkSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session check error:', error);
        setIsSessionValid(false);
        return false;
      }
      
      if (!data.session) {
        setIsSessionValid(false);
        return false;
      }
      
      // Get expiry time
      const expiresAt = data.session.expires_at;
      if (expiresAt) {
        const expiryDate = new Date(expiresAt * 1000);
        setSessionExpiresAt(expiryDate);
        
        // Check if session will expire soon
        const now = new Date();
        const timeUntilExpiry = expiryDate.getTime() - now.getTime();
        
        if (timeUntilExpiry < 0) {
          // Session has expired
          setIsSessionValid(false);
          return false;
        }
        
        if (timeUntilExpiry < SESSION_EXPIRY_WARNING) {
          // Session will expire soon, try to refresh it
          await refreshSession();
        }
      }
      
      setIsSessionValid(true);
      return true;
    } catch (error) {
      console.error('Error checking session:', error);
      setIsSessionValid(false);
      return false;
    }
  }, []);
  
  // Refresh the session
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh error:', error);
        return false;
      }
      
      if (!data.session) {
        return false;
      }
      
      setIsSessionValid(true);
      setSessionExpiresAt(new Date(data.session.expires_at! * 1000));
      return true;
    } catch (error) {
      console.error('Error refreshing session:', error);
      return false;
    }
  }, []);
  
  // Sign out the user
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        toast.error('Failed to sign out');
        return false;
      }
      
      setCurrentUser(null);
      setIsSessionValid(false);
      setSessionExpiresAt(null);
      toast.success('You have been signed out');
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
      return false;
    }
  }, [setCurrentUser]);
  
  // Auto refresh session when it's about to expire
  useEffect(() => {
    const checkSessionStatus = async () => {
      const valid = await checkSession();
      
      if (!valid && currentUser) {
        // Session is invalid but we have a user in state
        // This happens when the session has expired
        toast.error('Your session has expired', {
          description: 'Please sign in again to continue'
        });
        
        // Clear user from state
        setCurrentUser(null);
      }
    };
    
    // Initial check
    checkSessionStatus();
    
    // Set up interval to check session status
    const interval = setInterval(checkSessionStatus, SESSION_CHECK_INTERVAL);
    
    return () => clearInterval(interval);
  }, [checkSession, currentUser, setCurrentUser]);
  
  // Setup auth state change listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          setCurrentUser(null);
          setIsSessionValid(false);
          setSessionExpiresAt(null);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session) {
            // Session data is updated, check it
            checkSession();
          }
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [checkSession, setCurrentUser]);
  
  return {
    isSessionValid,
    sessionExpiresAt,
    refreshSession,
    signOut,
    checkSession
  };
};

export default useSessionManager;
