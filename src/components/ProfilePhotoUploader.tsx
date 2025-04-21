
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, ImagePlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@/context/UserContext';
import { uploadProfilePhoto, deleteProfilePhoto } from '@/services/profileService';

interface ProfilePhotoUploaderProps {
  onPhotoUploaded?: (url: string) => void;
  onPhotoRemoved?: (url: string) => void;
}

const ProfilePhotoUploader = ({ onPhotoUploaded, onPhotoRemoved }: ProfilePhotoUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const { currentUser } = useUser();

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (!files || files.length === 0) {
        return;
      }

      const file = files[0];
      const fileSize = file.size / 1024 / 1024; // size in MB
      
      // Validate file size (max 5MB to stay consistent with validation)
      if (fileSize > 5) {
        toast.error("File too large", { 
          description: "Please upload an image smaller than 5MB" 
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

      if (!currentUser || !currentUser.id) {
        toast.error("You must be logged in to upload photos");
        setUploading(false);
        return;
      }

      // Upload the photo to the correct bucket via the service
      const photoUrl = await uploadProfilePhoto(currentUser.id, file);
      
      if (photoUrl && onPhotoUploaded) {
        onPhotoUploaded(photoUrl);
        toast.success("Photo uploaded successfully");
      } else {
        throw new Error("Failed to upload photo");
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

  const handlePhotoRemove = async (photoUrl: string) => {
    if (!photoUrl) return;
    setUploading(true);
    try {
      const success = await deleteProfilePhoto(photoUrl);
      if (success) {
        if (onPhotoRemoved) onPhotoRemoved(photoUrl);
        toast.success('Photo removed successfully');
      } else {
        throw new Error('Failed to remove photo');
      }
    } catch (error) {
      console.error('Error removing photo:', error);
      toast.error('Failed to remove photo');
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
                <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, GIF up to 5MB</p>
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
