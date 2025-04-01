import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Crown, BadgeCheck, Lock, CheckCircle2 } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';

interface MonetizationProps {
  userData?: any;
}

const Monetization: React.FC<MonetizationProps> = ({ userData }) => {
  const { currentUser } = useUser();
  const user = userData || currentUser;

  const getCurrentPlan = () => {
    return user?.premiumStatus || 'basic';
  };

  const handleSubscribe = (plan: string) => {
    toast.success(`Redirecting to ${plan} subscription payment...`);
    // In a real app, redirect to payment page or process
  };

  const handleManageSubscription = () => {
    toast.success('Redirecting to subscription management...');
    // In a real app, redirect to subscription management page
  };

  const plans = [
    {
      name: 'Basic',
      price: '$0',
      description: 'Free forever',
      features: [
        '10 swipes per day',
        '1 match per day',
        'Basic compatibility matching',
      ],
      icon: Zap,
    },
    {
      name: 'Premium',
      price: '$9.99',
      description: 'Most popular',
      features: [
        'Unlimited swipes',
        'See who likes you',
        'Advanced compatibility matching',
        'No ads',
        'Advanced filters',
      ],
      icon: Sparkles,
    },
    {
      name: 'VIP',
      price: '$19.99',
      description: 'For serious daters',
      features: [
        'All Premium features',
        'Priority in discovery',
        'Exclusive VIP badge',
        'Free boosts monthly',
        'Concierge dating service',
      ],
      icon: Crown,
    },
  ];
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2">Upgrade Your LoveQuest Experience</h3>
        <p className="text-muted-foreground">Choose the plan that fits your dating journey</p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-3">
        {/* Basic Plan */}
        <Card className={`border-gray-200 ${getCurrentPlan() === 'basic' ? 'ring-2 ring-love-200' : ''}`}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Basic</CardTitle>
                <CardDescription>Free forever</CardDescription>
              </div>
              <Zap size={24} className="text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-3xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <CheckCircle2 size={16} className="mr-2 text-green-500" />
                <span>10 swipes per day</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 size={16} className="mr-2 text-green-500" />
                <span>1 match per day</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 size={16} className="mr-2 text-green-500" />
                <span>Basic compatibility matching</span>
              </li>
              <li className="flex items-center opacity-50">
                <Lock size={16} className="mr-2" />
                <span>No ads</span>
              </li>
              <li className="flex items-center opacity-50">
                <Lock size={16} className="mr-2" />
                <span>Advanced filters</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {getCurrentPlan() === 'basic' ? (
              <Button className="w-full" variant="outline" disabled>
                Current Plan
              </Button>
            ) : (
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleSubscribe('basic')}
              >
                Downgrade
              </Button>
            )}
          </CardFooter>
        </Card>
        
        {/* Premium Plan */}
        <Card className={`border-gray-200 ${getCurrentPlan() === 'premium' ? 'ring-2 ring-love-500' : ''}`}>
          <CardHeader className="bg-gradient-to-r from-love-50 to-purple-50 rounded-t-lg">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Premium</CardTitle>
                <CardDescription>Most popular</CardDescription>
              </div>
              <Sparkles size={24} className="text-love-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-3xl font-bold">$9.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <CheckCircle2 size={16} className="mr-2 text-green-500" />
                <span>Unlimited swipes</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 size={16} className="mr-2 text-green-500" />
                <span>See who likes you</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 size={16} className="mr-2 text-green-500" />
                <span>Advanced compatibility matching</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 size={16} className="mr-2 text-green-500" />
                <span>No ads</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 size={16} className="mr-2 text-green-500" />
                <span>Advanced filters</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {getCurrentPlan() === 'premium' ? (
              <Button 
                className="w-full"
                variant="outline"
                onClick={handleManageSubscription}
              >
                Manage Subscription
              </Button>
            ) : (
              <Button 
                className="w-full bg-love-500 hover:bg-love-600" 
                onClick={() => handleSubscribe('premium')}
              >
                Upgrade to Premium
              </Button>
            )}
          </CardFooter>
        </Card>
        
        {/* VIP Plan */}
        <Card className={`border-gray-200 ${getCurrentPlan() === 'vip' ? 'ring-2 ring-amber-300' : ''}`}>
          <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-t-lg">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">VIP</CardTitle>
                <CardDescription>For serious daters</CardDescription>
              </div>
              <Crown size={24} className="text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-3xl font-bold">$19.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <CheckCircle2 size={16} className="mr-2 text-green-500" />
                <span>All Premium features</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 size={16} className="mr-2 text-green-500" />
                <span>Priority in discovery</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 size={16} className="mr-2 text-green-500" />
                <span>Exclusive VIP badge</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 size={16} className="mr-2 text-green-500" />
                <span>Free boosts monthly</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 size={16} className="mr-2 text-green-500" />
                <span>Concierge dating service</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {getCurrentPlan() === 'vip' ? (
              <Button 
                className="w-full"
                variant="outline"
                onClick={handleManageSubscription}
              >
                Manage Subscription
              </Button>
            ) : (
              <Button 
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:opacity-90 text-white" 
                onClick={() => handleSubscribe('vip')}
              >
                Upgrade to VIP
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>All plans automatically renew until canceled. Cancel anytime.</p>
      </div>
    </div>
  );
};

export default Monetization;
