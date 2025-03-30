
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the register page
    navigate('/register');
  }, [navigate]);
  
  return null; // Component will redirect, so no need to render anything
};

export default SignUp;
