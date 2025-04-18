
import { useState } from 'react';
import { User } from '@/types/user';
import { toast } from 'sonner';
import { directProfileUpdate } from '@/utils/directProfileUpdate';

/**
 * A hook for directly updating profile data, bypassing RLS recursion issues
 */
export const useDirectProfileUpdate = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  
  /**
   * Update profile data directly with improved RLS handling
   */
  const updateProfile = async (userId: string, data: Partial<User>): Promise<boolean> => {
    if (!userId) {
      toast.error('User ID is required');
      return false;
    }
    
    setIsUpdating(true);
    
    try {
      console.log('Updating profile with data:', data);
      
      // Use the improved directProfileUpdate utility
      const success = await directProfileUpdate(userId, data);
      
      if (success) {
        toast.success('Profile updated successfully');
      } else {
        throw new Error('Failed to update profile');
      }
      
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Profile update error:', error);
      toast.error(`Failed to update profile: ${errorMessage}`);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };
  
  return {
    updateProfile,
    isUpdating
  };
};
