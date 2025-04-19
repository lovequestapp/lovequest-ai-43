
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MobileContainer from '@/components/MobileContainer';
import MobileToolbar from '@/components/MobileToolbar';
import MobileMonetization from '@/components/monetization/MobileMonetization';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from 'lucide-react';
import { User } from '@/types/user';
import EditProfileForm from '@/components/profile-editor/EditProfileForm';

interface MobileProfileLayoutProps {
  loading: boolean;
  error: string | null;
  profileData: User | null;
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNavigateBack: () => void;
  onUpdateProfile: (data: Partial<User>) => Promise<boolean>;
}

export const MobileProfileLayout: React.FC<MobileProfileLayoutProps> = ({
  loading,
  error,
  profileData,
  currentUser,
  activeTab,
  setActiveTab,
  onNavigateBack,
  onUpdateProfile,
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
        
        <EditProfileForm 
          initialData={profileData || currentUser}
          onUpdate={onUpdateProfile}
        />
      </>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <MobileContainer padding={false} scrollable>
          <div className="sticky top-0 z-10 bg-white border-b">
            <div className="p-4 pb-3 flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onNavigateBack}
                className="absolute left-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-center w-full">My Account</h1>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="profile" className="text-sm">Profile</TabsTrigger>
                <TabsTrigger value="monetization" className="text-sm">Earnings</TabsTrigger>
              </TabsList>
            
              <TabsContent value="profile" className="pb-20 px-4 pt-4">
                {renderContent()}
              </TabsContent>
              
              <TabsContent value="monetization" className="pb-20">
                <MobileMonetization />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t z-10">
            <Button variant="outline" onClick={onNavigateBack} className="w-full">
              Back to Profile
            </Button>
          </div>
        </MobileContainer>
      </main>
      <MobileToolbar />
    </div>
  );
};
