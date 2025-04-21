import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@/types/user';
import { AuthResult, AuthService } from './types';
import { mapProfileToUser, createAdminUser, isAdminCredentials } from './utils';

export class SupabaseAuthService implements AuthService {
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      if (isAdminCredentials(email, password)) {
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

      const userId = data.user.id;

      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        const defaultProfile = {
          id: userId,
          name: data.user.user_metadata?.name || '',
          email: email,
          age: 18,
          bio: '',
          location: '',
          premium_status: 'standard',
          role: 'subscriber',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          photos: [],
          interests: [],
          personality_traits: [],
          favorite_music: [],
          interested_in: [],
          voice_intro: null,
          popularity_points: 0,
          is_banned: false,
          is_verified: false,
          verification_status: 'unverified',
          gift_inventory: {
            rose: { count: 0, value: 1 },
            heart: { count: 0, value: 3 },
            teddy: { count: 0, value: 5 }
          },
          received_gifts: {
            rose: { count: 0, value: 1 },
            heart: { count: 0, value: 3 },
            teddy: { count: 0, value: 5 }
          },
          trial_end_date: null
        };

        const { error: insertError } = await supabase
          .from('profiles')
          .insert(defaultProfile);

        if (insertError) {
          console.error("Error creating default profile on login:", insertError);
          toast.error("Failed to create user profile");
          return { success: false, error: insertError.message };
        }
        profile = defaultProfile;
      } else if (profileError) {
        console.error("Error fetching profile on login:", profileError);
        toast.error("Failed to fetch user profile");
        return { success: false, error: profileError.message };
      }

      const isProfileIncomplete = !profile?.bio || !profile?.photos || profile?.photos.length === 0;

      const userObj = mapProfileToUser(profile, userId, email);

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

      toast.success("Registration successful!", {
        description: "Please check your email to confirm your account"
      });

      return { 
        success: true, 
        requiresEmailConfirmation: true 
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error("Registration failed", { description: error.message || "Unknown error" });
      return { success: false, error: error.message || "Unknown error" };
    }
  }

  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      localStorage.removeItem('admin_email');
      localStorage.removeItem('lovequestLastAuth');
      sessionStorage.clear();
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        toast.error("Logout failed", { description: error.message });
        return { success: false, error: error.message };
      }
      
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
      const adminEmail = localStorage.getItem('admin_email');
      if (adminEmail === 'hunainm.qureshi@gmail.com') {
        const lastAuth = localStorage.getItem('lovequestLastAuth');
        if (lastAuth) {
          const lastAuthDate = new Date(lastAuth);
          const now = new Date();
          if (now.getTime() - lastAuthDate.getTime() > 24 * 60 * 60 * 1000) {
            localStorage.removeItem('admin_email');
            localStorage.removeItem('lovequestLastAuth');
            return null;
          }
        }
        return createAdminUser();
      }
      
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        return null;
      }
      
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        return null;
      }

      const userId = data.user.id;

      let profile = await this.fetchUserProfile(userId);

      if (!profile) {
        const defaultProfile = {
          id: userId,
          name: data.user.user_metadata?.name || '',
          email: data.user.email || '',
          age: 18,
          bio: '',
          location: '',
          premium_status: 'standard',
          role: 'subscriber',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          photos: [],
          interests: [],
          personality_traits: [],
          favorite_music: [],
          interested_in: [],
          voice_intro: null,
          popularity_points: 0,
          is_banned: false,
          is_verified: false,
          verification_status: 'unverified',
          gift_inventory: {
            rose: { count: 0, value: 1 },
            heart: { count: 0, value: 3 },
            teddy: { count: 0, value: 5 }
          },
          received_gifts: {
            rose: { count: 0, value: 1 },
            heart: { count: 0, value: 3 },
            teddy: { count: 0, value: 5 }
          },
          trial_end_date: null
        };

        const { error: insertError } = await supabase
          .from('profiles')
          .insert(defaultProfile);

        if (insertError) {
          console.error('Error creating profile in getCurrentUser:', insertError);
          return null;
        }
        profile = defaultProfile;
      }

      return mapProfileToUser(profile, userId, data.user.email || '');
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
      const adminEmail = localStorage.getItem('admin_email');
      if (adminEmail === 'hunainm.qureshi@gmail.com') {
        return true;
      }
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session check error:", error);
        return false;
      }
      
      const isValid = !!data.session;
      
      if (isValid && data.session) {
        const expiresAt = data.session.expires_at;
        if (expiresAt) {
          const expiresAtDate = new Date(expiresAt * 1000);
          const now = new Date();
          const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
          
          if (expiresAtDate < oneHourFromNow) {
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

const supabaseAuthService = new SupabaseAuthService();

export default supabaseAuthService;
