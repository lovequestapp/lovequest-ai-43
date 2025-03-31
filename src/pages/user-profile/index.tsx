
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from '@/context/UserContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Edit, User, Wallet } from 'lucide-react';
import Monetization from '@/components/Monetization';
import ProfileEditor from '@/components/profile-editor/ProfileEditor';
import ProfileInfo from '@/components/profile-editor/ProfileInfo';
import ProtectedRoute from '@/components/protected-route';

const UserProfile = () => {
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  if (!currentUser) {
    return null; // ProtectedRoute will handle redirecting
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-display font-bold">Your Profile</h1>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate('/edit-profile')}
            >
              <Edit size={16} />
              Edit Profile
            </Button>
          </div>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User size={16} />
                <span>Profile Info</span>
              </TabsTrigger>
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <Edit size={16} />
                <span>Edit Profile</span>
              </TabsTrigger>
              <TabsTrigger value="monetize" className="flex items-center gap-2">
                <Wallet size={16} />
                <span>Monetization</span>
              </TabsTrigger>
            </TabsList>

            <Card>
              <CardContent className="pt-6">
                <TabsContent value="profile" className="mt-0">
                  <ProfileInfo />
                </TabsContent>
                
                <TabsContent value="edit" className="mt-0">
                  <ProfileEditor />
                </TabsContent>
                
                <TabsContent value="monetize" className="mt-0">
                  <Monetization />
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default UserProfile;
