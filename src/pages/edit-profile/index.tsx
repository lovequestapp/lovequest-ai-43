
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from '@/context/UserContext';
import ProfileEditor from '@/components/profile-editor/ProfileEditor';
import ProtectedRoute from '@/components/protected-route';
import { toast } from 'sonner';
import MobileContainer from '@/components/MobileContainer';
import MobileToolbar from '@/components/MobileToolbar';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileMonetization from '@/components/monetization/MobileMonetization';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useUserProfile } from '@/hooks/useUserProfile';

const EditProfile = () => {
  const { currentUser } = useUser();
  const { fetchProfileData, isLoading: isProfileLoading } = useUserProfile();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const [fetchError, setFetchError] = useState(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const loadProfileData = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setFetchError(null);
      
      console.log(`Attempting to fetch profile data (attempt ${fetchAttempts + 1})...`);
      const userProfile = await fetchProfileData(currentUser.id);
        
      if (userProfile) {
        console.log('Successfully loaded profile data');
        setProfileData(userProfile);
      } else {
        console.log('No profile data returned, using currentUser from context');
        // Fall back to currentUser from context if no profile data found
        setProfileData(currentUser);
        toast.info('Using profile data from your current session');
      }
    } catch (err) {
      console.error('Error loading profile data:', err);
      setFetchError(err);
      
      // Continue with currentUser data even if profile fetch fails
      setProfileData(currentUser);
      
      // Only show toast on first error to avoid multiple notifications
      if (fetchAttempts === 0) {
        toast.info('Using local profile data from your current session');
      }
    } finally {
      setLoading(false);
      setFetchAttempts(prev => prev + 1);
    }
  }, [currentUser, fetchProfileData, fetchAttempts]);
  
  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="h-64 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-t-love-500 border-love-200 animate-spin"></div>
        </div>
      );
    }
    
    if (activeTab === 'profile') {
      return (
        <>
          {fetchError && (
            <div className="mb-4 p-3 bg-amber-50 text-amber-700 rounded-md text-sm">
              <p>There was an issue loading your profile data from the server. You're seeing local data from your current session.</p>
            </div>
          )}
          <ProfileEditor initialData={profileData || currentUser} />
        </>
      );
    } else {
      return <MobileMonetization />;
    }
  };

  if (isMobile) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <MobileContainer padding={false} scrollable>
              <div className="sticky top-0 z-10 bg-white border-b">
                <div className="p-4 pb-3">
                  <h1 className="text-xl font-semibold text-center">My Account</h1>
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="profile" className="text-sm">Profile</TabsTrigger>
                    <TabsTrigger value="monetization" className="text-sm">Earnings</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="pb-20">
                {renderContent()}
              </div>
              
              <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t z-10">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/user-profile')}
                  className="w-full"
                >
                  Back to Profile
                </Button>
              </div>
            </MobileContainer>
          </main>
          <MobileToolbar />
        </div>
      </ProtectedRoute>
    );
  }

  // Fallback for non-mobile
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-display">Edit Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full border-2 border-t-love-500 border-love-200 animate-spin"></div>
                </div>
              ) : (
                <>
                  {fetchError && (
                    <div className="mb-4 p-3 bg-amber-50 text-amber-700 rounded-md text-sm">
                      <p>There was an issue loading your profile data from the server. You're seeing local data from your current session.</p>
                    </div>
                  )}
                  <ProfileEditor initialData={profileData || currentUser} />
                </>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-center mt-6 gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/user-profile')}
            >
              Back to Profile
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default EditProfile;
