
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { Layout } from '@/components/layout';
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
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto">
          <VerificationProcess skipVerification={handleSkipVerification} />
        </div>
      </div>
    </Layout>
  );
};

export default VerificationPage;
