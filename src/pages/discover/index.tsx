
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';
import { UserWithCoordinates } from '@/types/user';
import useMatchProcessing from './hooks/useMatchProcessing';
import { Filter, MapPin, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DiscoverFilters from './DiscoverFilters';
import NoMatchesCard from './NoMatchesCard';
import DiscoverContent from './DiscoverContent';
import MobileFilterDisclosure from '@/components/discover/MobileFilterDisclosure';
import useLocationCache from '@/hooks/useLocationCache';
import { ModerationProvider } from '@/contexts/ModerationContext';

const Discover = () => {
  const { currentUser, allUsers, likeUser, passUser } = useUser();
  const [activeTab, setActiveTab] = useState('recommended');
  const [location, setLocation] = useState('Determining location...');
  const [profiles, setProfiles] = useState<UserWithCoordinates[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const { filteredUsers, applyFilters, setMaxDistance, setAgeRange, setVerifiedOnly, setSortBy } = useMatchProcessing(
    allUsers as UserWithCoordinates[],
    currentUser
  );
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userCoordinates, setUserCoordinates] = useState<{latitude: number, longitude: number} | null>(null);

  const { cachedLocation, cacheLocation } = useLocationCache();

  useEffect(() => {
    if (cachedLocation) {
      setLocation(cachedLocation);
      setLoadingLocation(false);
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserCoordinates(coords);

          fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.longitude},${coords.latitude}.json?access_token=${localStorage.getItem('mapbox_token') || ''}`)
            .then(response => response.json())
            .then(data => {
              if (data.features && data.features.length > 0) {
                const placeName = data.features[0].place_name;
                setLocation(placeName);
                cacheLocation(placeName);
              } else {
                // Fallback to approximate location string if no feature returned
                setLocation('Nearby');
              }
            })
            .catch(() => {
              setLocation('Nearby');
            })
            .finally(() => {
              setLoadingLocation(false);
            });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocation("Location unavailable");
          setLoadingLocation(false);
          toast.error("Couldn't get your location: Location services may be disabled.");
        },
        { enableHighAccuracy: false, timeout: 7000, maximumAge: 5 * 60 * 1000 }
      );
    } else {
      setLocation("Geolocation not supported");
      setLoadingLocation(false);
      toast.error("Geolocation is not supported by your browser");
    }
  }, [cachedLocation, cacheLocation]);

  useEffect(() => {
    if (allUsers && currentUser && userCoordinates) {
      setIsLoading(true);
      try {
        const usersWithCoordinates = allUsers.map(user => {
          if (user.id === currentUser.id && userCoordinates) {
            return {
              ...user,
              coordinates: userCoordinates
            };
          }
          
          const randomDistance = Math.random() * 50;
          const randomAngle = Math.random() * 2 * Math.PI;
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

  const handleSwipe = (profileId: string, direction: 'left' | 'right') => {
    if (direction === 'right') {
      likeUser(profileId);
      toast.success("You liked this profile!");
      
      if (Math.random() > 0.7) {
        const matchedProfile = filteredUsers.find(p => p.id === profileId);
        if (matchedProfile) {
          toast("It's a match! 💕", {
            description: `You and ${matchedProfile.name} like each other!`,
            duration: 5000,
          });
        }
      }
    } else {
      passUser(profileId);
    }

    setTimeout(() => {
      applyFilters();
    }, 300);
  };

  return (
    <ModerationProvider>
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
                  className="hidden sm:flex items-center gap-1"
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

            {/* Mobile filter progressive disclosure */}
            <MobileFilterDisclosure
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
            />

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
                  className="mb-6 animate-in fade-in slide-in-from-top-4 duration-300 hidden sm:block"
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
                ) : (
                  <div className="flex justify-center">
                    <DiscoverContent 
                      profiles={filteredUsers} 
                      onSwipe={handleSwipe} 
                    />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="nearby" className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading nearby profiles...</p>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <DiscoverContent 
                      profiles={filteredUsers.sort((a, b) => {
                        if (!a.distance) return 1;
                        if (!b.distance) return -1;
                        return a.distance - b.distance;
                      })} 
                      onSwipe={handleSwipe} 
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Layout>
    </ModerationProvider>
  );
};

export default Discover;
