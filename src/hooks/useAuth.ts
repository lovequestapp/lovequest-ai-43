import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { User } from '@/types/user';
import authService, { AuthResult } from '@/services/auth';

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
    const initialize = async () => {
      try {
        console.log('Initializing auth state');
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
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
              setTimeout(async () => {
                const user = await authService.getCurrentUser();
                
                if (user) {
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

        // Get initial session
        const isValid = await authService.isSessionValid();
        
        if (isValid) {
          const user = await authService.getCurrentUser();
          
          if (user) {
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
          setAuthState({
            loading: false,
            authenticated: false,
            user: null
          });
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState({
          loading: false,
          authenticated: false,
          user: null
        });
      }
    };

    initialize();
  }, [setCurrentUser]);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const result = await authService.signIn(email, password);
      
      if (result.success && result.user) {
        setAuthState({
          loading: false,
          authenticated: true,
          user: result.user
        });
        
        setCurrentUser(result.user);
      }
      
      return result;
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email: string, password: string, name: string, planType: string = 'free'): Promise<AuthResult> => {
    try {
      const result = await authService.signUp(email, password, name, planType);
      
      if (result.success && result.user) {
        setAuthState({
          loading: false,
          authenticated: true,
          user: result.user
        });
        
        setCurrentUser(result.user);
      }
      
      return result;
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      const result = await authService.signOut();
      
      if (result.success) {
        setAuthState({
          loading: false,
          authenticated: false,
          user: null
        });
        
        setCurrentUser(null);
        navigate('/login');
      }
      
      return result;
    } catch (error: any) {
      console.error('Sign out error:', error);
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
