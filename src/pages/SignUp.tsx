
import React from 'react';
import Header from '@/components/header/Header';
import Footer from '@/components/Footer';
import SignUp from '@/components/SignUp';
import { Sparkles, Brain, Heart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const SignUpPage = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold mb-6 text-center">Join Our Dating Community</h1>
        
        <div className="max-w-3xl mx-auto mb-8 text-center">
          <p className="text-muted-foreground mb-6">
            Create your profile, find meaningful connections, and start your journey to finding love today.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="bg-background border border-border rounded-lg p-4 md:p-6 flex flex-col items-center text-center">
              <Sparkles className="h-7 w-7 text-love-500 mb-2" />
              <h3 className="font-display font-medium text-lg mb-2">AI-Powered Matching</h3>
              <p className="text-sm text-muted-foreground">Our algorithm analyzes your personality and preferences to find truly compatible matches.</p>
            </div>
            
            <div className="bg-background border border-border rounded-lg p-4 md:p-6 flex flex-col items-center text-center">
              <Brain className="h-7 w-7 text-love-500 mb-2" />
              <h3 className="font-display font-medium text-lg mb-2">Psychological Compatibility</h3>
              <p className="text-sm text-muted-foreground">We evaluate writing style, interests, and values to ensure deep, meaningful connections.</p>
            </div>
            
            <div className="bg-background border border-border rounded-lg p-4 md:p-6 flex flex-col items-center text-center">
              <Heart className="h-7 w-7 text-love-500 mb-2" />
              <h3 className="font-display font-medium text-lg mb-2">Quality Over Quantity</h3>
              <p className="text-sm text-muted-foreground">Our approach focuses on finding fewer, better matches rather than endless swiping.</p>
            </div>
          </div>
        </div>
        
        <SignUp />
      </main>
      
      <Footer />
    </div>
  );
};

export default SignUpPage;
