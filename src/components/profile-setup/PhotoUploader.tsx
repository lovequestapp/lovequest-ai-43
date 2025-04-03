
import React from 'react';
import { Camera, X, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface PhotoUploaderProps {
  photos: string[];
  uploadingPhoto: boolean;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removePhoto: (index: number) => void;
  minRequiredPhotos?: number;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photos,
  uploadingPhoto,
  handlePhotoUpload,
  removePhoto,
  minRequiredPhotos = 1
}) => {
  // Max file size in MB
  const MAX_FILE_SIZE = 5;

  // Handle file validation before passing to the parent
  const validateAndUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      
      const file = e.target.files[0];
      
      // Check file size
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > MAX_FILE_SIZE) {
        toast.error(`File too large`, {
          description: `Please upload an image smaller than ${MAX_FILE_SIZE}MB`
        });
        // Reset the input
        e.target.value = '';
        return;
      }
      
      // Validate file type
      if (!file.type.match('image.*')) {
        toast.error("Invalid file type", {
          description: "Please upload a valid image file (JPEG, PNG, etc.)"
        });
        // Reset the input
        e.target.value = '';
        return;
      }
      
      // If validation passes, call the parent handler
      handlePhotoUpload(e);
    } catch (error) {
      console.error('Error validating file:', error);
      toast.error("File validation error", {
        description: "Please try uploading a different image"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Upload up to 6 photos for your LoveQuest profile (at least {minRequiredPhotos} required)</p>
        <span className="text-sm font-medium">{photos.length}/6</span>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {photos.map((photo, index) => (
          <div key={index} className="relative group aspect-square">
            <img 
              src={photo} 
              alt={`LoveQuest profile photo ${index + 1}`} 
              className="w-full h-full object-cover rounded-md"
            />
            <button
              type="button"
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removePhoto(index)}
              aria-label="Remove photo"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        
        {photos.length < 6 && (
          <label className="aspect-square border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={validateAndUpload}
              disabled={uploadingPhoto}
            />
            {uploadingPhoto ? (
              <Loader2 size={24} className="text-love-500 animate-spin" />
            ) : (
              <>
                <Camera size={24} className="text-gray-400" />
                <span className="text-sm text-gray-500 mt-1">Add Photo</span>
                <span className="text-xs text-gray-400 mt-1">Max {MAX_FILE_SIZE}MB</span>
              </>
            )}
          </label>
        )}
      </div>
      
      {photos.length < minRequiredPhotos && (
        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-md">
          <AlertTriangle size={16} />
          <p className="text-xs">Please upload at least {minRequiredPhotos} {minRequiredPhotos === 1 ? 'photo' : 'photos'} to continue with your LoveQuest profile.</p>
        </div>
      )}
    </div>
  );
};

export default PhotoUploader;
