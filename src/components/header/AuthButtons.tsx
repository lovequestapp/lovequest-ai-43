
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const AuthButtons = () => {
  const navigate = useNavigate();
  
  return (
    <div className="hidden md:flex items-center gap-2">
      <Button variant="ghost" className="hover:bg-love-50" onClick={() => navigate('/login')}>
        Log In
      </Button>
      <Button className="bg-love-500 hover:bg-love-600" onClick={() => navigate('/register')}>
        Sign Up
      </Button>
    </div>
  );
};

export default AuthButtons;
