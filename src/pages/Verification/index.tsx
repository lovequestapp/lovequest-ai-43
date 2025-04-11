import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import Header from '@/components/header/Header';
import Footer from '@/components/Footer';
import VerificationProcess from '@/components/VerificationProcess';

const VerificationPage = () => {
  useAuthRedirect({
    redirectIfUnauthenticated: true,
    unauthenticatedRedirectPath: '/login'
  });
  
  const navigate = useNavigate();
  
  const handleSkipVerification = () => {
    navigate('/profile');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto">
          <VerificationProcess skipVerification={handleSkipVerification} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VerificationPage;
