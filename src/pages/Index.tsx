
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CompatibilityQuiz from '@/components/CompatibilityQuiz';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';

// Import our components
import Hero from '@/components/homepage/Hero';
import AppPreview from '@/components/homepage/AppPreview';
import HowItWorks from '@/components/homepage/HowItWorks';
import Features from '@/components/homepage/Features';
import Testimonials from '@/components/homepage/Testimonials';
import PricingSection from '@/components/homepage/PricingSection';
import FAQ from '@/components/homepage/FAQ';

const Index = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const location = useLocation();
  
  // Check if we need to show the quiz from navigation state
  useEffect(() => {
    if (location.state?.showQuiz) {
      setShowQuiz(true);
    }
  }, [location.state]);
  
  const handleQuizComplete = (results: Record<string, string>) => {
    console.log('Quiz results:', results);
    // If user is not logged in, redirect to signup with return to quiz
    if (!currentUser) {
      navigate('/signup', { state: { returnToQuiz: true, quizResults: results } });
    } else {
      // In a real app, we would save these results to the user profile
      navigate('/discover');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {showQuiz ? (
          <div className="container mx-auto px-4 py-10 pb-36">
            <CompatibilityQuiz onComplete={handleQuizComplete} />
          </div>
        ) : (
          <>
            <Hero />
            <AppPreview />
            <HowItWorks />
            <Features />
            <Testimonials />
            <PricingSection />
            <FAQ />
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
