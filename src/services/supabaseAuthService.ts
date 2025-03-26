
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/context/UserContext';

interface AuthCredentials {
  email: string;
  password: string;
}

// Define a type that matches our database structure
interface ProfileRecord {
  id: string;
  name: string | null;
  age: number | null;
  email: string | null;
  bio: string | null;
  location: string | null;
  interests: string[] | null;
  gender: string | null;
  interested_in: string[] | null;
  premium_status: string | null;
  photos: string[] | null;
  popularity_points: number | null;
  personality_traits: string[] | null;
  is_verified: boolean | null;
  is_banned: boolean | null;
  role: string | null;
}

// Type guard function to check if string is a valid gender type
function isValidGender(gender: string | null): gender is 'male' | 'female' | 'non-binary' {
  return gender === 'male' || gender === 'female' || gender === 'non-binary';
}

// Convert string[] to gender array
function toGenderArray(arr: string[] | null): ('male' | 'female' | 'non-binary')[] {
  if (!arr) return [];
  return arr.filter(isValidGender);
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
        // The profile is created automatically via database trigger
        // Let's update it with additional data
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            name: userData.name,
            age: userData.age,
            bio: userData.bio || '',
            location: userData.location || '',
            interests: userData.interests || [],
            gender: userData.gender || 'non-binary',
            interested_in: userData.interestedIn || [],
            premium_status: 'basic',
            photos: userData.photos || [],
            popularity_points: 0,
            personality_traits: userData.personalityTraits || [],
            is_verified: false,
          })
          .eq('id', data.user.id);
          
        if (profileError) throw profileError;
        
        // Return the user data
        const gender = isValidGender(userData.gender || 'non-binary') 
          ? userData.gender || 'non-binary' 
          : 'non-binary';
        
        const interestedIn = Array.isArray(userData.interestedIn) 
          ? toGenderArray(userData.interestedIn as string[]) 
          : [];
          
        return {
          id: data.user.id,
          name: userData.name || 'New User',
          email: credentials.email,
          age: userData.age || 25,
          bio: userData.bio || '',
          location: userData.location || '',
          interests: userData.interests || [],
          photos: userData.photos || [],
          gender: gender,
          interestedIn: interestedIn,
          popularityPoints: 0,
          premiumStatus: 'basic',
          giftInventory: { rose: 0, heart: 0, teddy: 0 },
          receivedGifts: { rose: 0, heart: 0, teddy: 0 },
          compatibilityScore: 0,
          personalityTraits: userData.personalityTraits || [],
          role: 'subscriber',
          isBanned: false,
          verificationStatus: 'unverified',
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
        
        // Handle missing profile data with defaults
        const profile = profileData as ProfileRecord || {
          id: data.user.id,
          name: null,
          age: null,
          email: data.user.email,
          bio: null,
          location: null,
          interests: [],
          gender: 'non-binary',
          interested_in: [],
          premium_status: 'basic',
          photos: [],
          popularity_points: 0,
          personality_traits: [],
          is_verified: false,
          is_banned: false,
          role: 'subscriber'
        };

        const gender = isValidGender(profile.gender) 
          ? profile.gender 
          : 'non-binary';
        
        const interestedIn = Array.isArray(profile.interested_in) 
          ? toGenderArray(profile.interested_in) 
          : [];
        
        // Return the user data
        return {
          id: data.user.id,
          name: profile.name || 'User',
          email: data.user.email || '',
          age: profile.age || 25,
          bio: profile.bio || '',
          location: profile.location || '',
          interests: profile.interests || [],
          photos: profile.photos || [],
          gender: gender,
          interestedIn: interestedIn,
          popularityPoints: profile.popularity_points || 0,
          premiumStatus: (profile.premium_status || 'basic') as 'basic' | 'premium' | 'vip',
          giftInventory: { rose: 0, heart: 0, teddy: 0 },
          receivedGifts: { rose: 0, heart: 0, teddy: 0 },
          compatibilityScore: 0,
          personalityTraits: profile.personality_traits || [],
          role: (profile.role || 'subscriber') as 'admin' | 'moderator' | 'subscriber' | 'vip' | 'trial',
          isBanned: profile.is_banned || false,
          verificationStatus: profile.is_verified ? 'verified' : 'unverified',
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
          
        if (profileError) {
          // If there's an error but the user exists in auth, create a basic profile
          return {
            id: data.user.id,
            name: data.user.email?.split('@')[0] || 'User',
            email: data.user.email || '',
            interests: [],
            photos: [], // Added missing required property
            age: 25,
            bio: '',
            location: '',
            gender: 'non-binary',
            popularityPoints: 0,
            premiumStatus: 'basic',
            giftInventory: { rose: 0, heart: 0, teddy: 0 },
            receivedGifts: { rose: 0, heart: 0, teddy: 0 },
            interestedIn: [],
            personalityTraits: [],
            compatibilityScore: 0,
            role: 'subscriber',
            isBanned: false,
            verificationStatus: 'unverified'
          };
        }
        
        // Handle missing profile data with defaults
        const profile = profileData as ProfileRecord;
        
        const gender = isValidGender(profile.gender) 
          ? profile.gender 
          : 'non-binary';
        
        const interestedIn = Array.isArray(profile.interested_in) 
          ? toGenderArray(profile.interested_in) 
          : [];
        
        // Return the user data
        return {
          id: data.user.id,
          name: profile.name || 'User',
          email: data.user.email || '',
          age: profile.age || 25,
          bio: profile.bio || '',
          location: profile.location || '',
          interests: profile.interests || [],
          photos: profile.photos || [],
          gender: gender,
          interestedIn: interestedIn,
          popularityPoints: profile.popularity_points || 0,
          premiumStatus: (profile.premium_status || 'basic') as 'basic' | 'premium' | 'vip',
          giftInventory: { rose: 0, heart: 0, teddy: 0 },
          receivedGifts: { rose: 0, heart: 0, teddy: 0 },
          compatibilityScore: 0,
          personalityTraits: profile.personality_traits || [],
          role: (profile.role || 'subscriber') as 'admin' | 'moderator' | 'subscriber' | 'vip' | 'trial',
          isBanned: profile.is_banned || false,
          verificationStatus: profile.is_verified ? 'verified' : 'unverified',
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
      
      // Handle missing profile data with defaults
      const profile = profileData as ProfileRecord;
      
      const gender = isValidGender(profile.gender) 
        ? profile.gender 
        : 'non-binary';
      
      const interestedIn = Array.isArray(profile.interested_in) 
        ? toGenderArray(profile.interested_in) 
        : [];
      
      // Return the updated user data
      return {
        id: authData.user.id,
        name: profile.name || 'User',
        email: authData.user.email || '',
        age: profile.age || 25,
        bio: profile.bio || '',
        location: profile.location || '',
        interests: profile.interests || [],
        photos: profile.photos || [],
        gender: gender,
        interestedIn: interestedIn,
        popularityPoints: profile.popularity_points || 0,
        premiumStatus: (profile.premium_status || 'basic') as 'basic' | 'premium' | 'vip',
        giftInventory: { rose: 0, heart: 0, teddy: 0 },
        receivedGifts: { rose: 0, heart: 0, teddy: 0 },
        compatibilityScore: 0,
        personalityTraits: profile.personality_traits || [],
        role: (profile.role || 'subscriber') as 'admin' | 'moderator' | 'subscriber' | 'vip' | 'trial',
        isBanned: profile.is_banned || false,
        verificationStatus: profile.is_verified ? 'verified' : 'unverified',
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
