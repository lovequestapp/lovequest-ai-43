
import { createClient } from '@supabase/supabase-js';

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

// Check if Supabase is properly configured
export const getSupabaseStatus = () => ({
  isConfigured: true,
  url: supabaseUrl
});

// Authenticate with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error('Error signing in:', error.message);
    return { success: false, error: error.message };
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error('Error signing up:', error.message);
    return { success: false, error: error.message };
  }
};

// Sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error signing out:', error.message);
    return { success: false, error: error.message };
  }
};

// Get current session
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { success: true, session: data.session };
  } catch (error: any) {
    console.error('Error getting session:', error.message);
    return { success: false, error: error.message };
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('Error getting user:', error.message);
    return { success: false, error: error.message };
  }
};
