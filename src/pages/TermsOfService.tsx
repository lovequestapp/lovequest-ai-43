
import React from 'react';
import Header from '@/components/header/Header';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-display font-bold mb-6">Terms of Service</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Agreement to Terms</h2>
          <p>
            By accessing or using LoveQuest AI, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            If you do not agree with any of these terms, you are prohibited from using or accessing this app.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use License</h2>
          <p>
            Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, 
            and revocable license to access and use the app for personal, non-commercial purposes.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
          <p>
            You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your
            account and password and for restricting access to your computer. You agree to accept responsibility for all activities
            that occur under your account.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. User Content</h2>
          <p>
            Our app allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos,
            or other material. You are responsible for the content you post, including its legality, reliability, and appropriateness.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Prohibited Uses</h2>
          <p>You agree not to use our app:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>In any way that violates any applicable law or regulation</li>
            <li>To harass, abuse, or harm another person</li>
            <li>To impersonate or attempt to impersonate our company, employee, another user, or any other person</li>
            <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the app</li>
            <li>To attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the app</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Payment Terms</h2>
          <p>
            All payments are processed securely through our payment provider. By providing a payment method, you represent that you are
            authorized to use the designated payment method and authorize us to charge your payment method for the total amount of your subscription.
          </p>
          
          <Separator className="my-8" />
          
          <p className="italic text-muted-foreground">
            Note: This is a template terms of service for demonstration purposes. You should have a lawyer review and
            customize these terms to your specific app before launching.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
