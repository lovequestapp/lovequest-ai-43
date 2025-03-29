
import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/home';
import Register from './pages/register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import EditProfile from './pages/edit-profile';
import Discover from './pages/discover';
import Explore from './pages/Explore'; // Changed from './pages/explore' to match casing
import Admin from './pages/Admin';
import ProtectedRoute from './components/protected-route';
import { useUser } from './context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import './index.css';

function App() {
  const { currentUser, setCurrentUser } = useUser();
  const navigate = useNavigate();

  // Check for existing session on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          // Get the user profile from profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
            
          if (profileError) {
            console.error("Error fetching profile:", profileError);
            return;
          }
          
          // Ensure gender is properly typed
          const gender = profileData?.gender || 'non-binary';
          const validGender = (gender === 'male' || gender === 'female' || gender === 'non-binary') 
            ? gender 
            : 'non-binary';
            
          // Ensure interestedIn is properly typed
          const interestedIn = profileData?.interested_in || [];
          const validInterestedIn = Array.isArray(interestedIn) ? 
            interestedIn.filter((interest: string) => 
              interest === 'male' || interest === 'female' || interest === 'non-binary'
            ) as ('male' | 'female' | 'non-binary')[] :
            [] as ('male' | 'female' | 'non-binary')[];
          
          // Map Supabase profile data to our User type
          const mappedUser = {
            id: data.session.user.id,
            name: profileData?.name || data.session.user.email?.split('@')[0] || 'User',
            email: data.session.user.email || '',
            age: profileData?.age || 25,
            bio: profileData?.bio || '',
            location: profileData?.location || '',
            interests: profileData?.interests || [],
            photos: profileData?.photos || [],
            gender: validGender as 'male' | 'female' | 'non-binary',
            interestedIn: validInterestedIn,
            popularityPoints: profileData?.popularity_points || 0,
            premiumStatus: (profileData?.premium_status || 'basic') as 'basic' | 'premium' | 'vip',
            giftInventory: { rose: 0, heart: 0, teddy: 0 },
            receivedGifts: { rose: 0, heart: 0, teddy: 0 },
            compatibilityScore: 0,
            personalityTraits: profileData?.personality_traits || [],
            role: (profileData?.role || 'subscriber') as 'admin' | 'moderator' | 'subscriber' | 'vip' | 'trial',
            isBanned: profileData?.is_banned || false,
            verificationStatus: profileData?.is_verified ? 'verified' : 'unverified' as 'verified' | 'unverified' | 'pending' | 'rejected',
          };
          
          setCurrentUser(mappedUser);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };

    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === 'SIGNED_IN' && session) {
          // Get the user profile from profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError && profileError.code !== 'PGRST116') {
            console.error("Error fetching profile:", profileError);
          }
          
          // Ensure gender is properly typed
          const gender = profileData?.gender || 'non-binary';
          const validGender = (gender === 'male' || gender === 'female' || gender === 'non-binary') 
            ? gender 
            : 'non-binary';
            
          // Ensure interestedIn is properly typed
          const interestedIn = profileData?.interested_in || [];
          const validInterestedIn = Array.isArray(interestedIn) ? 
            interestedIn.filter((interest: string) => 
              interest === 'male' || interest === 'female' || interest === 'non-binary'
            ) as ('male' | 'female' | 'non-binary')[] :
            [] as ('male' | 'female' | 'non-binary')[];
          
          // Map Supabase profile data to our User type
          const mappedUser = {
            id: session.user.id,
            name: profileData?.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            age: profileData?.age || 25,
            bio: profileData?.bio || '',
            location: profileData?.location || '',
            interests: profileData?.interests || [],
            photos: profileData?.photos || [],
            gender: validGender as 'male' | 'female' | 'non-binary',
            interestedIn: validInterestedIn,
            popularityPoints: profileData?.popularity_points || 0,
            premiumStatus: (profileData?.premium_status || 'basic') as 'basic' | 'premium' | 'vip',
            giftInventory: { rose: 0, heart: 0, teddy: 0 },
            receivedGifts: { rose: 0, heart: 0, teddy: 0 },
            compatibilityScore: 0,
            personalityTraits: profileData?.personality_traits || [],
            role: (profileData?.role || 'subscriber') as 'admin' | 'moderator' | 'subscriber' | 'vip' | 'trial',
            isBanned: profileData?.is_banned || false,
            verificationStatus: profileData?.is_verified ? 'verified' : 'unverified' as 'verified' | 'unverified' | 'pending' | 'rejected',
          };
          
          setCurrentUser(mappedUser);
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setCurrentUser]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile/:userId" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/messages" 
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/messages/:userId" 
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/edit-profile" 
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/discover" 
        element={
          <ProtectedRoute>
            <Discover />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/explore" 
        element={
          <ProtectedRoute>
            <Explore />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
