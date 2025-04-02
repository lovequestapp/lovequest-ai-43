import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import { TestModeProvider } from './context/TestModeContext';
import Home from './pages/home';
import Register from './pages/register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import EditProfile from './pages/edit-profile';
import Discover from './pages/discover';
import Matches from './pages/Matches';
import Admin from './pages/Admin';
import UserProfile from './pages/user-profile';
import ProfileSetup from './pages/profile-setup';
import ProtectedRoute from './components/protected-route';
import { useUser } from './context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import './index.css';
import BlogPage from './pages/BlogPage';
import BlogPost from './pages/BlogPost';
import Explore from './pages/Explore';
import Preferences from '@/pages/Preferences';

const App = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <TestModeProvider>
          <Toaster position="top-center" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/profile-setup" 
              element={
                <ProtectedRoute>
                  <ProfileSetup />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile/:userId" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user-profile" 
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/messages/:userId" 
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit-profile" 
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/discover" 
              element={
                <ProtectedRoute>
                  <Discover />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/matches" 
              element={
                <ProtectedRoute>
                  <Matches />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/blog" 
              element={
                <ProtectedRoute>
                  <BlogPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/blog/:postId" 
              element={
                <ProtectedRoute>
                  <BlogPost />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/explore" 
              element={
                <ProtectedRoute>
                  <Explore />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/preferences" 
              element={<Preferences />} 
            />
          </Routes>
        </TestModeProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
