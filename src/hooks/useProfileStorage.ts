
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useProfileStorage = (userId: string) => {
  const [uploading, setUploading] = useState(false);

  /**
   * Upload a file to Supabase storage in the 'profile-photos' bucket, under 'profiles/<userId>/'
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
      
      console.log('Uploading file to path:', filePath);
      
      // Upload the file
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload file: ' + error.message);
        return null;
      }
      
      console.log('File uploaded successfully:', data.path);
      
      // Get the public URL
      const { data: publicData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);
      
      return publicData.publicUrl;
    } catch (error: any) {
      console.error('Error in file upload:', error);
      toast.error('An unexpected error occurred during upload: ' + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };
  
  /**
   * Delete a file from Supabase storage in 'profile-photos' bucket
   */
  const deleteFile = async (fileUrl: string, bucket: string = 'profile-photos'): Promise<boolean> => {
    try {
      if (!fileUrl) {
        console.warn('No file URL provided for deletion');
        return false;
      }
      
      // Extract the path from the URL
      const baseUrl = `https://utrifqgsjrtjlkufyhol.supabase.co/storage/v1/object/public/${bucket}/`;
      
      if (!fileUrl.startsWith(baseUrl)) {
        console.error('File URL does not belong to the bucket:', fileUrl);
        return false;
      }
      
      const filePath = fileUrl.substring(baseUrl.length);
      console.log('Deleting file at path:', filePath);
      
      // Delete the file
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);
      
      if (error) {
        console.error('Delete error:', error);
        return false;
      }
      
      console.log('File deleted successfully');
      return true;
    } catch (error: any) {
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
