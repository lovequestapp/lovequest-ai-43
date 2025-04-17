
import { useUser } from '@/context/UserContext';
import { useState } from 'react';
import { toast } from 'sonner';
import { User } from '@/types/user';
import { supabase } from '@/lib/supabase';
import { directProfileUpdate } from '@/utils/directProfileUpdate';

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
      
      console.log('Attempting profile update with data:', data);
      
      // Try the direct profile update utility first
      const directSuccess = await directProfileUpdate(currentUser.id, data);
      
      if (!directSuccess) {
        console.log('Direct update failed, trying fallback methods');
        
        // Convert user data to JSON-compatible format
        const jsonData = userToJsonObject(data);
        
        // Try field-by-field updates as a fallback
        let anyFieldUpdated = false;
        
        for (const [key, value] of Object.entries(data)) {
          try {
            const fieldName = mapFieldToDbColumn(key as keyof User);
            if (!fieldName) continue;
            
            const jsonValue = JSON.parse(JSON.stringify(value));
            
            const { error: fieldError } = await supabase
              .rpc('update_profile_field', {
                profile_id: currentUser.id,
                field_name: fieldName,
                field_value: jsonValue
              });
              
            if (!fieldError) {
              anyFieldUpdated = true;
              console.log(`Successfully updated field: ${key}`);
            }
          } catch (fieldErr) {
            console.warn(`Failed to update field ${key}:`, fieldErr);
          }
        }
        
        if (!anyFieldUpdated) {
          throw new Error('Failed to update any profile fields');
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
      
      // Map the field name to database column
      const dbField = mapFieldToDbColumn(field);
      if (!dbField) {
        throw new Error(`Unknown field: ${String(field)}`);
      }
      
      console.log(`Updating field ${dbField} with value:`, jsonValue);
      
      // Use the database function
      const { data: result, error } = await supabase
        .rpc('update_profile_field', {
          profile_id: currentUser.id,
          field_name: dbField,
          field_value: jsonValue
        });
      
      if (error) {
        console.error('Error invoking profile update function:', error);
        
        // Fall back to direct update utility
        const partialData = { [field]: value } as Partial<User>;
        const directSuccess = await directProfileUpdate(currentUser.id, partialData);
        
        if (!directSuccess) {
          // Last fallback: direct table update
          const { error: fallbackError } = await supabase
            .from('profiles')
            .update({ [dbField]: jsonValue })
            .eq('id', currentUser.id);
            
          if (fallbackError) {
            throw new Error(fallbackError.message);
          }
        }
      }
      
      // Update in context
      const success = await updateProfileField(field, value);
      
      if (success) {
        toast.success(`Updated ${field.toString()}`);
        return true;
      } else {
        console.warn(`Context update succeeded but UI didn't refresh for field ${field.toString()}`);
        // Still return true since the database update worked
        return true;
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
      
      console.log('Fetching profile data for user:', userId);
      
      // Try the database function first
      const { data, error } = await supabase
        .rpc('get_profile_by_id', {
          profile_id: userId
        });
      
      if (error || !data || data.length === 0) {
        console.log('RPC method failed or returned no data, trying direct query');
        
        // Try direct query as first fallback
        const { data: directData, error: directError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
          
        if (directError || !directData) {
          console.log('Direct query failed, trying edge function');
          
          // Try the edge function as final fallback
          const { data: edgeData, error: edgeError } = await supabase.functions
            .invoke('get_profile_by_id', {
              body: { profileId: userId }
            });
            
          if (edgeError || !edgeData || !edgeData.data) {
            console.error('Edge function failed or returned no data');
            return null;
          }
          
          console.log('Successfully retrieved profile via edge function');
          return edgeData.data;
        }
        
        console.log('Successfully retrieved profile via direct query');
        return directData;
      }
      
      console.log('Successfully retrieved profile via RPC');
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
