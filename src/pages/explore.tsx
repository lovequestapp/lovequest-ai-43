
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUser } from '@/context/UserContext';
import { Layout } from '@/components/layout';
import { Separator } from '@/components/ui/separator';
import { Heart, X, Filter, MapPin, Sparkles, Users, MessageCircle } from 'lucide-react';
import ProfileCard from '@/components/ProfileCard';
import { User } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';

const ExplorePage = () => {
  const { currentUser, getCompatibilityScore, likeProfile, passProfile } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [profiles, setProfiles] = useState<User[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'matches' | 'likes'>('all');
  
  // Filter states
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 70]);
  const [distance, setDistance] = useState<number>(50);
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [activeRegion, setActiveRegion] = useState('');
  
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!currentUser) return;
      
      setIsLoading(true);
      try {
        // Simulate fetching profiles from the database
        // In a real implementation, this would be a database query with filters
        
        // For now, we'll generate some mock profiles
        const mockProfiles = generateMockProfiles(20, currentUser);
        setProfiles(mockProfiles);
        applyFilters(mockProfiles);
        
        // Get user's region based on IP (simplified demo version)
        try {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          setActiveRegion(data.city || data.region || data.country_name || 'Your Region');
        } catch (error) {
          console.error('Error detecting location:', error);
          setActiveRegion('Your Region');
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
        toast({
          title: "Error",
          description: "Failed to load profiles. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfiles();
  }, [currentUser]);
  
  const applyFilters = (profilesData: User[] = profiles) => {
    if (!currentUser) return;
    
    let filtered = [...profilesData];
    
    // Filter by interested gender (if user has preferences)
    if (currentUser.interestedIn && currentUser.interestedIn.length > 0) {
      filtered = filtered.filter(profile => 
        currentUser.interestedIn.includes(profile.gender)
      );
    }
    
    // Filter by age range
    filtered = filtered.filter(profile => 
      profile.age >= ageRange[0] && profile.age <= ageRange[1]
    );
    
    // Filter by search query (name, location, bio, interests)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(profile => 
        profile.name.toLowerCase().includes(query) ||
        profile.location.toLowerCase().includes(query) ||
        profile.bio.toLowerCase().includes(query) ||
        profile.interests.some(interest => interest.toLowerCase().includes(query))
      );
    }
    
    // Filter by verification status if enabled
    if (onlyVerified) {
      filtered = filtered.filter(profile => profile.verificationStatus === 'verified');
    }
    
    // Filter by tab
    if (activeTab === 'matches') {
      // In a real app, you would fetch this from the database
      filtered = filtered.filter(profile => 
        getCompatibilityScore(currentUser, profile) > 75
      );
    } else if (activeTab === 'likes') {
      // In a real app, you would fetch profiles that the user has liked
      filtered = filtered.filter(profile => 
        Math.random() > 0.7 // Simulating some likes for demo purposes
      );
    }
    
    setFilteredProfiles(filtered);
  };
  
  const handleLike = (profileId: string) => {
    likeProfile(profileId);
    toast({
      title: "Liked!",
      description: "You've liked this profile",
    });
    
    // For demo purposes, show a match notification randomly
    if (Math.random() > 0.7) {
      const matchedProfile = profiles.find(p => p.id === profileId);
      if (matchedProfile) {
        toast({
          title: "It's a Match! 💕",
          description: `You and ${matchedProfile.name} like each other!`,
          action: (
            <Button 
              onClick={() => navigate(`/messages/${profileId}`)}
              variant="outline" 
              className="bg-white text-love-600"
            >
              Message
            </Button>
          ),
          duration: 5000,
        });
      }
    }
  };
  
  const handlePass = (profileId: string) => {
    passProfile(profileId);
    // Optionally remove from the view
    setFilteredProfiles(prev => prev.filter(profile => profile.id !== profileId));
  };
  
  const generateMockProfiles = (count: number, user: User): User[] => {
    const genders = ['male', 'female', 'non-binary'] as const;
    const verificationStatuses = ['verified', 'unverified', 'pending'] as const;
    const premiumStatuses = ['basic', 'premium', 'vip'] as const;
    
    const locations = [
      'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
      'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA'
    ];
    
    const interests = [
      'Travel', 'Cooking', 'Reading', 'Movies', 'Music', 'Sports', 'Hiking',
      'Photography', 'Art', 'Gaming', 'Dancing', 'Yoga', 'Meditation', 'Fitness'
    ];
    
    const traits = [
      'Kind', 'Funny', 'Intelligent', 'Creative', 'Adventurous', 'Loyal',
      'Honest', 'Ambitious', 'Romantic', 'Generous', 'Patient', 'Passionate'
    ];
    
    const maleImages = [
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&q=80',
      'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80'
    ];
    
    const femaleImages = [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80'
    ];
    
    const nonBinaryImages = [
      'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
      'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=400&q=80'
    ];
    
    const maleNames = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph'];
    const femaleNames = ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Susan', 'Jessica', 'Sarah'];
    const nonBinaryNames = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Riley', 'Avery', 'Quinn', 'Dakota'];
    
    // Generate random profiles based on preferred genders of the current user
    const mockProfiles: User[] = [];
    
    for (let i = 0; i < count; i++) {
      // Determine gender for this profile based on user's preferences if available
      let gender: 'male' | 'female' | 'non-binary';
      
      if (user.interestedIn && user.interestedIn.length > 0) {
        gender = user.interestedIn[Math.floor(Math.random() * user.interestedIn.length)];
      } else {
        gender = genders[Math.floor(Math.random() * genders.length)];
      }
      
      // Get appropriate name and photo based on gender
      let name: string;
      let photos: string[];
      
      if (gender === 'male') {
        name = maleNames[Math.floor(Math.random() * maleNames.length)];
        photos = [maleImages[Math.floor(Math.random() * maleImages.length)]];
      } else if (gender === 'female') {
        name = femaleNames[Math.floor(Math.random() * femaleNames.length)];
        photos = [femaleImages[Math.floor(Math.random() * femaleImages.length)]];
      } else {
        name = nonBinaryNames[Math.floor(Math.random() * nonBinaryNames.length)];
        photos = [nonBinaryImages[Math.floor(Math.random() * nonBinaryImages.length)]];
      }
      
      // Generate random interests (3-5 items)
      const profileInterests: string[] = [];
      const interestCount = Math.floor(Math.random() * 3) + 3;
      
      for (let j = 0; j < interestCount; j++) {
        const randomInterest = interests[Math.floor(Math.random() * interests.length)];
        if (!profileInterests.includes(randomInterest)) {
          profileInterests.push(randomInterest);
        }
      }
      
      // Generate random personality traits (2-4 items)
      const personalityTraits: string[] = [];
      const traitCount = Math.floor(Math.random() * 3) + 2;
      
      for (let j = 0; j < traitCount; j++) {
        const randomTrait = traits[Math.floor(Math.random() * traits.length)];
        if (!personalityTraits.includes(randomTrait)) {
          personalityTraits.push(randomTrait);
        }
      }
      
      // Calculate a "compatibility score" based on shared interests and other factors
      // In a real app, this would be calculated using an algorithm
      
      mockProfiles.push({
        id: `mock-${i}`,
        name,
        email: `${name.toLowerCase()}@example.com`,
        age: Math.floor(Math.random() * 25) + 21, // Age between 21-45
        bio: `Hi, I'm ${name}! I enjoy ${profileInterests.slice(0, 2).join(' and ')}. Looking for someone who values ${personalityTraits[0].toLowerCase()} and ${personalityTraits[1]?.toLowerCase() || 'honesty'}.`,
        location: locations[Math.floor(Math.random() * locations.length)],
        interests: profileInterests,
        photos,
        gender,
        interestedIn: [user.gender],
        popularityPoints: Math.floor(Math.random() * 500) + 100,
        premiumStatus: premiumStatuses[Math.floor(Math.random() * premiumStatuses.length)],
        giftInventory: { rose: 0, heart: 0, teddy: 0 },
        receivedGifts: { rose: 0, heart: 0, teddy: 0 },
        compatibilityScore: 0, // Will be calculated later
        personalityTraits,
        role: 'subscriber',
        isBanned: false,
        verificationStatus: verificationStatuses[Math.floor(Math.random() * verificationStatuses.length)],
      });
    }
    
    // Calculate and set compatibility scores
    mockProfiles.forEach(profile => {
      profile.compatibilityScore = getCompatibilityScore(user, profile);
    });
    
    return mockProfiles;
  };
  
  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold tracking-tight">Explore</h1>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowFilters(!showFilters)} 
                className="flex items-center gap-1"
              >
                <Filter size={16} />
                <span className="hidden sm:inline">Filters</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 text-love-500"
              >
                <MapPin size={16} />
                <span className="hidden sm:inline">{activeRegion || 'All Regions'}</span>
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Users size={16} />
            <span>Browse profiles in your area and find your perfect match</span>
          </div>
          
          <Tabs 
            defaultValue="all" 
            value={activeTab} 
            onValueChange={(value) => {
              setActiveTab(value as 'all' | 'matches' | 'likes');
              applyFilters();
            }}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="all" className="flex gap-1">
                <span>All Profiles</span>
              </TabsTrigger>
              <TabsTrigger value="matches" className="flex gap-1">
                <Sparkles size={16} className="text-amber-500" />
                <span>Matches</span>
              </TabsTrigger>
              <TabsTrigger value="likes" className="flex gap-1">
                <Heart size={16} className="text-love-500" />
                <span>Likes</span>
              </TabsTrigger>
            </TabsList>
            
            {showFilters && (
              <Card className="mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="search">Search Profiles</Label>
                      <Input
                        id="search"
                        placeholder="Name, location, interests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label>Age Range: {ageRange[0]} - {ageRange[1]}</Label>
                      <Slider
                        defaultValue={[18, 70]}
                        min={18}
                        max={80}
                        step={1}
                        value={ageRange}
                        onValueChange={(value) => setAgeRange(value as [number, number])}
                        className="mt-4"
                      />
                    </div>
                    
                    <div>
                      <Label>Maximum Distance: {distance} miles</Label>
                      <Slider
                        defaultValue={[50]}
                        min={5}
                        max={100}
                        step={5}
                        value={[distance]}
                        onValueChange={(value) => setDistance(value[0])}
                        className="mt-4"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="verified"
                        checked={onlyVerified}
                        onCheckedChange={setOnlyVerified}
                      />
                      <Label htmlFor="verified">Verified Profiles Only</Label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button 
                      onClick={() => {
                        applyFilters();
                        setShowFilters(false);
                      }}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <TabsContent value="all" className="space-y-4">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="h-80 animate-pulse bg-muted"></Card>
                  ))}
                </div>
              ) : filteredProfiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProfiles.map((profile) => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      onLike={() => handleLike(profile.id)}
                      onPass={() => handlePass(profile.id)}
                      showActions
                      currentUser={currentUser}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No profiles found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your filters or expanding your search criteria</p>
                  <Button onClick={() => {
                    setAgeRange([18, 70]);
                    setDistance(50);
                    setSearchQuery('');
                    setOnlyVerified(false);
                    applyFilters();
                  }}>
                    Reset Filters
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="matches" className="space-y-4">
              {filteredProfiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProfiles.map((profile) => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      onLike={() => handleLike(profile.id)}
                      onPass={() => handlePass(profile.id)}
                      showActions
                      currentUser={currentUser}
                      isMatch
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No matches yet</h3>
                  <p className="text-muted-foreground mb-4">Keep exploring profiles to find your perfect match!</p>
                  <div className="flex justify-center">
                    <Button 
                      onClick={() => setActiveTab('all')}
                      className="bg-gradient-love hover:opacity-90"
                    >
                      Explore Profiles
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="likes" className="space-y-4">
              {filteredProfiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProfiles.map((profile) => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      onLike={() => handleLike(profile.id)}
                      onPass={() => handlePass(profile.id)}
                      showActions
                      currentUser={currentUser}
                      alreadyLiked
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No likes yet</h3>
                  <p className="text-muted-foreground mb-4">Keep exploring to find profiles you like!</p>
                  <div className="flex justify-center">
                    <Button 
                      onClick={() => setActiveTab('all')}
                      className="bg-gradient-love hover:opacity-90"
                    >
                      Explore Profiles
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {!isLoading && filteredProfiles.length > 0 && (
            <div className="flex justify-center mt-8">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => {
                  // In a real app, load more profiles
                  setIsLoading(true);
                  setTimeout(() => {
                    const newProfiles = generateMockProfiles(6, currentUser!);
                    setProfiles(prev => [...prev, ...newProfiles]);
                    applyFilters([...profiles, ...newProfiles]);
                    setIsLoading(false);
                  }, 1500);
                }}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? "Loading..." : "Load More Profiles"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ExplorePage;
