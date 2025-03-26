
import { useState, useEffect } from 'react';
import { toast } from "sonner";

const useDiscoverFilters = () => {
  const [isFiltering, setIsFiltering] = useState(false);
  const [isLocationFiltering, setIsLocationFiltering] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [proximityRadius, setProximityRadius] = useState(50);
  const [userCoordinates, setUserCoordinates] = useState<{latitude: number, longitude: number} | null>(null);
  const [isNearbyFilterActive, setIsNearbyFilterActive] = useState(false);
  
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
  
  return {
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
  };
};

export default useDiscoverFilters;
