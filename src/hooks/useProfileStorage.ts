
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useProfileStorage = (userId: string) => {
  const [uploading, setUploading] = useState(false);

  /**
   * Upload a file to Supabase storage
   */
  const uploadFile = async (file: File, bucket: string = 'profile-photos', prefix: string = 'profiles'): Promise<string | null> => {
    if (!userId) {
      toast.error('User ID is required for upload');
      return null;
    }
    
    setUploading(true);
    
    try {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return null;
      }
      
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${prefix}/${userId}/${fileName}`;
      
      // Upload the file
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload file');
        return null;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);
      
      return publicUrl;
    } catch (error) {
      console.error('Error in file upload:', error);
      toast.error('An unexpected error occurred during upload');
      return null;
    } finally {
      setUploading(false);
    }
  };
  
  /**
   * Delete a file from Supabase storage
   */
  const deleteFile = async (fileUrl: string, bucket: string = 'profile-photos', prefix: string = 'profiles'): Promise<boolean> => {
    try {
      // Extract the path from the URL
      // Format: https://[project-ref].supabase.co/storage/v1/object/public/[bucket]/[path]
      const pathParts = fileUrl.split(`/storage/v1/object/public/${bucket}/`);
      
      if (pathParts.length < 2) {
        console.error('Invalid file URL format');
        return false;
      }
      
      const filePath = pathParts[1];
      
      // Delete the file
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);
      
      if (error) {
        console.error('Delete error:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in file deletion:', error);
      return false;
    }
  };
  
  return {
    uploading,
    uploadFile,
    deleteFile
  };
};
