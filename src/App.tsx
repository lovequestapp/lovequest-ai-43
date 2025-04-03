
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  Home,
  Register,
  Login,
  Profile,
  Messages,
  EditProfile,
  Discover,
  Matches,
  Admin,
  UserProfile,
  ProfileSetup,
  BlogPage,
  BlogPost,
  Explore,
  Preferences,
  Verification,
  EmailConfirmation,
  EmailConfirmSuccess,
  Shop
} from '@/pages';
import { Toaster } from 'sonner';
import { UserProvider } from '@/context/UserContext';
import ProtectedRoute from '@/components/protected-route';
import NotFound from '@/components/404';

const App = () => {
  return (
    <UserProvider>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-confirmation" element={<EmailConfirmation />} />
        <Route path="/auth/confirm-email" element={<EmailConfirmSuccess />} />
        
        {/* Protected routes */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/messages/:userId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
        <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
        <Route path="/profile/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/user-profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
        <Route path="/preferences" element={<ProtectedRoute><Preferences /></ProtectedRoute>} />
        <Route path="/verification" element={<ProtectedRoute><Verification /></ProtectedRoute>} />
        <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Admin /></ProtectedRoute>} />
        
        {/* Catch-all for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </UserProvider>
  );
};

export default App;
