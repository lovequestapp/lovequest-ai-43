
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProfilePosts from '@/components/ProfilePosts';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  MessageCircle, 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Music, 
  Sparkles,
  Camera,
  Users,
  X,
  Share2,
  Gift,
  Lock,
  Globe,
  BookOpen,
  Volume2,
  Pause,
  Play
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const ProfileDetails = () => {
  const { userId } = useParams<{ userId: string }>();
  const { potentialMatches, currentUser, likeUser, passUser, sendMessage } = useUser();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('about');
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const { isAuthenticated } = useProtectedRoute();
  
  // Mock posts data
  const [posts, setPosts] = useState([
    {
      id: '1',
      title: 'My hiking adventure',
      content: 'Went hiking in the mountains today. The view was absolutely breathtaking!',
      imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306',
      date: '2 days ago',
      likes: 24,
      comments: 5,
      tags: ['hiking', 'adventure', 'nature']
    },
    {
      id: '2',
      title: 'Coffee with friends',
      content: 'Had a wonderful time catching up with old friends at our favorite café. The best conversations happen over coffee!',
      imageUrl: 'https://images.unsplash.com/photo-1517231925375-bf2cb42917a5',
      date: '1 week ago',
      likes: 31,
      comments: 8,
      tags: ['friends', 'coffee', 'weekend']
    }
  ]);
  
  useEffect(() => {
    if (!userId) return;
    
    // Find the user profile from potentialMatches or elsewhere
    const foundProfile = potentialMatches.find(match => match.id === userId);
    
    if (foundProfile) {
      setProfile(foundProfile);
    } else {
      toast.error("Profile not found");
      navigate('/discover');
    }
  }, [userId, potentialMatches, navigate]);
  
  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-16 w-16 bg-love-200 rounded-full mb-4"></div>
            <div className="h-5 w-48 bg-love-100 rounded mb-3"></div>
            <div className="h-4 w-32 bg-love-50 rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const handleLike = () => {
    likeUser(profile.id);
    toast.success(`You liked ${profile.name}!`);
    navigate('/discover');
  };
  
  const handlePass = () => {
    passUser(profile.id);
    toast.message(`You passed on ${profile.name}`);
    navigate('/discover');
  };
  
  const handleMessage = () => {
    navigate(`/messages/${profile.id}`);
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const toggleVoicePlay = () => {
    setIsPlayingVoice(!isPlayingVoice);
    if (!isPlayingVoice) {
      toast.success(`Playing ${profile.name}'s voice introduction`);
      // Simulate voice playback
      setTimeout(() => setIsPlayingVoice(false), 5000);
    }
  };
  
  // Ensure profile has photos
  const photos = profile.photos && profile.photos.length ? profile.photos : ['https://via.placeholder.com/400x600?text=No+Photo'];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <motion.main 
        className="flex-grow container mx-auto px-4 py-8 pb-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2 hover:bg-love-50"
          onClick={handleBack}
        >
          <ArrowLeft size={16} />
          <span>Back to Discover</span>
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - Photos */}
          <div className="md:col-span-2 space-y-6">
            <motion.div 
              className="relative rounded-xl overflow-hidden bg-black aspect-[4/3] group"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <img 
                src={photos[activePhotoIndex]} 
                alt={`${profile.name}'s photo ${activePhotoIndex + 1}`} 
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
              />
              
              {photos.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {photos.map((photo: string, index: number) => (
                    <button 
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === activePhotoIndex 
                          ? "bg-white w-4" 
                          : "bg-white/50"
                      }`}
                      onClick={() => setActivePhotoIndex(index)}
                      aria-label={`View photo ${index + 1}`}
                    />
                  ))}
                </div>
              )}
              
              <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <div className="flex items-center gap-1.5">
                  <Camera size={14} className="text-white" />
                  <span className="text-white text-sm font-medium">
                    {activePhotoIndex + 1}/{photos.length}
                  </span>
                </div>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-6 gap-2">
              {photos.map((photo: string, index: number) => (
                <motion.div 
                  key={index}
                  className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${
                    index === activePhotoIndex 
                      ? "ring-2 ring-love-500 ring-offset-2" 
                      : "opacity-80 hover:opacity-100"
                  }`}
                  onClick={() => setActivePhotoIndex(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img 
                    src={photo} 
                    alt={`${profile.name} thumbnail ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="interests">Interests</TabsTrigger>
                <TabsTrigger value="posts">Posts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">About {profile.name}</h3>
                    <p className="text-gray-700 whitespace-pre-line">{profile.bio}</p>
                    
                    {/* Voice Introduction */}
                    <div className="mt-6 p-3 bg-love-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Volume2 size={18} className="text-love-700" />
                        <span className="text-love-700 font-medium">Voice Introduction</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`rounded-full h-8 w-8 p-0 ${isPlayingVoice ? 'bg-love-100 text-love-700' : ''}`}
                        onClick={toggleVoicePlay}
                      >
                        {isPlayingVoice ? <Pause size={16} /> : <Play size={16} />}
                      </Button>
                    </div>
                    
                    {profile.favoriteMusic && profile.favoriteMusic.length > 0 && (
                      <div className="flex items-center gap-2 mt-4 text-love-700">
                        <Music size={18} />
                        <span>Favorite music: {profile.favoriteMusic.join(', ')}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {profile.personalityTraits && profile.personalityTraits.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Personality</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.personalityTraits.map((trait: string, index: number) => (
                          <Badge 
                            key={index} 
                            className="bg-love-500"
                          >
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="interests">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest: string, index: number) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="bg-love-50 text-love-700 py-1.5 px-3"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="posts">
                <Card>
                  <CardContent className="p-6">
                    <ProfilePosts userId={profile.id} posts={posts} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right column - Profile info and actions */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h2 className="text-3xl font-display font-bold">
                    {profile.name}, {profile.age}
                  </h2>
                  
                  <div className="flex items-center text-muted-foreground mt-1">
                    <MapPin size={16} className="mr-1 text-love-400" />
                    <span>{profile.location}</span>
                  </div>
                </div>
                
                {profile.compatibilityScore && (
                  <div className="bg-love-50 p-4 rounded-lg mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={18} className="text-love-500" />
                      <span className="font-medium text-love-700">Compatibility Score</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-love-400 to-love-600 h-2.5 rounded-full" 
                        style={{ width: `${profile.compatibilityScore}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 text-right text-sm text-love-700 font-medium">
                      {profile.compatibilityScore}%
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center gap-4 mt-6">
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-300 hover:border-gray-400 flex items-center justify-center gap-2"
                    onClick={handlePass}
                  >
                    <X size={18} className="text-gray-500" />
                    <span>Pass</span>
                  </Button>
                  
                  <Button 
                    className="w-full bg-gradient-love hover:opacity-90 flex items-center justify-center gap-2"
                    onClick={handleLike}
                  >
                    <Heart size={18} />
                    <span>Like</span>
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Button 
                    variant="outline"
                    className="border-love-200 text-love-700 hover:bg-love-50 flex items-center justify-center gap-2"
                    onClick={handleMessage}
                  >
                    <MessageCircle size={18} />
                    <span>Message</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="border-amber-200 text-amber-700 hover:bg-amber-50 flex items-center justify-center gap-2"
                  >
                    <Gift size={18} />
                    <span>Send Gift</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {profile.gender || profile.interestedIn ? (
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Basic Info</h3>
                  <div className="space-y-3">
                    {profile.gender && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gender</span>
                        <span className="font-medium">{profile.gender}</span>
                      </div>
                    )}
                    
                    {profile.interestedIn && profile.interestedIn.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Interested in</span>
                        <div className="flex items-center gap-1">
                          <Users size={14} className="text-love-400" />
                          <span className="font-medium">{profile.interestedIn.join(', ')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : null}
            
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Share Profile</h3>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2 hover:bg-love-50"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Profile link copied to clipboard");
                  }}
                >
                  <Share2 size={18} className="text-love-500" />
                  <span>Copy Profile Link</span>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">More Options</h3>
                <div className="space-y-3">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-gray-700"
                  >
                    <Lock size={16} className="mr-2 text-gray-500" />
                    <span>Block Profile</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-gray-700"
                  >
                    <Globe size={16} className="mr-2 text-gray-500" />
                    <span>Translate Profile</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-gray-700"
                  >
                    <BookOpen size={16} className="mr-2 text-gray-500" />
                    <span>View Match History</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.main>
      
      <Footer className="mt-auto" />
    </div>
  );
};

export default ProfileDetails;
