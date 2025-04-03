
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
      
      const success = await updateProfile(data);
      if (success) {
        toast.success('Profile updated successfully');
        return true;
      } else {
        throw new Error('Failed to update profile');
      }
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
      
      const success = await updateProfileField(field, value);
      if (success) {
        toast.success(`Updated ${field.toString()}`);
        return true;
      } else {
        throw new Error(`Failed to update ${field.toString()}`);
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
   * Fetch a user's profile data directly from Supabase
   */
  const fetchProfileData = async (userId: string) => {
    setIsLoading(true);
    
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      
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
