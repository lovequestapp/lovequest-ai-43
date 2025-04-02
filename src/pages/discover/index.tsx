
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
import { toast } from 'sonner';
import { User, UserWithCoordinates } from '@/types/user';
import useMatchProcessing from './hooks/useMatchProcessing';
import ProfileCard from '@/components/ProfileCard';
import DiscoverFilters from './DiscoverFilters';
import { MapPin, Sparkles, Search, Filter, Loader2 } from 'lucide-react';

const Discover = () => {
  const { currentUser, allUsers } = useUser();
  const [activeTab, setActiveTab] = useState('recommended');
  const [location, setLocation] = useState('Determining location...');
  const [searchTerm, setSearchTerm] = useState('');
  const [profiles, setProfiles] = useState<UserWithCoordinates[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const { filteredUsers, applyFilters, setMaxDistance, setAgeRange, setVerifiedOnly, setSortBy, boostProfile } = useMatchProcessing(
    allUsers as UserWithCoordinates[],
    currentUser
  );
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userCoordinates, setUserCoordinates] = useState<{latitude: number, longitude: number} | null>(null);

  // Get user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // Success handler
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserCoordinates(coords);
          
          // Attempt to get location name via reverse geocoding
          fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.longitude},${coords.latitude}.json?access_token=${localStorage.getItem('mapbox_token') || ''}`)
            .then(response => response.json())
            .then(data => {
              if (data.features && data.features.length > 0) {
                // Extract city and country
                const placeName = data.features[0].place_name;
                setLocation(placeName);
              }
            })
            .catch(err => {
              console.error("Error getting location name:", err);
            })
            .finally(() => {
              setLoadingLocation(false);
            });
        },
        // Error handler
        (error) => {
          console.error("Error getting location:", error);
          setLocation("Location unavailable");
          setLoadingLocation(false);
          toast.error("Couldn't get your location", {
            description: "Location services may be disabled."
          });
        },
        // Options
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setLocation("Geolocation not supported");
      setLoadingLocation(false);
      toast.error("Geolocation is not supported by your browser");
    }
  }, []);

  useEffect(() => {
    if (allUsers && currentUser && userCoordinates) {
      setIsLoading(true);
      try {
        // Add real coordinates to users
        const usersWithCoordinates = allUsers.map(user => {
          // For current user, use actual coordinates
          if (user.id === currentUser.id && userCoordinates) {
            return {
              ...user,
              coordinates: userCoordinates
            };
          }
          
          // For demo users, generate realistic coordinates near the user
          // This simulates users being at various distances
          const randomDistance = Math.random() * 50; // Random distance up to 50 miles
          const randomAngle = Math.random() * 2 * Math.PI; // Random angle in radians
          
          // Approximate 1 degree of latitude = 69 miles, 1 degree longitude = 55 miles at 40° latitude
          const latOffset = (randomDistance * Math.cos(randomAngle)) / 69;
          const lngOffset = (randomDistance * Math.sin(randomAngle)) / 55;
          
          return {
            ...user,
            coordinates: {
              latitude: userCoordinates.latitude + latOffset,
              longitude: userCoordinates.longitude + lngOffset,
            }
          };
        }) as UserWithCoordinates[];
        
        setProfiles(usersWithCoordinates);
      } catch (err) {
        setError('Failed to load profiles');
        toast.error('Failed to load profiles');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [allUsers, currentUser, userCoordinates]);

  useEffect(() => {
    if (profiles.length > 0) {
      setIsLoading(true);
      try {
        applyFilters();
      } catch (err) {
        setError('Failed to apply filters');
        toast.error('Failed to apply filters');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [applyFilters, profiles]);

  const handleBoostProfile = (userId: string) => {
    try {
      boostProfile(userId, 'local');
      toast.success("Profile Boosted!", {
        description: "Your profile is now boosted locally!",
      });
    } catch (err) {
      toast.error("Failed to boost profile");
      console.error(err);
    }
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
                <span className="hidden sm:inline">
                  {loadingLocation ? (
                    <span className="flex items-center gap-1">
                      <Loader2 size={12} className="animate-spin" />
                      Locating...
                    </span>
                  ) : (
                    location
                  )}
                </span>
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
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading profiles...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-500">
                  <p>{error}</p>
                  <Button 
                    variant="outline" 
                    onClick={() => applyFilters()} 
                    className="mt-4"
                  >
                    Retry
                  </Button>
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUsers.map((profile) => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      currentUser={currentUser}
                      showActions={true}
                      onBoost={() => handleBoostProfile(profile.id)}
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
