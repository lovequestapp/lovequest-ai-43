
// Calculate distance between two points in km using the Haversine formula
export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return Math.round(distance * 10) / 10;
};

// Filter users by proximity (within specified radius)
export const getNearbyUsers = (
  currentUser: UserWithCoordinates,
  users: UserWithCoordinates[],
  radius: number
): UserWithCoordinates[] => {
  if (!currentUser.coordinates) return users;
  
  const { latitude, longitude } = currentUser.coordinates;
  
  return users
    .map(user => {
      if (user.coordinates) {
        const distance = calculateDistance(
          latitude,
          longitude,
          user.coordinates.latitude,
          user.coordinates.longitude
        );
        
        return {
          ...user,
          distance
        };
      }
      
      // If no coordinates, assume a random distance
      return {
        ...user,
        distance: Math.floor(Math.random() * radius * 1.5)
      };
    })
    .filter(user => (user.distance || 0) <= radius);
};

import type { UserWithCoordinates } from '@/types/user';
