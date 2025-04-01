
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Camera, X, Plus, Upload } from 'lucide-react';

// Define the schema for form validation
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(500, 'Bio must not exceed 500 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  age: z.number().min(18, 'Must be at least 18 years old').max(100, 'Age must be reasonable'),
  gender: z.string().min(1, 'Gender is required'),
  interests: z.array(z.string()).optional(),
  favoriteMusic: z.array(z.string()).optional(),
  personalityTraits: z.array(z.string()).optional(),
});

interface ProfileEditorProps {
  initialData?: any;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ initialData }) => {
  const { currentUser, updateUserProfile } = useUser();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  
  const userData = initialData || currentUser;
  
  // Use react-hook-form for form handling
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userData?.name || '',
      bio: userData?.bio || '',
      location: userData?.location || '',
      age: userData?.age || 18,
      gender: userData?.gender || '',
      interests: userData?.interests || [],
      favoriteMusic: userData?.favoriteMusic || [],
      personalityTraits: userData?.personalityTraits || [],
    },
  });
  
  useEffect(() => {
    if (userData) {
      setValue('name', userData.name || '');
      setValue('bio', userData.bio || '');
      setValue('location', userData.location || '');
      setValue('age', userData.age || 18);
      setValue('gender', userData.gender || '');
      setValue('interests', userData.interests || []);
      setValue('favoriteMusic', userData.favoriteMusic || []);
      setValue('personalityTraits', userData.personalityTraits || []);
      setPhotos(userData.photos || []);
    }
  }, [userData, setValue]);
  
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await updateUserProfile({
        ...data,
        photos,
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    
    // Check if already at max 6 photos
    if (photos.length >= 6) {
      toast.error('You can only upload up to 6 photos');
      return;
    }
    
    setUploadingPhoto(true);
    try {
      // For demo purposes, create object URL
      // In production, you would upload to Supabase storage
      const imageUrl = URL.createObjectURL(file);
      
      // Add to photos array
      setPhotos([...photos, imageUrl]);
      toast.success('Photo added successfully');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };
  
  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h3 className="text-lg font-medium">Profile Photos</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {photos.map((photo, index) => (
              <div key={index} className="relative group">
                <img 
                  src={photo} 
                  alt={`Profile photo ${index + 1}`} 
                  className="w-full h-32 object-cover rounded-md"
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
              <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                />
                {uploadingPhoto ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-love-500"></div>
                ) : (
                  <>
                    <Plus size={24} className="text-gray-400" />
                    <span className="text-sm text-gray-500 mt-1">Add Photo</span>
                    <span className="text-xs text-gray-400 mt-1">{photos.length}/6</span>
                  </>
                )}
              </label>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <Input
                id="name"
                {...register('name')}
                className="mt-1"
                error={errors.name?.message}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <Textarea
                id="bio"
                {...register('bio')}
                className="mt-1 h-32"
                error={errors.bio?.message}
              />
              {errors.bio && (
                <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
              )}
            </div>
            
            {/* More form fields for location, age, gender, etc. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <Input
                  id="location"
                  {...register('location')}
                  className="mt-1"
                  error={errors.location?.message}
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <Input
                  id="age"
                  type="number"
                  {...register('age', { valueAsNumber: true })}
                  className="mt-1"
                  error={errors.age?.message}
                />
                {errors.age && (
                  <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                id="gender"
                {...register('gender')}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-love-500 focus:border-love-500 sm:text-sm rounded-md"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
              )}
            </div>
            
            {/* Add interest tags, personality traits here */}
            
            <div className="flex justify-end">
              <Button type="submit" disabled={loading} className="bg-love-500 hover:bg-love-600">
                {loading ? 'Updating...' : 'Save Profile'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileEditor;
