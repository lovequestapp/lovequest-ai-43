
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, UserCheck, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  
  const handleTakeQuiz = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/', { state: { showQuiz: true } });
  };
  
  const handleSignUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/signup');
  };
  
  const handleSafetyInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/safety');
  };
  
  const handleBannerClick = () => {
    navigate('/signup');
  };

  return (
    <section 
      className="py-16 md:py-24 px-4 text-center relative overflow-hidden cursor-pointer"
      onClick={handleBannerClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-love-50 to-passion-50 -z-10" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--love-100),transparent_70%)]" />
      
      <div className="max-w-4xl mx-auto">
        <div className="inline-block bg-white p-2 rounded-full mb-6 shadow-md pointer-events-auto">
          <Heart size={40} className="text-love-500" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 bg-gradient-love text-transparent bg-clip-text pointer-events-auto">
          Find Your Perfect Match with AI
        </h1>
        
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto pointer-events-auto">
          Experience a smarter way to date. Our AI algorithm finds deep compatibility beyond just photos and profiles.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 pointer-events-auto">
          <Button 
            onClick={handleTakeQuiz}
            className="text-lg py-6 px-8 rounded-full bg-gradient-love hover:opacity-90 shadow-md w-full sm:w-auto"
            size="lg"
          >
            <Sparkles size={20} className="mr-2" />
            Take the Compatibility Quiz
          </Button>
          
          <Button 
            onClick={handleSignUp}
            className="text-lg py-6 px-8 rounded-full bg-white text-love-600 border border-love-200 hover:bg-love-50 shadow-md w-full sm:w-auto"
            size="lg"
          >
            <UserCheck size={20} className="mr-2" />
            Sign Up Now
          </Button>
        </div>
        
        <div 
          className="bg-white/90 backdrop-blur-sm rounded-lg p-4 inline-block shadow-md pointer-events-auto cursor-pointer hover:bg-white/100 transition-colors"
          onClick={handleSafetyInfoClick}
        >
          <p className="text-sm font-medium text-love-700 flex items-center">
            <Shield size={16} className="mr-2 text-love-500" />
            All profiles are verified for your safety
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
