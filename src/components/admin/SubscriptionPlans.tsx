
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Tag, Calendar, BarChart4, CheckCircle2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Define interfaces for our subscription plans and coupons
interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
  trial_days: number;
}

interface Coupon {
  id: string;
  code: string;
  discount_percent: number;
  valid_until: string;
  max_uses: number;
  times_used: number;
  is_active: boolean;
  plan_id?: string | null;
}

// Mock subscription plans data
const mockPlans: SubscriptionPlan[] = [
  {
    id: '1',
    name: 'Basic',
    description: 'Essential features for casual users',
    price_monthly: 9.99,
    price_yearly: 99.99,
    features: [
      'Up to 50 swipes per day',
      'Basic matching algorithm',
      'Message up to 10 matches',
      'View who liked you'
    ],
    is_popular: false,
    is_active: true,
    trial_days: 7
  },
  {
    id: '2',
    name: 'Premium',
    description: 'Enhanced features for serious daters',
    price_monthly: 19.99,
    price_yearly: 199.99,
    features: [
      'Unlimited swipes',
      'Advanced matching algorithm',
      'Unlimited messages',
      'See who liked you',
      'Priority in search results',
      'Read receipts'
    ],
    is_popular: true,
    is_active: true,
    trial_days: 14
  },
  {
    id: '3',
    name: 'VIP',
    description: 'Ultimate experience for finding love',
    price_monthly: 29.99,
    price_yearly: 299.99,
    features: [
      'All Premium features',
      'Profile boosting once a week',
      'See who viewed your profile',
      'VIP badge on profile',
      'Access to exclusive events',
      'Personal matchmaking assistance'
    ],
    is_popular: false,
    is_active: true,
    trial_days: 30
  }
];

