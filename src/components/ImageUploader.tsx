
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, ImagePlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@/context/UserContext';

interface ImageUploaderProps {
  onImageUploaded?: (url: string) => void;
  maxSize?: number; // in MB
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUploaded,
  maxSize = 2,
  className
}) => {
  const [uploading, setUploading] = useState(false);
  const { currentUser } = useUser();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (!files || files.length === 0) {
        return;
      }

      const file = files[0];
      const fileSize = file.size / 1024 / 1024; // size in MB
      
      // Validate file size
      if (fileSize > maxSize) {
        toast.error(`File too large`, { 
          description: `Please upload an image smaller than ${maxSize}MB` 
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

      // Mock image upload - in a real app, this would upload to your storage
      setTimeout(() => {
        // Create a URL for the image
        const imageUrl = URL.createObjectURL(file);
        if (onImageUploaded) {
          onImageUploaded(imageUrl);
        }
        toast.success("Image uploaded successfully");
        setUploading(false);
      }, 1500);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Upload failed", { 
        description: "There was a problem uploading your image" 
      });
      setUploading(false);
    }
  };

  return (
    <Card className={`p-4 border-dashed border-2 hover:border-primary/50 transition-all ${className}`}>
      <label className="flex flex-col items-center justify-center cursor-pointer">
        <div className="flex flex-col items-center justify-center gap-2">
          {uploading ? (
            <>
              <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
              <span className="text-sm text-muted-foreground">Uploading image...</span>
            </>
          ) : (
            <>
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                <ImagePlus className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="mt-2 text-center">
                <p className="text-sm font-medium">Click to upload image</p>
                <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, GIF up to {maxSize}MB</p>
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
          onChange={handleImageUpload}
          disabled={uploading || !currentUser}
        />
      </label>
    </Card>
  );
};

export default ImageUploader;
