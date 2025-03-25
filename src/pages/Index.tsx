
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompatibilityQuiz from '@/components/CompatibilityQuiz';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppPreviewMockup from '@/components/AppPreviewMockup';
import { 
  Heart, 
  Sparkles, 
  Users, 
  MessageCircleHeart, 
  Shield, 
  UserCheck, 
  Gift, 
  Smartphone, 
  Star,
  Clock,
  Check,
  X,
  ChevronRight,
  Trophy,
  Zap,
  ArrowRight,
  Gem,
  Lock,
  BellRing,
  CalendarCheck,
  Search,
  MapPin,
  Crown
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const Index = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const navigate = useNavigate();
  
  const handleQuizComplete = (results: Record<string, string>) => {
    console.log('Quiz results:', results);
    // In a real app, we would save these results to the user profile
    navigate('/discover');
  };
  
  const handleBannerClick = () => {
    navigate('/signup');
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

  const howItWorks = [
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

  const testimonials = [
    {
      name: "Sarah M.",
      age: 28,
      quote: "I found my perfect match within two weeks of joining! The AI matching actually works, and the verification process made me feel so much safer than on other dating apps.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&auto=format&fit=crop"
    },
    {
      name: "Michael T.",
      age: 32,
      quote: "The verification process gave me peace of mind that I was talking to real people. The conversation starters feature helped me break the ice easily.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&auto=format&fit=crop"
    },
    {
      name: "Jennifer K.",
      age: 26,
      quote: "The compatibility quiz matched me with people I actually connect with. After countless failed attempts on other dating apps, I finally met someone special here.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&auto=format&fit=crop"
    },
    {
      name: "David L.",
      age: 30,
      quote: "What sets LoveQuest apart is the quality of people. Everyone I've met has been genuine and looking for something real - not just hookups.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&auto=format&fit=crop"
    },
    {
      name: "Rebecca W.",
      age: 34,
      quote: "The Premium membership was completely worth it. I got more meaningful matches in one month than a year on other dating platforms.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&auto=format&fit=crop"
    }
  ];

  const faqs = [
    {
      question: "How does the AI matching work?",
      answer: "Our proprietary AI analyzes over 100 compatibility factors including personality traits, communication styles, life goals, and values. Unlike traditional dating apps that focus primarily on appearance and location, our algorithm prioritizes deep compatibility for meaningful connections."
    },
    {
      question: "How is LoveQuest different from other dating apps?",
      answer: "LoveQuest focuses on quality over quantity. Our AI matching, stringent verification process, and meaningful conversation tools are designed to help you find genuine connections rather than endless swiping."
    },
    {
      question: "How does the verification process work?",
      answer: "Our multi-step verification includes photo verification, social media linking options, and optional ID verification for enhanced trust. This ensures you're only talking to real, authentic people."
    },
    {
      question: "Can I use LoveQuest for free?",
      answer: "Yes! Our free tier gives you access to basic features including profile creation, limited matches, and text messaging. Premium plans unlock advanced features for serious daters."
    },
    {
      question: "How private is my information?",
      answer: "We take privacy seriously. Your personal data is encrypted and never sold to third parties. You control exactly what information is visible on your profile and to whom."
    }
  ];

  const pressLogos = [
    {
      name: "TechCrunch",
      quote: "Revolutionizing online dating"
    },
    {
      name: "Forbes",
      quote: "Top dating innovation of the year"
    },
    {
      name: "Wired",
      quote: "AI that actually understands compatibility"
    },
    {
      name: "Vogue",
      quote: "Dating reimagined for the modern age"
    }
  ];

  const comparisonFeatures = [
    { name: "AI-Powered Matching", free: true, premium: true, vip: true },
    { name: "Verified Profiles", free: true, premium: true, vip: true },
    { name: "Daily Matches", free: "5/day", premium: "Unlimited", vip: "Unlimited" },
    { name: "Message Filters", free: false, premium: true, vip: true },
    { name: "Video Calling", free: false, premium: true, vip: true },
    { name: "See Who Likes You", free: false, premium: true, vip: true },
    { name: "Relationship Insights", free: false, premium: true, vip: true },
    { name: "Profile Boost", free: false, premium: "Once a month", vip: "Weekly" },
    { name: "Priority Support", free: false, premium: false, vip: true },
    { name: "Exclusive VIP Events", free: false, premium: false, vip: true },
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowQuiz(true);
                    }}
                    className="text-lg py-6 px-8 rounded-full bg-gradient-love hover:opacity-90 shadow-md w-full sm:w-auto"
                    size="lg"
                  >
                    <Sparkles size={20} className="mr-2" />
                    Take the Compatibility Quiz
                  </Button>
                  
                  <Link to="/signup" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      className="text-lg py-6 px-8 rounded-full bg-white text-love-600 border border-love-200 hover:bg-love-50 shadow-md w-full sm:w-auto"
                      size="lg"
                    >
                      <UserCheck size={20} className="mr-2" />
                      Sign Up Now
                    </Button>
                  </Link>
                </div>
                
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 inline-block shadow-md pointer-events-auto">
                  <p className="text-sm font-medium text-love-700 flex items-center">
                    <Shield size={16} className="mr-2 text-love-500" />
                    All profiles are verified for your safety
                  </p>
                </div>
              </div>
            </section>
            
            {/* App Preview Mockup Section */}
            <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-10 items-center">
                  <div className="space-y-6 max-w-xl">
                    <div className="inline-flex items-center px-4 py-2 bg-love-50 rounded-full">
                      <Smartphone size={18} className="text-love-500 mr-2" />
                      <span className="text-sm font-medium text-love-700">App Preview</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-display font-bold">
                      Experience Love in Your <span className="bg-gradient-love text-transparent bg-clip-text">Pocket</span>
                    </h2>
                    
                    <p className="text-lg text-gray-700">
                      Our beautifully designed app puts meaningful connections at your fingertips. With thoughtful features and an intuitive interface, finding love has never been more seamless.
                    </p>
                    
                    <ul className="space-y-3">
                      {['AI-powered matching', 'Secure messaging', 'Date planning tools', 'Profile verification'].map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <div className="h-6 w-6 rounded-full bg-love-100 flex items-center justify-center mr-3">
                            <Heart size={14} className="text-love-500" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="pt-4">
                      <Link to="/signup">
                        <Button className="bg-gradient-love hover:opacity-90 rounded-full">
                          Get Started Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="flex justify-center items-center relative py-10">
                    {/* Decorative elements */}
                    <div className="absolute -z-10 w-72 h-72 bg-love-100 rounded-full blur-3xl opacity-30 animate-pulse-heart"></div>
                    <div className="absolute -z-10 w-64 h-64 bg-passion-100 rounded-full blur-3xl opacity-30 -bottom-10 -right-10"></div>
                    
                    {/* iPhone Mockup */}
                    <AppPreviewMockup />
                  </div>
                </div>
              </div>
            </section>
            
            {/* How It Works Section */}
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
                  
                  {howItWorks.map((step, index) => (
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

            {/* Features Section with visual enhancements */}
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
            
            {/* Enhanced Testimonials Section - Carousel Style */}
            <section className="py-16 px-4 bg-gray-50 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--love-100),transparent_70%)]" />
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm mb-4">
                    <Trophy size={18} className="text-love-500 mr-2" />
                    <span className="text-sm font-medium text-love-700">Success Stories</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                    What Our Members Say
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Join thousands who've found meaningful connections through our AI-powered matching.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8 overflow-hidden relative">
                  {testimonials.slice(0, 3).map((testimonial, index) => (
                    <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow card-hover">
                      <div className="flex items-center mb-4">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-love-100"
                        />
                        <div>
                          <h3 className="font-semibold">{testimonial.name}</h3>
                          <p className="text-sm text-gray-600">{testimonial.age} years old</p>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute -top-2 -left-2 text-4xl text-love-200">"</div>
                        <p className="italic text-gray-700 relative z-10 pl-4">{testimonial.quote}</p>
                        <div className="absolute -bottom-4 -right-2 text-4xl text-love-200">"</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-8 gap-2">
                  {[0, 1].map((dot) => (
                    <button key={dot} className={`w-3 h-3 rounded-full ${dot === 0 ? 'bg-love-500' : 'bg-love-200'}`}></button>
                  ))}
                </div>
              </div>
            </section>
            
            {/* Pricing Section with Toggle */}
            <section className="py-16 px-4 bg-white">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center px-4 py-2 bg-love-50 rounded-full mb-4">
                    <Crown size={18} className="text-love-500 mr-2" />
                    <span className="text-sm font-medium text-love-700">Membership Plans</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                    Choose Your Perfect Plan
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Flexible options to match your dating goals
                  </p>
                  
                  <div className="inline-flex items-center mt-6 bg-gray-100 p-1 rounded-full">
                    <RadioGroup 
                      value={billingPeriod} 
                      onValueChange={setBillingPeriod} 
                      className="flex"
                    >
                      <div className={`px-4 py-2 rounded-full cursor-pointer ${billingPeriod === 'monthly' ? 'bg-white shadow-sm' : ''}`}>
                        <RadioGroupItem 
                          value="monthly" 
                          id="monthly" 
                          className="hidden"
                        />
                        <label htmlFor="monthly" className="cursor-pointer flex items-center">
                          Monthly
                        </label>
                      </div>
                      <div className={`px-4 py-2 rounded-full cursor-pointer flex items-center ${billingPeriod === 'yearly' ? 'bg-white shadow-sm' : ''}`}>
                        <RadioGroupItem 
                          value="yearly" 
                          id="yearly" 
                          className="hidden"
                        />
                        <label htmlFor="yearly" className="cursor-pointer flex items-center">
                          Yearly
                          <Badge className="ml-2 bg-love-500">Save 20%</Badge>
                        </label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <Card className="border-love-100 shadow-md hover:-translate-y-1 transition-all duration-300">
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-display font-bold mb-2">Free</h3>
                      <p className="text-3xl font-bold mb-4">$0<span className="text-lg font-normal text-gray-500">/month</span></p>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                          <Check size={16} className="text-green-500 mr-2" />
                          Basic profile creation
                        </li>
                        <li className="flex items-center">
                          <Check size={16} className="text-green-500 mr-2" />
                          Limited matches per day
                        </li>
                        <li className="flex items-center">
                          <Check size={16} className="text-green-500 mr-2" />
                          Text messaging
                        </li>
                        <li className="flex items-center text-gray-400">
                          <X size={16} className="text-gray-300 mr-2" />
                          See who likes you
                        </li>
                        <li className="flex items-center text-gray-400">
                          <X size={16} className="text-gray-300 mr-2" />
                          Video calls
                        </li>
                      </ul>
                      <Link to="/signup" className="block">
                        <Button variant="outline" className="w-full border-love-200">Sign Up Free</Button>
                      </Link>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-love-500 shadow-xl hover:-translate-y-2 transition-all duration-300 relative">
                    <Badge 
                      variant="success" 
                      className="absolute top-2 right-2 px-2 py-1 text-xs font-medium flex items-center gap-1"
                    >
                      <Star size={12} className="text-green-700" />
                      Most Popular
                    </Badge>
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-display font-bold mb-2">Premium</h3>
                      <p className="text-3xl font-bold mb-4">
                        ${billingPeriod === 'monthly' ? '9.99' : '7.99'}
                        <span className="text-lg font-normal text-gray-500">/month</span>
                      </p>
                      {billingPeriod === 'yearly' && (
                        <p className="text-sm text-love-600 mb-4">Billed annually (${(7.99 * 12).toFixed(2)})</p>
                      )}
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                          <Check size={16} className="text-green-500 mr-2" />
                          Unlimited matches
                        </li>
                        <li className="flex items-center">
                          <Check size={16} className="text-green-500 mr-2" />
                          Voice notes & Video calling
                        </li>
                        <li className="flex items-center">
                          <Check size={16} className="text-green-500 mr-2" />
                          Priority in search results
                        </li>
                        <li className="flex items-center">
                          <Check size={16} className="text-green-500 mr-2" />
                          See who liked you
                        </li>
                        <li className="flex items-center text-gray-400">
                          <X size={16} className="text-gray-300 mr-2" />
                          Profile boost weekly
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
                      <p className="text-3xl font-bold mb-4">
                        ${billingPeriod === 'monthly' ? '19.99' : '15.99'}
                        <span className="text-lg font-normal text-gray-500">/month</span>
                      </p>
                      {billingPeriod === 'yearly' && (
                        <p className="text-sm text-love-600 mb-4">Billed annually (${(15.99 * 12).toFixed(2)})</p>
                      )}
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                          <Check size={16} className="text-green-500 mr-2" />
                          All Premium features
                        </li>
                        <li className="flex items-center">
                          <Check size={16} className="text-green-500 mr-2" />
                          Profile boost once a week
                        </li>
                        <li className="flex items-center">
                          <Check size={16} className="text-green-500 mr-2" />
                          Unlimited gifts
                        </li>
                        <li className="flex items-center">
                          <Check size={16} className="text-green-500 mr-2" />
                          Exclusive VIP badge
                        </li>
                        <li className="flex items-center">
                          <Check size={16} className="text-green-500 mr-2" />
                          Priority support
                        </li>
                      </ul>
                      <Link to="/signup" className="block">
                        <Button variant="outline" className="w-full border-love-200 bg-gradient-to-r from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 text-love-700">Go VIP</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Feature Comparison Table */}
                <div className="mt-16 bg-white rounded-xl shadow-sm border border-love-100 overflow-hidden">
                  <div className="px-6 py-4 bg-love-50">
                    <h3 className="text-xl font-semibold">Feature Comparison</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-full">
                      <thead>
                        <tr className="border-b border-love-100">
                          <th className="text-left p-4">Feature</th>
                          <th className="p-4 text-center">Free</th>
                          <th className="p-4 text-center bg-love-50">Premium</th>
                          <th className="p-4 text-center">VIP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonFeatures.map((feature, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="p-4 font-medium">{feature.name}</td>
                            <td className="p-4 text-center">
                              {typeof feature.free === 'boolean' ? 
                                (feature.free ? <Check size={18} className="mx-auto text-green-500" /> : 
                                <X size={18} className="mx-auto text-gray-300" />) : 
                                feature.free}
                            </td>
                            <td className="p-4 text-center bg-love-50/50">
                              {typeof feature.premium === 'boolean' ? 
                                (feature.premium ? <Check size={18} className="mx-auto text-green-500" /> : 
                                <X size={18} className="mx-auto text-gray-300" />) : 
                                feature.premium}
                            </td>
                            <td className="p-4 text-center">
                              {typeof feature.vip === 'boolean' ? 
                                (feature.vip ? <Check size={18} className="mx-auto text-green-500" /> : 
                                <X size={18} className="mx-auto text-gray-300" />) : 
                                feature.vip}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
            
            {/* FAQ Section */}
            <section className="py-16 px-4 bg-gray-50">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-xl text-gray-600">
                    Find answers to common questions about LoveQuest
                  </p>
                </div>
                
                <Accordion type="single" collapsible className="bg-white rounded-xl shadow-sm border border-love-100 overflow-hidden">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className={index > 0 ? 'border-t border-love-100' : ''}>
                      <AccordionTrigger className="px-6 py-4 hover:bg-love-50/50">
                        <span className="text-left font-medium">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 py-4 text-gray-700">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
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
