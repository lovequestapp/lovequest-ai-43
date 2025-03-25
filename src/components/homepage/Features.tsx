
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Gem, Sparkles, Users, MessageCircleHeart, Shield } from 'lucide-react';

const Features = () => {
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

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-love-50 rounded-full mb-4">
            <Gem size={18} className="text-love-500 mr-2" />
            <span className="text-sm font-medium text-love-700">Premium Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Why Choose <span className="bg-gradient-love text-transparent bg-clip-text">LoveQuest</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our innovative features are designed to help you form deeper connections
            and find meaningful relationships.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-love-100 shadow-sm hover:shadow-md transition-shadow card-hover">
              <CardContent className="p-6 text-center">
                <div className="mb-4 w-16 h-16 rounded-full bg-love-50 flex items-center justify-center mx-auto">
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
  );
};

export default Features;
