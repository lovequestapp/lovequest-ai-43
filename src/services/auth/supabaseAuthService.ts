import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@/types/user';
import { AuthResult, AuthService } from './types';
import { mapProfileToUser, checkTrialExpiration, createAdminUser, isAdminCredentials } from './utils';

export class SupabaseAuthService implements AuthService {
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      // Check for admin credentials
      if (isAdminCredentials(email, password)) {
        // Store a marker for admin login
        localStorage.setItem('admin_email', email);
        localStorage.setItem('lovequestLastAuth', new Date().toISOString());
        
        const adminUser = createAdminUser();
        toast.success("Admin login successful!");
        
        return { 
          success: true, 
          user: adminUser,
          isProfileIncomplete: false
        };
      }
      
      // Regular auth flow
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error("Login failed", { description: error.message });
        return { success: false, error: error.message };
      }

      if (!data.session) {
        toast.error("Login failed", { description: "No session created" });
        return { success: false, error: "No session created" };
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (profileError) {
        console.error("Error fetching profile:", profileError);
      }
      
      // We no longer need to check trial expiration, as we've moved to standard/unlimited/vip model
      const userObj = mapProfileToUser(profile, data.user.id, data.user.email || '');
      
      // Check if profile is incomplete - if bio is empty or no photos, redirect to profile setup
      const isProfileIncomplete = !profile?.bio || !profile?.photos || profile?.photos.length === 0;
      
      // Store auth timestamp to help with session management
      localStorage.setItem('lovequestLastAuth', new Date().toISOString());
      toast.success("Login successful!");
      
      return { 
        success: true,
        user: userObj,
        isProfileIncomplete 
      };
    } catch (error: any) {
      toast.error("Login failed", { description: error.message });
      return { success: false, error: error.message };
    }
  }

  async signUp(
    email: string, 
    password: string, 
    name: string, 
    planType: string = 'standard'
  ): Promise<AuthResult> {
    try {
      // First, create the user account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: window.location.origin + '/profile'
        }
      });

      if (error) {
        toast.error("Registration failed", { description: error.message });
        return { success: false, error: error.message };
      }

      if (!data.user) {
        toast.error("Registration failed", { description: "No user account created" });
        return { success: false, error: "No user account created" };
      }
      
      // Set premium status based on plan type
      let premiumStatus = 'standard';
      
      if (planType === 'unlimited' || planType === 'vip' || planType === 'admin') {
        premiumStatus = planType;
      }

      // Create profile record if we have a session
      if (data.session) {
        // Create profile with the authenticated session
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name,
            email,
            premium_status: premiumStatus,
            created_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error("Error creating profile:", profileError);
          toast.error("Failed to create profile", { description: profileError.message });
          return { success: false, error: profileError.message };
        }
        
        const profile = await this.fetchUserProfile(data.user.id);
        const userObj = mapProfileToUser(profile, data.user.id, data.user.email || '');
        
        if (planType === 'standard') {
          toast.success("Your standard account has been created!");
        } else {
          toast.success(`Your ${planType} subscription has been activated!`);
        }
        
        return { 
          success: true,
          user: userObj,
          isProfileIncomplete: true
        };
      }
      
      // No session means email confirmation is required
      toast.success("Registration successful!", {
        description: "Please check your email to confirm your account"
      });
      
      return { 
        success: true, 
        requiresEmailConfirmation: true 
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error("Registration failed", { description: error.message });
      return { success: false, error: error.message };
    }
  }

  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      // Clear admin marker, auth timestamp, and all related session data
      localStorage.removeItem('admin_email');
      localStorage.removeItem('lovequestLastAuth');
      sessionStorage.clear(); // Clear any session storage as well
      
      // Sign out from supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        toast.error("Logout failed", { description: error.message });
        return { success: false, error: error.message };
      }
      
      // Force clear any supabase specific storage items using the fixed project ID
      // instead of projectRef which doesn't exist in the type
      const supabaseProjectId = 'jhfzugtgazuagqfpsuku';
      localStorage.removeItem(`sb-${supabaseProjectId}-auth-token`);
      
      toast.success("Logged out successfully");
      return { success: true };
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error("Logout failed", { description: error.message });
      return { success: false, error: error.message };
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      // Check for admin user
      const adminEmail = localStorage.getItem('admin_email');
      if (adminEmail === 'hunainm.qureshi@gmail.com') {
        // Double check if we want to be using admin or if it's a stale value
        // If the last auth was more than 24 hours ago, clear it
        const lastAuth = localStorage.getItem('lovequestLastAuth');
        if (lastAuth) {
          const lastAuthDate = new Date(lastAuth);
          const now = new Date();
          if (now.getTime() - lastAuthDate.getTime() > 24 * 60 * 60 * 1000) {
            // Clear stale admin session
            localStorage.removeItem('admin_email');
            localStorage.removeItem('lovequestLastAuth');
            return null;
          }
        }
        return createAdminUser();
      }
      
      // Check for session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        return null;
      }
      
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        return null;
      }
      
      // Fetch user profile
      const profile = await this.fetchUserProfile(data.user.id);
      return mapProfileToUser(profile, data.user.id, data.user.email || '');
    } catch (error: any) {
      console.error('Error getting current user:', error.message);
      return null;
    }
  }

  async getSession(): Promise<{ session: any | null; error?: string }> {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { session: data.session };
    } catch (error: any) {
      console.error('Error getting session:', error.message);
      return { session: null, error: error.message };
    }
  }

  async refreshSession(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log("Attempting to refresh session...");
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      if (data.session) {
        console.log("Session refreshed successfully");
        localStorage.setItem('lovequestLastAuth', new Date().toISOString());
        return { success: true };
      }
      
      console.log("No session returned from refresh");
      return { success: false };
    } catch (error: any) {
      console.error('Error refreshing session:', error.message);
      return { success: false, error: error.message };
    }
  }

  async isSessionValid(): Promise<boolean> {
    try {
      // First check for admin user
      const adminEmail = localStorage.getItem('admin_email');
      if (adminEmail === 'hunainm.qureshi@gmail.com') {
        return true;
      }
      
      // Then check regular Supabase session
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
            await this.refreshSession();
          }
        }
      }
      
      return isValid;
    } catch (error) {
      console.error("Error checking session validity:", error);
      return false;
    }
  }

  async checkUserRoleAndSubscription(): Promise<{ 
    isLoggedIn: boolean; 
    role: string | null; 
    subscription: string | null 
  }> {
    try {
      // Check for admin user
      const adminEmail = localStorage.getItem('admin_email');
      if (adminEmail === 'hunainm.qureshi@gmail.com') {
        return { 
          isLoggedIn: true, 
          role: 'admin', 
          subscription: 'admin' 
        };
      }
      
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
        .select('role, premium_status')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        return { 
          isLoggedIn: true, 
          role: 'subscriber', 
          subscription: 'standard' 
        };
      }
      
      return { 
        isLoggedIn: true, 
        role: profileData.role || 'subscriber', 
        subscription: profileData.premium_status || 'standard' 
      };
    } catch (error) {
      console.error("Error checking user role and subscription:", error);
      return { 
        isLoggedIn: false, 
        role: null, 
        subscription: null 
      };
    }
  }

  // Helper methods
  private async fetchUserProfile(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception fetching user profile:', error);
      return null;
    }
  }

  private async updateProfile(userId: string, data: any): Promise<any> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', userId);

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Exception updating profile:', error);
      throw error;
    }
  }
}

// Create a singleton instance of the auth service
const supabaseAuthService = new SupabaseAuthService();

export default supabaseAuthService;
