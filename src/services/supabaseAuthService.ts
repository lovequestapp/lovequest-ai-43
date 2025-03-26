
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/context/UserContext';

interface AuthCredentials {
  email: string;
  password: string;
}

export const supabaseAuthService = {
  /**
   * Register a new user with Supabase
   */
  register: async (credentials: AuthCredentials, userData: Partial<User>): Promise<User | null> => {
    try {
      // Register with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: userData.name,
            age: userData.age,
            bio: userData.bio || '',
            location: userData.location || '',
            interests: userData.interests || [],
            gender: userData.gender || 'non-binary',
            interestedIn: userData.interestedIn || [],
          }
        }
      });
      
      if (error) throw error;
      
      if (data?.user) {
        // Create a user profile in Supabase
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              name: userData.name,
              age: userData.age,
              email: credentials.email,
              bio: userData.bio || '',
              location: userData.location || '',
              interests: userData.interests || [],
              gender: userData.gender || 'non-binary',
              interested_in: userData.interestedIn || [],
              premium_status: 'basic',
              photos: userData.photos || [],
              popularity_points: 0,
              personality_traits: userData.personalityTraits || [],
              is_verified: userData.verificationId ? true : false,
            }
          ]);
          
        if (profileError) throw profileError;
        
        // Return the user data
        return {
          id: data.user.id,
          name: userData.name || 'New User',
          email: credentials.email,
          age: userData.age || 25,
          bio: userData.bio || '',
          location: userData.location || '',
          interests: userData.interests || [],
          photos: userData.photos || [],
          gender: userData.gender as 'male' | 'female' | 'non-binary' || 'non-binary',
          interestedIn: userData.interestedIn || [],
          popularityPoints: 0,
          premiumStatus: 'basic',
          giftInventory: { rose: 0, heart: 0, teddy: 0 },
          receivedGifts: { rose: 0, heart: 0, teddy: 0 },
          compatibilityScore: 0,
          personalityTraits: userData.personalityTraits || [],
          role: 'subscriber',
          isBanned: false,
          verificationStatus: userData.verificationId ? 'verified' : 'unverified',
        };
      }
      
      return null;
    } catch (error) {
      console.error('Supabase registration error:', error);
      return null;
    }
  },

  /**
   * Log in a user with Supabase
   */
  login: async (credentials: AuthCredentials): Promise<User | null> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (error) throw error;
      
      if (data?.user) {
        // Get user profile from Supabase
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) throw profileError;
        
        // Return the user data
        return {
          id: data.user.id,
          name: profileData.name,
          email: data.user.email || '',
          age: profileData.age,
          bio: profileData.bio || '',
          location: profileData.location || '',
          interests: profileData.interests || [],
          photos: profileData.photos || [],
          gender: profileData.gender || 'non-binary',
          interestedIn: profileData.interested_in || [],
          popularityPoints: profileData.popularity_points || 0,
          premiumStatus: profileData.premium_status || 'basic',
          giftInventory: { rose: 0, heart: 0, teddy: 0 },
          receivedGifts: { rose: 0, heart: 0, teddy: 0 },
          compatibilityScore: 0,
          personalityTraits: profileData.personality_traits || [],
          role: profileData.role || 'subscriber',
          isBanned: profileData.is_banned || false,
          verificationStatus: profileData.is_verified ? 'verified' : 'unverified',
        };
      }
      
      return null;
    } catch (error) {
      console.error('Supabase login error:', error);
      return null;
    }
  },

  /**
   * Log out the current user
   */
  logout: async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Supabase logout error:', error);
    }
  },

  /**
   * Check if user is logged in with Supabase
   */
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const { data } = await supabase.auth.getSession();
      return data.session !== null;
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  },

  /**
   * Get the current user from Supabase
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const { data } = await supabase.auth.getUser();
      
      if (data?.user) {
        // Get user profile from Supabase
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) throw profileError;
        
        // Return the user data
        return {
          id: data.user.id,
          name: profileData.name,
          email: data.user.email || '',
          age: profileData.age,
          bio: profileData.bio || '',
          location: profileData.location || '',
          interests: profileData.interests || [],
          photos: profileData.photos || [],
          gender: profileData.gender || 'non-binary',
          interestedIn: profileData.interested_in || [],
          popularityPoints: profileData.popularity_points || 0,
          premiumStatus: profileData.premium_status || 'basic',
          giftInventory: { rose: 0, heart: 0, teddy: 0 },
          receivedGifts: { rose: 0, heart: 0, teddy: 0 },
          compatibilityScore: 0,
          personalityTraits: profileData.personality_traits || [],
          role: profileData.role || 'subscriber',
          isBanned: profileData.is_banned || false,
          verificationStatus: profileData.is_verified ? 'verified' : 'unverified',
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  /**
   * Update user data in Supabase
   */
  updateUserData: async (userData: Partial<User>): Promise<User | null> => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      
      if (!authData?.user) return null;
      
      const { error } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          bio: userData.bio,
          location: userData.location,
          interests: userData.interests,
          gender: userData.gender,
          interested_in: userData.interestedIn,
          photos: userData.photos,
          personality_traits: userData.personalityTraits,
        })
        .eq('id', authData.user.id);
        
      if (error) throw error;
      
      // Get updated user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();
        
      if (profileError) throw profileError;
      
      // Return the updated user data
      return {
        id: authData.user.id,
        name: profileData.name,
        email: authData.user.email || '',
        age: profileData.age,
        bio: profileData.bio || '',
        location: profileData.location || '',
        interests: profileData.interests || [],
        photos: profileData.photos || [],
        gender: profileData.gender || 'non-binary',
        interestedIn: profileData.interested_in || [],
        popularityPoints: profileData.popularity_points || 0,
        premiumStatus: profileData.premium_status || 'basic',
        giftInventory: { rose: 0, heart: 0, teddy: 0 },
        receivedGifts: { rose: 0, heart: 0, teddy: 0 },
        compatibilityScore: 0,
        personalityTraits: profileData.personality_traits || [],
        role: profileData.role || 'subscriber',
        isBanned: profileData.is_banned || false,
        verificationStatus: profileData.is_verified ? 'verified' : 'unverified',
      };
    } catch (error) {
      console.error('Error updating user data:', error);
      return null;
    }
  },
  
  /**
   * Reset password using Supabase
   */
  resetPassword: async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      return false;
    }
  }
};
