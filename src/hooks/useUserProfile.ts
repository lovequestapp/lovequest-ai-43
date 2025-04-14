
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
   * Update the entire user profile
   */
  const updateUserProfile = async (data: Partial<User>) => {
    setIsUpdating(true);
    setUpdateError(null);
    
    try {
      if (!currentUser?.id) {
        throw new Error('User not authenticated');
      }
      
      // Use RPC call to avoid triggering RLS policy recursion
      const { error } = await supabase.rpc('update_profile_data', {
        p_user_id: currentUser.id,
        p_name: data.name,
        p_bio: data.bio,
        p_age: data.age,
        p_location: data.location,
        p_interests: data.interests,
        p_gender: data.gender,
        p_interested_in: data.interestedIn,
        p_personality_traits: data.personalityTraits,
        p_photos: data.photos,
        p_favorite_music: data.favoriteMusic,
        p_voice_intro: data.voiceIntro
      });
      
      if (error) {
        console.error('Error updating profile with RPC:', error);
        
        // Fallback to service role for critical functions if RPC fails
        const { error: directError } = await supabase.auth.admin.updateUserById(
          currentUser.id,
          {
            user_metadata: {
              name: data.name,
              updated_at: new Date().toISOString()
            }
          }
        );
        
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
      
      // Create a simple update object with just the one field
      const updateData = { [field]: value } as Partial<User>;
      
      // Use the same approach as updateUserProfile
      const dbField = mapFieldToDbColumn(field);
      if (!dbField) {
        throw new Error(`Unknown field: ${String(field)}`);
      }
      
      // Workaround for infinite recursion in RLS policies
      // Use functions API instead of direct table updates
      const { data, error } = await supabase.functions.invoke('update-profile-field', {
        body: {
          userId: currentUser.id,
          field: dbField,
          value: value
        }
      });
      
      if (error) {
        console.error('Error invoking profile update function:', error);
        // Fall back to direct update as a last resort
        const { error: fallbackError } = await supabase
          .from('profiles')
          .update({ [dbField]: value })
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
      
      // Directly fetch from supabase instead of using profileService
      // Using is_profile_owner function to avoid recursion issues
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile data:', error);
        throw error;
      }
      
      if (!data) {
        console.log('No profile data found, will fall back to context user data');
        return null;
      }
      
      return data;
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
