
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import ProtectedRoute from '@/components/protected-route';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { User } from '@/types/user';
import { useProfileData } from '@/hooks/useProfileData';
import { MobileProfileLayout } from '@/components/profile-editor/MobileProfileLayout';
import { DesktopProfileLayout } from '@/components/profile-editor/DesktopProfileLayout';
import { updateProfileData } from '@/services/profileService';

const EditProfilePage = () => {
  const { currentUser } = useUser();
  const { profileData, loading, error, setProfileData } = useProfileData(currentUser?.id);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleProfileUpdate = async (updatedData: Partial<User>) => {
    if (!currentUser?.id) {
      toast.error('You must be logged in to update your profile');
      return false;
    }

    try {
      console.log('Updating profile with data:', updatedData);
      const success = await updateProfileData(currentUser.id, updatedData);
      
      if (!success) {
        throw new Error('Profile update failed');
      }
      
      setProfileData(prev => prev ? { ...prev, ...updatedData } : null);
      toast.success('Profile updated successfully');
      return true;
    } catch (err: any) {
      console.error('Error in profile update:', err);
      toast.error('Failed to update profile: ' + (err.message || 'Unknown error'));
      return false;
    }
  };

  const handleNavigateBack = () => navigate('/user-profile');

  return (
    <ProtectedRoute>
      {isMobile ? (
        <MobileProfileLayout
          loading={loading}
          error={error}
          profileData={profileData}
          currentUser={currentUser}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onNavigateBack={handleNavigateBack}
          onUpdateProfile={handleProfileUpdate}
        />
      ) : (
        <DesktopProfileLayout
          loading={loading}
          error={error}
          profileData={profileData}
          currentUser={currentUser}
          onNavigateBack={handleNavigateBack}
          onUpdateProfile={handleProfileUpdate}
        />
      )}
    </ProtectedRoute>
  );
};

export default EditProfilePage;
