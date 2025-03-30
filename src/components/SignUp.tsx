
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const SignUp = () => {
  const navigate = useNavigate();
  
  const handleSignUp = () => {
    toast.info("Redirecting to registration page");
    navigate('/register');
  };
  
  return (
    <Card className="p-6 text-center">
      <h2 className="text-xl font-bold mb-4">Ready to find love?</h2>
      <p className="mb-6">Create your account to start your journey.</p>
      <Button 
        onClick={handleSignUp}
        className="w-full bg-gradient-love"
      >
        Create Your Account
      </Button>
    </Card>
  );
};

export default SignUp;
