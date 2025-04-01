
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, ImagePlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';

interface ProfilePhotoUploaderProps {
  onPhotoUploaded?: (url: string) => void;
}

const ProfilePhotoUploader = ({ onPhotoUploaded }: ProfilePhotoUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const { currentUser, uploadProfilePhoto } = useUser();

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (!files || files.length === 0) {
        return;
      }

      const file = files[0];
      const fileSize = file.size / 1024 / 1024; // size in MB
      
      // Validate file size (max 2MB)
      if (fileSize > 2) {
        toast.error("File too large", { 
          description: "Please upload an image smaller than 2MB" 
        });
        return;
      }

      // Validate file type
      if (!file.type.match('image.*')) {
        toast.error("Invalid file type", { 
          description: "Please upload an image file" 
        });
        return;
      }

      setUploading(true);

      // Create bucket if it doesn't exist (this will actually be handled by our SQL)
      try {
        await supabase.storage.createBucket('profile-photos', {
          public: true,
          fileSizeLimit: 2097152 // 2MB in bytes
        });
      } catch (error) {
        // Bucket might already exist, continue
        console.log('Bucket creation:', error);
      }

      // Upload the photo
      const photoUrl = await uploadProfilePhoto(file);
      
      if (photoUrl && onPhotoUploaded) {
        onPhotoUploaded(photoUrl);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error("Upload failed", { 
        description: "There was a problem uploading your photo" 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-4 border-dashed border-2 hover:border-primary/50 transition-all">
      <label className="flex flex-col items-center justify-center cursor-pointer">
        <div className="flex flex-col items-center justify-center gap-2">
          {uploading ? (
            <>
              <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
              <span className="text-sm text-muted-foreground">Uploading photo...</span>
            </>
          ) : (
            <>
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                <ImagePlus className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="mt-2 text-center">
                <p className="text-sm font-medium">Click to upload photo</p>
                <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, GIF up to 2MB</p>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="mt-2"
                disabled={!currentUser}
              >
                <Upload className="h-4 w-4 mr-2" />
                Select Image
              </Button>
            </>
          )}
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handlePhotoUpload}
          disabled={uploading || !currentUser}
        />
      </label>
    </Card>
  );
};

export default ProfilePhotoUploader;
