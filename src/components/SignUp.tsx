
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from '@/context/UserContext';
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Basic profile creation',
      'Limited matches per day',
      'Text messaging',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    features: [
      'Unlimited matches',
      'Voice notes',
      'Video calling',
      'Priority in search results',
      'See who liked you',
    ],
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 19.99,
    features: [
      'All Premium features',
      'Profile boost once a week',
      'Unlimited gifts',
      'Exclusive VIP badge',
      'VIP customer support',
    ],
  },
];

const SignUp = () => {
  const { setCurrentUser } = useUser();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    location: '',
    bio: '',
    interests: '',
    photos: ['/placeholder.svg'],
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }
    
    if (parseInt(formData.age) < 18) {
      toast({
        title: "Age Restriction",
        description: "You must be 18 or older to use this service",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would send the data to a backend service
    // For now, we'll just create a user in our local state
    const newUser = {
      id: `user-${Date.now()}`,
      name: formData.name,
      age: parseInt(formData.age),
      bio: formData.bio,
      location: formData.location,
      interests: formData.interests.split(',').map(i => i.trim()),
      photos: formData.photos,
      giftInventory: { 'rose': 3, 'heart': 1, 'teddy': 2 },
      popularityPoints: 0,
      premiumLikes: 0,
      profileBoost: { active: false },
      receivedGifts: { rose: 0, heart: 0, teddy: 0 },
      balance: {
        amount: 0,
        currency: 'USD',
        withdrawalHistory: []
      },
      // Add plan info
      plan: selectedPlan,
    };
    
    setCurrentUser(newUser as any);
    
    toast({
      title: "Account created!",
      description: `Welcome to our dating app, ${formData.name}!`,
    });
    
    // In a real app, this would navigate to the dashboard
    window.location.href = '/discover';
  };
  
  const nextStep = () => {
    if (step === 1) {
      // Validate fields for step 1
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "Please make sure your passwords match",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (step === 2) {
      // Validate fields for step 2
      if (!formData.age || !formData.location || !formData.bio || !formData.interests) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
      
      if (parseInt(formData.age) < 18) {
        toast({
          title: "Age Restriction",
          description: "You must be 18 or older to use this service",
          variant: "destructive",
        });
        return;
      }
    }
    
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-display text-center">
          {step === 1 && "Create your account"}
          {step === 2 && "Tell us about yourself"}
          {step === 3 && "Choose your membership plan"}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  min="18"
                  max="120"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Your age"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="bio">About Me</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="interests">Interests (comma separated)</Label>
                <Input
                  id="interests"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  placeholder="Travel, Music, Cooking, etc."
                  required
                />
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <div 
                    key={plan.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPlan === plan.id 
                        ? 'border-love-500 bg-love-50' 
                        : 'border-gray-200 hover:border-love-300'
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <div className="font-display font-semibold text-xl">{plan.name}</div>
                    <div className="text-2xl font-bold mb-4">
                      ${plan.price}
                      <span className="text-sm font-normal text-gray-500">/month</span>
                    </div>
                    
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-love-500 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={prevStep}
              >
                Back
              </Button>
            )}
            
            {step < 3 ? (
              <Button 
                type="button" 
                className="ml-auto"
                onClick={nextStep}
              >
                Next
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="ml-auto"
                disabled={!selectedPlan}
              >
                Complete Registration
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignUp;
