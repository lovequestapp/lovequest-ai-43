import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/header/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from '@/context/UserContext';
import ProtectedRoute from '@/components/protected-route';
import { toast } from 'sonner';
import MobileContainer from '@/components/MobileContainer';
import MobileToolbar from '@/components/MobileToolbar';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileMonetization from '@/components/monetization/MobileMonetization';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';
import EditProfileForm from '@/components/profile-editor/EditProfileForm';
import { useDirectProfileUpdate } from '@/hooks/useDirectProfileUpdate';
import { directProfileUpdate } from '@/utils/directProfileUpdate';
import { convertPremiumStatus } from '@/utils/premiumStatusUtils';

const EditProfilePage = () => {
  const { currentUser } = useUser();
  const [profileData, setProfileData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { updateProfile } = useDirectProfileUpdate();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!currentUser?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log('Fetching profile data for user:', currentUser.id);
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching profile data:', fetchError);
          setError('Failed to load profile data from database.');
          setProfileData(currentUser);
        } else if (data) {
          console.log('Profile data retrieved successfully');
          
          let giftInventory = { rose: 0, heart: 0, teddy: 0 };
          let receivedGifts = { rose: 0, heart: 0, teddy: 0 };
          
          try {
            if (data.gift_inventory) {
              const gift = typeof data.gift_inventory === 'string' 
                ? JSON.parse(data.gift_inventory) 
                : data.gift_inventory;
                
              giftInventory = {
                rose: gift.rose?.count || 0,
                heart: gift.heart?.count || 0,
                teddy: gift.teddy?.count || 0
              };
            }
            
            if (data.received_gifts) {
              const received = typeof data.received_gifts === 'string'
                ? JSON.parse(data.received_gifts)
                : data.received_gifts;
                
              receivedGifts = {
                rose: received.rose?.count || 0,
                heart: received.heart?.count || 0,
                teddy: received.teddy?.count || 0
              };
            }
          } catch (e) {
            console.error('Error parsing JSON fields:', e);
          }
          
          const transformedData: User = {
            id: data.id,
            name: data.name || '',
            email: data.email || '',
            age: data.age || 18,
            bio: data.bio || '',
            location: data.location || '',
            interests: Array.isArray(data.interests) ? data.interests : [],
            photos: Array.isArray(data.photos) ? data.photos : [],
            gender: (data.gender as 'male' | 'female' | 'non-binary') || 'non-binary',
            interestedIn: Array.isArray(data.interested_in) ? 
              data.interested_in.filter(g => ['male', 'female', 'non-binary'].includes(g)) as ('male' | 'female' | 'non-binary')[] : 
              [],
            popularityPoints: data.popularity_points || 0,
            premiumStatus: convertPremiumStatus(data.premium_status) as 'standard' | 'unlimited' | 'vip' | 'admin',
            giftInventory,
            receivedGifts,
            compatibilityScore: 0,
            personalityTraits: Array.isArray(data.personality_traits) ? data.personality_traits : [],
            role: (data.role as 'admin' | 'moderator' | 'subscriber' | 'vip' | 'trial') || 'subscriber',
            isBanned: !!data.is_banned,
            verificationStatus: data.is_verified ? 'verified' : 'unverified',
            lastMessage: '',
            lastMessageTime: new Date(),
            status: 'online',
            favoriteMusic: Array.isArray(data.favorite_music) ? data.favorite_music : [],
            voiceIntro: data.voice_intro || '',
            bankDetails: {
              accountName: '',
              accountNumber: '',
              bankName: '',
              routingNumber: '',
              accountType: ''
            }
          };
          
          setProfileData(transformedData);
        } else {
          console.log('No profile data found, using context data');
          setProfileData(currentUser);
        }
      } catch (err: any) {
        console.error('Error in profile data fetching:', err);
        setError('An unexpected error occurred while loading your profile: ' + (err.message || 'Unknown error'));
        setProfileData(currentUser);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [currentUser]);

  const handleProfileUpdate = async (updatedData: Partial<User>) => {
    if (!currentUser?.id) {
      toast.error('You must be logged in to update your profile');
      return false;
    }

    try {
      const success = await directProfileUpdate(currentUser.id, updatedData);
      
      if (!success) {
        const hookSuccess = await updateProfile(currentUser.id, updatedData);
        
        if (!hookSuccess) {
          throw new Error('All profile update methods failed');
        }
      }
      
      setProfileData(prev => prev ? { ...prev, ...updatedData } : null);
      toast.success('Profile updated successfully');
      return true;
    } catch (err: any) {
      console.error('Error in profile update:', err);
      toast.error('Failed to update profile: ' + (err.message || 'Unknown error'));
      return false;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="h-64 flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-love-500" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      );
    }

    if (!profileData && !currentUser) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to load profile data. Please try again later or contact support.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <>
        {error && (
          <Alert variant="warning" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <EditProfileForm 
          initialData={profileData || currentUser}
          onUpdate={handleProfileUpdate}
        />
      </>
    );
  };

  if (isMobile) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <MobileContainer padding={false} scrollable>
              <div className="sticky top-0 z-10 bg-white border-b">
                <div className="p-4 pb-3 flex items-center">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => navigate('/user-profile')}
                    className="absolute left-2"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <h1 className="text-xl font-semibold text-center w-full">My Account</h1>
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="profile" className="text-sm">Profile</TabsTrigger>
                    <TabsTrigger value="monetization" className="text-sm">Earnings</TabsTrigger>
                  </TabsList>
                
                  <TabsContent value="profile" className="pb-20 px-4 pt-4">
                    {renderContent()}
                  </TabsContent>
                  
                  <TabsContent value="monetization" className="pb-20">
                    <MobileMonetization />
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t z-10">
                <Button variant="outline" onClick={() => navigate('/user-profile')} className="w-full">
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto shadow-sm">
            <CardHeader className="border-b">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate('/user-profile')}
                  className="mr-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <CardTitle className="text-2xl font-display">Edit Your Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="py-6">
              {renderContent()}
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default EditProfilePage;
