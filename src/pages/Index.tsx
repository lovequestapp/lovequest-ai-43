
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CompatibilityQuiz from '@/components/CompatibilityQuiz';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Heart, Sparkles, Users, MessageCircleHeart } from 'lucide-react';

const Index = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const navigate = useNavigate();
  
  const handleQuizComplete = (results: Record<string, string>) => {
    console.log('Quiz results:', results);
    // In a real app, we would save these results to the user profile
    navigate('/discover');
  };
  
  const features = [
    {
      icon: <Sparkles size={28} className="text-love-500" />,
      title: "AI-Powered Matching",
      description: "Our advanced AI analyzes compatibility beyond just interests, finding deeper connections based on values, communication styles, and life goals."
    },
    {
      icon: <Users size={28} className="text-love-500" />,
      title: "Authentic Connections",
      description: "Focus on quality over quantity. Our platform helps you form meaningful relationships with highly compatible people."
    },
    {
      icon: <MessageCircleHeart size={28} className="text-love-500" />,
      title: "Conversation Starters",
      description: "Never worry about what to say first. Our AI suggests personalized conversation starters based on shared interests and values."
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {showQuiz ? (
          <div className="container mx-auto px-4 py-10">
            <CompatibilityQuiz onComplete={handleQuizComplete} />
          </div>
        ) : (
          <>
            <section className="py-16 md:py-24 px-4 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-love-50 to-passion-50 -z-10" />
              
              <div className="max-w-4xl mx-auto">
                <div className="inline-block bg-white p-2 rounded-full mb-6 shadow-md">
                  <Heart size={40} className="text-love-500 animate-pulse-heart" />
                </div>
                
                <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 bg-gradient-love text-transparent bg-clip-text">
                  Find Your Perfect Match with AI
                </h1>
                
                <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                  Experience a smarter way to date. Our AI algorithm finds deep compatibility beyond just photos and profiles.
                </p>
                
                <Button 
                  onClick={() => setShowQuiz(true)}
                  className="text-lg py-6 px-8 rounded-full bg-gradient-love hover:opacity-90 shadow-md animate-float"
                  size="lg"
                >
                  <Sparkles size={20} className="mr-2" />
                  Take the Compatibility Quiz
                </Button>
              </div>
            </section>
            
            <section className="py-16 px-4 bg-white">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
                  Why Choose <span className="bg-gradient-love text-transparent bg-clip-text">LoveQuest</span>
                </h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {features.map((feature, index) => (
                    <Card key={index} className="border-love-100 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6 text-center">
                        <div className="mb-4 flex justify-center">
                          {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
            
            <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-love-50 to-passion-50">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  Ready to Find True Love?
                </h2>
                
                <p className="text-xl text-gray-700 mb-8">
                  Join thousands who've found meaningful connections through our AI-powered matching.
                </p>
                
                <Button 
                  onClick={() => setShowQuiz(true)}
                  className="text-lg py-6 px-8 rounded-full bg-gradient-love hover:opacity-90 shadow-md"
                  size="lg"
                >
                  <Heart size={20} className="mr-2 fill-white" />
                  Start Your Love Journey
                </Button>
              </div>
            </section>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
