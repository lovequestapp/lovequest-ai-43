
// Main export file that reexports all matching utilities
export * from './matching/compatibility';
export * from './matching/distance';
export * from './matching/filtering';

// Export the types to be used elsewhere
import type { User, UserWithCoordinates, BoostLevelType, UserPreferences } from '@/types/user';
export type { User, UserWithCoordinates, BoostLevelType, UserPreferences };
