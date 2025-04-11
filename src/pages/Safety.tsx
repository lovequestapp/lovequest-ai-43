
import React from 'react';
import Header from '@/components/header/Header';
import Footer from '@/components/Footer';
import { Shield, UserCheck, Lock, BellRing, AlertTriangle, Eye, Image, CheckCircle2, BadgeCheck, UserCog, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';

const Safety = () => {
  const safetyFeatures = [
    {
      icon: <UserCheck size={36} className="text-green-500" />,
      title: "Identity Verification",
      description: "Every user must verify their identity through our multi-step verification process, including photo verification and optional ID verification."
    },
    {
      icon: <Shield size={36} className="text-blue-500" />,
      title: "Secure Messaging",
      description: "Our encrypted messaging system ensures your conversations remain private and protected from unauthorized access."
    },
    {
      icon: <Lock size={36} className="text-indigo-500" />,
      title: "Data Protection",
      description: "Your personal information is encrypted and protected using industry-leading security standards."
    },
    {
      icon: <BellRing size={36} className="text-amber-500" />,
      title: "Safety Alerts",
      description: "Receive real-time alerts about suspicious behavior or potential safety concerns."
    },
    {
      icon: <AlertTriangle size={36} className="text-red-500" />,
      title: "Report System",
      description: "Easily report inappropriate behavior with our one-click reporting system. Our team reviews all reports within 24 hours."
    },
    {
      icon: <Eye size={36} className="text-purple-500" />,
      title: "Profile Monitoring",
      description: "AI-powered monitoring detects and flags potentially suspicious profiles before they can interact with our community."
    }
  ];

  const verificationSteps = [
    {
      step: 1,
      title: "Photo Verification",
      description: "Submit a selfie that matches your profile photos to confirm you're a real person."
    },
    {
      step: 2,
      title: "Email Verification",
      description: "Verify your email address to ensure we can reach you with important account information."
    },
    {
      step: 3,
      title: "Phone Verification",
      description: "Add and verify your phone number for added security and account recovery options."
    },
    {
      step: 4,
      title: "Optional ID Verification",
      description: "For the highest level of verification, you can submit a government-issued ID (driver's license, passport)."
    },
    {
      step: 5,
      title: "Social Media Verification",
      description: "Link your social media accounts to further verify your identity (optional)."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-love-50 to-white">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-6">
              <Shield size={28} className="text-love-500" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Your Safety is Our <span className="bg-gradient-love text-transparent bg-clip-text">Top Priority</span>
            </h1>
            
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              At LoveQuest, we've implemented comprehensive safety measures to ensure 
              you can focus on finding meaningful connections with confidence.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Link to="/signup">
                <Button className="bg-gradient-love text-white hover:opacity-90">
                  Create Safe Account
                </Button>
              </Link>
              <Link to="/discover">
                <Button variant="outline" className="border-love-200">
                  Explore Safely
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
              {["Profile Verification", "Photo Review", "Background Checks", "Behavior Monitoring", "Secure Messaging", "Privacy Controls"].map((feature, index) => (
                <div key={index} className="bg-white shadow-sm rounded-lg p-3 flex items-center justify-center">
                  <CheckCircle2 size={16} className="text-green-500 mr-2" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Safety Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                How We Keep You Safe
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our comprehensive safety features are designed to give you peace of mind 
                while using our platform.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {safetyFeatures.map((feature, index) => (
                <Card key={index} className="border-love-100 shadow-sm hover:shadow-md transition-all">
                  <CardHeader className="pb-2">
                    <div className="mb-4">{feature.icon}</div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Verification Process Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Our Verification Process
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We take profile verification seriously to ensure you're connecting with real people.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              {verificationSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-12 h-12 rounded-full bg-love-100 flex items-center justify-center shrink-0 border-2 border-love-500">
                      <span className="text-love-600 font-bold">{step.step}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  {index < verificationSteps.length - 1 && (
                    <div className="absolute top-12 left-6 w-0.5 h-12 bg-love-200"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Trust Badges Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-display font-bold mb-12">Trusted By</h2>
            <div className="flex flex-wrap justify-center items-center gap-12">
              {["Data Protection Certified", "Online Dating Association", "Internet Safety Council", "Privacy Shield"].map((badge, index) => (
                <div key={index} className="flex items-center">
                  <BadgeCheck size={24} className="text-love-500 mr-2" />
                  <span className="text-lg font-medium">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-love-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Ready to Date Safely?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Create an account now and experience dating with peace of mind.
            </p>
            <Link to="/signup">
              <Button className="bg-gradient-love text-white hover:opacity-90 px-6 py-6 text-lg rounded-full">
                Join LoveQuest Today
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Safety;
