
import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';

/**
 * Update a user profile directly, bypassing potential RLS recursion issues
 * 
 * @param userId - The ID of the user to update
 * @param data - The profile data to update
 * @returns Promise<boolean> - Whether the update was successful
 */
export const directProfileUpdate = async (userId: string, data: Partial<User>): Promise<boolean> => {
  if (!userId) {
    console.error('No user ID provided for profile update');
    return false;
  }

  try {
    console.log('Updating profile with direct method:', data);
    
    // Use the new database function for profile updates
    const { data: result, error } = await supabase
      .rpc('update_profile_data', {
        profile_id: userId,
        profile_data: data
      });
    
    if (error) {
      console.error('Database function update failed:', error);
      
      // Map user fields to database columns
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
      
      // Add updated_at timestamp
      updateData.updated_at = new Date().toISOString();
      
      // Approach 1: Standard update
      const { error: standardError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);
      
      if (standardError) {
        console.error('Standard update failed:', standardError);
        
        // Approach 2: Use direct update with select to force refresh
        const { error: directError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', userId)
          .select();
        
        if (directError) {
          console.error('Direct update failed:', directError);
          return false;
        }
      }
    }
    
    console.log('Profile update successful');
    return true;
  } catch (error) {
    console.error('Profile update error:', error);
    return false;
  }
};
