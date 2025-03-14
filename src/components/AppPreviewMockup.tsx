
import React, { useState, useEffect } from 'react';
import { Smartphone, ChevronRight, ChevronLeft, Heart, MessageCircle, Calendar } from 'lucide-react';

const mockScreens = [
  {
    id: 1,
    title: "Find Matches",
    description: "Our AI-powered matching algorithm finds your perfect match",
    bgColor: "bg-love-50",
    content: (
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center px-3 py-2 bg-white border-b">
          <Heart size={18} className="text-love-500" />
          <h4 className="text-sm font-medium">LoveQuest</h4>
          <div className="w-5"></div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-3 mb-2">
              <div className="flex items-start space-x-3">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                  <img 
                    src={`https://images.unsplash.com/photo-${i % 2 === 0 ? '1534528741775-53994a69daeb' : '1507003211169-0a1dd7228f2d'}?w=150&h=150&fit=crop`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{i % 2 === 0 ? 'Sarah' : 'Michael'}, {25 + i}</h3>
                    <div className="flex space-x-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-love-100 text-love-800">
                        95% Match
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {i % 2 === 0 ? 'Designer • Dog lover • Hiking enthusiast' : 'Software Engineer • Foodie • Travel addict'}
                  </p>
                  <div className="flex space-x-2 mt-2">
                    <button className="p-1.5 rounded-full bg-love-100 text-love-600 hover:bg-love-200 transition-colors">
                      <Heart size={16} />
                    </button>
                    <button className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                      <MessageCircle size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-2 border-t bg-white">
          <div className="flex justify-around">
            <button className="p-2 text-love-500">
              <Heart size={20} className="mx-auto" />
              <span className="text-xs">Matches</span>
            </button>
            <button className="p-2 text-gray-400">
              <MessageCircle size={20} className="mx-auto" />
              <span className="text-xs">Messages</span>
            </button>
            <button className="p-2 text-gray-400">
              <Calendar size={20} className="mx-auto" />
              <span className="text-xs">Dates</span>
            </button>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "Chat & Connect",
    description: "Meaningfully connect with personalized conversation starters",
    bgColor: "bg-passion-50",
    content: (
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center px-3 py-2 bg-white border-b">
          <button className="w-5">
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" 
                alt="Chat with Sarah" 
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-sm font-medium">Sarah</h4>
          </div>
          <div className="w-5"></div>
        </div>
        
        <div className="flex-1 bg-gray-50 p-3 overflow-y-auto space-y-3">
          <div className="flex justify-end">
            <div className="bg-love-100 text-gray-800 rounded-lg p-2 max-w-[80%] text-sm">
              Hi Sarah! I noticed you like hiking too. What's your favorite trail?
            </div>
          </div>
          
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-lg p-2 max-w-[80%] text-sm shadow-sm">
              Hey! I love the trails at Mount Rainier. Have you been there?
            </div>
          </div>
          
          <div className="flex justify-end">
            <div className="bg-love-100 text-gray-800 rounded-lg p-2 max-w-[80%] text-sm">
              Not yet, but it's on my bucket list! Would you want to plan a hike sometime?
            </div>
          </div>
          
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-lg p-2 max-w-[80%] text-sm shadow-sm">
              That sounds perfect! I'm free next weekend if you are?
            </div>
          </div>
          
          <div className="flex justify-end">
            <div className="bg-love-100 text-gray-800 rounded-lg p-2 max-w-[80%] text-sm">
              Next weekend works for me! Can't wait 😊
            </div>
          </div>
          
          <div className="flex justify-start items-end space-x-1">
            <div className="bg-white text-gray-800 rounded-lg p-2 max-w-[80%] text-sm shadow-sm">
              Great! I'll send you the details.
            </div>
            <span className="text-xs text-gray-500">Now</span>
          </div>
        </div>
        
        <div className="p-2 bg-white border-t">
          <div className="flex space-x-2">
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="flex-1 bg-gray-100 rounded-full px-4 py-1.5 text-sm focus:outline-none"
            />
            <button className="p-1.5 rounded-full bg-love-500 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13"></path>
                <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Go on Dates",
    description: "Turn digital connections into real-world relationships",
    bgColor: "bg-purple-50",
    content: (
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center px-3 py-2 bg-white border-b">
          <ChevronLeft size={18} className="text-gray-600" />
          <h4 className="text-sm font-medium">Upcoming Dates</h4>
          <div className="w-5"></div>
        </div>
        
        <div className="flex-1 p-3 space-y-3 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-sm p-3">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-love-700">Coffee Date with Sarah</h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                Confirmed
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <Calendar size={14} className="mr-2" />
                <span>Saturday, June 10th • 2:00 PM</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Emerald Coffee House, 123 Main St</span>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-100 flex space-x-2">
              <button className="flex-1 text-sm py-1.5 rounded-md bg-love-100 text-love-600 font-medium">
                Message
              </button>
              <button className="flex-1 text-sm py-1.5 rounded-md bg-gray-100 text-gray-600 font-medium">
                Reschedule
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-3">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-love-700">Hiking with Michael</h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                Pending
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <Calendar size={14} className="mr-2" />
                <span>Sunday, June 18th • 9:00 AM</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Mount Rainier Trail</span>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-100 flex space-x-2">
              <button className="flex-1 text-sm py-1.5 rounded-md bg-love-500 text-white font-medium">
                Confirm
              </button>
              <button className="flex-1 text-sm py-1.5 rounded-md bg-gray-100 text-gray-600 font-medium">
                Decline
              </button>
            </div>
          </div>
          
          <div className="p-3 bg-love-50 rounded-lg">
            <h3 className="font-medium text-love-700 mb-1">Date Ideas For You</h3>
            <p className="text-xs text-gray-600 mb-2">Based on your shared interests</p>
            
            <div className="space-y-2">
              <div className="bg-white rounded-md p-2 text-sm">Cooking Class - Italian Cuisine</div>
              <div className="bg-white rounded-md p-2 text-sm">Wine Tasting Tour</div>
              <div className="bg-white rounded-md p-2 text-sm">Botanical Garden Visit</div>
            </div>
          </div>
        </div>
        
        <div className="p-2 border-t bg-white">
          <div className="flex justify-around">
            <button className="p-2 text-gray-400">
              <Heart size={20} className="mx-auto" />
              <span className="text-xs">Matches</span>
            </button>
            <button className="p-2 text-gray-400">
              <MessageCircle size={20} className="mx-auto" />
              <span className="text-xs">Messages</span>
            </button>
            <button className="p-2 text-love-500">
              <Calendar size={20} className="mx-auto" />
              <span className="text-xs">Dates</span>
            </button>
          </div>
        </div>
      </div>
    )
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
          <div className="h-full pt-6">
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
                {screen.content}
              </div>
            ))}
          </div>
          
          {/* Navigation Dots */}
          <div className="absolute bottom-20 left-0 right-0 flex justify-center space-x-2 z-10">
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
