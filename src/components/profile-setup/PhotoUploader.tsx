
import React from 'react';
import { Camera, X, Loader2 } from 'lucide-react';

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
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Upload up to 6 photos for your profile (at least {minRequiredPhotos} required)</p>
      
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
              <Loader2 size={24} className="text-love-500 animate-spin" />
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
      
      {photos.length < minRequiredPhotos && (
        <p className="text-xs text-amber-600">Please upload at least {minRequiredPhotos} {minRequiredPhotos === 1 ? 'photo' : 'photos'} to continue.</p>
      )}
    </div>
  );
};

export default PhotoUploader;
