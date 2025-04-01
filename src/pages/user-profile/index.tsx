import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, User, Wallet, Crown, Shield, Music, Mic } from 'lucide-react';
import Monetization from '@/components/Monetization';
import ProfileEditor from '@/components/profile-editor/ProfileEditor';
import ProfileInfo from '@/components/profile-editor/ProfileInfo';
import ProtectedRoute from '@/components/protected-route';
import { toast } from 'sonner';
import { fetchUserProfile } from '@/services/profileService';

const UserProfile = () => {
  const { currentUser, setCurrentUser } = useUser();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const refreshUserProfile = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const userProfile = await fetchUserProfile(currentUser.id);
          
        if (userProfile) {
          setProfileData(userProfile);
          setCurrentUser(userProfile);
        } else {
          toast.error('Failed to load profile data');
        }
      } catch (err) {
        console.error('Error in profile fetch:', err);
        toast.error('Error refreshing profile data');
      } finally {
        setLoading(false);
      }
    };
    
    refreshUserProfile();
  }, [currentUser?.id, setCurrentUser]);

  if (!currentUser) {
    return null; // ProtectedRoute will handle redirecting
  }

  const getRoleBadge = () => {
    const role = currentUser?.role || 'subscriber';
    
    switch(role) {
      case 'admin':
        return (
          <Badge className="bg-gradient-to-r from-amber-500 to-amber-700 text-white ml-2">
            <Crown className="h-3 w-3 mr-1" /> Admin
          </Badge>
        );
      case 'moderator':
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-blue-700 text-white ml-2">
            <Shield className="h-3 w-3 mr-1" /> Moderator
          </Badge>
        );
      case 'vip':
        return (
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white ml-2">
            <Crown className="h-3 w-3 mr-1" /> VIP
          </Badge>
        );
      default:
        return null;
    }
  };

  const getSubscriptionBadge = () => {
    const subscription = currentUser?.premiumStatus || 'basic';
    
    switch(subscription) {
      case 'vip':
        return (
          <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white ml-2">
            VIP
          </Badge>
        );
      case 'premium':
        return (
          <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white ml-2">
            Premium
          </Badge>
        );
      case 'trial':
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white ml-2">
            Trial
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white ml-2">
            Basic
          </Badge>
        );
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center flex-wrap">
              <h1 className="text-2xl md:text-3xl font-display font-bold">Your Profile</h1>
              {getRoleBadge()}
              {getSubscriptionBadge()}
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate('/edit-profile')}
            >
              <Edit size={16} />
              Edit Profile
            </Button>
          </div>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User size={16} />
                <span>Profile Info</span>
              </TabsTrigger>
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <Edit size={16} />
                <span>Edit Profile</span>
              </TabsTrigger>
              <TabsTrigger value="monetize" className="flex items-center gap-2">
                <Wallet size={16} />
                <span>Monetization</span>
              </TabsTrigger>
            </TabsList>

            <Card>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="h-8 w-8 rounded-full border-2 border-t-love-500 border-love-200 animate-spin"></div>
                  </div>
                ) : (
                  <>
                    <TabsContent value="profile" className="mt-0">
                      <ProfileInfo profile={profileData || currentUser} />
                      
                      {profileData?.voiceIntro && (
                        <div className="mt-6 p-4 border rounded-lg">
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Mic size={18} />
                            Voice Introduction
                          </h3>
                          <div className="mt-3">
                            <audio
                              controls
                              src={profileData.voiceIntro}
                              className="w-full"
                            >
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        </div>
                      )}
                      
                      {profileData?.favoriteMusic && profileData.favoriteMusic.length > 0 && (
                        <div className="mt-6 p-4 border rounded-lg">
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Music size={18} />
                            Favorite Music
                          </h3>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {profileData.favoriteMusic.map((genre: string, index: number) => (
                              <Badge key={index} variant="secondary">
                                {genre}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="edit" className="mt-0">
                      <ProfileEditor initialData={profileData || currentUser} />
                    </TabsContent>
                    
                    <TabsContent value="monetize" className="mt-0">
                      <Monetization userData={profileData || currentUser} />
                    </TabsContent>
                  </>
                )}
              </CardContent>
            </Card>
          </Tabs>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default UserProfile;
