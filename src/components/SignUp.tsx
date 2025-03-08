
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from '@/context/UserContext';
import { useToast } from "@/hooks/use-toast";
import PersonalityTraitSelector from '@/components/PersonalityTraitSelector';
import AIProfileGenerator from '@/components/AIProfileGenerator';
import { Check, CreditCard, Star, Award, UserPlus, Key, Mail } from 'lucide-react';

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
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  
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
    gender: 'female',
    interestedIn: ['male'],
    favoriteMusic: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      gender: e.target.value as 'male' | 'female' | 'non-binary',
    });
  };

  const handleInterestedInChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setFormData({
      ...formData,
      interestedIn: selected as ('male' | 'female' | 'non-binary')[],
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
      personalityTraits: selectedTraits,
      favoriteMusic: formData.favoriteMusic,
      gender: formData.gender as 'male' | 'female' | 'non-binary',
      interestedIn: formData.interestedIn,
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

  const handleSelectTrait = (trait: string) => {
    if (selectedTraits.includes(trait)) {
      setSelectedTraits(selectedTraits.filter(t => t !== trait));
    } else {
      if (selectedTraits.length < 5) {
        setSelectedTraits([...selectedTraits, trait]);
      }
    }
  };

  const handleProfileImageGenerated = (imageUrl: string) => {
    setFormData({
      ...formData,
      photos: [imageUrl],
    });
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
          {step === 3 && "Add your profile photo"}
          {step === 4 && "Choose your membership plan"}
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
                  className="flex items-center gap-2"
                  icon={<UserPlus className="h-4 w-4 text-muted-foreground" />}
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
                <Label htmlFor="favoriteMusic">Favorite Song or Artist</Label>
                <Input
                  id="favoriteMusic"
                  name="favoriteMusic"
                  value={formData.favoriteMusic}
                  onChange={handleChange}
                  placeholder="E.g., The Beatles - Hey Jude"
                />
              </div>

              <div className="grid gap-2">
                <Label>Personality Traits</Label>
                <PersonalityTraitSelector 
                  selectedTraits={selectedTraits}
                  onSelectTrait={handleSelectTrait}
                />
                {selectedTraits.length >= 5 && (
                  <p className="text-xs text-love-600 mt-1">Maximum 5 traits selected</p>
                )}
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

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="gender">I am</Label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleGenderChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="non-binary">Non-binary</option>
                  </select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="interestedIn">Interested in</Label>
                  <select
                    id="interestedIn"
                    name="interestedIn"
                    multiple
                    value={formData.interestedIn}
                    onChange={handleInterestedInChange}
                    className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="non-binary">Non-binary</option>
                  </select>
                  <p className="text-xs text-muted-foreground">Hold Ctrl/Cmd to select multiple</p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-6 bg-gray-100 flex items-center justify-center">
                  {formData.photos[0] === '/placeholder.svg' ? (
                    <UserPlus className="h-12 w-12 text-gray-400" />
                  ) : (
                    <img 
                      src={formData.photos[0]} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                
                <AIProfileGenerator 
                  onImageGenerated={handleProfileImageGenerated}
                  gender={formData.gender as 'male' | 'female' | 'non-binary'}
                />

                <p className="text-sm text-muted-foreground mt-4 text-center max-w-md">
                  Our AI will generate a professional profile image for you. 
                  Click the button above to create your profile picture.
                </p>
              </div>
            </div>
          )}
          
          {step === 4 && (
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
                          <span className="text-love-500 mr-2"><Check size={16} /></span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {plan.id === 'premium' && (
                      <div className="mt-4 pt-2 border-t border-love-100">
                        <p className="text-sm flex items-center text-love-700">
                          <Star size={14} className="inline mr-1 text-amber-500" />
                          Most Popular Choice
                        </p>
                      </div>
                    )}

                    {plan.id === 'vip' && (
                      <div className="mt-4 pt-2 border-t border-love-100">
                        <p className="text-sm flex items-center text-love-700">
                          <Award size={14} className="inline mr-1 text-purple-500" />
                          Best Value
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {selectedPlan !== 'free' && (
                <div className="bg-love-50 p-4 rounded-lg border border-love-100 mt-6">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <CreditCard size={18} className="text-love-500" />
                    Payment Information
                  </h4>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input id="cardName" placeholder="John Smith" />
                      </div>
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="4242 4242 4242 4242" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="expMonth">Expiry Month</Label>
                        <Input id="expMonth" placeholder="MM" />
                      </div>
                      <div>
                        <Label htmlFor="expYear">Expiry Year</Label>
                        <Input id="expYear" placeholder="YY" />
                      </div>
                      <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Your payment is secure and encrypted. We never store your full card details.
                  </p>
                </div>
              )}
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
            
            {step < 4 ? (
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
