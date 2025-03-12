import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProfileCard from '@/components/ProfileCard';
import { useUser } from '@/context/UserContext';
import { 
  getAiEnhancedMatches, 
  shouldBoostProfile, 
  getNearbyUsers,
  UserWithCoordinates,
  BoostLevelType
} from '@/utils/matchingAlgorithm';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Filter, 
  Flame, 
  Crown, 
  MapPin, 
  Globe, 
  X,
  Rocket,
  Info
} from 'lucide-react';
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Slider } from "@/components/ui/slider";
import ProfileBoostPopup from "@/components/ProfileBoostPopup";
import { useBoostPopup } from "@/hooks/useBoostPopup";
import { cn } from '@/lib/utils';

const regions = [
  { value: "north-america", label: "North America" },
  { value: "south-america", label: "South America" },
  { value: "europe", label: "Europe" },
  { value: "asia", label: "Asia" },
  { value: "africa", label: "Africa" },
  { value: "oceania", label: "Oceania" },
];

const Discover = () => {
  console.log("Rendering Discover component");
  
  const { 
    currentUser = null, 
    potentialMatches = [], 
    likeUser = () => {}, 
    passUser = () => {}, 
    boostedProfiles = [] 
  } = useUser() || {};
  
  console.log("User context:", { currentUser, potentialMatchesCount: potentialMatches.length, boostedProfiles });
  
  const [enhancedMatches, setEnhancedMatches] = useState<UserWithCoordinates[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isLocationFiltering, setIsLocationFiltering] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [proximityRadius, setProximityRadius] = useState(50);
  const [userCoordinates, setUserCoordinates] = useState<{latitude: number, longitude: number} | null>(null);
  const [isNearbyFilterActive, setIsNearbyFilterActive] = useState(false);
  const { forceShowPopup } = useBoostPopup();
  
  useEffect(() => {
    console.log("Running geolocation effect");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Got user position:", position.coords);
          setUserCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          
          toast.success("Location detected successfully", {
            description: "Matches will now be prioritized by proximity"
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not detect location", {
            description: "Please enable location services to see nearby matches"
          });
        }
      );
    } else {
      console.log("Geolocation not supported by browser");
    }
  }, []);
  
  useEffect(() => {
    console.log("Running match processing effect with:", {
      hasCurrentUser: !!currentUser,
      potentialMatchesCount: potentialMatches.length,
      boostedProfilesCount: boostedProfiles?.length || 0,
      userCoordinates,
      isNearbyFilterActive
    });
    
    if (!currentUser) {
      console.log("No current user, skipping match processing");
      return;
    }
    
    if (!potentialMatches || potentialMatches.length === 0) {
      console.log("No potential matches, skipping processing");
      return;
    }
    
    try {
      console.log("Processing matches...");
      
      let processedMatches = [...potentialMatches] as UserWithCoordinates[];
      
      if (userCoordinates && isNearbyFilterActive) {
        console.log(`Filtering by proximity: ${proximityRadius}km radius`);
        const currentUserWithCoords: UserWithCoordinates = {
          ...(currentUser as UserWithCoordinates),
          coordinates: userCoordinates
        };
        
        processedMatches = getNearbyUsers(
          currentUserWithCoords,
          processedMatches,
          proximityRadius
        );
      }
      
      if (isLocationFiltering && selectedRegions.length > 0) {
        console.log(`Filtering by regions: ${selectedRegions.join(', ')}`);
        processedMatches = processedMatches.filter(match => {
          if (!match.location) return false;
          const matchRegion = match.location.split(',')[1]?.trim();
          return selectedRegions.includes(matchRegion);
        });
      }
      
      const currentUserWithCoords: UserWithCoordinates = userCoordinates 
        ? { ...(currentUser as UserWithCoordinates), coordinates: userCoordinates }
        : currentUser as UserWithCoordinates;
      
      console.log("Applying AI enhancement to matches");  
      const sortedMatches = getAiEnhancedMatches(
        currentUserWithCoords,
        processedMatches
      );
      
      console.log("Identifying boosted profiles");
      const safeBootedProfiles = boostedProfiles || [];
      
      const matchesWithBoostInfo = sortedMatches.map(match => {
        if (!match || !match.id) {
          console.warn("Invalid match object:", match);
          return {
            ...match,
            isBoosted: false,
            boostLevel: 'none' as BoostLevelType
          };
        }
        
        const isBoostedProfile = safeBootedProfiles.some(p => p && p.userId === match.id);
        
        const isInternationalBoosted = safeBootedProfiles.some(
          p => p && p.userId === match.id && p.boostType === 'international'
        );
        
        const popularityScore = match.popularityPoints || 0;
        const isBoosted = shouldBoostProfile(popularityScore) || Boolean(isBoostedProfile);
        
        let boostLevel: BoostLevelType = 
          popularityScore >= 100 ? 'super' : 'standard';
        
        if (isBoostedProfile) {
          boostLevel = isInternationalBoosted ? 'international' : 'local';
        }
        
        return {
          ...match,
          isBoosted,
          boostLevel: isBoosted ? boostLevel : 'none'
        };
      });
      
      const boostedMatches = matchesWithBoostInfo.filter(m => m.isBoosted);
      const normalMatches = matchesWithBoostInfo.filter(m => !m.isBoosted);
      
      const sortedBoostedMatches = boostedMatches.sort((a, b) => {
        const boostOrder = {
          'international': 0,
          'local': 1,
          'super': 2,
          'standard': 3,
          'none': 4
        };
        
        const aOrder = boostOrder[a.boostLevel as keyof typeof boostOrder] || 4;
        const bOrder = boostOrder[b.boostLevel as keyof typeof boostOrder] || 4;
        
        return aOrder - bOrder;
      });
      
      const finalMatches = [...sortedBoostedMatches, ...normalMatches];
      console.log(`Final matches: ${finalMatches.length} (${boostedMatches.length} boosted)`);
      setEnhancedMatches(finalMatches);
      
      const boostedCount = boostedMatches.length;
      if (boostedCount > 0) {
        toast(`${boostedCount} Boosted ${boostedCount === 1 ? 'Profile' : 'Profiles'}`,
          {
            description: "Boosted profiles are highlighted and ranked higher",
          }
        );
      }
    } catch (error) {
      console.error("Error processing matches:", error);
      toast.error("There was an error processing your matches", {
        description: "Please try refreshing the page"
      });
    }
  }, [
    currentUser, 
    potentialMatches, 
    selectedRegions, 
    isLocationFiltering, 
    isNearbyFilterActive, 
    proximityRadius, 
    userCoordinates,
    boostedProfiles
  ]);
  
  const togglePopularFilter = () => {
    setIsFiltering(!isFiltering);
    
    if (!isFiltering) {
      toast("Showing Popular Profiles", {
        description: "Displaying profiles that are trending right now",
      });
    } else {
      toast("Showing All Profiles", {
        description: "Displaying all compatible matches",
      });
    }
  };
  
  const toggleLocationFilter = () => {
    setIsLocationFiltering(!isLocationFiltering);
    
    if (!isLocationFiltering && selectedRegions.length === 0) {
      toast("Please select regions", {
        description: "Select regions you're interested in",
      });
    } else if (!isLocationFiltering) {
      toast("Filtering by selected regions", {
        description: `Showing matches from: ${selectedRegions.join(', ')}`,
      });
    } else {
      toast("Showing all regions", {
        description: "Displaying matches from all locations",
      });
    }
  };
  
  const toggleNearbyFilter = () => {
    if (!userCoordinates) {
      toast.error("Location not available", {
        description: "Please enable location services to use this feature",
      });
      return;
    }
    
    setIsNearbyFilterActive(!isNearbyFilterActive);
    
    if (!isNearbyFilterActive) {
      toast("Showing nearby profiles", {
        description: `Displaying profiles within ${proximityRadius}km`,
      });
    } else {
      toast("Showing all profiles", {
        description: "Distance is no longer a filter",
      });
    }
  };
  
  const handleRadiusChange = (value: number[]) => {
    setProximityRadius(value[0]);
  };
  
  const toggleRegion = (region: string) => {
    setSelectedRegions(prevRegions => 
      prevRegions.includes(region)
        ? prevRegions.filter(r => r !== region)
        : [...prevRegions, region]
    );
  };
  
  const filteredMatches = isFiltering
    ? enhancedMatches.filter(match => match.isBoosted)
    : enhancedMatches;
  
  console.log(`Rendering ${filteredMatches.length} matches`);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 pb-36">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Discover</h1>
            <p className="text-muted-foreground">Find your perfect match based on compatibility</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={isFiltering ? "default" : "outline"} 
              onClick={togglePopularFilter}
              className="flex items-center gap-2"
            >
              <Flame size={16} className={isFiltering ? "text-white" : ""} />
              <span>Popular</span>
            </Button>
            
            <Button 
              variant={isNearbyFilterActive ? "default" : "outline"}
              onClick={toggleNearbyFilter}
              className="flex items-center gap-2"
              disabled={!userCoordinates}
            >
              <MapPin size={16} className={isNearbyFilterActive ? "text-white" : ""} />
              <span>Nearby</span>
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant={isLocationFiltering ? "default" : "outline"} 
                  className="flex items-center gap-2"
                >
                  <Globe size={16} className={isLocationFiltering ? "text-white" : ""} />
                  <span>Regions</span>
                  {selectedRegions.length > 0 && (
                    <Badge variant="outline" className="ml-1 bg-background text-foreground">
                      {selectedRegions.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <Command>
                  <CommandInput placeholder="Search regions..." />
                  <CommandList>
                    <CommandEmpty>No region found.</CommandEmpty>
                    <CommandGroup>
                      {regions.map((region) => (
                        <CommandItem
                          key={region.value}
                          onSelect={() => toggleRegion(region.value)}
                          className="flex items-center justify-between"
                        >
                          <span>{region.label}</span>
                          {selectedRegions.includes(region.value) && (
                            <Badge className="ml-auto bg-love-500">Selected</Badge>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                  <div className="border-t p-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-medium">Selected regions: {selectedRegions.length}</span>
                      {selectedRegions.length > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedRegions([])}
                          className="h-auto p-1"
                        >
                          <X size={14} />
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {selectedRegions.map(region => {
                        const regionLabel = regions.find(r => r.value === region)?.label || region;
                        return (
                          <Badge 
                            key={region} 
                            variant="secondary"
                            className="flex gap-1 items-center"
                          >
                            {regionLabel}
                            <X 
                              size={12} 
                              className="cursor-pointer"
                              onClick={() => toggleRegion(region)}
                            />
                          </Badge>
                        );
                      })}
                    </div>
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedRegions([])}
                      >
                        Clear All
                      </Button>
                      <Button 
                        size="sm"
                        onClick={toggleLocationFilter}
                        disabled={selectedRegions.length === 0}
                      >
                        Apply Filter
                      </Button>
                    </div>
                  </div>
                </Command>
              </PopoverContent>
            </Popover>
            
            {isNearbyFilterActive && userCoordinates && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <span>{proximityRadius}km</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Proximity Radius</h4>
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between">
                        <span className="text-xs">5km</span>
                        <span className="text-xs">500km</span>
                      </div>
                      <Slider
                        value={[proximityRadius]}
                        min={5}
                        max={500}
                        step={5}
                        onValueChange={handleRadiusChange}
                      />
                      <div className="flex justify-center mt-2">
                        <span className="text-sm font-medium">{proximityRadius}km</span>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
            
            <Button
              variant="outline"
              className="bg-love-50 text-love-700 border-love-200 hover:bg-love-100"
              onClick={forceShowPopup}
            >
              <Rocket size={16} className="mr-2" />
              Boost Profile
            </Button>
          </div>
        </div>
        
        {filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map(match => (
              <div key={match.id} className="relative">
                {match.isBoosted && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <Badge className={`py-1 px-3 flex items-center gap-1 ${
                      match.boostLevel === 'super' 
                        ? 'bg-amber-500 text-amber-950 border-amber-600' 
                        : match.boostLevel === 'international'
                          ? 'bg-purple-500 text-white'
                          : match.boostLevel === 'local'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gradient-love text-white'
                    }`}>
                      {match.boostLevel === 'super' ? (
                        <Crown size={14} className="mr-1" />
                      ) : match.boostLevel === 'international' ? (
                        <Globe size={14} className="mr-1" />
                      ) : match.boostLevel === 'local' ? (
                        <MapPin size={14} className="mr-1" />
                      ) : (
                        <Sparkles size={14} className="mr-1" />
                      )}
                      {match.boostLevel === 'super' ? 'Super Popular' : 
                        match.boostLevel === 'international' ? 'International Boost' :
                        match.boostLevel === 'local' ? 'Local Boost' : 'Popular'}
                    </Badge>
                  </div>
                )}
                <ProfileCard
                  id={match.id}
                  name={match.name}
                  age={match.age}
                  bio={match.bio}
                  location={match.location}
                  interests={match.interests}
                  photos={match.photos}
                  compatibilityScore={match.compatibilityScore}
                  onLike={likeUser}
                  onPass={passUser}
                />
              </div>
            ))}
          </div>
        ) : (
          <Card className="max-w-md mx-auto text-center p-8">
            <CardContent className="p-6 flex flex-col items-center">
              <Badge className="mb-4 bg-love-100 text-love-700 border-0 py-1.5 px-3">
                <Sparkles size={14} className="mr-1.5" />
                AI Matching
              </Badge>
              
              <h2 className="text-2xl font-display font-semibold mb-3">No more matches for now</h2>
              
              <p className="text-muted-foreground mb-6">
                We're working on finding your perfect matches. Check back soon!
              </p>
              
              <Button className="bg-gradient-love hover:opacity-90">
                Update Preferences
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Discover;
