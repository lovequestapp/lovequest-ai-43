import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import MobileContainer from '@/components/MobileContainer';
import Blog from '@/components/Blog';
import MonetizationPanel from '@/components/MonetizationPanel';
import { 
  Edit, User, MapPin, Heart, Gift, Star, Shield, Calendar, Clock, 
  Mail, ChevronRight, Music, Users, ArrowLeft, Package
} from 'lucide-react';

const Profile = () => {
  const { userId } = useParams();
  const { currentUser, getProfileById, sendGift } = useUser();
  const [profileUser, setProfileUser] = useState(currentUser);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  useEffect(() => {
    // If userId is provided and it's not the current user's ID, fetch that user's profile
    if (userId && currentUser && userId !== currentUser.id) {
      const otherUser = getProfileById(userId);
      if (otherUser) {
        setProfileUser(otherUser);
        setIsOwnProfile(false);
      } else {
        // Handle case where user is not found
        toast.error("User not found");
        navigate("/discover");
      }
    } else {
      setProfileUser(currentUser);
      setIsOwnProfile(true);
    }
  }, [userId, currentUser, getProfileById, navigate]);

  const handleSendGift = (giftType: 'rose' | 'heart' | 'teddy') => {
    if (!profileUser || !currentUser) return;
    
    sendGift(profileUser.id, giftType);
    toast.success(`Sent a ${giftType} to ${profileUser.name}!`);
  };

  if (!profileUser || !currentUser) {
    return (
      <MobileContainer>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse">Loading profile...</div>
        </div>
      </MobileContainer>
    );
  }

  return (
    <MobileContainer scrollable padding>
      <div className="flex items-center justify-between mb-4">
        {!isOwnProfile && (
          <Button 
            variant="ghost" 
            className="p-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        
        <h1 className="text-2xl font-bold text-center flex-grow">
          {isOwnProfile ? "My Profile" : `${profileUser.name}'s Profile`}
        </h1>
        
        {isOwnProfile && (
          <Button 
            variant="ghost" 
            className="p-2" 
            onClick={() => navigate('/edit-profile')}
          >
            <Edit className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <div className="flex flex-col items-center mb-6">
        <Avatar className="w-24 h-24 mb-4 border-4 border-white shadow-lg">
          <AvatarImage src={profileUser.photos && profileUser.photos.length > 0 ? profileUser.photos[0] : ""} />
          <AvatarFallback className="bg-gradient-love text-white text-xl">
            {profileUser.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <h2 className="text-xl font-bold mb-1">{profileUser.name}, {profileUser.age}</h2>
        
        <div className="flex items-center mb-2">
          <MapPin className="h-4 w-4 text-gray-500 mr-1" />
          <span className="text-gray-700">{profileUser.location || "No location set"}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          <Badge variant="outline" className="bg-love-50 text-love-700 border-love-200">
            {profileUser.gender.charAt(0).toUpperCase() + profileUser.gender.slice(1)}
          </Badge>
          {profileUser.verificationStatus === 'verified' && (
            <Badge className="bg-blue-100 text-blue-700 border-none flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>Verified</span>
            </Badge>
          )}
          {profileUser.premiumStatus !== 'basic' && (
            <Badge className="bg-gradient-to-r from-amber-300 to-yellow-600 text-white border-none">
              {profileUser.premiumStatus === 'vip' ? 'VIP' : 'Premium'}
            </Badge>
          )}
        </div>
        
        {/* Gift buttons only shown on other user's profiles */}
        {!isOwnProfile && (
          <div className="flex gap-3 mb-6">
            <Button 
              variant="outline" 
              className="flex flex-col items-center py-2 border-love-200 hover:bg-love-50"
              onClick={() => handleSendGift('rose')}
            >
              <span className="text-lg mb-1">🌹</span>
              <span className="text-xs">Rose</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center py-2 border-love-200 hover:bg-love-50"
              onClick={() => handleSendGift('heart')}
            >
              <span className="text-lg mb-1">❤️</span>
              <span className="text-xs">Heart</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center py-2 border-love-200 hover:bg-love-50"
              onClick={() => handleSendGift('teddy')}
            >
              <span className="text-lg mb-1">🧸</span>
              <span className="text-xs">Teddy</span>
            </Button>
          </div>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="profile" className="data-[state=active]:bg-love-100">
            Profile
          </TabsTrigger>
          {isOwnProfile && (
            <TabsTrigger value="blog" className="data-[state=active]:bg-love-100">
              Blog
            </TabsTrigger>
          )}
          {isOwnProfile && (
            <TabsTrigger value="monetize" className="data-[state=active]:bg-love-100">
              Monetize
            </TabsTrigger>
          )}
          {!isOwnProfile && (
            <TabsTrigger value="compatibility" className="data-[state=active]:bg-love-100">
              Compatibility
            </TabsTrigger>
          )}
          {!isOwnProfile && (
            <TabsTrigger value="gifts" className="data-[state=active]:bg-love-100">
              Gifts
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-love-500" />
                <span>About Me</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line">
                {profileUser.bio || "No bio available."}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-love-500" />
                <span>Interests</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profileUser.interests && profileUser.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profileUser.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="bg-gray-100">
                      {interest}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No interests listed.</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="h-5 w-5 text-love-500" />
                <span>Personality Traits</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profileUser.personalityTraits && profileUser.personalityTraits.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profileUser.personalityTraits.map((trait, index) => (
                    <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                      {trait}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No personality traits listed.</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Music className="h-5 w-5 text-love-500" />
                <span>Favorite Music</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profileUser.favoriteMusic && profileUser.favoriteMusic.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profileUser.favoriteMusic.map((music, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700">
                      {music}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No favorite music listed.</p>
              )}
            </CardContent>
          </Card>
          
          {isOwnProfile && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5 text-love-500" />
                  <span>Your Subscription</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">
                      {profileUser.premiumStatus === 'vip' 
                        ? 'VIP Member' 
                        : profileUser.premiumStatus === 'premium' 
                          ? 'Premium Member' 
                          : 'Basic Member'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {profileUser.premiumStatus === 'vip' 
                        ? 'All features unlocked' 
                        : profileUser.premiumStatus === 'premium' 
                          ? 'Enhanced features available' 
                          : 'Limited features'}
                    </p>
                  </div>
                  <Button className="bg-gradient-love">
                    {profileUser.premiumStatus === 'basic' ? 'Upgrade' : 'Manage'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {isOwnProfile && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gift className="h-5 w-5 text-love-500" />
                  <span>Received Gifts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <div className="text-center">
                    <div className="text-xl mb-1">🌹</div>
                    <div className="font-medium">{profileUser.receivedGifts?.rose || 0}</div>
                    <div className="text-xs text-gray-500">Roses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl mb-1">❤️</div>
                    <div className="font-medium">{profileUser.receivedGifts?.heart || 0}</div>
                    <div className="text-xs text-gray-500">Hearts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl mb-1">🧸</div>
                    <div className="font-medium">{profileUser.receivedGifts?.teddy || 0}</div>
                    <div className="text-xs text-gray-500">Teddies</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {isOwnProfile && (
          <TabsContent value="blog">
            <Blog />
          </TabsContent>
        )}
        
        {isOwnProfile && (
          <TabsContent value="monetize">
            <MonetizationPanel />
          </TabsContent>
        )}
        
        {!isOwnProfile && (
          <TabsContent value="compatibility" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-love-500" />
                  <span>Compatibility Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center flex-col">
                  <div className="w-32 h-32 rounded-full border-8 border-love-100 flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-love-600">85%</span>
                  </div>
                  <p className="text-center text-gray-700 mb-2">
                    You and {profileUser.name} are highly compatible!
                  </p>
                  <Button className="mt-2 bg-gradient-love">Send Message</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5 text-love-500" />
                  <span>Compatibility Factors</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Interests</span>
                      <span className="text-sm text-love-600">90%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-love-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Communication Style</span>
                      <span className="text-sm text-love-600">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-love-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Values</span>
                      <span className="text-sm text-love-600">80%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-love-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Lifestyle</span>
                      <span className="text-sm text-love-600">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-love-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {!isOwnProfile && (
          <TabsContent value="gifts" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gift className="h-5 w-5 text-love-500" />
                  <span>Send a Gift</span>
                </CardTitle>
                <CardDescription>
                  Show {profileUser.name} that you're interested by sending a gift
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center p-3 border rounded-lg hover:bg-love-50 cursor-pointer transition-colors">
                    <div className="text-3xl mb-2">🌹</div>
                    <div className="font-medium">Rose</div>
                    <div className="text-xs text-gray-500">$5.00</div>
                    <Button 
                      variant="outline" 
                      onClick={() => handleSendGift('rose')} 
                      className="mt-2 w-full"
                    >
                      Send
                    </Button>
                  </div>
                  
                  <div className="flex flex-col items-center p-3 border rounded-lg hover:bg-love-50 cursor-pointer transition-colors">
                    <div className="text-3xl mb-2">❤️</div>
                    <div className="font-medium">Heart</div>
                    <div className="text-xs text-gray-500">$10.00</div>
                    <Button 
                      variant="outline" 
                      onClick={() => handleSendGift('heart')} 
                      className="mt-2 w-full"
                    >
                      Send
                    </Button>
                  </div>
                  
                  <div className="flex flex-col items-center p-3 border rounded-lg hover:bg-love-50 cursor-pointer transition-colors">
                    <div className="text-3xl mb-2">🧸</div>
                    <div className="font-medium">Teddy</div>
                    <div className="text-xs text-gray-500">$20.00</div>
                    <Button 
                      variant="outline" 
                      onClick={() => handleSendGift('teddy')} 
                      className="mt-2 w-full"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </MobileContainer>
  );
};

export default Profile;
