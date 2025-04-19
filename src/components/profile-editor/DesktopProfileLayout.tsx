
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { User } from '@/types/user';
import EditProfileForm from '@/components/profile-editor/EditProfileForm';
import Header from '@/components/header/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';

interface DesktopProfileLayoutProps {
  loading: boolean;
  error: string | null;
  profileData: User | null;
  currentUser: User | null;
  onNavigateBack: () => void;
  onUpdateProfile: (data: Partial<User>) => Promise<boolean>;
  isSaving?: boolean;
  saveError?: string | null;
  onFormChange?: () => void;
}

export const DesktopProfileLayout: React.FC<DesktopProfileLayoutProps> = ({
  loading,
  error,
  profileData,
  currentUser,
  onNavigateBack,
  onUpdateProfile,
  isSaving = false,
  saveError = null,
  onFormChange
}) => {
  const renderContent = () => {
    if (loading) {
      return (
        <div className="h-64 flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-love-500" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      );
    }

    if (!profileData && !currentUser) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to load profile data. Please try again later or contact support.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <>
        {error && (
          <Alert variant="warning" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {saveError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        )}
        
        <EditProfileForm 
          initialData={profileData || currentUser}
          onUpdate={onUpdateProfile}
          isSaving={isSaving}
          onChange={onFormChange}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto shadow-sm">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onNavigateBack}
                  className="mr-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <CardTitle className="text-2xl font-display">Edit Your Profile</CardTitle>
              </div>
              
              <div className="flex items-center gap-2">
                {profileData?.verificationStatus === 'verified' && (
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                    Verified
                  </Badge>
                )}
                
                {profileData?.verificationStatus === 'pending' && (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300">
                    Verification Pending
                  </Badge>
                )}
                
                {profileData?.premiumStatus !== 'standard' && (
                  <Badge variant="default" className="bg-purple-500 hover:bg-purple-600">
                    {profileData?.premiumStatus === 'vip' ? 'VIP' : 'Premium'}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="py-6">
            {renderContent()}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};
