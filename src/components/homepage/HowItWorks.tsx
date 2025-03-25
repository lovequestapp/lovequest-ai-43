
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Zap, UserCheck, Search, MessageCircleHeart, CalendarCheck } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <UserCheck size={32} className="text-love-500" />,
      title: "Create Your Profile",
      description: "Answer our in-depth personality questions to help our AI understand your values and preferences."
    },
    {
      icon: <Search size={32} className="text-love-500" />,
      title: "Discover Matches",
      description: "Our AI algorithm finds potential matches with the highest compatibility based on key factors."
    },
    {
      icon: <MessageCircleHeart size={32} className="text-love-500" />,
      title: "Connect Meaningfully",
      description: "Start conversations with AI-powered suggestions tailored to your shared interests."
    },
    {
      icon: <CalendarCheck size={32} className="text-love-500" />,
      title: "Plan Real-Life Dates",
      description: "Use our built-in tools to schedule and plan memorable dates with your matches."
    }
  ];

  return (
    <section className="py-16 px-4 bg-love-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm mb-4">
            <Zap size={18} className="text-love-500 mr-2" />
            <span className="text-sm font-medium text-love-700">Simple Process</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            How <span className="bg-gradient-love text-transparent bg-clip-text">LoveQuest</span> Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our intelligent matchmaking process combines advanced AI with human-centered design 
            to create meaningful connections.
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 relative">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-love-200 via-love-300 to-love-200 z-0"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="relative z-10 card-hover">
              <Card className="border-love-100 shadow-sm hover:shadow-md transition-shadow h-full">
                <CardContent className="p-6 text-center flex flex-col items-center">
                  <div className="mb-4 w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center border border-love-100">
                    {step.icon}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-love-500 text-white flex items-center justify-center text-lg font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
