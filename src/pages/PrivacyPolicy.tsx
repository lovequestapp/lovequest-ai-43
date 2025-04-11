
import React from 'react';
import Header from '@/components/header/Header';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-display font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            This Privacy Policy explains how we collect, use, process, and disclose your information, 
            including personal information, in conjunction with your access to and use of LoveQuest AI.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
          <p>
            We collect information you provide directly to us when you register for an account,
            create or modify your profile, set preferences, or make purchases through the app.
          </p>
          <p>This includes:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Account Information: Your name, email address, phone number, login details, and password</li>
            <li>Profile Information: Your gender, age, interests, and photos</li>
            <li>Identity Verification Information: Government ID for verification purposes</li>
            <li>Communication: Messages with other users</li>
            <li>Payment Information: Credit card details, billing address</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide, maintain, and improve our services</li>
            <li>Create and update your account</li>
            <li>Process transactions</li>
            <li>Send technical notices and support messages</li>
            <li>Match you with potential partners</li>
            <li>Respond to your comments and questions</li>
            <li>Personalize content and experiences</li>
            <li>Monitor and analyze trends and usage</li>
            <li>Detect, prevent, and address fraud and other illegal activities</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Sharing and Disclosure</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Other users as part of your profile information and communications</li>
            <li>Service providers who perform services on our behalf</li>
            <li>Third-party applications you choose to connect to your account</li>
            <li>Law enforcement agencies when required by law</li>
          </ul>
          
          <Separator className="my-8" />
          
          <p className="italic text-muted-foreground">
            Note: This is a template privacy policy for demonstration purposes. You should have a lawyer review and
            customize this policy to your specific app before launching.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
