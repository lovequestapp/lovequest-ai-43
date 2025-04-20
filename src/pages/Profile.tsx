
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from '@/context/UserContext';
import { Badge } from '@/components/ui/badge';
import { Edit, User, Wallet, Crown, Shield, Music, Mic, ShoppingBag, Heart, Rabbit } from 'lucide-react';
import Monetization from '@/components/Monetization';
import ProfileEditor from '@/components/profile-editor/ProfileEditor';
import ProfileInfo from '@/components/profile-editor/ProfileInfo';
import { toast } from 'sonner';
import { fetchUserProfile } from '@/services/profileService';
import GiftInventory from '@/components/GiftInventory';
import GiftTransactionHistory from '@/components/GiftTransactionHistory';
import GiftShop from '@/components/GiftShop';
import ProfileDetails from '@/pages/ProfileDetails';
import SubscriptionBadge from '@/components/SubscriptionBadge';

// Helper to normalize gift counts from possible object to number-only
const normalizeGifts = (gifts: any) => {
  if (!gifts) return { rose: 0, heart: 0, teddy: 0 };
  const safeGetCount = (gift: any): number => {
    if (gift == null) return 0;
    if (typeof gift === 'number') return gift;
    if (typeof gift === 'object' && typeof gift.count === 'number') return gift.count;
    return 0;
  };
  return {
    rose: safeGetCount(gifts.rose),
    heart: safeGetCount(gifts.heart),
    teddy: safeGetCount(gifts.teddy),
  };
};

const Profile = () => {
  const { currentUser, setCurrentUser } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  if (userId && userId !== currentUser?.id) {
    return <ProfileDetails />;
  }

  useEffect(() => {
    const refreshUserProfile = async () => {
      if (!currentUser?.id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching profile data for user ID:', currentUser.id);
        const userProfile = await fetchUserProfile(currentUser.id);
          
        if (userProfile) {
          console.log('Profile data loaded successfully:', userProfile);
          setProfileData(userProfile);
          setCurrentUser(userProfile);
        } else {
          console.error('Failed to load profile data - no data returned');
          setError('Failed to load profile data');
          toast.error('Failed to load profile data');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Error in profile fetch:', err);
        setError(errorMessage);
        toast.error(`Error loading profile: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };
    
    refreshUserProfile();
  }, [currentUser?.id, setCurrentUser]);

  if (!currentUser && !loading) {
    navigate('/login');
    return null;
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
    const subscription = currentUser?.premiumStatus || 'standard';
    return <SubscriptionBadge status={subscription} className="ml-2" />;
  };

  // Normalize gifts in userData passed to Monetization
  const monetizationUserData = React.useMemo(() => {
    const userToNormalize = profileData || currentUser;
    if (!userToNormalize) return null;

    // Clone and normalize gifts
    return {
      ...userToNormalize,
      receivedGifts: normalizeGifts(userToNormalize.receivedGifts),
      giftInventory: normalizeGifts(userToNormalize.giftInventory),
    };
  }, [profileData, currentUser]);

  return (
    <div className="container mx-auto px-4 py-8 pb-16 md:pb-8">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center flex-wrap">
          <h1 className="text-2xl md:text-3xl font-display font-bold">Your Profile</h1>
          {getRoleBadge()}
          {getSubscriptionBadge()}
        </div>
        {/* Removed Edit Profile button for better UX */}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
          <p className="font-medium">Error loading profile</p>
          <p className="text-sm">{error}</p>
          <button 
            type="button" 
            onClick={() => window.location.reload()}
            className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Retry
          </button>
        </div>
      )}

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} />
            <span>Profile Info</span>
          </TabsTrigger>
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <Edit size={16} />
            <span>Edit Profile</span>
          </TabsTrigger>
          <TabsTrigger value="shop" className="flex items-center gap-2">
            <ShoppingBag size={16} />
            <span>Gift Shop</span>
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
                  <p className="text-center text-sm text-gray-500 italic">
                    To edit your profile details, please use the "Edit Profile" tab.
                  </p>
                </TabsContent>
                
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
              </>
            )}
          </CardContent>
        </Card>
        
        <TabsContent value="edit" className="mt-0">
          <ProfileEditor initialData={profileData || currentUser} />
        </TabsContent>
        
        <TabsContent value="shop" className="mt-0">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-love-500" />
                Gift Shop
              </h2>
              <GiftShop />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-love-500" />
                Gift Inventory
              </h2>
              <GiftInventory />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
              <GiftTransactionHistory />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="monetize" className="mt-0">
          <Monetization userData={monetizationUserData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
