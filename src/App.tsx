import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import EditProfile from './pages/EditProfile';
import Discover from './pages/discover';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './context/UserContext';
import './index.css';

function App() {
  return (
    <UserProvider>
      <Router>
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
      </Router>
    </UserProvider>
  );
}

export default App;
