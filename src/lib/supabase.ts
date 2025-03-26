
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and key from environment variables or default to placeholders
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if Supabase is properly configured
const isSupabaseConfigured = supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';

// Helper to check if Supabase is configured
export const getSupabaseStatus = () => ({
  isConfigured: isSupabaseConfigured,
  url: isSupabaseConfigured ? 'Connected' : 'Not configured'
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
