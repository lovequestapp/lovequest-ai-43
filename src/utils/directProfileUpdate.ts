
import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';

/**
 * Convert User object to JSON-compatible format
 * This ensures all complex objects are properly serialized
 */
const userToJsonObject = (userData: Partial<User>): Record<string, any> => {
  try {
    // Deep clone and convert to plain object
    return JSON.parse(JSON.stringify(userData));
  } catch (error) {
    console.error('Error converting user data to JSON:', error);
    // Return a safe fallback with just the primitive values
    const safeData: Record<string, any> = {};
    Object.entries(userData).forEach(([key, value]) => {
      if (
        typeof value === 'string' || 
        typeof value === 'number' || 
        typeof value === 'boolean' || 
        value === null || 
        Array.isArray(value)
      ) {
        safeData[key] = value;
      }
    });
    return safeData;
  }
};

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
    
    // Convert to JSON-compatible format
    const jsonData = userToJsonObject(data);
    
    // Use the security-definer database function for profile updates
    const { data: result, error } = await supabase
      .rpc('update_profile_data', {
        profile_id: userId,
        profile_data: jsonData
      });
    
    if (error) {
      console.error('Database function update failed:', error);
      
      // Map user fields to database columns with proper handling of complex types
      const updateData: Record<string, any> = {};
      
      if (data.name !== undefined) updateData.name = data.name;
      if (data.bio !== undefined) updateData.bio = data.bio;
      if (data.age !== undefined) updateData.age = data.age;
      if (data.location !== undefined) updateData.location = data.location;
      
      // Handle array fields properly
      if (data.interests !== undefined) {
        // Ensure it's a proper array
        updateData.interests = Array.isArray(data.interests) ? data.interests : [];
      }
      
      if (data.gender !== undefined) updateData.gender = data.gender;
      
      if (data.interestedIn !== undefined) {
        updateData.interested_in = Array.isArray(data.interestedIn) ? data.interestedIn : [];
      }
      
      if (data.personalityTraits !== undefined) {
        updateData.personality_traits = Array.isArray(data.personalityTraits) ? data.personalityTraits : [];
      }
      
      if (data.photos !== undefined) {
        updateData.photos = Array.isArray(data.photos) ? data.photos : [];
      }
      
      if (data.favoriteMusic !== undefined) {
        updateData.favorite_music = Array.isArray(data.favoriteMusic) ? data.favoriteMusic : [];
      }
      
      if (data.voiceIntro !== undefined) updateData.voice_intro = data.voiceIntro;
      
      // Add updated_at timestamp
      updateData.updated_at = new Date().toISOString();
      
      console.log('Falling back to direct update with data:', updateData);
      
      // Try individual field updates as another fallback approach
      try {
        let updateSuccess = false;
        
        for (const [field, value] of Object.entries(updateData)) {
          if (field === 'updated_at') continue; // Skip the timestamp for individual updates
          
          // Use field-by-field update with the secure function
          const fieldResult = await supabase.rpc('update_profile_field', {
            profile_id: userId,
            field_name: field,
            field_value: JSON.parse(JSON.stringify(value))
          });
          
          if (fieldResult.error) {
            console.warn(`Failed to update field ${field}:`, fieldResult.error);
          } else {
            updateSuccess = true;
            console.log(`Successfully updated field ${field}`);
          }
        }
        
        if (!updateSuccess) {
          throw new Error('All field updates failed');
        }
      } catch (fieldError) {
        console.error('Field-by-field update failed:', fieldError);
        
        // Last resort: direct table update
        const { error: standardError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', userId);
        
        if (standardError) {
          console.error('Standard update failed:', standardError);
          
          // One final attempt with .select() to force refresh
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
    }
    
    console.log('Profile update successful');
    return true;
  } catch (error) {
    console.error('Profile update error:', error);
    return false;
  }
};
