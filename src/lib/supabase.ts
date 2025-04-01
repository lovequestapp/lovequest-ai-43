
import { createClient } from '@supabase/supabase-js';
import authService from '@/services/auth';

// Use the values from the Supabase integration
const supabaseUrl = 'https://lcacrngizbvjhabkhrkf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjYWNybmdpemJ2amhhYmtocmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MTk0MTAsImV4cCI6MjA1Nzk5NTQxMH0.IBMQTbAfF4ECtmoGWG6awNK-sQArtTdDTEdZlK-rSsE';

// Initialize the Supabase client with explicit auth options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: typeof window !== 'undefined' ? localStorage : undefined
  }
});

// Log any storage initialization errors
if (typeof window !== 'undefined') {
  console.log('Supabase client initialized with localStorage');
} else {
  console.log('Supabase client initialized without localStorage (server-side)');
}

// Check if Supabase is properly configured
export const getSupabaseStatus = () => ({
  isConfigured: true,
  url: supabaseUrl
});

// Helper function to check if a session is valid
export const isSessionValid = async () => {
  return authService.isSessionValid();
};

// Check user role and subscription level
export const checkUserRoleAndSubscription = async () => {
  return authService.checkUserRoleAndSubscription();
};

// Authenticate with email and password
export const signInWithEmail = async (email: string, password: string) => {
  const result = await authService.signIn(email, password);
  return {
    success: result.success,
    isProfileIncomplete: result.isProfileIncomplete,
    data: result.user ? { user: result.user, session: { user: result.user } } : undefined,
    error: result.error
  };
};

// Sign up with email and password
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

// Sign out
export const signOut = async () => {
  return authService.signOut();
};

// Get current session
export const getCurrentSession = async () => {
  return authService.getSession();
};

// Get current user
export const getCurrentUser = async () => {
  return authService.getCurrentUser();
};

// Refresh user session
export const refreshSession = async () => {
  return authService.refreshSession();
};
