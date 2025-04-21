
import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent } from "@/components/ui/card";
import BasicInfoForm from '@/components/profile-setup/BasicInfoForm';
import AboutYouForm from '@/components/profile-setup/AboutYouForm';
import ProfileSetupProgress from '@/components/profile-setup/ProfileSetupProgress';
import ProfileSetupFooter from '@/components/profile-setup/ProfileSetupFooter';

import LocationInterestsStep from './components/LocationInterestsStep';
import PhotoUploadStep from './components/PhotoUploadStep';
import VoiceIntroStep from './components/VoiceIntroStep';

import { directProfileUpdate } from '@/utils/directProfileUpdate';
import { uploadProfilePhoto, saveVoiceIntro } from '@/services/profileService';
import { User } from '@/types/user';

const ProfileSetupPage = () => {
  const { currentUser, updateUserProfile } = useUser();
  const navigate = useNavigate();

  const totalSteps = 5;
  const [step, setStep] = useState(1);

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    bio: currentUser?.bio || '',
    location: currentUser?.location || '',
    gender: currentUser?.gender || '' as 'male' | 'female' | 'non-binary' | '',
    interestedIn: currentUser?.interestedIn || [] as ('male' | 'female' | 'non-binary')[],
    age: currentUser?.age || 18,
    personalityTraits: currentUser?.personalityTraits || [],
    interests: currentUser?.interests || [],
    favoriteMusic: currentUser?.favoriteMusic || [],
  });

  const [photos, setPhotos] = useState<string[]>(currentUser?.photos || []);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [voiceNote, setVoiceNote] = useState<string | null>(currentUser?.voiceIntro || null);
  const [isRecording, setIsRecording] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser?.name && currentUser?.bio && currentUser?.photos && currentUser?.photos.length >= 1) {
      navigate('/discover');
    }
  }, [currentUser, navigate]);

  const handleProfileDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderInterestChange = (interest: 'male' | 'female' | 'non-binary') => {
    setProfileData(prev => {
      if (prev.interestedIn.includes(interest)) {
        return {
          ...prev,
          interestedIn: prev.interestedIn.filter(i => i !== interest)
        };
      } else {
        return {
          ...prev,
          interestedIn: [...prev.interestedIn, interest]
        };
      }
    });
  };

  const handleLocationSelect = (location: string) => {
    setProfileData(prev => ({ ...prev, location }));
  };

  const handlePersonalityTraitSelect = (trait: string) => {
    setProfileData(prev => {
      if (prev.personalityTraits.includes(trait)) {
        return {
          ...prev,
          personalityTraits: prev.personalityTraits.filter(t => t !== trait)
        };
      } else {
        return {
          ...prev,
          personalityTraits: [...prev.personalityTraits, trait]
        };
      }
    });
  };

  const handleInterestSelect = (interest: string) => {
    setProfileData(prev => {
      if (prev.interests.includes(interest)) {
        return {
          ...prev,
          interests: prev.interests.filter(i => i !== interest)
        };
      } else {
        return {
          ...prev,
          interests: [...prev.interests, interest]
        };
      }
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      setUploadingPhoto(true);

      if (!currentUser?.id) {
        toast.error("You must be logged in to upload photos");
        setUploadingPhoto(false);
        return;
      }

      const photoUrl = await uploadProfilePhoto(currentUser.id, file);

      if (photoUrl) {
        const newPhotos = [...photos, photoUrl];
        setPhotos(newPhotos);
        setProfileData(prev => ({ ...prev, photos: newPhotos }));
        toast.success("Photo uploaded successfully");
      } else {
        throw new Error("Failed to upload photo");
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error("Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => {
      const updated = prev.filter((_, i) => i !== index);
      setProfileData(prevProfile => ({ ...prevProfile, photos: updated }));
      return updated;
    });
  };

  const toggleRecording = () => {
    setIsRecording(prev => !prev);
  };

  const handleVoiceRecordingComplete = (audioUrl: string) => {
    setVoiceNote(audioUrl);
  };

  const handleDeleteVoiceNote = () => {
    setVoiceNote(null);
  };

  const handleNextStep = () => {
    if (step === 1 && (!profileData.name || !profileData.gender || profileData.interestedIn.length === 0)) {
      toast.error("Please fill out all required fields");
      return;
    }

    if (step === 2 && (!profileData.bio || profileData.bio.length < 20)) {
      toast.error("Please write a bio of at least 20 characters");
      return;
    }

    if (step === 3 && (!profileData.location)) {
      toast.error("Please enter your location");
      return;
    }

    if (step === 4 && photos.length < 1) {
      toast.error("Please upload at least one photo");
      return;
    }

    if (step < totalSteps) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (!currentUser?.id) {
        toast.error("You must be logged in to update your profile");
        return;
      }

      const updateData: Partial<User> = {
        ...profileData,
        gender: profileData.gender as 'male' | 'female' | 'non-binary',
        photos,
      };

      console.log('Submitting profile data:', updateData);

      const success = await directProfileUpdate(currentUser.id, updateData);

      if (voiceNote && success) {
        await saveVoiceIntro(currentUser.id, voiceNote);
      }

      if (success) {
        await updateUserProfile(updateData);

        toast.success("LoveQuest profile setup complete!");

        navigate('/discover');
      }
    } catch (error) {
      console.error('Profile setup error:', error);
      toast.error("Failed to complete LoveQuest profile setup");
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
          <LocationInterestsStep
            location={profileData.location}
            interests={profileData.interests}
            onLocationSelect={handleLocationSelect}
            onInterestSelect={handleInterestSelect}
          />
        );
      case 4:
        return (
          <PhotoUploadStep
            photos={photos}
            uploadingPhoto={uploadingPhoto}
            handlePhotoUpload={handlePhotoUpload}
            removePhoto={removePhoto}
            minRequiredPhotos={1}
          />
        );
      case 5:
        return (
          <VoiceIntroStep
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

  return (
    <div className="min-h-[100svh] bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 pb-20">
      <div className="container px-4 py-8 md:py-12 mx-auto max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">LoveQuest Profile Setup</h1>
        <ProfileSetupProgress
          currentStep={step}
          totalSteps={totalSteps}
        />

        <Card className="w-full mt-4 shadow-sm dark:bg-gray-800/50 backdrop-blur-sm border-gray-100 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="space-y-6">
              {renderStepContent()}

              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
                <ProfileSetupFooter
                  step={step}
                  totalSteps={totalSteps}
                  isSubmitting={isSubmitting}
                  handlePrevStep={handlePrevStep}
                  handleNextStep={handleNextStep}
                  handleSubmit={handleSubmit}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetupPage;

