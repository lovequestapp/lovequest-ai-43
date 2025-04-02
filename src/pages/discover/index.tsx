import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner'; // Added missing import
import { User, UserWithCoordinates } from '@/types/user';
import useMatchProcessing from './hooks/useMatchProcessing';
import ProfileCard from '@/components/ProfileCard';
import DiscoverFilters from './DiscoverFilters';
import { MapPin, Sparkles, Search, Filter } from 'lucide-react';

const Discover = () => {
  const { currentUser, allUsers } = useUser();
  const [activeTab, setActiveTab] = useState('recommended');
  const [location, setLocation] = useState('New York, USA');
  const [searchTerm, setSearchTerm] = useState('');
  const [profiles, setProfiles] = useState<UserWithCoordinates[]>([]);
  const { filteredUsers, applyFilters, setMaxDistance, setAgeRange, setVerifiedOnly, setSortBy, boostProfile } = useMatchProcessing(
    allUsers as UserWithCoordinates[],
    currentUser
  );
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (allUsers && currentUser) {
      // Mock setting coordinates for all users
      const usersWithCoordinates = allUsers.map(user => ({
        ...user,
        coordinates: {
          latitude: 40.7128, // Example latitude for New York
          longitude: -74.0060, // Example longitude for New York
        }
      })) as UserWithCoordinates[];
      setProfiles(usersWithCoordinates);
    }
  }, [allUsers, currentUser]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleBoostProfile = (userId: string, level: 'local' | 'international') => {
    boostProfile(userId, level);
    toast({
      title: "Profile Boosted!",
      description: `Your profile is now boosted ${level}ly!`,
    });
  };

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold tracking-tight">Discover</h1>
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
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <MapPin size={16} />
                <span className="hidden sm:inline">{location || 'All Regions'}</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Sparkles size={16} />
            <span>Find new connections based on your preferences and interests</span>
          </div>

          <Tabs defaultValue="recommended" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="recommended" className="flex gap-1">
                <Sparkles size={16} className="text-amber-500" />
                <span>Recommended</span>
              </TabsTrigger>
              <TabsTrigger value="nearby" className="flex gap-1">
                <MapPin size={16} className="text-blue-500" />
                <span>Nearby</span>
              </TabsTrigger>
              <TabsTrigger value="search" className="flex gap-1">
                <Search size={16} className="text-gray-500" />
                <span>Search</span>
              </TabsTrigger>
            </TabsList>

            {showFilters && (
              <DiscoverFilters
                preferences={{}}
                onPreferencesChange={(newPreferences) => {
                  setMaxDistance(newPreferences.maxDistance);
                  if (newPreferences.ageRange) {
                    setAgeRange([newPreferences.ageRange.min, newPreferences.ageRange.max]);
                  }
                  if (newPreferences.notificationsEnabled !== undefined) {
                    setVerifiedOnly(newPreferences.notificationsEnabled);
                  }
                }}
                onApplyFilters={applyFilters}
                className="mb-6 animate-in fade-in slide-in-from-top-4 duration-300"
              />
            )}

            <TabsContent value="recommended" className="space-y-4">
              {filteredUsers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUsers.map((profile) => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      onBoost={() => handleBoostProfile(profile.id, 'local')}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No profiles found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your filters or expanding your search criteria</p>
                  <Button onClick={() => {
                    setMaxDistance(undefined);
                    setAgeRange(undefined);
                    setVerifiedOnly(false);
                    applyFilters();
                  }}>
                    Reset Filters
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="nearby" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile) => (
                  <Card key={profile.id}>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold">{profile.name}</h3>
                      <p className="text-sm text-muted-foreground">{profile.location}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="search" className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Input
                  type="text"
                  placeholder="Search profiles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button>Search</Button>
              </div>
              <Separator />
              {profiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profiles.map((profile) => (
                    <Card key={profile.id}>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold">{profile.name}</h3>
                        <p className="text-sm text-muted-foreground">{profile.location}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No profiles found</h3>
                  <p className="text-muted-foreground">Please try a different search term.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Discover;
