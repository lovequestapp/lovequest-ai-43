
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PhotoUploader from '@/components/profile-setup/PhotoUploader';
import { useUser } from '@/context/UserContext';
import ProfileEditor from '@/components/profile-editor/ProfileEditor';
import ProtectedRoute from '@/components/protected-route';
import { fetchUserProfile } from '@/services/profileService';
import { toast } from 'sonner';

const EditProfile = () => {
  const { currentUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfileData = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const userProfile = await fetchUserProfile(currentUser.id);
          
        if (userProfile) {
          setProfileData(userProfile);
        } else {
          toast.error('Failed to load profile data');
        }
      } catch (err) {
        console.error('Error loading profile data:', err);
        toast.error('Error loading profile data');
      } finally {
        setLoading(false);
      }
    };
    
    loadProfileData();
  }, [currentUser]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-display">Edit Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full border-2 border-t-love-500 border-love-200 animate-spin"></div>
                </div>
              ) : (
                <ProfileEditor initialData={profileData || currentUser} />
              )}
            </CardContent>
          </Card>

          <div className="flex justify-center mt-6 gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/user-profile')}
            >
              Back to Profile
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default EditProfile;
