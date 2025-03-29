
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Edit, Trash2, PlusCircle, DollarSign, Users, Activity } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  is_active: boolean;
  user_count: number;
  created_at: string;
  priority: number;
}

interface Coupon {
  id: string;
  code: string;
  discount_percent: number;
  valid_until: string;
  max_uses: number;
  times_used: number;
  is_active: boolean;
  subscription_plan_id: string | null;
}

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);
  const [deletingCouponId, setDeletingCouponId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("plans");
  const [subscriptionStats, setSubscriptionStats] = useState({
    totalRevenue: 0,
    activeSubscribers: 0,
    conversionRate: 0,
    averageSubscriptionLength: 0
  });

  useEffect(() => {
    fetchPlans();
    fetchCoupons();
    fetchSubscriptionStats();
  }, []);

  const fetchPlans = async () => {
    try {
      // Check if subscription_plans table exists
      const { error: tableCheckError } = await supabase
        .from('subscription_plans')
        .select('id')
        .limit(1);
      
      // If the table doesn't exist, create it and seed initial data
      if (tableCheckError) {
        await createSubscriptionTable();
      } else {
        // Fetch existing plans
        const { data, error } = await supabase
          .from('subscription_plans')
          .select('*')
          .order('priority', { ascending: true });
          
        if (error) throw error;
        setPlans(data || []);
      }
    } catch (error: any) {
      toast("Failed to load subscription plans", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const createSubscriptionTable = async () => {
    // In a real app, this would be handled by migrations
    // For this demo, we'll simulate it with some demo data
    const demoPlans = [
      {
        id: "plan_basic",
        name: "Basic",
        description: "Free tier with limited features",
        price_monthly: 0,
        price_yearly: 0,
        features: ["5 matches per day", "Basic messaging", "Limited profile visibility"],
        is_active: true,
        user_count: 1250,
        created_at: new Date().toISOString(),
        priority: 1
      },
      {
        id: "plan_premium",
        name: "Premium",
        description: "Enhanced features for serious daters",
        price_monthly: 9.99,
        price_yearly: 99.99,
        features: ["Unlimited matches", "Advanced messaging", "See who likes you", "Profile boost once monthly"],
        is_active: true,
        user_count: 785,
        created_at: new Date().toISOString(),
        priority: 2
      },
      {
        id: "plan_vip",
        name: "VIP",
        description: "Ultimate dating experience",
        price_monthly: 19.99,
        price_yearly: 199.99,
        features: ["All Premium features", "Weekly profile boost", "Priority support", "Exclusive events", "Advanced analytics"],
        is_active: true,
        user_count: 310,
        created_at: new Date().toISOString(),
        priority: 3
      }
    ];
    
    setPlans(demoPlans);
    toast("Demo subscription plans loaded", {
      description: "This is simulated data for demonstration purposes"
    });
  };

  const fetchCoupons = async () => {
    try {
      // Check if coupons table exists
      const { error: tableCheckError } = await supabase
        .from('coupons')
        .select('id')
        .limit(1);
      
      // If the table doesn't exist, create demo data
      if (tableCheckError) {
        await createCouponsTable();
      } else {
        // Fetch existing coupons
        const { data, error } = await supabase
          .from('coupons')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setCoupons(data || []);
      }
    } catch (error: any) {
      toast("Failed to load coupons", {
        description: error.message
      });
    }
  };

  const createCouponsTable = async () => {
    // For demo purposes only
    const demoCoupons = [
      {
        id: "coupon_welcome",
        code: "WELCOME25",
        discount_percent: 25,
        valid_until: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
        max_uses: 1000,
        times_used: 342,
        is_active: true,
        subscription_plan_id: null
      },
      {
        id: "coupon_summer",
        code: "SUMMER2025",
        discount_percent: 30,
        valid_until: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString(),
        max_uses: 500,
        times_used: 89,
        is_active: true,
        subscription_plan_id: "plan_premium"
      }
    ];
    
    setCoupons(demoCoupons);
    toast("Demo coupons loaded", {
      description: "This is simulated data for demonstration purposes"
    });
  };

  const fetchSubscriptionStats = async () => {
    // For demo purposes, let's populate with fake stats
    setSubscriptionStats({
      totalRevenue: 28650,
      activeSubscribers: 1095,
      conversionRate: 12.8,
      averageSubscriptionLength: 4.5
    });
  };

  const handleSavePlan = () => {
    if (!editingPlan) return;
    
    const updatedPlans = editingPlan.id 
      ? plans.map(plan => plan.id === editingPlan.id ? editingPlan : plan)
      : [...plans, { ...editingPlan, id: `plan_${Date.now()}`, created_at: new Date().toISOString() }];
    
    setPlans(updatedPlans);
    setIsPlanDialogOpen(false);
    setEditingPlan(null);
    
    toast(`Subscription plan ${editingPlan.id ? 'updated' : 'created'} successfully`);
  };

  const handleSaveCoupon = () => {
    if (!editingCoupon) return;
    
    const updatedCoupons = editingCoupon.id 
      ? coupons.map(coupon => coupon.id === editingCoupon.id ? editingCoupon : coupon)
      : [...coupons, { ...editingCoupon, id: `coupon_${Date.now()}` }];
    
    setCoupons(updatedCoupons);
    setIsCouponDialogOpen(false);
    setEditingCoupon(null);
    
    toast(`Coupon ${editingCoupon.id ? 'updated' : 'created'} successfully`);
  };

  const handleDeletePlan = () => {
    if (!deletingPlanId) return;
    
    setPlans(plans.filter(plan => plan.id !== deletingPlanId));
    setIsDeleteDialogOpen(false);
    setDeletingPlanId(null);
    
    toast("Subscription plan deleted successfully");
  };

  const handleDeleteCoupon = () => {
    if (!deletingCouponId) return;
    
    setCoupons(coupons.filter(coupon => coupon.id !== deletingCouponId));
    setIsDeleteDialogOpen(false);
    setDeletingCouponId(null);
    
    toast("Coupon deleted successfully");
  };

  const handlePlanFeatureChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!editingPlan) return;
    
    const features = e.target.value
      .split('\n')
      .map(feature => feature.trim())
      .filter(feature => feature.length > 0);
      
    setEditingPlan({ ...editingPlan, features });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full">
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="coupons">Coupon Codes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="plans" className="space-y-6 pt-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Subscribers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{subscriptionStats.activeSubscribers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 20) + 5}% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${subscriptionStats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 15) + 8}% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Conversion Rate
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{subscriptionStats.conversionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 5) + 1}% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Subscription Plans</CardTitle>
                <CardDescription>
                  Manage your subscription plans and pricing
                </CardDescription>
              </div>
              <Button onClick={() => {
                setEditingPlan({
                  id: '',
                  name: '',
                  description: '',
                  price_monthly: 0,
                  price_yearly: 0,
                  features: [],
                  is_active: true,
                  user_count: 0,
                  created_at: '',
                  priority: plans.length + 1
                });
                setIsPlanDialogOpen(true);
              }}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Plan
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center my-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Monthly Price</TableHead>
                      <TableHead>Yearly Price</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Users</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">
                          {plan.name}
                          <div className="text-xs text-muted-foreground mt-1">
                            {plan.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          ${plan.price_monthly.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          ${plan.price_yearly.toFixed(2)}
                          {plan.price_yearly > 0 && plan.price_monthly > 0 && (
                            <div className="text-xs text-green-600 mt-1">
                              Save ${(plan.price_monthly * 12 - plan.price_yearly).toFixed(2)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={plan.is_active ? "outline" : "secondary"}>
                            {plan.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {plan.user_count.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingPlan(plan);
                                setIsPlanDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setDeletingPlanId(plan.id);
                                setIsDeleteDialogOpen(true);
                              }}
                              disabled={plan.user_count > 0}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="coupons" className="space-y-6 pt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Coupon Codes</CardTitle>
                <CardDescription>
                  Manage promotional discounts and offers
                </CardDescription>
              </div>
              <Button onClick={() => {
                setEditingCoupon({
                  id: '',
                  code: '',
                  discount_percent: 10,
                  valid_until: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
                  max_uses: 100,
                  times_used: 0,
                  is_active: true,
                  subscription_plan_id: null
                });
                setIsCouponDialogOpen(true);
              }}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Coupon
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center my-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Valid Until</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coupons.map((coupon) => (
                      <TableRow key={coupon.id}>
                        <TableCell className="font-medium">
                          {coupon.code}
                          <div className="text-xs text-muted-foreground mt-1">
                            {coupon.subscription_plan_id ? `Limited to ${plans.find(p => p.id === coupon.subscription_plan_id)?.name || 'a specific'} plan` : 'Applicable to all plans'}
                          </div>
                        </TableCell>
                        <TableCell>
                          {coupon.discount_percent}% off
                        </TableCell>
                        <TableCell>
                          {new Date(coupon.valid_until).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {coupon.times_used} / {coupon.max_uses === 0 ? '∞' : coupon.max_uses}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={coupon.is_active ? "outline" : "secondary"}>
                            {coupon.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingCoupon(coupon);
                                setIsCouponDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setDeletingCouponId(coupon.id);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Analytics</CardTitle>
              <CardDescription>
                View detailed statistics about your subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Monthly Recurring Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      ${(subscriptionStats.totalRevenue / 12).toFixed(2)}
                    </div>
                    <div className="h-36 mt-4 bg-gray-100 flex items-center justify-center rounded">
                      <p className="text-muted-foreground">Monthly revenue chart would go here</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Subscription Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[180px] mt-4 bg-gray-100 flex items-center justify-center rounded">
                      <p className="text-muted-foreground">Subscription distribution chart would go here</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Key Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Average Revenue Per User:</dt>
                        <dd className="font-medium">${(subscriptionStats.totalRevenue / subscriptionStats.activeSubscribers).toFixed(2)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Churn Rate:</dt>
                        <dd className="font-medium">{(Math.random() * 5).toFixed(2)}%</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Avg. Subscription Length:</dt>
                        <dd className="font-medium">{subscriptionStats.averageSubscriptionLength} months</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Free-to-Paid Conversion:</dt>
                        <dd className="font-medium">{subscriptionStats.conversionRate}%</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Subscription Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[158px] mt-4 bg-gray-100 flex items-center justify-center rounded">
                      <p className="text-muted-foreground">Subscription growth chart would go here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Export Analytics Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Edit Plan Dialog */}
      <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingPlan?.id ? 'Edit' : 'Add'} Subscription Plan</DialogTitle>
            <DialogDescription>
              Configure the subscription details and features
            </DialogDescription>
          </DialogHeader>
          
          {editingPlan && (
            <div className="grid gap-4 py-4">
              <div className="grid items-center gap-4">
                <Label htmlFor="plan-name">Plan Name</Label>
                <Input
                  id="plan-name"
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})}
                />
              </div>
              
              <div className="grid items-center gap-4">
                <Label htmlFor="plan-description">Description</Label>
                <Input
                  id="plan-description"
                  value={editingPlan.description}
                  onChange={(e) => setEditingPlan({...editingPlan, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="plan-monthly-price">Monthly Price ($)</Label>
                  <Input
                    id="plan-monthly-price"
                    type="number"
                    step="0.01"
                    value={editingPlan.price_monthly}
                    onChange={(e) => setEditingPlan({...editingPlan, price_monthly: parseFloat(e.target.value)})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="plan-yearly-price">Yearly Price ($)</Label>
                  <Input
                    id="plan-yearly-price"
                    type="number"
                    step="0.01"
                    value={editingPlan.price_yearly}
                    onChange={(e) => setEditingPlan({...editingPlan, price_yearly: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="grid items-center gap-4">
                <Label htmlFor="plan-features">Features (one per line)</Label>
                <Textarea
                  id="plan-features"
                  rows={5}
                  value={editingPlan.features.join('\n')}
                  onChange={handlePlanFeatureChange}
                  placeholder="Add each feature on a new line"
                />
              </div>
              
              <div className="grid items-center gap-4">
                <Label htmlFor="plan-priority">Display Priority</Label>
                <Input
                  id="plan-priority"
                  type="number"
                  value={editingPlan.priority}
                  onChange={(e) => setEditingPlan({...editingPlan, priority: parseInt(e.target.value)})}
                />
                <p className="text-sm text-muted-foreground">
                  Lower numbers appear first
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="plan-active"
                  checked={editingPlan.is_active}
                  onCheckedChange={(checked) => setEditingPlan({...editingPlan, is_active: checked})}
                />
                <Label htmlFor="plan-active">Active</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPlanDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePlan}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Coupon Dialog */}
      <Dialog open={isCouponDialogOpen} onOpenChange={setIsCouponDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingCoupon?.id ? 'Edit' : 'Add'} Coupon</DialogTitle>
            <DialogDescription>
              Configure the coupon code and discount
            </DialogDescription>
          </DialogHeader>
          
          {editingCoupon && (
            <div className="grid gap-4 py-4">
              <div className="grid items-center gap-4">
                <Label htmlFor="coupon-code">Coupon Code</Label>
                <Input
                  id="coupon-code"
                  value={editingCoupon.code}
                  onChange={(e) => setEditingCoupon({...editingCoupon, code: e.target.value.toUpperCase()})}
                />
              </div>
              
              <div className="grid items-center gap-4">
                <Label htmlFor="coupon-discount">Discount (%)</Label>
                <Input
                  id="coupon-discount"
                  type="number"
                  min="1"
                  max="100"
                  value={editingCoupon.discount_percent}
                  onChange={(e) => setEditingCoupon({
                    ...editingCoupon, 
                    discount_percent: Math.min(100, Math.max(1, parseInt(e.target.value)))
                  })}
                />
              </div>
              
              <div className="grid items-center gap-4">
                <Label htmlFor="coupon-valid-until">Valid Until</Label>
                <Input
                  id="coupon-valid-until"
                  type="date"
                  value={new Date(editingCoupon.valid_until).toISOString().substring(0, 10)}
                  onChange={(e) => setEditingCoupon({
                    ...editingCoupon, 
                    valid_until: new Date(e.target.value).toISOString()
                  })}
                />
              </div>
              
              <div className="grid items-center gap-4">
                <Label htmlFor="coupon-max-uses">Maximum Uses (0 for unlimited)</Label>
                <Input
                  id="coupon-max-uses"
                  type="number"
                  min="0"
                  value={editingCoupon.max_uses}
                  onChange={(e) => setEditingCoupon({
                    ...editingCoupon, 
                    max_uses: parseInt(e.target.value)
                  })}
                />
              </div>
              
              <div className="grid items-center gap-4">
                <Label htmlFor="coupon-plan">Limit to Plan (optional)</Label>
                <select
                  id="coupon-plan"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={editingCoupon.subscription_plan_id || ''}
                  onChange={(e) => setEditingCoupon({
                    ...editingCoupon, 
                    subscription_plan_id: e.target.value || null
                  })}
                >
                  <option value="">All Plans</option>
                  {plans.map(plan => (
                    <option key={plan.id} value={plan.id}>{plan.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="coupon-active"
                  checked={editingCoupon.is_active}
                  onCheckedChange={(checked) => setEditingCoupon({...editingCoupon, is_active: checked})}
                />
                <Label htmlFor="coupon-active">Active</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCouponDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCoupon}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {deletingPlanId ? 'subscription plan' : 'coupon'}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDeleteDialogOpen(false);
              setDeletingPlanId(null);
              setDeletingCouponId(null);
            }}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={deletingPlanId ? handleDeletePlan : handleDeleteCoupon}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPlans;
