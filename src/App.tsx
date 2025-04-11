
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
  Shop,
  CheckoutPage
} from '@/pages';
import { Toaster } from 'sonner';
import { UserProvider } from '@/context/UserContext';
import { CartProvider } from '@/context/CartContext';
import ProtectedRoute from '@/components/protected-route';
import NotFound from '@/components/404';
import { Layout } from '@/components/layout';

const App = () => {
  return (
    <UserProvider>
      <CartProvider>
        <Toaster position="top-right" richColors />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/email-confirmation" element={<Layout><EmailConfirmation /></Layout>} />
          <Route path="/auth/confirm-email" element={<Layout><EmailConfirmSuccess /></Layout>} />
          
          {/* Protected routes */}
          <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
          <Route path="/profile-setup" element={<ProtectedRoute><Layout><ProfileSetup /></Layout></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Layout><Messages /></Layout></ProtectedRoute>} />
          <Route path="/messages/:userId" element={<ProtectedRoute><Layout><Messages /></Layout></ProtectedRoute>} />
          <Route path="/edit-profile" element={<ProtectedRoute><Layout><EditProfile /></Layout></ProtectedRoute>} />
          <Route path="/discover" element={<ProtectedRoute><Layout><Discover /></Layout></ProtectedRoute>} />
          <Route path="/matches" element={<ProtectedRoute><Layout><Matches /></Layout></ProtectedRoute>} />
          <Route path="/profile/:userId" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
          <Route path="/user-profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><Layout><Explore /></Layout></ProtectedRoute>} />
          <Route path="/preferences" element={<ProtectedRoute><Layout><Preferences /></Layout></ProtectedRoute>} />
          <Route path="/verification" element={<ProtectedRoute><Layout><Verification /></Layout></ProtectedRoute>} />
          <Route path="/shop" element={<ProtectedRoute><Layout><Shop /></Layout></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Layout><CheckoutPage /></Layout></ProtectedRoute>} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Layout hideFooter hideMobileToolbar><Admin /></Layout></ProtectedRoute>} />
          
          {/* Catch-all for 404 */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </CartProvider>
    </UserProvider>
  );
};

export default App;
