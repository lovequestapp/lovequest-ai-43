
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { User } from '@/types/user';
import authService, { AuthResult } from '@/services/auth';
import { toast } from 'sonner';

interface AuthState {
  loading: boolean;
  authenticated: boolean;
  user: User | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    loading: true,
    authenticated: false,
    user: null
  });
  const { setCurrentUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Initializing auth state');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_OUT') {
          setAuthState({
            loading: false,
            authenticated: false,
            user: null
          });
          setCurrentUser(null);
          return;
        }

        if (session && session.user) {
          // Use setTimeout to avoid calling Supabase inside the callback
          setTimeout(async () => {
            const user = await authService.getCurrentUser();
            
            if (user) {
              console.log('User authenticated:', user.email);
              setAuthState({
                loading: false,
                authenticated: true,
                user
              });
              
              setCurrentUser(user);
            }
          }, 0);
        }
      }
    );

    // THEN check for existing session
    const checkInitialSession = async () => {
      const isValid = await authService.isSessionValid();
      
      if (isValid) {
        const user = await authService.getCurrentUser();
        
        if (user) {
          console.log('Initial session valid, user:', user.email);
          setAuthState({
            loading: false,
            authenticated: true,
            user
          });
          
          setCurrentUser(user);
        } else {
          setAuthState({
            loading: false,
            authenticated: false,
            user: null
          });
        }
      } else {
        console.log('No valid initial session');
        setAuthState({
          loading: false,
          authenticated: false,
          user: null
        });
      }
    };
    
    checkInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [setCurrentUser]);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      console.log('Attempting sign in for:', email);
      const result = await authService.signIn(email, password);
      
      if (result.success && result.user) {
        console.log('Sign in successful');
        setAuthState({
          loading: false,
          authenticated: true,
          user: result.user
        });
        
        setCurrentUser(result.user);
        
        // Store auth timestamp to help with session management
        localStorage.setItem('lovequestLastAuth', new Date().toISOString());
      } else {
        console.log('Sign in failed:', result.error);
        toast.error("Login failed", { description: result.error });
      }
      
      return result;
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error("Login failed", { description: error.message });
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email: string, password: string, name: string, planType: string = 'free'): Promise<AuthResult> => {
    try {
      console.log('Attempting sign up for:', email);
      const result = await authService.signUp(email, password, name, planType);
      
      if (result.success && result.user) {
        console.log('Sign up successful');
        setAuthState({
          loading: false,
          authenticated: true,
          user: result.user
        });
        
        setCurrentUser(result.user);
        
        // Store auth timestamp to help with session management
        localStorage.setItem('lovequestLastAuth', new Date().toISOString());
      } else if (result.requiresEmailConfirmation) {
        console.log('Sign up successful, email confirmation required');
        toast.success("Please check your email to confirm your account");
      } else {
        console.log('Sign up failed:', result.error);
        toast.error("Registration failed", { description: result.error });
      }
      
      return result;
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error("Registration failed", { description: error.message });
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting sign out');
      const result = await authService.signOut();
      
      if (result.success) {
        console.log('Sign out successful');
        setAuthState({
          loading: false,
          authenticated: false,
          user: null
        });
        
        setCurrentUser(null);
        
        // Clear auth timestamp
        localStorage.removeItem('lovequestLastAuth');
        localStorage.removeItem('admin_email');
        
        // Clear any Supabase auth tokens using a fixed key prefix
        // We use a fixed string instead of projectRef which doesn't exist in type
        const supabaseKeyPrefix = 'sb-jhfzugtgazuagqfpsuku';
        localStorage.removeItem(`${supabaseKeyPrefix}-auth-token`);
        
        // Navigate to login page
        navigate('/login');
      } else {
        console.log('Sign out failed:', result.error);
        toast.error("Logout failed", { description: result.error });
      }
      
      return result;
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error("Logout failed", { description: error.message });
      return { success: false, error: error.message };
    }
  };

  return {
    loading: authState.loading,
    authenticated: authState.authenticated,
    user: authState.user,
    signIn,
    signUp,
    signOut
  };
};
