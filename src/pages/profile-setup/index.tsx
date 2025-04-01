
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from 'sonner';
import { useUser } from '@/context/UserContext';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Import refactored components
import ProfileSetupProgress from '@/components/profile-setup/ProfileSetupProgress';
import BasicInfoForm from '@/components/profile-setup/BasicInfoForm';
import AboutYouForm from '@/components/profile-setup/AboutYouForm';
import PhotoUploader from '@/components/profile-setup/PhotoUploader';
import VoiceIntroSection from '@/components/profile-setup/VoiceIntroSection';
import ProfileSetupFooter from '@/components/profile-setup/ProfileSetupFooter';

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
  
  const handleVoiceRecordingComplete = (audioUrl: string) => {
    setVoiceNote(audioUrl);
    setIsRecording(false);
  };
  
  const handleDeleteVoiceNote = () => {
    setVoiceNote(null);
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
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <BasicInfoForm 
            profileData={profileData}
            handleProfileDataChange={handleProfileDataChange}
            handleGenderInterestChange={handleGenderInterestChange}
          />
        );
      case 2:
        return (
          <AboutYouForm 
            profileData={profileData}
            handleProfileDataChange={handleProfileDataChange}
            handlePersonalityTraitSelect={handlePersonalityTraitSelect}
          />
        );
      case 3:
        return (
          <PhotoUploader 
            photos={photos}
            uploadingPhoto={uploadingPhoto}
            handlePhotoUpload={handlePhotoUpload}
            removePhoto={removePhoto}
          />
        );
      case 4:
        return (
          <VoiceIntroSection 
            profileData={profileData}
            voiceNote={voiceNote}
            isRecording={isRecording}
            toggleRecording={toggleRecording}
            onVoiceRecordingComplete={handleVoiceRecordingComplete}
            onDeleteVoiceNote={handleDeleteVoiceNote}
          />
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
  
  const TOTAL_STEPS = 4;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-display">Complete Your Profile</CardTitle>
            <CardDescription>Let potential matches learn more about you</CardDescription>
            <ProfileSetupProgress step={step} totalSteps={TOTAL_STEPS} />
          </CardHeader>
          
          <CardContent>
            {renderStepContent()}
          </CardContent>
          
          <CardFooter>
            <ProfileSetupFooter 
              step={step}
              totalSteps={TOTAL_STEPS}
              isSubmitting={isSubmitting}
              handlePrevStep={handlePrevStep}
              handleNextStep={handleNextStep}
              handleSubmit={handleSubmit}
            />
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileSetup;
