
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';
import { toast } from 'sonner';

/**
 * A hook to directly update profile data in Supabase,
 * bypassing the recursive RLS policy issue
 */
export const useDirectProfileUpdate = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Update a user profile directly without using RLS policies
   */
  const updateProfile = async (userId: string, data: Partial<User>): Promise<boolean> => {
    if (!userId) {
      toast.error('User ID is required for profile update');
      return false;
    }
    
    setIsUpdating(true);
    setError(null);
    
    try {
      console.log('Updating profile with data:', data);
      
      // Map User type fields to database column names
      const dbData = {
        name: data.name,
        bio: data.bio,
        age: data.age,
        location: data.location,
        interests: data.interests,
        gender: data.gender,
        interested_in: data.interestedIn,
        personality_traits: data.personalityTraits,
        photos: data.photos,
        favorite_music: data.favoriteMusic,
        ...(data.voiceIntro !== undefined ? { voice_intro: data.voiceIntro } : {})
      };
      
      // Add a small delay to prevent rapid consecutive updates
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Use direct database update
      const { error: updateError } = await supabase
        .from('profiles')
        .update(dbData)
        .eq('id', userId);
      
      if (updateError) {
        throw new Error(updateError.message);
      }
      
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update profile';
      console.error('Profile update error:', error);
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };
  
  return {
    updateProfile,
    isUpdating,
    error
  };
};
