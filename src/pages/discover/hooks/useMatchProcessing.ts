
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { 
  UserWithCoordinates, 
  BoostLevelType,
  getAiEnhancedMatches, 
  shouldBoostProfile, 
  getNearbyUsers,
  BOOST_PRIORITY
} from '@/utils/matchingAlgorithm';

interface UseMatchProcessingProps {
  currentUser: UserWithCoordinates | null;
  potentialMatches: UserWithCoordinates[];
  boostedProfiles: any[];
  userCoordinates: {latitude: number, longitude: number} | null;
  isNearbyFilterActive: boolean;
  proximityRadius: number;
  isLocationFiltering: boolean;
  selectedRegions: string[];
  isFiltering: boolean;
}

const useMatchProcessing = ({
  currentUser,
  potentialMatches,
  boostedProfiles,
  userCoordinates,
  isNearbyFilterActive,
  proximityRadius,
  isLocationFiltering,
  selectedRegions,
  isFiltering
}: UseMatchProcessingProps) => {
  const [enhancedMatches, setEnhancedMatches] = useState<UserWithCoordinates[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<UserWithCoordinates[]>([]);
  
  // Process matches when dependencies change
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
      
      // Apply location-based filtering if enabled
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
        
        // Sort by distance after filtering
        processedMatches.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      }
      
      // Apply region filtering if enabled
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
      
      // Advanced algorithm: Apply multiple factors for match scoring
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
        // Consider both paid boosts and organic popularity
        const isBoosted = shouldBoostProfile(popularityScore) || Boolean(isBoostedProfile);
        
        let boostLevel: BoostLevelType = 'none';
        
        // Advanced boost level assignment
        if (popularityScore >= 100) {
          boostLevel = 'super';
        } else if (popularityScore >= 70) {
          boostLevel = 'local';  // Changed from 'standard' to 'local'
        }
        
        // Paid boosts take precedence
        if (isBoostedProfile) {
          boostLevel = isInternationalBoosted ? 'international' : 'local';
        }
        
        // Calculate activity score based on recent activity (mocked)
        const activityScore = Math.random() * 100; // In a real app, this would be based on user activity
        
        return {
          ...match,
          isBoosted,
          boostLevel: isBoosted ? boostLevel : 'none' as BoostLevelType,
          activityScore: Math.round(activityScore),
          // Combine compatibility with recency to get a final score
          finalScore: (match.compatibilityScore || 0) * 0.7 + activityScore * 0.3
        };
      });
      
      const boostedMatches = matchesWithBoostInfo.filter(m => m.isBoosted);
      const normalMatches = matchesWithBoostInfo.filter(m => !m.isBoosted);
      
      // Enhanced sorting algorithm for boosted profiles
      const sortedBoostedMatches = boostedMatches.sort((a, b) => {
        // First sort by boost level priority
        const boostComparison = BOOST_PRIORITY[a.boostLevel as BoostLevelType] - 
                                BOOST_PRIORITY[b.boostLevel as BoostLevelType];
        
        if (boostComparison !== 0) return boostComparison;
        
        // Then by compatibility score within the same boost level
        return (b.compatibilityScore || 0) - (a.compatibilityScore || 0);
      });
      
      // Sort normal matches by final score, which combines compatibility and activity
      const sortedNormalMatches = normalMatches.sort((a, b) => 
        (b.finalScore || 0) - (a.finalScore || 0)
      );
      
      const finalMatches = [...sortedBoostedMatches, ...sortedNormalMatches];
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
  
  // Apply filters to the enhanced matches
  useEffect(() => {
    setFilteredMatches(isFiltering
      ? enhancedMatches.filter(match => match.isBoosted)
      : enhancedMatches);
  }, [enhancedMatches, isFiltering]);
  
  return {
    enhancedMatches,
    filteredMatches
  };
};

export default useMatchProcessing;
