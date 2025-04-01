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
      console.log('Fetching user profile for ID:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      console.log('Fetched profile data:', data);
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
    const validVerificationStatus = isVerified ? 'verified' as const : 'unverified' as const;

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
      verificationStatus: validVerificationStatus,
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
        console.log('Initializing auth state');
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
      console.log('Attempting to sign in with email:', email);
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

      // Fetch user profile and update state
      const profile = await fetchUserProfile(data.user.id);
      const userObj = mapProfileToUser(profile, data.user.id, data.user.email || '');
      
      // Check if profile is incomplete - if bio is empty or no photos, redirect to profile setup
      const isProfileIncomplete = !profile?.bio || !profile?.photos || profile?.photos.length === 0;
      
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
  };

  const signUp = async (email: string, password: string, name: string, planType: string = 'free') => {
    try {
      console.log('Sign up with:', { email, name, planType });
      
      // First, create the user account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        toast.error("Registration failed", { description: error.message });
        return { success: false, error: error.message };
      }

      if (!data.user) {
        console.error('No user account created');
        toast.error("Registration failed", { description: "No user account created" });
        return { success: false, error: "No user account created" };
      }
      
      // Determine premium status and trial end date
      let premiumStatus = 'free';
      let trialEndDate = null;
      
      if (planType === 'premium' || planType === 'basic') {
        // Set trial period for premium plans (3 days)
        premiumStatus = 'trial';
        trialEndDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
      }

      console.log('Creating profile with:', { 
        id: data.user.id, 
        name, 
        email, 
        premiumStatus, 
        trialEndDate 
      });

      // Wait for the auth session to be established before creating the profile
      if (data.session) {
        // Create profile with the authenticated session
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name,
            email,
            premium_status: premiumStatus,
            trial_end_date: trialEndDate,
            created_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error("Error creating profile:", profileError);
          toast.error("Failed to create profile", { description: profileError.message });
          return { success: false, error: profileError.message };
        }
        
        // If we have a session, sign in the user right away
        console.log('Session available, signing in user');
        const profile = await fetchUserProfile(data.user.id);
        const userObj = mapProfileToUser(profile, data.user.id, data.user.email || '');
        
        setAuthState({
          loading: false,
          authenticated: true,
          user: userObj
        });
        
        setCurrentUser(userObj);
        
        if (planType === 'free') {
          toast.success("Your free account has been created!");
        } else {
          toast.success(`Your ${planType} subscription has been activated with a 3-day free trial!`);
        }
        
        return { success: true };
      }
      
      if (!data.session) {
        console.log('No session, email confirmation required');
        toast.success("Registration successful!", {
          description: "Please check your email to confirm your account"
        });
        return { 
          success: true, 
          requiresEmailConfirmation: true 
        };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
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
