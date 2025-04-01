
import React from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface PhotoUploaderProps {
  photos: string[];
  uploadingPhoto: boolean;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removePhoto: (index: number) => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photos,
  uploadingPhoto,
  handlePhotoUpload,
  removePhoto
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Profile Photos</h3>
      <p className="text-sm text-muted-foreground">Upload up to 6 photos for your profile (at least 1 required)</p>
      
      <div className="grid grid-cols-3 gap-3">
        {photos.map((photo, index) => (
          <div key={index} className="relative group aspect-square">
            <img 
              src={photo} 
              alt={`Profile photo ${index + 1}`} 
              className="w-full h-full object-cover rounded-md"
            />
            <button
              type="button"
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removePhoto(index)}
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
              onChange={handlePhotoUpload}
              disabled={uploadingPhoto}
            />
            {uploadingPhoto ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            ) : (
              <>
                <Camera size={24} className="text-gray-400" />
                <span className="text-sm text-gray-500 mt-1">Add Photo</span>
                <span className="text-xs text-gray-400 mt-1">{photos.length}/6</span>
              </>
            )}
          </label>
        )}
      </div>
      
      {photos.length === 0 && (
        <p className="text-xs text-amber-600">Please upload at least one photo to continue.</p>
      )}
    </div>
  );
};

export default PhotoUploader;
