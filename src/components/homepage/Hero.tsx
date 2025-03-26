
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, UserCheck, Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  const navigate = useNavigate();
  
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
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-love-50 to-passion-50 -z-10" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--love-100),transparent_70%)]" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-love-200 rounded-full blur-3xl opacity-20 animate-pulse-heart" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-passion-100 rounded-full blur-3xl opacity-30" />
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon badge */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center bg-white p-3 rounded-full mb-8 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={handleTakeQuiz}
          >
            <Heart size={36} className="text-love-500" />
          </motion.div>
          
          {/* Main heading */}
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold mb-6 bg-gradient-love text-transparent bg-clip-text leading-tight"
          >
            Find Your Perfect Match with <br className="hidden sm:block" />Intelligent AI
          </motion.h1>
          
          {/* Subheading */}
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto"
          >
            Experience a smarter way to date. Our AI algorithm finds deep compatibility 
            beyond just photos and profiles.
          </motion.p>
          
          {/* CTA buttons */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-12"
          >
            <Button 
              onClick={handleTakeQuiz}
              variant="love"
              size="xl"
              rounded="full"
              className="group relative overflow-hidden shadow-md hover:shadow-xl w-full sm:w-auto"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-love-500 to-passion-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
              <Sparkles size={20} className="mr-2 animate-sparkle" />
              <span>Take the Compatibility Quiz</span>
              <ArrowRight size={18} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </Button>
            
            <Button 
              onClick={handleSignUp}
              variant="glossy"
              size="xl"
              rounded="full"
              className="group w-full sm:w-auto hover:shadow-xl transition-all duration-300"
            >
              <UserCheck size={20} className="mr-2" />
              <span>Sign Up Now</span>
              <ArrowRight size={18} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </Button>
          </motion.div>
          
          {/* Safety badge */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onClick={handleSafetyInfoClick}
            className="inline-flex items-center bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-md hover:shadow-xl hover:bg-white/100 transition-all duration-300 cursor-pointer"
          >
            <Shield size={20} className="text-love-500 mr-3" />
            <p className="text-sm font-medium text-love-700">All profiles are verified for your safety</p>
            <ArrowRight size={16} className="ml-3 text-love-400" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
