
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { useUser } from '@/context/UserContext';
import { UserWithCoordinates, BoostLevelType } from '@/utils/matchingAlgorithm';

import FilterBar from './FilterBar';
import MatchGrid from './MatchGrid';
import NoMatchesCard from './NoMatchesCard';
import SwipeableCard from '@/components/card/SwipeableCard';
import useDiscoverFilters from './hooks/useDiscoverFilters';
import useMatchProcessing from './hooks/useMatchProcessing';
import ProfileBoostPopup from '@/components/ProfileBoostPopup';
import { useBoostPopup } from '@/hooks/useBoostPopup';

const DiscoverContent = () => {
  const navigate = useNavigate();
  const { 
    currentUser = null, 
    potentialMatches = [], 
    likeUser = () => {}, 
    passUser = () => {}, 
    boostedProfiles = [] 
  } = useUser() || {};
  
  const [viewMode, setViewMode] = useState<'swipe' | 'grid'>('swipe');
  const { showBoostPopup, forceShowPopup } = useBoostPopup();
  
  const {
    isFiltering,
    isLocationFiltering,
    isNearbyFilterActive,
    selectedRegions,
    proximityRadius,
    userCoordinates,
    
    togglePopularFilter,
    toggleLocationFilter,
    toggleNearbyFilter,
    handleRadiusChange,
    toggleRegion
  } = useDiscoverFilters();
  
  const { enhancedMatches, filteredMatches } = useMatchProcessing({
    currentUser,
    potentialMatches,
    boostedProfiles,
    userCoordinates,
    isNearbyFilterActive,
    proximityRadius,
    isLocationFiltering,
    selectedRegions,
    isFiltering
  });
  
  const handleSwipe = (id: string, direction: 'left' | 'right') => {
    if (direction === 'right') {
      likeUser(id);
      toast.success(`You liked this profile!`);
    } else {
      passUser(id);
      toast.message(`You passed on this profile`);
    }
  };
  
  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };
  
  return (
    <main className="flex-grow container mx-auto px-4 py-8 pb-36">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Discover</h1>
          <p className="text-muted-foreground">Find your perfect match based on compatibility</p>
        </div>
        
        <FilterBar 
          isFiltering={isFiltering}
          isNearbyFilterActive={isNearbyFilterActive}
          isLocationFiltering={isLocationFiltering}
          selectedRegions={selectedRegions}
          proximityRadius={proximityRadius}
          userCoordinates={userCoordinates}
          togglePopularFilter={togglePopularFilter}
          toggleNearbyFilter={toggleNearbyFilter}
          toggleLocationFilter={toggleLocationFilter}
          toggleRegion={toggleRegion}
          handleRadiusChange={handleRadiusChange}
          viewMode={viewMode}
          setViewMode={setViewMode}
          forceShowPopup={forceShowPopup}
        />
      </div>
      
      {filteredMatches.length > 0 ? (
        viewMode === 'swipe' ? (
          <div className="flex justify-center px-4 py-6">
            <SwipeableCard
              profiles={filteredMatches}
              onSwipe={handleSwipe}
            />
          </div>
        ) : (
          <MatchGrid 
            matches={filteredMatches} 
            onViewProfile={handleViewProfile} 
          />
        )
      ) : (
        <NoMatchesCard />
      )}
      
      {showBoostPopup && <ProfileBoostPopup />}
    </main>
  );
};

export default DiscoverContent;
