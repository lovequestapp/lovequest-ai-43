
import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/home';
import Register from './pages/register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import EditProfile from './pages/edit-profile';
import Discover from './pages/discover';
import Admin from './pages/Admin';
import ProtectedRoute from './components/protected-route';
import { useUser } from './context/UserContext';
import { getCurrentUser } from './lib/supabase';
import { toast } from 'sonner';
import './index.css';

function App() {
  const { currentUser, setCurrentUser } = useUser();
  const navigate = useNavigate();

  // Check for existing session on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await getCurrentUser();
        if (session.success && session.user) {
          setCurrentUser(session.user);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };

    checkAuth();
  }, [setCurrentUser]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
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
        path="/admin" 
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
