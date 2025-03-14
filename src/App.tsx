
import { Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { Toaster } from './components/ui/sonner';
import CookieConsent from './components/CookieConsent';
import ProfileBoostPopup from './components/ProfileBoostPopup';
import { useBoostPopup } from './hooks/useBoostPopup';
import { Suspense, lazy } from 'react';
import Index from './pages/Index';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Lazy load non-critical pages for better performance
const Profile = lazy(() => import('./pages/Profile'));
const Discover = lazy(() => import('./pages/Discover'));
const Messages = lazy(() => import('./pages/Messages'));
const Explore = lazy(() => import('./pages/Explore'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

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
  
  return (
    <ErrorBoundary>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<SignUp />} />
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
            path="/blog/:postId" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <BlogPost />
              </Suspense>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" richColors closeButton />
        <CookieConsent />
        <ProfileBoostPopup isOpen={showBoostPopup} onClose={closePopup} />
      </UserProvider>
    </ErrorBoundary>
  );
}

export default App;
