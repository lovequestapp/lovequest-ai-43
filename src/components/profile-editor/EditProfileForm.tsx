
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Loader2, Save, X } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form';
import VoiceRecorder from '@/components/VoiceRecorder';
import { User } from '@/types/user';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

// Define the schema for form validation
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(500, 'Bio must not exceed 500 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  age: z.coerce.number().min(18, 'Must be at least 18 years old').max(100, 'Age must be reasonable'),
  gender: z.string().min(1, 'Gender is required'),
});

interface EditProfileFormProps {
  initialData: User;
  onUpdate: (data: Partial<User>) => Promise<boolean>;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ initialData, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>(initialData.photos || []);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [voiceIntro, setVoiceIntro] = useState<string | null>(initialData.voiceIntro || null);
  const [interests, setInterests] = useState<string[]>(initialData.interests || []);
  const [favoriteMusic, setFavoriteMusic] = useState<string[]>(initialData.favoriteMusic || []);
  const [personalityTraits, setPersonalityTraits] = useState<string[]>(initialData.personalityTraits || []);
  const [interestedIn, setInterestedIn] = useState<('male' | 'female' | 'non-binary')[]>(initialData.interestedIn || []);
  
  // Create form with react-hook-form
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData.name || '',
      bio: initialData.bio || '',
      location: initialData.location || '',
      age: initialData.age || 18,
      gender: initialData.gender || '',
    },
  });
  
  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    setLoading(true);
    try {
      // Combine form data with other state
      const updatedData: Partial<User> = {
        ...data,
        photos,
        voiceIntro: voiceIntro || '',
        interests,
        favoriteMusic,
        personalityTraits,
        interestedIn,
      };
      
      const success = await onUpdate(updatedData);
      
      if (!success) {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
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
      if (!initialData || !initialData.id) {
        toast.error('User data not available for photo upload');
        return;
      }
      
      // Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `profiles/${initialData.id}/${fileName}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);
      
      if (urlData) {
        const newPhotos = [...photos, urlData.publicUrl];
        setPhotos(newPhotos);
        
        // Update profile with new photos array
        await onUpdate({ photos: newPhotos });
        
        toast.success('Photo added successfully');
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
      const newPhotos = [...photos];
      const removedPhoto = newPhotos.splice(index, 1)[0];
      setPhotos(newPhotos);
      
      // Extract the path from the URL
      const urlParts = removedPhoto.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `profiles/${initialData.id}/${fileName}`;
      
      // Try to remove from storage (but don't block UI on this)
      supabase.storage
        .from('profile-photos')
        .remove([filePath])
        .then(({ error }) => {
          if (error) {
            console.warn('Could not remove photo from storage:', error);
          }
        });
      
      // Update profile with new photos array
      await onUpdate({ photos: newPhotos });
      
      toast.success('Photo removed successfully');
    } catch (error) {
      console.error('Error removing photo:', error);
      toast.error('Failed to remove photo');
    }
  };
  
  const handleVoiceRecordingComplete = async (audioData: string) => {
    setVoiceIntro(audioData);
    await onUpdate({ voiceIntro: audioData });
    toast.success('Voice intro saved');
  };
  
  const handleDeleteVoiceIntro = async () => {
    setVoiceIntro(null);
    await onUpdate({ voiceIntro: '' });
    toast.success('Voice intro removed');
  };
  
  const toggleInterest = async (interest: string) => {
    let updatedInterests: string[];
    if (interests.includes(interest)) {
      updatedInterests = interests.filter(i => i !== interest);
    } else {
      if (interests.length >= 20) {
        toast.error('You can select up to 20 interests');
        return;
      }
      updatedInterests = [...interests, interest];
    }
    
    setInterests(updatedInterests);
    await onUpdate({ interests: updatedInterests });
  };
  
  const toggleMusic = async (genre: string) => {
    let updatedMusic: string[];
    if (favoriteMusic.includes(genre)) {
      updatedMusic = favoriteMusic.filter(m => m !== genre);
    } else {
      if (favoriteMusic.length >= 10) {
        toast.error('You can select up to 10 music genres');
        return;
      }
      updatedMusic = [...favoriteMusic, genre];
    }
    
    setFavoriteMusic(updatedMusic);
    await onUpdate({ favoriteMusic: updatedMusic });
  };
  
  const togglePersonalityTrait = async (trait: string) => {
    let updatedTraits: string[];
    if (personalityTraits.includes(trait)) {
      updatedTraits = personalityTraits.filter(t => t !== trait);
    } else {
      if (personalityTraits.length >= 8) {
        toast.error('You can select up to 8 personality traits');
        return;
      }
      updatedTraits = [...personalityTraits, trait];
    }
    
    setPersonalityTraits(updatedTraits);
    await onUpdate({ personalityTraits: updatedTraits });
  };
  
  const toggleGenderInterest = async (gender: 'male' | 'female' | 'non-binary') => {
    let updatedGenderInterests: ('male' | 'female' | 'non-binary')[];
    if (interestedIn.includes(gender)) {
      updatedGenderInterests = interestedIn.filter(g => g !== gender);
    } else {
      updatedGenderInterests = [...interestedIn, gender];
    }
    
    setInterestedIn(updatedGenderInterests);
    await onUpdate({ interestedIn: updatedGenderInterests });
  };
  
  // Sample data for UI
  const interestCategories = [
    { category: "Lifestyle", items: ["Travel", "Fashion", "Gaming", "Technology", "Pets", "Gardening", "DIY"] },
    { category: "Sports & Fitness", items: ["Running", "Yoga", "Gym", "Hiking", "Swimming", "Cycling", "Basketball"] },
    { category: "Arts & Culture", items: ["Music", "Art", "Theater", "Photography", "Reading", "Film", "Museums"] },
    { category: "Food & Drink", items: ["Cooking", "Baking", "Wine", "Foodie", "Coffee", "Vegan", "BBQ"] }
  ];
  
  const musicGenres = ["Pop", "Rock", "Hip Hop", "Jazz", "Classical", "Country", "Electronic", "R&B", "Folk", "Blues", "Metal", "Reggae", "Indie"];
  
  const traits = ["Adventurous", "Ambitious", "Caring", "Creative", "Funny", "Honest", "Independent", "Intellectual", "Outgoing", "Reliable", "Romantic", "Spontaneous", "Thoughtful", "Loyal", "Calm", "Energetic"];
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Photo Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Profile Photos</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-gray-100 border">
                <img 
                  src={photo} 
                  alt={`Profile ${index + 1}`} 
                  className="object-cover w-full h-full"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 rounded-full"
                  onClick={() => removePhoto(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {photos.length < 6 && (
              <div className="relative aspect-square rounded-md bg-gray-50 border border-dashed flex items-center justify-center">
                <input
                  type="file"
                  id="photoUpload"
                  className="sr-only"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                />
                <label
                  htmlFor="photoUpload"
                  className="cursor-pointer flex flex-col items-center justify-center text-sm text-gray-500 w-full h-full"
                >
                  {uploadingPhoto ? (
                    <Loader2 className="h-6 w-6 animate-spin text-love-500" />
                  ) : (
                    <>
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Add Photo</span>
                    </>
                  )}
                </label>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Basic Info Section */}
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground mt-1">
                  {field.value.length}/500 characters
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <select
                      className="w-full p-2 border rounded-md"
                      {...field}
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
            
            <div>
              <FormLabel>Interested In</FormLabel>
              <div className="flex flex-wrap gap-2 mt-2">
                {(['male', 'female', 'non-binary'] as const).map((gender) => (
                  <Button
                    key={gender}
                    type="button"
                    variant={interestedIn.includes(gender) ? "default" : "outline"}
                    onClick={() => toggleGenderInterest(gender)}
                    className="capitalize"
                  >
                    {gender}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator />
        
        {/* Voice Intro Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Voice Introduction</h3>
          <VoiceRecorder 
            onRecordingComplete={handleVoiceRecordingComplete}
            initialAudio={voiceIntro || undefined}
            onDelete={handleDeleteVoiceIntro}
          />
        </div>

        <Separator />
        
        {/* Interests Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Interests</h3>
          <p className="text-sm text-muted-foreground">
            Select interests that you enjoy or are passionate about
          </p>
          
          <div className="space-y-6">
            {interestCategories.map((category) => (
              <div key={category.category} className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">{category.category}</h4>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item) => {
                    const isSelected = interests.includes(item);
                    return (
                      <Badge 
                        key={item}
                        variant={isSelected ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer py-1.5 px-3 hover:bg-love-50",
                          isSelected ? "bg-love-500 hover:bg-love-600" : "hover:text-love-600 hover:border-love-200"
                        )}
                        onClick={() => toggleInterest(item)}
                      >
                        {item}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />
        
        {/* Music Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Favorite Music</h3>
          <div className="flex flex-wrap gap-2">
            {musicGenres.map((genre) => {
              const isSelected = favoriteMusic.includes(genre);
              return (
                <Badge 
                  key={genre}
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer py-1.5 px-3 hover:bg-love-50",
                    isSelected ? "bg-love-500 hover:bg-love-600" : "hover:text-love-600 hover:border-love-200"
                  )}
                  onClick={() => toggleMusic(genre)}
                >
                  {genre}
                </Badge>
              );
            })}
          </div>
        </div>

        <Separator />
        
        {/* Personality Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Personality Traits</h3>
          <p className="text-sm text-muted-foreground">
            Select traits that best describe your personality
          </p>
          
          <div className="flex flex-wrap gap-2">
            {traits.map((trait) => {
              const isSelected = personalityTraits.includes(trait);
              return (
                <Badge 
                  key={trait}
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer py-1.5 px-3 hover:bg-love-50",
                    isSelected ? "bg-love-500 hover:bg-love-600" : "hover:text-love-600 hover:border-love-200"
                  )}
                  onClick={() => togglePersonalityTrait(trait)}
                >
                  {trait}
                </Badge>
              );
            })}
          </div>
        </div>
        
        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditProfileForm;
