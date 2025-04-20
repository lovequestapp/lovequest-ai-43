
import React, { useState, useEffect } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { useProfileMonitor } from '@/hooks/useProfileMonitor';

const EditProfilePage = () => {
  const { currentUser, updateProfile: updateUserContext } = useUser();
  const { profileData, loading, error, setProfileData } = useProfileData(currentUser?.id);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Set up real-time monitoring for profile changes
  const { isConnected, connectionError } = useProfileMonitor(
    null,
    (updatedProfile) => {
      // Only update if it's the current user's profile
      if (updatedProfile.id === currentUser?.id) {
        console.log('Detected remote update to current user profile:', updatedProfile);
        setProfileData(updatedProfile);
        
        // Also update the user context
        updateUserContext(updatedProfile);
        
        toast.info('Your profile was updated in another session');
      }
    },
    null
  );

  // Warn users about unsaved changes when leaving page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        const message = 'You have unsaved changes. Are you sure you want to leave?';
        e.returnValue = message;
        return message;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [unsavedChanges]);

  const handleProfileUpdate = async (updatedData: Partial<User>) => {
    if (!currentUser?.id) {
      toast.error('You must be logged in to update your profile');
      return false;
    }

    // Set the flag for unsaved changes
    setUnsavedChanges(false);
    setIsSaving(true);
    setSaveError(null);

    try {
      console.log('Updating profile with data:', updatedData);
      const success = await updateProfileData(currentUser.id, updatedData);
      
      if (!success) {
        throw new Error('Profile update failed');
      }
      
      // Update local state
      setProfileData(prev => prev ? { ...prev, ...updatedData } : null);
      
      // Also update user context
      await updateUserContext(updatedData);
      
      toast.success('Profile updated successfully');
      return true;
    } catch (err: any) {
      console.error('Error in profile update:', err);
      const errorMessage = err.message || 'Unknown error';
      setSaveError(`Failed to update profile: ${errorMessage}`);
      toast.error(`Failed to update profile: ${errorMessage}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleFormChange = () => {
    setUnsavedChanges(true);
  };

  const handleNavigateBack = () => {
    if (unsavedChanges) {
      const confirm = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirm) return;
    }
    navigate('/user-profile');
  };

  return (
    <ProtectedRoute>
      {!isConnected && !loading && (
        <div className="fixed top-0 left-0 right-0 z-50 p-4">
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You're currently offline. Changes may not save until you reconnect.
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      {connectionError && (
        <div className="fixed top-0 left-0 right-0 z-50 p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {connectionError}. Profile updates may not be synchronized.
            </AlertDescription>
          </Alert>
        </div>
      )}
      
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
          isSaving={isSaving}
          saveError={saveError}
          onFormChange={handleFormChange}
        />
      ) : (
        <DesktopProfileLayout
          loading={loading}
          error={error}
          profileData={profileData}
          currentUser={currentUser}
          onNavigateBack={handleNavigateBack}
          onUpdateProfile={handleProfileUpdate}
          isSaving={isSaving}
          saveError={saveError}
          onFormChange={handleFormChange}
        />
      )}
    </ProtectedRoute>
  );
};

export default EditProfilePage;