// Mock coupons data
const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'WELCOME25',
    discount_percent: 25,
    valid_until: '2023-12-31',
    max_uses: 100,
    times_used: 57,
    is_active: true
  },
  {
    id: '2',
    code: 'SUMMER50',
    discount_percent: 50,
    valid_until: '2023-09-30',
    max_uses: 50,
    times_used: 23,
    is_active: true,
    plan_id: '2'
  },
  {
    id: '3',
    code: 'HOLIDAYS20',
    discount_percent: 20,
    valid_until: '2023-12-25',
    max_uses: 200,
    times_used: 0,
    is_active: false
  }
];

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [currentCoupon, setCurrentCoupon] = useState<Coupon | null>(null);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, we'd fetch from Supabase
        // const { data: plansData, error: plansError } = await supabase.from('subscription_plans').select('*');
        // if (plansError) throw plansError;
        
        // const { data: couponsData, error: couponsError } = await supabase.from('coupons').select('*');
        // if (couponsError) throw couponsError;
        
        // Using mock data for now
        setPlans(mockPlans);
        setCoupons(mockCoupons);
      } catch (error) {
        console.error('Error fetching subscription data:', error);
        toast('Error fetching data', {
          description: 'Could not load subscription plans. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSavePlan = async (plan: SubscriptionPlan) => {
    try {
      // In a real app, we'd save to Supabase
      // const { error } = await supabase
      //   .from('subscription_plans')
      //   .upsert(plan);
      // if (error) throw error;
      
      // For now, update the local state
      if (plan.id) {
        setPlans(prev => prev.map(p => p.id === plan.id ? plan : p));
      } else {
        const newPlan = { ...plan, id: Date.now().toString() };
        setPlans(prev => [...prev, newPlan]);
      }
      
      setIsPlanDialogOpen(false);
      toast('Plan Saved', {
        description: `Subscription plan "${plan.name}" has been saved successfully.`
      });
    } catch (error) {
      console.error('Error saving plan:', error);
      toast('Error Saving Plan', {
        description: 'There was an issue saving the subscription plan.'
      });
    }
  };

  const handleSaveCoupon = async (coupon: Coupon) => {
    try {
      // In a real app, we'd save to Supabase
      // const { error } = await supabase
      //   .from('coupons')
      //   .upsert(coupon);
      // if (error) throw error;
      
      // For now, update the local state
      if (coupon.id) {
        setCoupons(prev => prev.map(c => c.id === coupon.id ? coupon : c));
      } else {
        const newCoupon = { ...coupon, id: Date.now().toString() };
        setCoupons(prev => [...prev, newCoupon]);
      }
      
      setIsCouponDialogOpen(false);
      toast('Coupon Saved', {
        description: `Coupon code "${coupon.code}" has been saved successfully.`
      });
    } catch (error) {
      console.error('Error saving coupon:', error);
      toast('Error Saving Coupon', {
        description: 'There was an issue saving the coupon code.'
      });
    }
  };

  const handleDeletePlan = async (id: string) => {
    try {
      // In a real app, we'd delete from Supabase
      // const { error } = await supabase
      //   .from('subscription_plans')
      //   .delete()
      //   .eq('id', id);
      // if (error) throw error;
      
      // For now, update the local state
      setPlans(prev => prev.filter(plan => plan.id !== id));
      
      toast('Plan Deleted', {
        description: 'Subscription plan has been deleted successfully.'
      });
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast('Error Deleting Plan', {
        description: 'There was an issue deleting the subscription plan.'
      });
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    try {
      // In a real app, we'd delete from Supabase
      // const { error } = await supabase
      //   .from('coupons')
      //   .delete()
      //   .eq('id', id);
      // if (error) throw error;
      
      // For now, update the local state
      setCoupons(prev => prev.filter(coupon => coupon.id !== id));
      
      toast('Coupon Deleted', {
        description: 'Coupon code has been deleted successfully.'
      });
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast('Error Deleting Coupon', {
        description: 'There was an issue deleting the coupon code.'
      });
    }
  };

  const defaultPlan: SubscriptionPlan = {
    id: '',
    name: '',
    description: '',
    price_monthly: 0,
    price_yearly: 0,
    features: [''],
    is_popular: false,
    is_active: true,
    trial_days: 7
  };

  const defaultCoupon: Coupon = {
    id: '',
    code: '',
    discount_percent: 10,
    valid_until: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
    max_uses: 100,
    times_used: 0,
    is_active: true,
    plan_id: null
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Subscription Plans</CardTitle>
              <CardDescription>Manage your subscription tiers and pricing</CardDescription>
            </div>
            <Button 
              onClick={() => {
                setCurrentPlan(defaultPlan);
                setIsPlanDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : plans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <Card key={plan.id} className={plan.is_popular ? 'border-primary' : ''}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{plan.name}</CardTitle>
                        {plan.is_popular && (
                          <Badge className="mt-1">Most Popular</Badge>
                        )}
                        {!plan.is_active && (
                          <Badge variant="outline" className="mt-1 ml-2">Inactive</Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${plan.price_monthly}</div>
                        <div className="text-muted-foreground text-sm">per month</div>
                      </div>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      {plan.trial_days > 0 ? `${plan.trial_days}-day free trial` : 'No free trial'}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setCurrentPlan(plan);
                          setIsPlanDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8">
              <h3 className="text-lg font-medium">No plans found</h3>
              <p className="text-muted-foreground mt-1">Create your first subscription plan to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Promotional Coupons</CardTitle>
                <CardDescription>Create and manage discount coupons</CardDescription>
              </div>
              <Button 
                onClick={() => {
                  setCurrentCoupon(defaultCoupon);
                  setIsCouponDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Coupon
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : coupons.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Code</th>
                      <th className="text-left py-3 px-4 font-medium">Discount</th>
                      <th className="text-left py-3 px-4 font-medium">Valid Until</th>
                      <th className="text-left py-3 px-4 font-medium">Usage</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((coupon) => (
                      <tr key={coupon.id} className="border-b">
                        <td className="py-4 px-4 font-medium">{coupon.code}</td>
                        <td className="py-4 px-4">{coupon.discount_percent}% off</td>
                        <td className="py-4 px-4">{new Date(coupon.valid_until).toLocaleDateString()}</td>
                        <td className="py-4 px-4">
                          {coupon.times_used} / {coupon.max_uses}
                        </td>
                        <td className="py-4 px-4">
                          {coupon.is_active ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                              Inactive
                            </Badge>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setCurrentCoupon(coupon);
                                setIsCouponDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDeleteCoupon(coupon.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-8">
                <h3 className="text-lg font-medium">No coupons found</h3>
                <p className="text-muted-foreground mt-1">Create promotional coupons to attract new users</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog for editing plans */}
      <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {currentPlan?.id ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}
            </DialogTitle>
            <DialogDescription>
              Configure the details and pricing for this subscription plan.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            
            const updatedPlan: SubscriptionPlan = {
              ...currentPlan!,
              name: formData.get('name') as string,
              description: formData.get('description') as string,
              price_monthly: parseFloat(formData.get('price_monthly') as string),
              price_yearly: parseFloat(formData.get('price_yearly') as string),
              trial_days: parseInt(formData.get('trial_days') as string),
              is_popular: formData.get('is_popular') === 'on',
              is_active: formData.get('is_active') === 'on',
              features: (formData.get('features') as string).split('\n').filter(f => f.trim() !== '')
            };
            
            handleSavePlan(updatedPlan);
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={currentPlan?.name}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  defaultValue={currentPlan?.description}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price_monthly" className="text-right">
                  Monthly Price
                </Label>
                <div className="col-span-3 flex items-center">
                  <span className="mr-2">$</span>
                  <Input
                    id="price_monthly"
                    name="price_monthly"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={currentPlan?.price_monthly}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price_yearly" className="text-right">
                  Yearly Price
                </Label>
                <div className="col-span-3 flex items-center">
                  <span className="mr-2">$</span>
                  <Input
                    id="price_yearly"
                    name="price_yearly"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={currentPlan?.price_yearly}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trial_days" className="text-right">
                  Trial Days
                </Label>
                <Input
                  id="trial_days"
                  name="trial_days"
                  type="number"
                  min="0"
                  defaultValue={currentPlan?.trial_days}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="features" className="text-right">
                  Features
                </Label>
                <textarea
                  id="features"
                  name="features"
                  className="col-span-3 min-h-24 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="One feature per line"
                  defaultValue={currentPlan?.features.join('\n')}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right">Options</div>
                <div className="col-span-3 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="is_popular" 
                      name="is_popular" 
                      defaultChecked={currentPlan?.is_popular} 
                    />
                    <Label htmlFor="is_popular">Mark as most popular plan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="is_active" 
                      name="is_active" 
                      defaultChecked={currentPlan?.is_active} 
                    />
                    <Label htmlFor="is_active">Plan is active</Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsPlanDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog for editing coupons */}
      <Dialog open={isCouponDialogOpen} onOpenChange={setIsCouponDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {currentCoupon?.id ? 'Edit Coupon' : 'Create New Coupon'}
            </DialogTitle>
            <DialogDescription>
              Set up a promotional coupon code for your subscription plans.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            
            const updatedCoupon: Coupon = {
              ...currentCoupon!,
              code: formData.get('code') as string,
              discount_percent: parseInt(formData.get('discount_percent') as string),
              valid_until: formData.get('valid_until') as string,
              max_uses: parseInt(formData.get('max_uses') as string),
              is_active: formData.get('is_active') === 'on',
              plan_id: formData.get('plan_id') as string || null
            };
            
            handleSaveCoupon(updatedCoupon);
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  Coupon Code
                </Label>
                <Input
                  id="code"
                  name="code"
                  defaultValue={currentCoupon?.code}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discount_percent" className="text-right">
                  Discount %
                </Label>
                <div className="col-span-3 flex items-center">
                  <Input
                    id="discount_percent"
                    name="discount_percent"
                    type="number"
                    min="1"
                    max="100"
                    defaultValue={currentCoupon?.discount_percent}
                    required
                  />
                  <span className="ml-2">%</span>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="valid_until" className="text-right">
                  Valid Until
                </Label>
                <Input
                  id="valid_until"
                  name="valid_until"
                  type="date"
                  defaultValue={currentCoupon?.valid_until}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="max_uses" className="text-right">
                  Max Uses
                </Label>
                <Input
                  id="max_uses"
                  name="max_uses"
                  type="number"
                  min="1"
                  defaultValue={currentCoupon?.max_uses}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="plan_id" className="text-right">
                  Plan Specific
                </Label>
                <Select 
                  name="plan_id"
                  defaultValue={currentCoupon?.plan_id || ''}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Apply to any plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Apply to any plan</SelectItem>
                    {plans.map(plan => (
                      <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right">Status</div>
                <div className="col-span-3">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="is_active" 
                      name="is_active" 
                      defaultChecked={currentCoupon?.is_active} 
                    />
                    <Label htmlFor="is_active">Coupon is active</Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCouponDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Coupon</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPlans;
