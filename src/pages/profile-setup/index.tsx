import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { useAuth } from '@/hooks/useAuth';
import PersonalityTraitSelector from '@/components/PersonalityTraitSelector';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronLeft, ChevronRight, Camera, Mic, User } from 'lucide-react';

type GenderType = 'male' | 'female' | 'non-binary';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { user, authenticated, loading } = useAuth();
  const { currentUser, updateUserProfile } = useUser();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [voiceNote, setVoiceNote] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    age: currentUser?.age || 18,
    location: currentUser?.location || '',
    bio: currentUser?.bio || '',
    gender: (currentUser?.gender as GenderType) || '' as string,
    interestedIn: currentUser?.interestedIn || [],
    personalityTraits: currentUser?.personalityTraits || []
  });
  
  useEffect(() => {
    if (!loading && !authenticated) {
      navigate('/login');
    }
  }, [loading, authenticated, navigate]);
  
  const handleProfileDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: name === 'age' ? Number(value) : value
    }));
  };
  
  const handleGenderInterestChange = (interest: 'male' | 'female' | 'non-binary') => {
    setProfileData(prev => {
      const currentInterests = [...prev.interestedIn] as ('male' | 'female' | 'non-binary')[];
      
      if (currentInterests.includes(interest)) {
        return {
          ...prev,
          interestedIn: currentInterests.filter(i => i !== interest)
        };
      } else {
        return {
          ...prev,
          interestedIn: [...currentInterests, interest]
        };
      }
    });
  };
  
  const handlePersonalityTraitSelect = (trait: string) => {
    setProfileData(prev => {
      const traits = [...prev.personalityTraits];
      
      if (traits.includes(trait)) {
        return {
          ...prev,
          personalityTraits: traits.filter(t => t !== trait)
        };
      } else {
        return {
          ...prev,
          personalityTraits: [...traits, trait]
        };
      }
    });
  };
  
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    
    if (photos.length >= 6) {
      toast.error('You can only upload up to 6 photos');
      return;
    }
    
    setUploadingPhoto(true);
    try {
      const imageUrl = URL.createObjectURL(file);
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
  
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setVoiceNote('voice_recording.mp3');
      toast.success('Voice note recorded successfully');
    } else {
      setIsRecording(true);
      toast.info('Recording voice note...');
    }
  };
  
  const handleNextStep = () => {
    if (step === 1) {
      if (!profileData.name || !profileData.age || !profileData.location) {
        toast.error('Please fill in all required basic information');
        return;
      }
      if (profileData.age < 18) {
        toast.error('You must be at least at 18 years old');
        return;
      }
    }
    
    if (step === 2) {
      if (!profileData.bio || profileData.bio.length < 20) {
        toast.error('Please write a bio with at least 20 characters');
        return;
      }
    }
    
    setStep(step + 1);
  };
  
  const handlePrevStep = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = async () => {
    if (photos.length === 0) {
      toast.error('Please upload at least one photo');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (!currentUser) {
        throw new Error('User data not available');
      }
      
      const gender = profileData.gender;
      let validGender: GenderType = 'non-binary';
      
      if (gender === 'male' || gender === 'female' || gender === 'non-binary') {
        validGender = gender as GenderType;
      }
      
      await updateUserProfile(currentUser.id, {
        ...profileData,
        gender: validGender,
        photos,
        voiceIntro: voiceNote || ''
      });
      
      toast.success('Profile setup completed!');
      navigate('/user-profile');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile', { 
        description: error.message || 'An unexpected error occurred' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderProgress = () => {
    const percent = (step / 4) * 100;
    return (
      <div className="w-full mb-6">
        <Progress value={percent} className="h-2" />
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>Step {step} of 4</span>
          <span>{Math.round(percent)}% Complete</span>
        </div>
      </div>
    );
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileDataChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age"
                    name="age"
                    type="number"
                    min={18}
                    value={profileData.age}
                    onChange={handleProfileDataChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location"
                    name="location"
                    value={profileData.location}
                    onChange={handleProfileDataChange}
                    placeholder="City, Country"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  name="gender"
                  value={profileData.gender}
                  onChange={handleProfileDataChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-love-500 focus:border-love-500 sm:text-sm rounded-md"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label>Interested In (select all that apply)</Label>
                <div className="flex flex-wrap gap-2">
                  {['male', 'female', 'non-binary'].map((gender) => (
                    <Button
                      key={gender}
                      type="button"
                      variant={profileData.interestedIn.includes(gender as any) ? "default" : "outline"}
                      onClick={() => handleGenderInterestChange(gender as 'male' | 'female' | 'non-binary')}
                      className="capitalize"
                    >
                      {gender}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">About You</h3>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio"
                name="bio"
                value={profileData.bio}
                onChange={handleProfileDataChange}
                placeholder="Tell us about yourself, your interests, hobbies, and what you're looking for..."
                rows={6}
                required
              />
              <p className="text-xs text-muted-foreground">
                {profileData.bio.length}/500 characters 
                {profileData.bio.length < 20 && " (minimum 20 characters)"}
              </p>
            </div>
            
            <div className="space-y-2 pt-4">
              <Label>Personality Traits</Label>
              <PersonalityTraitSelector 
                selectedTraits={profileData.personalityTraits} 
                onSelectTrait={handlePersonalityTraitSelect} 
              />
            </div>
          </div>
        );
      case 3:
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
                    <ChevronLeft size={16} className="rotate-45" />
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
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-love-500"></div>
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
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Voice Introduction</h3>
            <p className="text-sm text-muted-foreground">Add a voice note to let others hear your voice (optional)</p>
            
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-md">
              {voiceNote ? (
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-love-100 flex items-center justify-center">
                    <Mic size={32} className="text-love-500" />
                  </div>
                  <p className="text-sm font-medium">Voice Note Recorded</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setVoiceNote(null)}
                    size="sm"
                  >
                    Delete & Re-record
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-3">
                  <Button
                    className={isRecording ? "bg-red-500 hover:bg-red-600" : ""}
                    onClick={toggleRecording}
                  >
                    {isRecording ? "Stop Recording" : "Record Voice Note"}
                    <Mic size={18} className="ml-2" />
                  </Button>
                  <p className="text-xs text-muted-foreground">Maximum 30 seconds</p>
                </div>
              )}
            </div>
            
            <div className="bg-love-50 p-4 rounded-md mt-6">
              <h4 className="text-base font-medium text-love-700 mb-2 flex items-center">
                <User size={18} className="mr-2" />
                Profile Preview
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Name:</span> {profileData.name}, {profileData.age}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Location:</span> {profileData.location}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Gender:</span> {profileData.gender || 'Not specified'} 
                <span className="mx-2">•</span>
                <span className="font-medium">Interested in:</span> {profileData.interestedIn.length > 0 ? profileData.interestedIn.join(', ') : 'Not specified'}
              </p>
              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Personality:</span> 
                <div className="flex flex-wrap gap-1 mt-1">
                  {profileData.personalityTraits.map(trait => (
                    <span key={trait} className="inline-block px-2 py-1 bg-love-100 text-love-700 rounded-full text-xs">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                <span className="font-medium">Bio:</span> {profileData.bio}
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-love-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-display">Complete Your Profile</CardTitle>
            <CardDescription>Let potential matches learn more about you</CardDescription>
            {renderProgress()}
          </CardHeader>
          
          <CardContent>
            {renderStepContent()}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            {step > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handlePrevStep}
                className="flex items-center gap-1"
              >
                <ChevronLeft size={16} />
                Back
              </Button>
            )}
            
            {step < 4 ? (
              <Button 
                type="button" 
                className={`${step === 1 && 'w-full'} ${step > 1 ? 'ml-auto' : ''}`}
                onClick={handleNextStep}
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </Button>
            ) : (
              <Button 
                type="button"
                onClick={handleSubmit}
                className="ml-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving Profile..." : "Complete Setup"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileSetup;
