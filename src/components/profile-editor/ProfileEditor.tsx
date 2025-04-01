
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';
import { Camera, X, Plus, Upload } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form';
import { updateProfileData, uploadProfilePhoto } from '@/services/profileService';
import VoiceRecorder from '@/components/VoiceRecorder';

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
  const { currentUser, setCurrentUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [voiceIntro, setVoiceIntro] = useState<string | null>(null);
  
  const userData = initialData || currentUser;
  
  // Use react-hook-form for form handling
  const form = useForm({
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
      form.setValue('name', userData.name || '');
      form.setValue('bio', userData.bio || '');
      form.setValue('location', userData.location || '');
      form.setValue('age', userData.age || 18);
      form.setValue('gender', userData.gender || '');
      form.setValue('interests', userData.interests || []);
      form.setValue('favoriteMusic', userData.favoriteMusic || []);
      form.setValue('personalityTraits', userData.personalityTraits || []);
      setPhotos(userData.photos || []);
      setVoiceIntro(userData.voiceIntro || null);
    }
  }, [userData, form]);
  
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (!userData || !userData.id) {
        toast.error('User data not available');
        return;
      }
      
      console.log('Submitting profile update:', { ...data, photos, voiceIntro });
      
      // Call the profileService to update the user's profile
      const success = await updateProfileData(userData.id, {
        ...data,
        photos,
        voiceIntro,
      });
      
      if (success) {
        // Update local state with new data
        if (setCurrentUser) {
          setCurrentUser(prev => {
            if (prev) {
              return { 
                ...prev, 
                ...data, 
                photos, 
                voiceIntro 
              };
            }
            return prev;
          });
        }
        
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
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
      if (!userData || !userData.id) {
        toast.error('User data not available for photo upload');
        return;
      }
      
      // Upload photo using profileService
      const photoUrl = await uploadProfilePhoto(userData.id, file);
      
      if (photoUrl) {
        // Add to photos array
        const newPhotos = [...photos, photoUrl];
        setPhotos(newPhotos);
        
        // Update user's profile with new photos array
        await updateProfileData(userData.id, { photos: newPhotos });
        
        toast.success('Photo added successfully');
      } else {
        toast.error('Failed to upload photo');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };
  
  const removePhoto = async (index: number) => {
    try {
      if (!userData || !userData.id) {
        toast.error('User data not available');
        return;
      }
      
      const newPhotos = [...photos];
      newPhotos.splice(index, 1);
      setPhotos(newPhotos);
      
      // Update user's profile with new photos array
      await updateProfileData(userData.id, { photos: newPhotos });
      
      toast.success('Photo removed successfully');
    } catch (error) {
      console.error('Error removing photo:', error);
      toast.error('Failed to remove photo');
    }
  };
  
  const handleVoiceRecordingComplete = async (audioData: string) => {
    try {
      if (!userData || !userData.id) {
        toast.error('User data not available');
        return;
      }
      
      setVoiceIntro(audioData);
      
      // Update user's profile with new voice intro
      await updateProfileData(userData.id, { voiceIntro: audioData });
      
      toast.success('Voice intro saved successfully');
    } catch (error) {
      console.error('Error saving voice intro:', error);
      toast.error('Failed to save voice intro');
    }
  };
  
  const handleDeleteVoiceIntro = async () => {
    try {
      if (!userData || !userData.id) {
        toast.error('User data not available');
        return;
      }
      
      setVoiceIntro(null);
      
      // Update user's profile with empty voice intro
      await updateProfileData(userData.id, { voiceIntro: '' });
      
      toast.success('Voice intro removed successfully');
    } catch (error) {
      console.error('Error removing voice intro:', error);
      toast.error('Failed to remove voice intro');
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input id="name" {...field} className="mt-1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea id="bio" {...field} className="mt-1 h-32" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input id="location" {...field} className="mt-1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input 
                          id="age" 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                          className="mt-1" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <select
                        id="gender"
                        {...field}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-love-500 focus:border-love-500 sm:text-sm rounded-md"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="non-binary">Non-binary</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Voice Introduction</h3>
                <p className="text-sm text-gray-500">Record a brief voice introduction for your profile</p>
                <VoiceRecorder 
                  onRecordingComplete={handleVoiceRecordingComplete}
                  initialAudio={voiceIntro || undefined}
                  onDelete={handleDeleteVoiceIntro}
                />
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" disabled={loading} className="bg-love-500 hover:bg-love-600">
                  {loading ? 'Updating...' : 'Save Profile'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileEditor;
