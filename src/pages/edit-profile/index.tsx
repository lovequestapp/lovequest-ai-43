
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
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
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';
import EditProfileForm from '@/components/profile-editor/EditProfileForm';

const EditProfilePage = () => {
  const { currentUser } = useUser();
  const [profileData, setProfileData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!currentUser?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Use maybeSingle to avoid errors when no data is returned
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching profile data:', fetchError);
          setError('Failed to load profile data from database.');
          setProfileData(currentUser); // Fallback to context data
        } else if (data) {
          // Transform database data to match User type
          const transformedData: User = {
            id: data.id,
            name: data.name || '',
            email: data.email || '',
            age: data.age || 18,
            bio: data.bio || '',
            location: data.location || '',
            interests: data.interests || [],
            photos: data.photos || [],
            gender: data.gender as 'male' | 'female' | 'non-binary' || 'non-binary',
            interestedIn: data.interested_in as ('male' | 'female' | 'non-binary')[] || [],
            popularityPoints: data.popularity_points || 0,
            premiumStatus: data.premium_status as 'basic' | 'premium' | 'vip' | 'trial' || 'basic',
            giftInventory: {
              rose: data.gift_inventory?.rose?.count || 0,
              heart: data.gift_inventory?.heart?.count || 0,
              teddy: data.gift_inventory?.teddy?.count || 0
            },
            receivedGifts: {
              rose: data.received_gifts?.rose?.count || 0,
              heart: data.received_gifts?.heart?.count || 0,
              teddy: data.received_gifts?.teddy?.count || 0
            },
            compatibilityScore: 0,
            personalityTraits: data.personality_traits || [],
            role: data.role as 'admin' | 'moderator' | 'subscriber' | 'vip' | 'trial' || 'subscriber',
            isBanned: data.is_banned || false,
            verificationStatus: data.is_verified ? 'verified' : 'unverified',
            lastMessage: '',
            lastMessageTime: new Date(),
            status: 'online',
            favoriteMusic: data.favorite_music || [],
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
      } catch (err) {
        console.error('Error in profile data fetching:', err);
        setError('An unexpected error occurred while loading your profile.');
        setProfileData(currentUser); // Fallback to context data
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
      // Transform the User type data to match database column names
      const dbData = {
        name: updatedData.name,
        bio: updatedData.bio,
        age: updatedData.age,
        location: updatedData.location,
        interests: updatedData.interests,
        gender: updatedData.gender,
        interested_in: updatedData.interestedIn,
        personality_traits: updatedData.personalityTraits,
        photos: updatedData.photos,
        favorite_music: updatedData.favoriteMusic,
        voice_intro: updatedData.voiceIntro
      };

      // Update profile in Supabase
      const { error: updateError } = await supabase
        .from('profiles')
        .update(dbData)
        .eq('id', currentUser.id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        toast.error('Failed to update profile');
        return false;
      }

      // Update local state
      setProfileData(prev => prev ? { ...prev, ...updatedData } : null);
      toast.success('Profile updated successfully');
      return true;
    } catch (err) {
      console.error('Error in profile update:', err);
      toast.error('An unexpected error occurred while updating your profile');
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
                </Tabs>
              </div>
              
              <TabsContent value="profile" className="pb-20 px-4 pt-4">
                {renderContent()}
              </TabsContent>
              
              <TabsContent value="monetization" className="pb-20">
                <MobileMonetization />
              </TabsContent>
              
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
