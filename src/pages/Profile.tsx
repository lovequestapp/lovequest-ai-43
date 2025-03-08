
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GiftShop from '@/components/GiftShop';
import Monetization from '@/components/Monetization';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, MapPin, Edit2, Plus, X, Heart, Gift, ShoppingCart, Sparkles, Timer, Star, Coins } from 'lucide-react';

const Profile = () => {
  const { currentUser, updateUserProfile, getGiftBenefits } = useUser();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(currentUser);
  const [newInterest, setNewInterest] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  
  if (!currentUser || !profile) {
    return null;
  }
  
  const handleSave = () => {
    if (profile) {
      updateUserProfile(profile);
      setEditing(false);
    }
  };
  
  const handleCancel = () => {
    setProfile(currentUser);
    setEditing(false);
  };
  
  const handleAddInterest = () => {
    if (newInterest.trim() && profile) {
      setProfile({
        ...profile,
        interests: [...profile.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };
  
  const handleRemoveInterest = (index: number) => {
    if (profile) {
      const newInterests = [...profile.interests];
      newInterests.splice(index, 1);
      setProfile({
        ...profile,
        interests: newInterests
      });
    }
  };

  const giftInventory = currentUser.giftInventory || { 'rose': 0, 'heart': 0, 'teddy': 0 };
  const receivedGifts = currentUser.receivedGifts || { rose: 0, heart: 0, teddy: 0 };
  const benefits = getGiftBenefits();
  
  React.useEffect(() => {
    if (window.location.hash === '#shop') {
      setActiveTab('shop');
    } else if (window.location.hash === '#monetize') {
      setActiveTab('monetize');
    }
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-display font-bold">My Profile</h1>
          
          {activeTab === 'profile' && !editing ? (
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setEditing(true)}
            >
              <Edit2 size={16} />
              <span>Edit Profile</span>
            </Button>
          ) : activeTab === 'profile' ? (
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button 
                className="bg-gradient-love hover:opacity-90"
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </div>
          ) : null}
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="shop">Gift Shop</TabsTrigger>
            <TabsTrigger value="monetize" className="flex items-center gap-1">
              <Coins size={16} />
              <span>Monetize</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 rounded-full bg-love-100 flex items-center justify-center mb-4">
                        {profile.photos && profile.photos.length > 0 ? (
                          <img 
                            src={profile.photos[0]} 
                            alt={profile.name} 
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User size={48} className="text-love-500" />
                        )}
                      </div>
                      
                      {editing ? (
                        <Input
                          value={profile.name}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                          className="text-center font-semibold text-xl mb-1"
                        />
                      ) : (
                        <h2 className="font-semibold text-xl mb-1">{profile.name}</h2>
                      )}
                      
                      <div className="flex items-center text-muted-foreground mb-4">
                        <MapPin size={16} className="mr-1" />
                        {editing ? (
                          <Input
                            value={profile.location}
                            onChange={(e) => setProfile({...profile, location: e.target.value})}
                            className="text-sm"
                          />
                        ) : (
                          <span>{profile.location}</span>
                        )}
                      </div>
                      
                      {editing ? (
                        <Button variant="outline" className="w-full">
                          Upload New Photo
                        </Button>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
                
                {!editing && (
                  <>
                    <Card className="mt-4">
                      <CardHeader>
                        <h3 className="text-lg font-semibold">Gift Benefits</h3>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Sparkles className="text-amber-500 mr-2" />
                              <span>Popularity Points</span>
                            </div>
                            <Badge variant="outline" className="bg-love-50 text-love-700">
                              {benefits.popularityPoints}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Star className="text-purple-500 mr-2" />
                              <span>Premium Likes</span>
                            </div>
                            <Badge variant="outline" className="bg-love-50 text-love-700">
                              {benefits.premiumLikes}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Timer className="text-blue-500 mr-2" />
                              <span>Profile Boost</span>
                            </div>
                            {benefits.profileBoost ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                Active {benefits.boostTimeRemaining ? `(${benefits.boostTimeRemaining})` : ''}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-100 text-gray-500">
                                Inactive
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="mt-4">
                      <CardHeader>
                        <h3 className="text-lg font-semibold">My Gift Inventory</h3>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Heart className="text-rose-500 mr-2" />
                              <span>Roses</span>
                            </div>
                            <Badge variant="outline">{giftInventory.rose || 0}</Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Heart className="text-red-500 fill-red-500 mr-2" />
                              <span>Hearts</span>
                            </div>
                            <Badge variant="outline">{giftInventory.heart || 0}</Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Gift className="text-amber-700 mr-2" />
                              <span>Teddy Bears</span>
                            </div>
                            <Badge variant="outline">{giftInventory.teddy || 0}</Badge>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="text-sm font-medium mb-2">Gifts Received:</h4>
                          <div className="flex justify-between">
                            <span>Roses</span>
                            <Badge variant="outline" className="bg-love-50 text-love-700">{receivedGifts.rose}</Badge>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span>Hearts</span>
                            <Badge variant="outline" className="bg-love-50 text-love-700">{receivedGifts.heart}</Badge>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span>Teddy Bears</span>
                            <Badge variant="outline" className="bg-love-50 text-love-700">{receivedGifts.teddy}</Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <Button 
                            onClick={() => setActiveTab('shop')} 
                            variant="outline" 
                            className="border-love-200 text-love-600"
                          >
                            <ShoppingCart size={16} className="mr-2" />
                            Go to Shop
                          </Button>
                          
                          <Button 
                            onClick={() => setActiveTab('monetize')} 
                            variant="outline" 
                            className="border-purple-200 text-purple-600"
                          >
                            <Coins size={16} className="mr-2" />
                            Monetize
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
              
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold">About Me</h3>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      {editing ? (
                        <Textarea
                          id="bio"
                          value={profile.bio}
                          onChange={(e) => setProfile({...profile, bio: e.target.value})}
                          className="mt-2"
                          rows={5}
                        />
                      ) : (
                        <p className="mt-2 text-gray-700">{profile.bio}</p>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label className="mb-2 block">Interests</Label>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {profile.interests.map((interest, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="bg-love-50 text-love-700 hover:bg-love-100 py-1.5 px-3"
                          >
                            {interest}
                            {editing && (
                              <button 
                                className="ml-2 text-love-500 hover:text-love-700"
                                onClick={() => handleRemoveInterest(index)}
                              >
                                <X size={14} />
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                      
                      {editing && (
                        <div className="flex gap-2">
                          <Input
                            value={newInterest}
                            onChange={(e) => setNewInterest(e.target.value)}
                            placeholder="Add new interest"
                          />
                          <Button 
                            variant="outline" 
                            onClick={handleAddInterest}
                            disabled={!newInterest.trim()}
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label htmlFor="age">Age</Label>
                      {editing ? (
                        <Input
                          id="age"
                          type="number"
                          value={profile.age}
                          onChange={(e) => setProfile({...profile, age: parseInt(e.target.value) || profile.age})}
                          className="mt-2 max-w-xs"
                        />
                      ) : (
                        <p className="mt-2 text-gray-700">{profile.age}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="shop">
            <GiftShop />
          </TabsContent>
          
          <TabsContent value="monetize">
            <Monetization />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
