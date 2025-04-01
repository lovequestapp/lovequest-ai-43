
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

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

// Helper function to check if a session is valid
export const isSessionValid = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Session check error:", error);
      return false;
    }
    
    const isValid = !!data.session;
    
    // If session will expire soon (within 1 hour), try to refresh it
    if (isValid && data.session) {
      const expiresAt = data.session.expires_at;
      if (expiresAt) {
        const expiresAtDate = new Date(expiresAt * 1000);
        const now = new Date();
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
        
        if (expiresAtDate < oneHourFromNow) {
          // Session expires within the next hour, attempt to refresh
          console.log("Session expiring soon, refreshing...");
          await refreshSession();
        }
      }
    }
    
    return isValid;
  } catch (error) {
    console.error("Error checking session validity:", error);
    return false;
  }
};

// Check user role and subscription level
export const checkUserRoleAndSubscription = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      return { 
        isLoggedIn: false, 
        role: null, 
        subscription: null 
      };
    }
    
    const userId = data.session.user.id;
    
    // Get user profile from the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role, premium_status, trial_end_date')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      return { 
        isLoggedIn: true, 
        role: 'subscriber', 
        subscription: 'basic' 
      };
    }
    
    // Check if trial has expired
    if (profileData.premium_status === 'trial' && profileData.trial_end_date) {
      const trialEndDate = new Date(profileData.trial_end_date);
      const now = new Date();
      
      if (now > trialEndDate) {
        // Trial has expired, update to basic
        await supabase
          .from('profiles')
          .update({ premium_status: 'basic' })
          .eq('id', userId);
          
        return { 
          isLoggedIn: true, 
          role: profileData.role || 'subscriber', 
          subscription: 'basic' 
        };
      }
    }
    
    return { 
      isLoggedIn: true, 
      role: profileData.role || 'subscriber', 
      subscription: profileData.premium_status || 'basic' 
    };
  } catch (error) {
    console.error("Error checking user role and subscription:", error);
    return { 
      isLoggedIn: false, 
      role: null, 
      subscription: null 
    };
  }
};

// Authenticate with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    // Store auth timestamp to help with session management
    if (data.session) {
      localStorage.setItem('lovequestLastAuth', new Date().toISOString());
    }
    
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
      password,
      options: {
        emailRedirectTo: window.location.origin + '/profile',
        data: {
          email: email,
          name: email.split('@')[0] // Default name from email
        }
      }
    });
    
    if (error) throw error;
    
    // Check if user needs to confirm email
    if (!data.session) {
      toast("Please check your email to confirm your registration.");
      return { 
        success: true, 
        data, 
        message: "Check your email for confirmation link" 
      };
    }
    
    // Store auth timestamp
    localStorage.setItem('lovequestLastAuth', new Date().toISOString());
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Error signing up:', error.message);
    const errorMessage = error.message === "User already registered" 
      ? "This email is already registered. Please log in instead."
      : error.message;
    return { success: false, error: errorMessage };
  }
};

// Sign out
export const signOut = async () => {
  try {
    // Clear auth timestamp
    localStorage.removeItem('lovequestLastAuth');
    
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
    // Check for session first
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      console.log('No active session found');
      return { success: false, user: null };
    }
    
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    
    // If we have a user, fetch their profile from the profiles table
    if (data.user) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (!profileError && profileData) {
        // Check if trial has expired
        if (profileData.premium_status === 'trial' && profileData.trial_end_date) {
          const trialEndDate = new Date(profileData.trial_end_date);
          const now = new Date();
          
          if (now > trialEndDate) {
            // Trial has expired, update to basic
            await supabase
              .from('profiles')
              .update({ premium_status: 'basic' })
              .eq('id', data.user.id);
              
            profileData.premium_status = 'basic';
            toast.info("Your free trial has expired. You have been moved to our Basic plan.");
          }
        }
        
        // Return user with profile data
        return { 
          success: true, 
          user: {
            id: data.user.id,
            email: data.user.email,
            name: profileData.name || data.user.email?.split('@')[0] || 'User',
            age: profileData.age || 25,
            bio: profileData.bio || '',
            location: profileData.location || '',
            interests: profileData.interests || [],
            photos: profileData.photos || [],
            gender: profileData.gender || 'non-binary',
            interestedIn: profileData.interested_in || [],
            popularityPoints: profileData.popularity_points || 0,
            premiumStatus: profileData.premium_status || 'basic',
            role: profileData.role || 'subscriber',
            isBanned: profileData.is_banned || false,
            verificationStatus: profileData.is_verified ? 'verified' : 'unverified',
            personalityTraits: profileData.personality_traits || [],
            giftInventory: profileData.gift_inventory || { rose: 0, heart: 0, teddy: 0 },
            receivedGifts: profileData.received_gifts || { rose: 0, heart: 0, teddy: 0 },
            compatibilityScore: 0,
          }
        };
      }
      
      // If no profile or error, return basic user
      return { 
        success: true, 
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.email?.split('@')[0] || 'User',
          age: 25,
          bio: '',
          location: '',
          interests: [],
          photos: [],
          gender: 'non-binary' as const,
          interestedIn: [],
          popularityPoints: 0,
          premiumStatus: 'basic' as const,
          role: 'subscriber' as const,
          isBanned: false,
          verificationStatus: 'unverified' as const,
          personalityTraits: [],
          giftInventory: { rose: 0, heart: 0, teddy: 0 },
          receivedGifts: { rose: 0, heart: 0, teddy: 0 },
          compatibilityScore: 0,
        }
      };
    }
    
    return { success: false, user: null };
  } catch (error: any) {
    console.error('Error getting user:', error.message);
    return { success: false, error: error.message };
  }
};

// Refresh user session
export const refreshSession = async () => {
  try {
    console.log("Attempting to refresh session...");
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    
    if (data.session) {
      console.log("Session refreshed successfully");
      localStorage.setItem('lovequestLastAuth', new Date().toISOString());
      return { success: true, session: data.session };
    }
    
    console.log("No session returned from refresh");
    return { success: false };
  } catch (error: any) {
    console.error('Error refreshing session:', error.message);
    return { success: false, error: error.message };
  }
};
