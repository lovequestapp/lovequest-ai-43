import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CompatibilityQuiz from '@/components/CompatibilityQuiz';
import Header from '@/components/header/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import MobileToolbar from '@/components/MobileToolbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Helmet } from 'react-helmet';

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
  const isMobile = useIsMobile();
  
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
      <Helmet>
        <title>LoveQuest - Find your perfect match</title>
        <meta name="description" content="LoveQuest is an AI-powered dating app that helps you find compatible partners based on personality traits and interests." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#FF4B91" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Helmet>
      
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
      
      {isMobile && currentUser && (
        <MobileToolbar />
      )}

      {/* Add extra bottom padding when mobile toolbar is visible */}
      {isMobile && currentUser && (
        <div className="h-16 w-full" aria-hidden="true"></div>
      )}
    </div>
  );
};

export default Index;
