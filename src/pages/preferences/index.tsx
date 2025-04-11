
import React from 'react';
import UserPreferences from '@/components/preferences/UserPreferences';
import { useUser } from '@/context/UserContext';
import ProtectedRoute from '@/components/protected-route';
import { Layout } from '@/components/layout';

const PreferencesPage: React.FC = () => {
  const { currentUser } = useUser();

  if (!currentUser) {
    return null; // ProtectedRoute will handle redirecting
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-display font-bold mb-6">Your Preferences</h1>
          <div className="max-w-3xl mx-auto">
            <UserPreferences />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default PreferencesPage;
