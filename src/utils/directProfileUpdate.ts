
import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';
import { toast } from 'sonner';

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
        value === null
      ) {
        safeData[key] = value;
      } else if (Array.isArray(value)) {
        // Handle arrays safely
        try {
          safeData[key] = [...value];
        } catch (err) {
          console.warn(`Could not serialize array field ${key}:`, err);
        }
      } else if (typeof value === 'object' && value !== null) {
        // Handle objects safely
        try {
          safeData[key] = {...value};
        } catch (err) {
          console.warn(`Could not serialize object field ${key}:`, err);
        }
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
    
    // Try the edge function first for more reliable updates
    try {
      console.log('Trying edge function update first');
      const { data: edgeResult, error: edgeError } = await supabase.functions
        .invoke('get_profile_by_id', {
          body: { 
            profileId: userId,
            profileData: jsonData,
            action: 'update'
          }
        });
        
      if (!edgeError && edgeResult?.success) {
        console.log('Edge function update successful');
        toast.success('Profile updated successfully');
        return true;
      } else if (edgeError) {
        console.warn('Edge function update failed:', edgeError);
        // Continue to other methods
      }
    } catch (edgeFuncError) {
      console.warn('Edge function call failed:', edgeFuncError);
      // Continue to other methods
    }

    // Use a security-definer database function for profile updates
    console.log('Trying database function update');
    const { data: result, error } = await supabase
      .rpc('update_profile_data', {
        profile_id: userId,
        profile_data: jsonData
      });
    
    if (error) {
      console.error('Database function update failed:', error);
      
      // Try field-by-field updates
      console.log('Trying field-by-field updates');
      let updateSuccess = false;
      
      for (const [field, value] of Object.entries(jsonData)) {
        const fieldName = mapFieldToDbColumn(field);
        if (!fieldName) continue;
        
        try {
          // Use field-by-field update with the secure function
          const fieldResult = await supabase.rpc('update_profile_field', {
            profile_id: userId,
            field_name: fieldName,
            field_value: value
          });
          
          if (fieldResult.error) {
            console.warn(`Failed to update field ${field}:`, fieldResult.error);
          } else {
            updateSuccess = true;
            console.log(`Successfully updated field ${field}`);
          }
        } catch (fieldError) {
          console.error(`Error updating field ${field}:`, fieldError);
        }
      }
      
      if (updateSuccess) {
        toast.success('Profile partially updated');
        return true;
      }
      
      // Last resort: direct table update
      console.log('Trying direct table update');
      const updateData = mapUserToDbFields(jsonData);
      
      const { error: directError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);
      
      if (directError) {
        throw new Error(`All update methods failed: ${directError.message}`);
      }
    }
    
    console.log('Profile update successful');
    toast.success('Profile updated successfully');
    return true;
  } catch (error) {
    console.error('Profile update error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    toast.error(`Profile update failed: ${message}`);
    return false;
  }
};

/**
 * Map User type fields to database column names
 */
const mapFieldToDbColumn = (field: string): string | null => {
  const fieldMap: Record<string, string> = {
    name: 'name',
    bio: 'bio',
    age: 'age',
    location: 'location',
    interests: 'interests',
    gender: 'gender',
    interestedIn: 'interested_in',
    personalityTraits: 'personality_traits',
    photos: 'photos',
    favoriteMusic: 'favorite_music',
    voiceIntro: 'voice_intro'
  };
  
  return fieldMap[field] || null;
};

/**
 * Map User data to database fields
 */
const mapUserToDbFields = (userData: Record<string, any>): Record<string, any> => {
  const updateData: Record<string, any> = {};
  
  if (userData.name !== undefined) updateData.name = userData.name;
  if (userData.bio !== undefined) updateData.bio = userData.bio;
  if (userData.age !== undefined) updateData.age = userData.age;
  if (userData.location !== undefined) updateData.location = userData.location;
  
  // Handle array fields properly
  if (userData.interests !== undefined) {
    updateData.interests = Array.isArray(userData.interests) ? userData.interests : [];
  }
  
  if (userData.gender !== undefined) updateData.gender = userData.gender;
  
  if (userData.interestedIn !== undefined) {
    updateData.interested_in = Array.isArray(userData.interestedIn) ? userData.interestedIn : [];
  }
  
  if (userData.personalityTraits !== undefined) {
    updateData.personality_traits = Array.isArray(userData.personalityTraits) ? userData.personalityTraits : [];
  }
  
  if (userData.photos !== undefined) {
    updateData.photos = Array.isArray(userData.photos) ? userData.photos : [];
  }
  
  if (userData.favoriteMusic !== undefined) {
    updateData.favorite_music = Array.isArray(userData.favoriteMusic) ? userData.favoriteMusic : [];
  }
  
  if (userData.voiceIntro !== undefined) updateData.voice_intro = userData.voiceIntro;
  updateData.updated_at = new Date().toISOString();
  
  return updateData;
};
