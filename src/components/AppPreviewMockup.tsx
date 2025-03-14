
import React, { useState, useEffect } from 'react';
import { Smartphone, ChevronRight, ChevronLeft } from 'lucide-react';

const mockScreens = [
  {
    id: 1,
    title: "Find Matches",
    description: "Our AI-powered matching algorithm finds your perfect match",
    bgColor: "bg-love-100",
    image: "https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?w=500&h=900&fit=crop"
  },
  {
    id: 2,
    title: "Chat & Connect",
    description: "Meaningfully connect with personalized conversation starters",
    bgColor: "bg-passion-100",
    image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=500&h=900&fit=crop"
  },
  {
    id: 3,
    title: "Go on Dates",
    description: "Turn digital connections into real-world relationships",
    bgColor: "bg-purple-100",
    image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=500&h=900&fit=crop"
  }
];

const AppPreviewMockup = () => {
  const [activeScreen, setActiveScreen] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-scroll through screens
  useEffect(() => {
    const interval = setInterval(() => {
      goToNextScreen();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeScreen]);

  const goToNextScreen = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setActiveScreen((prev) => (prev + 1) % mockScreens.length);
      setIsAnimating(false);
    }, 500);
  };

  const goToPrevScreen = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setActiveScreen((prev) => (prev - 1 + mockScreens.length) % mockScreens.length);
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div className="relative w-full max-w-xs mx-auto">
      {/* iPhone Frame */}
      <div className="relative rounded-[40px] bg-gray-900 border-4 border-gray-800 p-2 shadow-xl aspect-[9/19] w-full mx-auto">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-900 rounded-b-2xl z-10"></div>
        
        {/* Screen */}
        <div className="absolute inset-2 rounded-[32px] bg-gray-50 overflow-hidden">
          {/* Status Bar */}
          <div className="h-6 bg-black bg-opacity-20 flex justify-between items-center px-4">
            <div className="text-white text-xs font-bold">9:41</div>
            <div className="flex space-x-1">
              <div className="w-4 h-2 bg-white rounded-sm"></div>
              <div className="w-1 h-2 bg-white rounded-full"></div>
              <div className="w-1 h-2 bg-white rounded-full"></div>
              <div className="w-1 h-2 bg-white rounded-full"></div>
              <div className="w-4 h-2 bg-white rounded-sm"></div>
            </div>
          </div>
          
          {/* App Content */}
          <div className="h-full">
            {mockScreens.map((screen, index) => (
              <div 
                key={screen.id}
                className={`absolute inset-0 flex flex-col ${screen.bgColor} transition-all duration-500 ease-in-out ${
                  index === activeScreen 
                    ? 'opacity-100 translate-x-0' 
                    : index < activeScreen 
                      ? 'opacity-0 -translate-x-full' 
                      : 'opacity-0 translate-x-full'
                }`}
              >
                <div className="p-4 pb-2">
                  <h3 className="text-lg font-display font-semibold text-gray-900">{screen.title}</h3>
                  <p className="text-xs text-gray-700">{screen.description}</p>
                </div>
                
                <div className="flex-1 relative overflow-hidden">
                  <img 
                    src={screen.image} 
                    alt={screen.title}
                    className="absolute inset-0 w-full h-full object-cover rounded-b-3xl"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation Dots */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
            {mockScreens.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveScreen(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeScreen ? 'bg-love-600 scale-125' : 'bg-gray-400'
                }`}
                aria-label={`Go to screen ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Side Buttons */}
        <div className="absolute right-0 top-[20%] w-1 h-10 bg-gray-800 rounded-l-lg"></div>
        <div className="absolute left-0 top-[15%] w-1 h-6 bg-gray-800 rounded-r-lg"></div>
        <div className="absolute left-0 top-[25%] w-1 h-6 bg-gray-800 rounded-r-lg"></div>
        
        {/* Home Bar */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gray-600 rounded-full"></div>
      </div>
      
      {/* Navigation Arrows */}
      <button 
        onClick={goToPrevScreen}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
        aria-label="Previous screen"
      >
        <ChevronLeft className="text-love-600" size={20} />
      </button>
      
      <button 
        onClick={goToNextScreen}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-12 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
        aria-label="Next screen"
      >
        <ChevronRight className="text-love-600" size={20} />
      </button>
      
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-love-200 via-passion-200 to-purple-200 rounded-[48px] -z-10 blur-xl opacity-70 animate-glow"></div>
    </div>
  );
};

export default AppPreviewMockup;
