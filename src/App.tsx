
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Register from './pages/register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import EditProfile from './pages/edit-profile';
import Discover from './pages/discover';
import ProtectedRoute from './components/protected-route';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route 
        path="/profile/:userId" 
        element={
          <ProtectedRoute>
            <Profile />
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
    </Routes>
  );
}

export default App;
