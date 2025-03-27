
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, MessageCircleHeart, UserCheck, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  {
    icon: <Sparkles className="h-6 w-6 text-love-500" />,
    title: "AI-Powered Matching",
    description: "Our advanced algorithm finds your most compatible matches based on personality, values, and goals."
  },
  {
    icon: <MessageCircleHeart className="h-6 w-6 text-love-500" />,
    title: "Meaningful Conversations",
    description: "Start with AI-suggested conversation topics based on your shared interests."
  },
  {
    icon: <Shield className="h-6 w-6 text-love-500" />,
    title: "Verified Profiles",
    description: "100% of our profiles are verified for your safety and peace of mind."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 text-center">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-love-50 to-passion-50 -z-10" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--love-100),transparent_70%)]" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center bg-white p-3 rounded-full mb-8 shadow-md"
          >
            <Heart size={36} className="text-love-500" />
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold mb-6 bg-gradient-love text-transparent bg-clip-text leading-tight"
          >
            Find Your Perfect Match with <br className="hidden sm:block" />Intelligent AI
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto"
          >
            Experience a smarter way to date. Our AI algorithm finds deep compatibility 
            beyond just photos and profiles.
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link to="/register">
              <Button size="lg" className="bg-gradient-love group relative overflow-hidden shadow-md hover:shadow-xl text-white w-full sm:w-auto rounded-full">
                <Sparkles size={20} className="mr-2" />
                <span>Get Started</span>
                <ArrowRight size={18} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </Button>
            </Link>
            
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-love-200 text-love-700 hover:bg-love-50 group relative w-full sm:w-auto rounded-full">
                <UserCheck size={20} className="mr-2" />
                <span>Login</span>
                <ArrowRight size={18} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </Button>
            </Link>
          </motion.div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-flex items-center bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-md"
          >
            <Shield size={20} className="text-love-500 mr-3" />
            <p className="text-sm font-medium text-love-700">All profiles are verified for your safety</p>
          </motion.div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-love-300 flex justify-center p-1">
            <motion.div 
              animate={{ 
                y: [0, 12, 0],
              }}
              transition={{ 
                repeat: Infinity,
                duration: 1.5,
              }}
              className="w-2 h-2 bg-love-500 rounded-full"
            />
          </div>
        </motion.div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Why Choose <span className="bg-gradient-love text-transparent bg-clip-text">LoveQuest</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our innovative features are designed to help you form deeper connections
            </p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="border-love-100 shadow-sm hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 w-16 h-16 rounded-full bg-love-50 flex items-center justify-center mx-auto">
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-6 bg-love-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Ready to Find Your <span className="bg-gradient-love text-transparent bg-clip-text">Perfect Match</span>?
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Join thousands who've already found meaningful connections through our AI-powered matching
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-gradient-love text-white px-8 py-6 text-lg rounded-full">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
