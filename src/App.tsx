
import { Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { Toaster } from './components/ui/sonner';
import CookieConsent from './components/CookieConsent';
import ProfileBoostPopup from './components/ProfileBoostPopup';
import { useBoostPopup } from './hooks/useBoostPopup';
import { useIsMobile } from './hooks/use-mobile';
import MobileToolbar from './components/MobileToolbar';
import { Suspense, lazy, useEffect } from 'react';
import Index from './pages/Index';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import './App.css';

// Lazy load non-critical pages for better performance
const Profile = lazy(() => import('./pages/Profile'));
const Discover = lazy(() => import('./pages/Discover'));
const Messages = lazy(() => import('./pages/Messages'));
const Explore = lazy(() => import('./pages/Explore'));
const Dates = lazy(() => import('./pages/Dates'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const ProfileDetails = lazy(() => import('./pages/ProfileDetails'));
const Admin = lazy(() => import('./pages/Admin'));
const Safety = lazy(() => import('./pages/Safety'));

// Simple loading fallback for lazy-loaded components
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-pulse flex flex-col items-center">
      <div className="h-12 w-12 bg-love-200 rounded-full mb-4"></div>
      <div className="h-4 w-32 bg-love-100 rounded mb-2"></div>
      <div className="h-3 w-24 bg-love-50 rounded"></div>
    </div>
  </div>
);

function App() {
  const { showBoostPopup, closePopup } = useBoostPopup();
  const isMobile = useIsMobile();
  
  // Initialize any required services when the app starts
  useEffect(() => {
    // This will be used when connecting to Supabase and Stripe
    // Example: supabase.auth.onAuthStateChange()
    // Example: paymentService.initializeStripe()
    
    console.log('App initialized');
  }, []);
  
  return (
    <ErrorBoundary>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/profile" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Profile />
              </Suspense>
            } 
          />
          <Route 
            path="/discover" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Discover />
              </Suspense>
            } 
          />
          <Route 
            path="/profiles/:userId" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <ProfileDetails />
              </Suspense>
            } 
          />
          <Route 
            path="/messages" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Messages />
              </Suspense>
            } 
          />
          <Route 
            path="/messages/:id" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Messages />
              </Suspense>
            } 
          />
          <Route 
            path="/explore" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Explore />
              </Suspense>
            } 
          />
          <Route 
            path="/dates" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Dates />
              </Suspense>
            } 
          />
          <Route 
            path="/blog/:postId" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <BlogPost />
              </Suspense>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Admin />
              </Suspense>
            } 
          />
          <Route 
            path="/safety" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Safety />
              </Suspense>
            } 
          />
          {/* New routes for app store compliance pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" richColors closeButton />
        <CookieConsent />
        <ProfileBoostPopup isOpen={showBoostPopup} onClose={closePopup} />
        {isMobile && <MobileToolbar />}
      </UserProvider>
    </ErrorBoundary>
  );
}

export default App;
