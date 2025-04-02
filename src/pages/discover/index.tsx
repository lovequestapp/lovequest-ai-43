
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { useUser } from '@/context/UserContext';
import { UserWithCoordinates } from '@/types/user';
import UserCard from '@/components/UserCard';
import DiscoverFilters from './DiscoverFilters';
import { useDebounce } from '@/hooks/use-debounce';
import useMatchProcessing from './hooks/useMatchProcessing';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Filter, MapPin, Sliders } from 'lucide-react';

const DiscoverPage = () => {
  const { currentUser, allUsers, updatePreferences } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [location, setLocation] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Convert regular users to UserWithCoordinates for the matching system
  const usersWithCoordinates: UserWithCoordinates[] = allUsers.map(user => ({
    ...user,
    coordinates: undefined, // You would get this from a real location system
    distance: undefined,
    isBoosted: false
  }));
  
  const {
    filteredUsers,
    applyFilters,
    setMaxDistance,
    setAgeRange,
    setVerifiedOnly,
    setSortBy,
    boostProfile
  } = useMatchProcessing(usersWithCoordinates, currentUser);
  
  useEffect(() => {
    // Apply initial filters
    applyFilters();
    
    // Attempt to get user's location for better matching
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          // In a real app, you would update the user's coordinates in the database
          console.log("User location:", latitude, longitude);
          
          // Fetch location name from coordinates
          fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
            .then(res => res.json())
            .then(data => {
              setLocation(data.city || data.locality || "Your location");
            })
            .catch(err => {
              console.error("Error fetching location name:", err);
            });
        },
        error => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, [applyFilters]);
  
  // Filter users by search query
  useEffect(() => {
    if (debouncedSearchQuery) {
      // In a real app, you might want to search in the database instead
      const query = debouncedSearchQuery.toLowerCase();
      // Filter users by name, location, interests, etc.
      // Update the filtered users accordingly
    }
  }, [debouncedSearchQuery]);
  
  const handleViewProfile = (userId: string) => {
    // Navigate to the user's profile
    console.log("Viewing profile:", userId);
    // navigate(`/profile/${userId}`);
  };
  
  const handleBoostProfile = (level: 'local' | 'international') => {
    if (!currentUser) return false;
    
    boostProfile(currentUser.id, level);
    toast.success(`Your profile has been boosted with ${level} visibility!`);
    return true;
  };
  
  return (
    <Layout>
      <div className="container max-w-6xl py-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Discover</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Find your perfect match in {location || "your area"}
              </p>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:max-w-[200px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search profiles..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setShowFilters(!showFilters)}
                className="flex-shrink-0"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Filters sidebar */}
            {showFilters && (
              <div className="md:col-span-1">
                <DiscoverFilters 
                  preferences={currentUser?.preferences || {}}
                  onPreferencesChange={(newPrefs) => {
                    if (currentUser) {
                      updatePreferences(newPrefs);
                      
                      // Update local filter state
                      if (newPrefs.maxDistance) setMaxDistance(newPrefs.maxDistance);
                      if (newPrefs.ageRange) setAgeRange([newPrefs.ageRange.min, newPrefs.ageRange.max]);
                    }
                  }}
                  onApplyFilters={applyFilters}
                  className="sticky top-20"
                />
              </div>
            )}
            
            {/* User cards grid */}
            <div className={`${showFilters ? 'md:col-span-2 lg:col-span-3' : 'md:col-span-3 lg:col-span-4'}`}>
              <Tabs defaultValue="all" className="mb-6">
                <TabsList>
                  <TabsTrigger value="all">All Profiles</TabsTrigger>
                  <TabsTrigger value="nearby">Nearby</TabsTrigger>
                  <TabsTrigger value="new">New</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                </TabsList>
              </Tabs>
              
              {filteredUsers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredUsers.map(user => (
                    <UserCard
                      key={user.id}
                      user={user}
                      onViewProfile={() => handleViewProfile(user.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-muted rounded-full p-4 mb-4">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No profiles found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Try adjusting your filters or search criteria to find more matches
                  </p>
                  <Button onClick={() => {
                    setShowFilters(false);
                    setSearchQuery('');
                    setMaxDistance(undefined);
                    setAgeRange(undefined);
                    setVerifiedOnly(false);
                    setSortBy('compatibility');
                    applyFilters();
                  }}>
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DiscoverPage;
