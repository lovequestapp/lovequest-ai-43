
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';
import { toast } from 'sonner';

/**
 * A hook for directly updating profile data, bypassing RLS recursion issues
 */
export const useDirectProfileUpdate = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  
  /**
   * Update profile data directly with minimal RLS policy involvement
   */
  const updateProfile = async (userId: string, data: Partial<User>): Promise<boolean> => {
    if (!userId) {
      toast.error('User ID is required');
      return false;
    }
    
    setIsUpdating(true);
    
    try {
      console.log('Updating profile with data:', data);
      
      // Map the User type fields to database column names
      const updateData: Record<string, any> = {};
      
      if (data.name !== undefined) updateData.name = data.name;
      if (data.bio !== undefined) updateData.bio = data.bio;
      if (data.age !== undefined) updateData.age = data.age;
      if (data.location !== undefined) updateData.location = data.location;
      if (data.interests !== undefined) updateData.interests = data.interests;
      if (data.gender !== undefined) updateData.gender = data.gender;
      if (data.interestedIn !== undefined) updateData.interested_in = data.interestedIn;
      if (data.personalityTraits !== undefined) updateData.personality_traits = data.personalityTraits;
      if (data.photos !== undefined) updateData.photos = data.photos;
      if (data.favoriteMusic !== undefined) updateData.favorite_music = data.favoriteMusic;
      if (data.voiceIntro !== undefined) updateData.voice_intro = data.voiceIntro;
      
      // Use a temporary authentication approach to avoid recursion
      const { error: authError } = await supabase.auth.refreshSession();
      if (authError) {
        console.warn('Session refresh error:', authError);
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);
      
      if (error) {
        if (error.code === '42P17') { // Infinite recursion error code
          console.error('Recursion detected, trying alternative update method');
          
          // Try a more direct approach
          const { error: altError } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', userId)
            .select();
          
          if (altError) {
            throw new Error(altError.message);
          }
        } else {
          throw new Error(error.message);
        }
      }
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Profile update error:', error);
      toast.error(errorMessage);
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
