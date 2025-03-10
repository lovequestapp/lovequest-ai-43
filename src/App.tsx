
import { Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { Toaster } from './components/ui/sonner';
import CookieConsent from './components/CookieConsent';
import ProfileBoostPopup from './components/ProfileBoostPopup';
import { useBoostPopup } from './hooks/useBoostPopup';
import Index from './pages/Index';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Discover from './pages/Discover';
import Messages from './pages/Messages';
import Explore from './pages/Explore';
import BlogPost from './pages/BlogPost';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  const { showBoostPopup, closePopup } = useBoostPopup();
  
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/messages/:id" element={<Messages />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/blog/:postId" element={<BlogPost />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <CookieConsent />
      <ProfileBoostPopup isOpen={showBoostPopup} onClose={closePopup} />
    </UserProvider>
  );
}

export default App;
