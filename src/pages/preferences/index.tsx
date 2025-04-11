
import React from 'react';
import Header from '@/components/header/Header';
import Footer from '@/components/Footer';
import UserPreferences from '@/components/preferences/UserPreferences';
import { useUser } from '@/context/UserContext';
import ProtectedRoute from '@/components/protected-route';
import MobileToolbar from '@/components/MobileToolbar';

const PreferencesPage: React.FC = () => {
  const { currentUser } = useUser();

  if (!currentUser) {
    return null; // ProtectedRoute will handle redirecting
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 mb-16 md:mb-0">
          <h1 className="text-3xl font-display font-bold mb-6">Your Preferences</h1>
          <div className="max-w-3xl mx-auto">
            <UserPreferences />
          </div>
        </main>
        <MobileToolbar />
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default PreferencesPage;
