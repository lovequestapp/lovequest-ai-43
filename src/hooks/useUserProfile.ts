
import { useUser } from '@/context/UserContext';
import { useState } from 'react';
import { toast } from 'sonner';
import { User } from '@/types/user';
import { supabase } from '@/lib/supabase';

/**
 * A custom hook for handling user profile operations
 */
export const useUserProfile = () => {
  const { 
    currentUser, 
    updateProfile, 
    updateProfileField, 
    uploadProfilePhoto, 
    deleteProfilePhoto 
  } = useUser();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * Convert User object to JSON-compatible format
   */
  const userToJsonObject = (userData: Partial<User>): Record<string, any> => {
    return JSON.parse(JSON.stringify(userData));
  };
  
  /**
   * Update the entire user profile
   */
  const updateUserProfile = async (data: Partial<User>) => {
    setIsUpdating(true);
    setUpdateError(null);
    
    try {
      if (!currentUser?.id) {
        throw new Error('User not authenticated');
      }
      
      // Convert user data to JSON-compatible format
      const jsonData = userToJsonObject(data);
      
      // Use the database function for profile updates
      const { data: result, error } = await supabase
        .rpc('update_profile_data', {
          profile_id: currentUser.id,
          profile_data: jsonData
        });
      
      if (error) {
        console.error('Error updating profile with database function:', error);
        
        // Fallback to direct update with simplified mapping
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
        
        // Update the timestamp
        updateData.updated_at = new Date().toISOString();
        
        const { error: directError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', currentUser.id);
        
        if (directError) {
          throw new Error(directError.message);
        }
      }
      
      // If database update was successful, also update the local context
      await updateProfile(data);
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Profile update error:', error);
      setUpdateError(errorMessage);
      toast.error(`Error updating profile: ${errorMessage}`);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };
  
  /**
   * Update a single field in the user profile
   */
  const updateField = async <K extends keyof User>(field: K, value: User[K]) => {
    setIsUpdating(true);
    setUpdateError(null);
    
    try {
      if (!currentUser?.id) {
        throw new Error('User not authenticated');
      }
      
      // Convert value to JSON-compatible format
      const jsonValue = JSON.parse(JSON.stringify(value));
      
      // Use the same approach as updateUserProfile
      const dbField = mapFieldToDbColumn(field);
      if (!dbField) {
        throw new Error(`Unknown field: ${String(field)}`);
      }
      
      // Use the new database function
      const { data: result, error } = await supabase
        .rpc('update_profile_field', {
          profile_id: currentUser.id,
          field_name: dbField,
          field_value: jsonValue
        });
      
      if (error) {
        console.error('Error invoking profile update function:', error);
        // Fall back to direct update as a last resort
        const { error: fallbackError } = await supabase
          .from('profiles')
          .update({ [dbField]: jsonValue })
          .eq('id', currentUser.id)
          .select();
          
        if (fallbackError) {
          throw new Error(fallbackError.message);
        }
      }
      
      // Then update in context
      const success = await updateProfileField(field, value);
      
      if (success) {
        toast.success(`Updated ${field.toString()}`);
        return true;
      } else {
        throw new Error(`Failed to update context for ${field.toString()}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Field update error:', error);
      setUpdateError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };
  
  /**
   * Map User type fields to database column names
   */
  const mapFieldToDbColumn = (field: keyof User): string | null => {
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
    
    return fieldMap[field as string] || null;
  };
  
  /**
   * Fetch a user's profile data directly from Supabase
   */
  const fetchProfileData = async (userId: string) => {
    setIsLoading(true);
    
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      // Add a small delay to prevent multiple rapid requests
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Use the new database function to fetch profile
      const { data, error } = await supabase
        .rpc('get_profile_by_id', {
          profile_id: userId
        });
      
      if (error) {
        console.error('Error fetching profile data:', error);
        
        // Fallback to direct query
        const { data: directData, error: directError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
          
        if (directError) {
          throw directError;
        }
        
        if (!directData) {
          console.log('No profile data found, will fall back to context user data');
          return null;
        }
        
        return directData;
      }
      
      if (!data || data.length === 0) {
        console.log('No profile data found via RPC, will fall back to context user data');
        return null;
      }
      
      return data[0];
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Handle uploading a profile photo
   */
  const handleUploadPhoto = async (file: File) => {
    setIsUpdating(true);
    setUpdateError(null);
    
    try {
      if (!currentUser?.id) {
        throw new Error('User not authenticated');
      }
      
      const photoUrl = await uploadProfilePhoto(file);
      toast.success('Photo uploaded successfully');
      return photoUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload photo';
      console.error('Photo upload error:', error);
      setUpdateError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };
  
  /**
   * Handle deleting a profile photo
   */
  const handleDeletePhoto = async (photoUrl: string) => {
    setIsUpdating(true);
    setUpdateError(null);
    
    try {
      if (!currentUser?.id) {
        throw new Error('User not authenticated');
      }
      
      const success = await deleteProfilePhoto(photoUrl);
      if (success) {
        toast.success('Photo deleted successfully');
        return true;
      } else {
        throw new Error('Failed to delete photo');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Photo delete error:', error);
      setUpdateError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };
  
  return {
    currentUser,
    updateUserProfile,
    updateField,
    uploadPhoto: handleUploadPhoto,
    deletePhoto: handleDeletePhoto,
    fetchProfileData,
    isUpdating,
    isLoading,
    updateError
  };
};
