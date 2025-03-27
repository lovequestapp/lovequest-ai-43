
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, UserCheck, Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const Hero = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleTakeQuiz = () => {
    navigate('/', { state: { showQuiz: true } });
  };
  
  const handleSignUp = () => {
    navigate('/signup');
  };
  
  const handleSafetyInfoClick = () => {
    navigate('/safety');
  };
  
  return (
    <section className="relative py-12 md:py-20 lg:py-28 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-love-50 to-passion-50 -z-10" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--love-100),transparent_70%)]" />
      
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon badge */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center bg-white p-2 sm:p-3 rounded-full mb-6 sm:mb-8 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={handleTakeQuiz}
          >
            <Heart size={isMobile ? 28 : 36} className="text-love-500" />
          </motion.div>
          
          {/* Main heading */}
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 sm:mb-6 bg-gradient-love text-transparent bg-clip-text leading-tight"
          >
            Find Your Perfect Match with {isMobile ? '' : <br className="hidden sm:block" />}Intelligent AI
          </motion.h1>
          
          {/* Subheading */}
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-10 max-w-2xl mx-auto px-2"
          >
            Experience a smarter way to date. Our AI algorithm finds deep compatibility 
            beyond just photos and profiles.
          </motion.p>
          
          {/* CTA buttons */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mb-8 sm:mb-12"
          >
            <Button 
              onClick={handleTakeQuiz}
              size={isMobile ? "default" : "lg"}
              className="group relative bg-gradient-love text-white overflow-hidden shadow-md hover:shadow-xl w-full sm:w-auto rounded-full"
            >
              <Sparkles size={isMobile ? 18 : 20} className="mr-2 animate-sparkle" />
              <span>{isMobile ? "Take Quiz" : "Take the Compatibility Quiz"}</span>
              <ArrowRight size={isMobile ? 16 : 18} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </Button>
            
            <Button 
              onClick={handleSignUp}
              variant="outline"
              size={isMobile ? "default" : "lg"}
              className="group w-full sm:w-auto hover:shadow-xl transition-all duration-300 border-love-200 text-love-700 hover:bg-love-50 rounded-full mt-3 sm:mt-0"
            >
              <UserCheck size={isMobile ? 18 : 20} className="mr-2" />
              <span>Sign Up Now</span>
              <ArrowRight size={isMobile ? 16 : 18} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </Button>
          </motion.div>
          
          {/* Safety badge */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onClick={handleSafetyInfoClick}
            className="inline-flex items-center bg-white/90 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-md hover:shadow-xl hover:bg-white/100 transition-all duration-300 cursor-pointer text-center"
          >
            <Shield size={isMobile ? 16 : 20} className="text-love-500 mr-2 sm:mr-3 flex-shrink-0" />
            <p className="text-xs sm:text-sm font-medium text-love-700 truncate">All profiles are verified for your safety</p>
            <ArrowRight size={isMobile ? 14 : 16} className="ml-2 sm:ml-3 text-love-400 flex-shrink-0" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
