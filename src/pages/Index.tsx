import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CompatibilityQuiz from '@/components/CompatibilityQuiz';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Heart, Sparkles, Users, MessageCircleHeart, Shield, UserCheck, Gift } from 'lucide-react';

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
    },
    {
      icon: <Shield size={28} className="text-love-500" />,
      title: "Verified Profiles Only",
      description: "Our advanced identity verification ensures you're only connecting with real, authentic people."
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      age: 28,
      quote: "I found my perfect match within two weeks of joining! The AI matching actually works.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&auto=format&fit=crop"
    },
    {
      name: "Michael T.",
      age: 32,
      quote: "The verification process gave me peace of mind that I was talking to real people.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&auto=format&fit=crop"
    },
    {
      name: "Jennifer K.",
      age: 26,
      quote: "The compatibility quiz matched me with people I actually connect with. Highly recommend!",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&auto=format&fit=crop"
    }
  ];
  
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
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                  <Button 
                    onClick={() => setShowQuiz(true)}
                    className="text-lg py-6 px-8 rounded-full bg-gradient-love hover:opacity-90 shadow-md animate-float w-full sm:w-auto"
                    size="lg"
                  >
                    <Sparkles size={20} className="mr-2" />
                    Take the Compatibility Quiz
                  </Button>
                  
                  <Link to="/signup">
                    <Button 
                      className="text-lg py-6 px-8 rounded-full bg-white text-love-600 border border-love-200 hover:bg-love-50 shadow-md w-full sm:w-auto"
                      size="lg"
                    >
                      <UserCheck size={20} className="mr-2" />
                      Sign Up Now
                    </Button>
                  </Link>
                </div>
                
                <div className="bg-white rounded-lg p-4 inline-block shadow-md animate-float">
                  <p className="text-sm font-medium text-love-700 flex items-center">
                    <Shield size={16} className="mr-2 text-love-500" />
                    All profiles are verified for your safety
                  </p>
                </div>
              </div>
            </section>
            
            <section className="py-16 px-4 bg-white">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
                  Why Choose <span className="bg-gradient-love text-transparent bg-clip-text">LoveQuest</span>
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
            
            <section className="py-16 px-4 bg-love-50">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
                  Membership Plans
                </h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <Card className="border-love-100 shadow-md hover:-translate-y-1 transition-all duration-300">
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-display font-bold mb-2">Free</h3>
                      <p className="text-3xl font-bold mb-4">$0<span className="text-lg font-normal text-gray-500">/month</span></p>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                          <Heart size={16} className="text-love-500 mr-2" />
                          Basic profile creation
                        </li>
                        <li className="flex items-center">
                          <Heart size={16} className="text-love-500 mr-2" />
                          Limited matches per day
                        </li>
                        <li className="flex items-center">
                          <Heart size={16} className="text-love-500 mr-2" />
                          Text messaging
                        </li>
                      </ul>
                      <Link to="/signup" className="block">
                        <Button className="w-full">Sign Up Free</Button>
                      </Link>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-love-500 shadow-xl hover:-translate-y-2 transition-all duration-300 relative">
                    <div className="absolute -top-3 left-0 right-0 mx-auto w-max bg-love-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-display font-bold mb-2">Premium</h3>
                      <p className="text-3xl font-bold mb-4">$9.99<span className="text-lg font-normal text-gray-500">/month</span></p>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                          <Heart size={16} className="text-love-500 mr-2" />
                          Unlimited matches
                        </li>
                        <li className="flex items-center">
                          <Heart size={16} className="text-love-500 mr-2" />
                          Voice notes & Video calling
                        </li>
                        <li className="flex items-center">
                          <Heart size={16} className="text-love-500 mr-2" />
                          Priority in search results
                        </li>
                        <li className="flex items-center">
                          <Heart size={16} className="text-love-500 mr-2" />
                          See who liked you
                        </li>
                      </ul>
                      <Link to="/signup" className="block">
                        <Button className="w-full bg-love-500 hover:bg-love-600">Get Premium</Button>
                      </Link>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-love-100 shadow-md hover:-translate-y-1 transition-all duration-300">
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-display font-bold mb-2">VIP</h3>
                      <p className="text-3xl font-bold mb-4">$19.99<span className="text-lg font-normal text-gray-500">/month</span></p>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                          <Heart size={16} className="text-love-500 mr-2" />
                          All Premium features
                        </li>
                        <li className="flex items-center">
                          <Heart size={16} className="text-love-500 mr-2" />
                          Profile boost once a week
                        </li>
                        <li className="flex items-center">
                          <Heart size={16} className="text-love-500 mr-2" />
                          Unlimited gifts
                        </li>
                        <li className="flex items-center">
                          <Gift size={16} className="text-love-500 mr-2" />
                          Exclusive VIP badge
                        </li>
                      </ul>
                      <Link to="/signup" className="block">
                        <Button className="w-full">Go VIP</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>
            
            <section className="py-16 px-4 bg-white">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
                  Success Stories
                </h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-love-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-4">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="w-16 h-16 rounded-full object-cover mr-4"
                        />
                        <div>
                          <h3 className="font-semibold">{testimonial.name}</h3>
                          <p className="text-sm text-gray-600">{testimonial.age} years old</p>
                        </div>
                      </div>
                      <p className="italic text-gray-700">"{testimonial.quote}"</p>
                    </div>
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
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button 
                    onClick={() => setShowQuiz(true)}
                    className="text-lg py-6 px-8 rounded-full bg-gradient-love hover:opacity-90 shadow-md"
                    size="lg"
                  >
                    <Heart size={20} className="mr-2 fill-white" />
                    Start Your Love Journey
                  </Button>
                  
                  <Link to="/signup">
                    <Button 
                      className="text-lg py-6 px-8 rounded-full bg-white text-love-600 border border-love-200 hover:bg-love-50 shadow-md"
                      size="lg"
                    >
                      <UserCheck size={20} className="mr-2" />
                      Create Your Account
                    </Button>
                  </Link>
                </div>
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
