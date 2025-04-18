
import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';
import { toast } from 'sonner';

/**
 * Convert User object to JSON-compatible format
 */
const userToJsonObject = (userData: Partial<User>): Record<string, any> => {
  try {
    return JSON.parse(JSON.stringify(userData));
  } catch (error) {
    console.error('Error converting user data to JSON:', error);
    const safeData: Record<string, any> = {};
    Object.entries(userData).forEach(([key, value]) => {
      if (typeof value === 'string' || 
          typeof value === 'number' || 
          typeof value === 'boolean' || 
          value === null) {
        safeData[key] = value;
      } else if (Array.isArray(value)) {
        safeData[key] = [...value];
      } else if (typeof value === 'object' && value !== null) {
        safeData[key] = {...value};
      }
    });
    return safeData;
  }
};

/**
 * Update a user profile directly with simple RLS policy approach
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
    
    // Map the data to database fields with correct names
    const updateData = {
      name: jsonData.name,
      bio: jsonData.bio,
      age: jsonData.age,
      location: jsonData.location,
      interests: Array.isArray(jsonData.interests) ? jsonData.interests : [],
      gender: jsonData.gender,
      interested_in: Array.isArray(jsonData.interestedIn) ? jsonData.interestedIn : [],
      personality_traits: Array.isArray(jsonData.personalityTraits) ? jsonData.personalityTraits : [],
      photos: Array.isArray(jsonData.photos) ? jsonData.photos : [],
      favorite_music: Array.isArray(jsonData.favoriteMusic) ? jsonData.favoriteMusic : [],
      voice_intro: jsonData.voiceIntro,
      updated_at: new Date().toISOString()
    };

    // Try direct update with RPC function to bypass recursion issues
    const { data: result, error: rpcError } = await supabase.rpc(
      'update_profile_data',
      {
        profile_id: userId,
        profile_data: updateData
      }
    );
    
    if (rpcError) {
      console.error('RPC update failed, falling back to direct update:', rpcError);
      
      // Fall back to direct update
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);
      
      if (error) {
        throw error;
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
