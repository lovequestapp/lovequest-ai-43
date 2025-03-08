
import { Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { Toaster } from './components/ui/sonner';
import CookieConsent from './components/CookieConsent';
import Index from './pages/Index';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Discover from './pages/Discover';
import Messages from './pages/Messages';
import Explore from './pages/Explore';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
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
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <CookieConsent />
    </UserProvider>
  );
}

export default App;
