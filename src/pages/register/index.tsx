
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { useAuth } from '@/hooks/useAuth';
import { CreditCard, Star, Award, Clock, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const subscriptionPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    duration: 'forever',
    features: [
      'Basic profile creation',
      'Limited to 5 matches per day',
      'Basic messaging (5 messages per day)',
      'View limited profiles'
    ],
    badge: 'Free',
    icon: <Clock className="h-5 w-5 text-blue-500" />
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    duration: 'monthly',
    features: [
      'Unlimited profile viewing',
      '10 matches per day',
      'Basic messaging features',
      'Profile boosts (1 per month)',
      '3-day free trial'
    ],
    badge: 'Popular',
    icon: <Star className="h-5 w-5 text-amber-500" />
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    duration: 'monthly',
    features: [
      'All Basic features',
      'Unlimited matches',
      'Advanced AI matching',
      'Read receipts',
      'Voice messages',
      'Video calls',
      'Profile boosts (5 per month)',
      '3-day free trial'
    ],
    badge: 'Best Value',
    icon: <Award className="h-5 w-5 text-purple-500" />
  }
];

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvc: ''
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentUser } = useUser();
  const { signUp } = useAuth();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (location.state) {
      const { name: stateName, email: stateEmail, password: statePassword } = location.state as any;
      if (stateName) setName(stateName);
      if (stateEmail) setEmail(stateEmail);
      if (statePassword) setPassword(statePassword);
    }
  }, [location.state]);
  
  const handleNextStep = () => {
    if (step === 1 && !selectedPlan) {
      toast.error("Please select a subscription plan");
      return;
    }
    
    if (step === 2 && selectedPlan !== 'free') {
      if (!paymentInfo.cardName || !paymentInfo.cardNumber || 
          !paymentInfo.expMonth || !paymentInfo.expYear || !paymentInfo.cvc) {
        toast.error("Please fill in all payment details");
        return;
      }
    }
    
    setStep(step + 1);
  };
  
  const handlePrevStep = () => {
    setStep(step - 1);
  };
  
  const handleChangePlan = (planId: string) => {
    setSelectedPlan(planId);
  };
  
  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo({ ...paymentInfo, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register form submitted with plan:', selectedPlan);
    
    if (!name || !email || !password) {
      toast.error("Please fill out all fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Attempting to sign up with plan:', selectedPlan);
      const result = await signUp(email, password, name, selectedPlan);
      console.log('Sign up result:', result);
      
      if (!result.success) {
        throw new Error(result.error || "Registration failed");
      }
      
      if (result.requiresEmailConfirmation) {
        toast.info("Please check your email to confirm your registration");
      } else {
        // If no email confirmation required, redirect to profile
        if (selectedPlan === 'free') {
          toast.success("Your free account has been created!");
        } else {
          toast.success(`Your ${selectedPlan} subscription has been activated with a 3-day free trial!`);
        }
        
        navigate('/profile');
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      if (error.message?.includes("User already registered")) {
        toast.error("This email is already registered. Please try logging in instead.");
      } else {
        toast.error(error.message || "An error occurred during registration");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderProgress = () => {
    const percent = (step / 3) * 100;
    return (
      <div className="w-full mb-6">
        <Progress value={percent} className="h-2" />
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>Step {step} of 3</span>
          <span>{Math.round(percent)}% Complete</span>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Select a Subscription Plan</h3>
            <div className="grid grid-cols-1 gap-4">
              {subscriptionPlans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all relative ${
                    selectedPlan === plan.id 
                      ? 'border-love-500 bg-love-50 shadow-md' 
                      : 'border-gray-200 hover:border-love-300'
                  }`}
                  onClick={() => handleChangePlan(plan.id)}
                >
                  {plan.badge && (
                    <div className="absolute -top-2 -right-2 bg-love-500 text-white text-xs px-2 py-1 rounded-full">
                      {plan.badge}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {plan.icon}
                      <h4 className="font-semibold">{plan.name}</h4>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">${plan.price}</div>
                      <div className="text-xs text-muted-foreground">{plan.duration}</div>
                    </div>
                  </div>
                  
                  <ul className="mt-4 space-y-2 text-sm">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {selectedPlan === plan.id && (
                    <div className="mt-4 pt-2 border-t border-love-100 flex justify-end">
                      <Check size={18} className="text-love-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
        return selectedPlan === 'free' ? (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Free Account Confirmation</h3>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
              <h4 className="font-semibold flex items-center gap-2 text-blue-700">
                <Clock className="h-5 w-5 text-blue-500" />
                Free Account
              </h4>
              <p className="text-sm text-blue-700 mt-2">
                You've selected our free account option. You'll have access to our basic features.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Payment Information</h3>
            <div className="bg-love-50 p-4 rounded-lg border border-love-100">
              <h4 className="font-medium flex items-center gap-2 mb-4">
                <CreditCard size={18} className="text-love-500" />
                Credit Card Details
              </h4>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input 
                    id="cardName" 
                    name="cardName" 
                    placeholder="John Smith" 
                    value={paymentInfo.cardName}
                    onChange={handlePaymentInfoChange}
                  />
                </div>
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input 
                    id="cardNumber" 
                    name="cardNumber" 
                    placeholder="4242 4242 4242 4242" 
                    value={paymentInfo.cardNumber}
                    onChange={handlePaymentInfoChange}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="expMonth">Expiry Month</Label>
                    <Input 
                      id="expMonth" 
                      name="expMonth" 
                      placeholder="MM" 
                      maxLength={2}
                      value={paymentInfo.expMonth}
                      onChange={handlePaymentInfoChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expYear">Expiry Year</Label>
                    <Input 
                      id="expYear" 
                      name="expYear" 
                      placeholder="YY" 
                      maxLength={2}
                      value={paymentInfo.expYear}
                      onChange={handlePaymentInfoChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input 
                      id="cvc" 
                      name="cvc" 
                      placeholder="123" 
                      maxLength={3}
                      value={paymentInfo.cvc}
                      onChange={handlePaymentInfoChange}
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Your payment is secure and encrypted. We never store your full card details.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium mb-2">Order Summary</h4>
              <div className="flex justify-between text-sm">
                <span>
                  {selectedPlan === 'premium' ? 'Premium Plan' : 'Basic Plan'}
                </span>
                <span className="font-semibold">
                  ${selectedPlan === 'premium' ? '19.99' : '9.99'}/month
                </span>
              </div>
              <div className="mt-4 pt-2 border-t border-gray-200 flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold">
                  ${selectedPlan === 'premium' ? '19.99' : '9.99'}/month
                </span>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Complete Registration</h3>
            
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-green-700 flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                {selectedPlan === 'free' ? 'Free Account Selected' : 'Subscription Selected'}
              </h4>
              <p className="text-sm text-green-700 mt-1">
                {selectedPlan === 'free' 
                  ? 'Your free account will be created after registration.' 
                  : `Your ${selectedPlan === 'premium' ? 'Premium' : 'Basic'} subscription will be activated after registration.`}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name" 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password" 
                  required
                  minLength={8}
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className={`w-full ${isMobile ? 'max-w-full' : 'max-w-lg'}`}>
        <CardHeader>
          <CardTitle className="text-2xl font-display">Create Account</CardTitle>
          <CardDescription>Complete your registration to start finding matches</CardDescription>
          {renderProgress()}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {renderStepContent()}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={handlePrevStep}
              className="flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              Back
            </Button>
          )}
          
          {step < 3 ? (
            <Button 
              type="button" 
              className={`${step === 1 && 'w-full'} ${step > 1 ? 'ml-auto' : ''}`}
              onClick={handleNextStep}
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              className="ml-auto"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Complete Registration"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
