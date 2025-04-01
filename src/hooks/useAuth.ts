
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';
import { User } from '@/types/user';

interface AuthState {
  loading: boolean;
  authenticated: boolean;
  user: User | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    loading: true,
    authenticated: false,
    user: null
  });
  const { setCurrentUser } = useUser();
  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await (supabase
        .from('profiles') as any)
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
  }, []);

  const mapProfileToUser = useCallback((profile: any, userId: string, userEmail: string) => {
    const gender = profile?.gender || 'non-binary';
    const validGender = (gender === 'male' || gender === 'female' || gender === 'non-binary')
      ? gender
      : 'non-binary';

    const interestedIn = profile?.interested_in || [];
    const validInterestedIn = Array.isArray(interestedIn)
      ? interestedIn.filter((gender: string) => ['male', 'female', 'non-binary'].includes(gender))
      : [];

    const premiumStatus = profile?.premium_status || 'basic';
    const validPremiumStatus = ['basic', 'premium', 'vip', 'trial'].includes(premiumStatus)
      ? premiumStatus
      : 'basic';

    const role = profile?.role || 'subscriber';
    const validRole = ['admin', 'moderator', 'subscriber', 'vip', 'trial'].includes(role)
      ? role
      : 'subscriber';
      
    const isVerified = profile?.is_verified || false;
    const validVerificationStatus = isVerified ? 'verified' : 'unverified';

    return {
      id: userId,
      name: profile?.name || userEmail?.split('@')[0] || 'User',
      email: userEmail || '',
      age: profile?.age || 18,
      bio: profile?.bio || '',
      location: profile?.location || '',
      interests: profile?.interests || [],
      photos: profile?.photos || [],
      gender: validGender,
      interestedIn: validInterestedIn,
      popularityPoints: profile?.popularity_points || 0,
      premiumStatus: validPremiumStatus,
      giftInventory: profile?.gift_inventory || { rose: 0, heart: 0, teddy: 0 },
      receivedGifts: profile?.received_gifts || { rose: 0, heart: 0, teddy: 0 },
      compatibilityScore: 0,
      personalityTraits: profile?.personality_traits || [],
      role: validRole,
      isBanned: profile?.is_banned || false,
      verificationStatus: validVerificationStatus as "pending" | "rejected" | "verified" | "unverified",
      lastMessage: '',
      lastMessageTime: new Date(),
      status: 'online',
      favoriteMusic: [],
      voiceIntro: '',
      bankDetails: {
        accountName: '',
        accountNumber: '',
        bankName: '',
        routingNumber: '',
        accountType: ''
      }
    } as User;
  }, []);

  useEffect(() => {
    const initialize = async () => {
      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event);
            
            if (event === 'SIGNED_OUT') {
              setAuthState({
                loading: false,
                authenticated: false,
                user: null
              });
              setCurrentUser(null);
              return;
            }

            if (session && session.user) {
              setTimeout(async () => {
                const profile = await fetchUserProfile(session.user.id);
                const user = mapProfileToUser(profile, session.user.id, session.user.email || '');
                
                setAuthState({
                  loading: false,
                  authenticated: true,
                  user
                });
                
                setCurrentUser(user);
              }, 0);
            }
          }
        );

        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (data.session && data.session.user) {
          const profile = await fetchUserProfile(data.session.user.id);
          const user = mapProfileToUser(profile, data.session.user.id, data.session.user.email || '');
          
          setAuthState({
            loading: false,
            authenticated: true,
            user
          });
          
          setCurrentUser(user);
        } else {
          setAuthState({
            loading: false,
            authenticated: false,
            user: null
          });
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState({
          loading: false,
          authenticated: false,
          user: null
        });
      }
    };

    initialize();
  }, [setCurrentUser, fetchUserProfile, mapProfileToUser]);

  const signIn = async (email: string, password: string) => {
    try {
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

      toast.success("Login successful!");
      return { success: true };
    } catch (error: any) {
      toast.error("Login failed", { description: error.message });
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
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

      const { error: profileError } = await (supabase
        .from('profiles') as any)
        .insert([{ 
          id: data.user.id,
          name,
          email,
          created_at: new Date().toISOString(),
        }]);

      if (profileError) {
        console.error("Error creating profile:", profileError);
        toast.error("Failed to create profile");
        return { success: false, error: profileError.message };
      }

      toast.success("Registration successful!");
      
      if (!data.session) {
        toast.info("Please check your email to confirm your registration");
        return { 
          success: true, 
          requiresEmailConfirmation: true 
        };
      }

      return { success: true };
    } catch (error: any) {
      toast.error("Registration failed", { description: error.message });
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error("Logout failed", { description: error.message });
        return { success: false, error: error.message };
      }
      
      toast.success("Logged out successfully");
      navigate('/login');
      return { success: true };
    } catch (error: any) {
      toast.error("Logout failed", { description: error.message });
      return { success: false, error: error.message };
    }
  };

  return {
    loading: authState.loading,
    authenticated: authState.authenticated,
    user: authState.user,
    signIn,
    signUp,
    signOut
  };
};
