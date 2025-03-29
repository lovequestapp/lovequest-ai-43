
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@/types/user';

export const login = async (email: string, password: string): Promise<{ success: boolean, user?: User }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      toast.error("Login failed", {
        description: error.message
      });
      return { success: false };
    }
    
    if (!data.session) {
      toast.error("Login failed", {
        description: "No session created"
      });
      return { success: false };
    }
    
    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
      
    if (profileError) {
      console.error("Error fetching profile:", profileError);
      // Continue anyway, but log the error
    }
    
    // Handle type-safe gender
    const gender = profile?.gender || 'non-binary';
    const validGender = (gender === 'male' || gender === 'female' || gender === 'non-binary') 
      ? gender as 'male' | 'female' | 'non-binary'
      : 'non-binary' as const;
      
    // Handle type-safe interestedIn
    const interestedIn = profile?.interested_in || [];
    const validInterestedIn = Array.isArray(interestedIn) ? 
      interestedIn.filter((interest: string) => 
        interest === 'male' || interest === 'female' || interest === 'non-binary'
      ) as ('male' | 'female' | 'non-binary')[] :
      [] as ('male' | 'female' | 'non-binary')[];
      
    // Handle type-safe premiumStatus
    const premiumStatus = profile?.premium_status || 'basic';
    const validPremiumStatus = (premiumStatus === 'basic' || premiumStatus === 'premium' || premiumStatus === 'vip')
      ? premiumStatus as 'basic' | 'premium' | 'vip'
      : 'basic' as const;
      
    // Handle type-safe role
    const role = profile?.role || 'subscriber';
    const validRole = (role === 'admin' || role === 'moderator' || role === 'subscriber' || role === 'vip' || role === 'trial')
      ? role as 'admin' | 'moderator' | 'subscriber' | 'vip' | 'trial'
      : 'subscriber' as const;
    
    // Map data to User type
    const user: User = {
      id: data.user.id,
      name: profile?.name || data.user.email?.split('@')[0] || 'User',
      email: data.user.email || '',
      age: profile?.age || 18,
      bio: profile?.bio || '',
      location: profile?.location || '',
      interests: profile?.interests || [],
      photos: profile?.photos || [],
      gender: validGender,
      interestedIn: validInterestedIn,
      popularityPoints: profile?.popularity_points || 0,
      premiumStatus: validPremiumStatus,
      giftInventory: { rose: 0, heart: 0, teddy: 0 },
      receivedGifts: { rose: 0, heart: 0, teddy: 0 },
      compatibilityScore: 0,
      personalityTraits: profile?.personality_traits || [],
      role: validRole,
      isBanned: profile?.is_banned || false,
      verificationStatus: profile?.is_verified ? 'verified' : 'unverified',
      // Additional properties
      lastMessage: '',
      lastMessageTime: new Date(),
      status: 'offline',
      favoriteMusic: [],
      voiceIntro: '',
      bankDetails: {
        accountName: '',
        accountNumber: '',
        bankName: '',
        routingNumber: '',
        accountType: ''
      }
    };
    
    toast.success("Login successful!");
    
    return {
      success: true,
      user
    };
  } catch (error) {
    console.error('Login error:', error);
    toast.error("Login failed", {
      description: "An unexpected error occurred"
    });
    return { success: false };
  }
};

export const register = async (email: string, password: string, name: string): Promise<{ success: boolean, user?: User }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        }
      }
    });
    
    if (error) {
      toast.error("Registration failed", {
        description: error.message
      });
      return { success: false };
    }
    
    if (!data.user) {
      toast.error("Registration failed", {
        description: "No user account created"
      });
      return { success: false };
    }
    
    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        { 
          id: data.user.id,
          name,
          email,
          created_at: new Date().toISOString(),
        }
      ]);
      
    if (profileError) {
      console.error("Error creating profile:", profileError);
      toast.error("Failed to create profile", {
        description: profileError.message
      });
      // Attempt to clean up the auth account
      await supabase.auth.admin.deleteUser(data.user.id);
      return { success: false };
    }
    
    // Create user object
    const user: User = {
      id: data.user.id,
      name,
      email: email,
      age: 18,
      bio: '',
      location: '',
      interests: [],
      photos: [],
      gender: 'non-binary',
      interestedIn: [],
      popularityPoints: 0,
      premiumStatus: 'basic',
      giftInventory: { rose: 0, heart: 0, teddy: 0 },
      receivedGifts: { rose: 0, heart: 0, teddy: 0 },
      compatibilityScore: 0,
      personalityTraits: [],
      role: 'subscriber',
      isBanned: false,
      verificationStatus: 'unverified',
      // Additional properties
      lastMessage: '',
      lastMessageTime: new Date(),
      status: 'offline',
      favoriteMusic: [],
      voiceIntro: '',
      bankDetails: {
        accountName: '',
        accountNumber: '',
        bankName: '',
        routingNumber: '',
        accountType: ''
      }
    };
    
    toast.success("Registration successful!");
    
    return {
      success: true,
      user
    };
  } catch (error) {
    console.error('Registration error:', error);
    toast.error("Registration failed", {
      description: "An unexpected error occurred"
    });
    return { success: false };
  }
};

export const logout = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error("Logout failed", {
        description: error.message
      });
      return false;
    }
    
    toast.success("Logged out successfully");
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    toast.error("Logout failed", {
      description: "An unexpected error occurred"
    });
    return false;
  }
};
