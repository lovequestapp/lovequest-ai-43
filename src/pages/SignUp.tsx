
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SignUp from '@/components/SignUp';

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Added significant bottom padding (pb-36) to ensure content doesn't get hidden by footer */}
      <main className="flex-grow container mx-auto px-4 py-12 pb-36">
        <h1 className="text-3xl font-display font-bold mb-8 text-center">Join Our Dating Community</h1>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Create your profile, find meaningful connections, and start your journey to finding love today.
        </p>
        
        <SignUp />
      </main>
      
      <Footer />
    </div>
  );
};

export default SignUpPage;
