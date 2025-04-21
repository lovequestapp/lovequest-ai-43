
import React from 'react';
import PhotoUploader from '@/components/profile-setup/PhotoUploader';

interface PhotoUploadStepProps {
  photos: string[];
  uploadingPhoto: boolean;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removePhoto: (index: number) => void;
  minRequiredPhotos?: number;
}

const PhotoUploadStep: React.FC<PhotoUploadStepProps> = ({
  photos,
  uploadingPhoto,
  handlePhotoUpload,
  removePhoto,
  minRequiredPhotos = 1,
}) => {
  return (
    <PhotoUploader
      photos={photos}
      uploadingPhoto={uploadingPhoto}
      handlePhotoUpload={handlePhotoUpload}
      removePhoto={removePhoto}
      minRequiredPhotos={minRequiredPhotos}
    />
  );
};

export default PhotoUploadStep;

