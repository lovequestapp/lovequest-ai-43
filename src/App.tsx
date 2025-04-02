
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
import { ProtectedRouteProvider } from '@/context/ProtectedRouteContext';
import NotFound from '@/components/404';

const App = () => {
  return (
    <ProtectedRouteProvider>
      <UserProvider>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:userId" element={<Messages />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:postId" element={<BlogPost />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/email-confirmation" element={<EmailConfirmation />} />
          <Route path="/auth/confirm-email" element={<EmailConfirmSuccess />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </UserProvider>
    </ProtectedRouteProvider>
  );
};

export default App;
