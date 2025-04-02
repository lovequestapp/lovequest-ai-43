
import { supabase } from '@/integrations/supabase/client';
import authService from '@/services/auth';

// Re-export the supabase client from the integrations directory
export { supabase };

// Helper function to check if a session is valid
export const isSessionValid = async () => {
  return authService.isSessionValid();
};

// Check user role and subscription level
export const checkUserRoleAndSubscription = async () => {
  return authService.checkUserRoleAndSubscription();
};

// Re-export authentication methods for backward compatibility
export const signInWithEmail = async (email: string, password: string) => {
  const result = await authService.signIn(email, password);
  return {
    success: result.success,
    isProfileIncomplete: result.isProfileIncomplete,
    data: result.user ? { user: result.user, session: { user: result.user } } : undefined,
    error: result.error
  };
};

export const signUpWithEmail = async (email: string, password: string) => {
  const result = await authService.signUp(email, password, email.split('@')[0] || 'User');
  return {
    success: result.success,
    requiresEmailConfirmation: result.requiresEmailConfirmation,
    data: result.user ? { user: result.user, session: { user: result.user } } : undefined,
    error: result.error,
    message: result.requiresEmailConfirmation ? "Check your email for confirmation link" : undefined
  };
};

export const signOut = async () => {
  return authService.signOut();
};

export const getCurrentSession = async () => {
  return authService.getSession();
};

export const getCurrentUser = async () => {
  return authService.getCurrentUser();
};

export const refreshSession = async () => {
  return authService.refreshSession();
};

// Get supabase status (for backward compatibility)
export const getSupabaseStatus = () => ({
  isConfigured: true,
  url: supabase.getUrl()
});
