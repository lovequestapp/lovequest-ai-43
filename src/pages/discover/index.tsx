import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useUser } from '@/context/UserContext';
import { useTestMode } from '@/context/TestModeContext';
import { Layout } from '@/components/layout';
import UserCard from '@/components/UserCard';
import { calculateDistance } from '@/utils/matching/distance';
import { UserWithCoordinates } from '@/types/user';
import { useDebounce } from '@/hooks/use-debounce';
import {
  boostProfile,
  filterProfiles,
  sortProfiles,
  calculateDistances as calculateDistancesUtil
} from './hooks/useMatchProcessing';
import { Separator } from '@/components/ui/separator';
import { Filter, MapPin, Users, Search } from 'lucide-react';
import DiscoverFilters from './DiscoverFilters';

interface Coordinates {
  latitude: number;
  longitude: number;
}

const DiscoverPage = () => {
  const { allUsers, currentUser } = useUser();
  const { toast } = useToast();
  const { isTestMode, demoProfiles } = useTestMode();
  const [searchParams, setSearchParams] = useSearchParams();
  const [profiles, setProfiles] = useState<UserWithCoordinates[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<UserWithCoordinates[]>([]);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter states
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 60]);
  const [distance, setDistance] = useState<number>(50);
  const [genderPreference, setGenderPreference] = useState<string>('all');
  const [interests, setInterests] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  const [activeRegion, setActiveRegion] = useState('');
  
  const displayProfiles = isTestMode ? [...demoProfiles, ...allUsers] : allUsers;
  
  // Load filters from URL
  useEffect(() => {
    const initialAgeRange = searchParams.get('ageRange');
    const initialDistance = searchParams.get('distance');
    const initialGender = searchParams.get('gender');
    
    if (initialAgeRange) {
      const [min, max] = initialAgeRange.split(',').map(Number);
      setAgeRange([min, max]);
    }
    if (initialDistance) {
      setDistance(Number(initialDistance));
    }
    if (initialGender) {
      setGenderPreference(initialGender);
    }
  }, [searchParams]);
  
  // Update URL on filter change
  const updateSearchParams = useCallback(() => {
    const newParams = new URLSearchParams();
    newParams.set('ageRange', ageRange.join(','));
    newParams.set('distance', String(distance));
    newParams.set('gender', genderPreference);
    setSearchParams(newParams);
  }, [ageRange, distance, genderPreference, setSearchParams]);
  
  // Load user location
  useEffect(() => {
    const getLocation = () => {
      setLoadingLocation(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setLoadingLocation(false);
          },
          error => {
            console.error("Error getting location:", error);
            toast({
              title: "Error",
              description: "Unable to retrieve your location.",
              variant: "destructive"
            });
            setLoadingLocation(false);
          }
        );
      } else {
        toast({
          title: "Error",
          description: "Geolocation is not supported by this browser.",
          variant: "destructive"
        });
        setLoadingLocation(false);
      }
    };
    
    getLocation();
  }, [toast]);
  
  // Load profiles
  useEffect(() => {
    if (!currentUser) return;
    
    setLoadingProfiles(true);
    
    // Filter out the current user
    let availableProfiles = displayProfiles.filter(user => user.id !== currentUser.id) as UserWithCoordinates[];
    
    // Apply initial filters
    availableProfiles = filterProfiles(availableProfiles, {
      ageRange,
      distance,
      genderPreference,
      interests,
      searchTerm: debouncedSearchTerm,
      currentUser
    });
    
    // Calculate distances if location is available
    if (userLocation) {
      availableProfiles = calculateDistancesUtil(availableProfiles, userLocation);
    } else {
      availableProfiles.forEach(profile => {
        profile.distance = undefined;
      });
    }
    
    // Boost profiles
    availableProfiles = availableProfiles.map(profile => boostProfile(profile));
    
    // Sort profiles
    availableProfiles.sort(sortProfiles);
    
    setProfiles(availableProfiles);
    setFilteredProfiles(availableProfiles);
    setLoadingProfiles(false);
    
    try {
      fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
          setActiveRegion(data.city || data.region || data.country_name || 'Your Region');
        })
        .catch(error => {
          console.error('Error detecting location:', error);
          setActiveRegion('Your Region');
        });
    } catch (error) {
      console.error('Error detecting location:', error);
      setActiveRegion('Your Region');
    }
  }, [currentUser, displayProfiles, userLocation, ageRange, distance, genderPreference, interests, debouncedSearchTerm]);
  
  const handleViewProfile = (profileId: string) => {
    console.log(`View profile ${profileId}`);
  };
  
  const calculateDistances = (profiles: UserWithCoordinates[], userLocation: Coordinates): UserWithCoordinates[] => {
    return profiles.map(profile => {
      // Create a new object to avoid mutation
      const updatedProfile = { ...profile };
      
      if (profile.coordinates) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          profile.coordinates.latitude,
          profile.coordinates.longitude
        );
        updatedProfile.distance = distance;
      }
      
      return updatedProfile;
    });
  };
  
  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold tracking-tight">Discover</h1>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsFilterOpen(!isFilterOpen)} 
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
            <span>Explore new connections and find your perfect match</span>
          </div>
          
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-love-500" />
            <Input
              placeholder="Search profiles..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Separator className="my-4" />
          
          {isFilterOpen && (
            <DiscoverFilters
              ageRange={ageRange}
              setAgeRange={setAgeRange}
              distance={distance}
              setDistance={setDistance}
              genderPreference={genderPreference}
              setGenderPreference={setGenderPreference}
              interests={interests}
              setInterests={setInterests}
              onApplyFilters={updateSearchParams}
              onClose={() => setIsFilterOpen(false)}
            />
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loadingProfiles ? (
              // Skeleton cards while loading
              [...Array(8)].map((_, i) => (
                <Card key={i} className="h-64 animate-pulse bg-muted"></Card>
              ))
            ) : profiles.length === 0 ? (
              // No profiles message
              <div className="text-center py-12 col-span-full">
                <h3 className="text-xl font-medium mb-2">No profiles found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or expanding your search criteria</p>
                <Button onClick={() => {
                  setAgeRange([18, 60]);
                  setDistance(50);
                  setGenderPreference('all');
                  setInterests([]);
                  setSearchTerm('');
                  updateSearchParams();
                }}>
                  Reset Filters
                </Button>
              </div>
            ) : (
              // User cards
              demoProfiles.map(profile => {
                // Add the distance property to each profile
                const profileWithDistance = { 
                  ...profile, 
                  distance: Math.floor(Math.random() * 20) + 1 
                };
                
                return (
                  <UserCard 
                    key={profile.id} 
                    user={profileWithDistance} 
                    onViewProfile={() => handleViewProfile(profile.id)} 
                    isDemo={!!profile.isDemo}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DiscoverPage;
