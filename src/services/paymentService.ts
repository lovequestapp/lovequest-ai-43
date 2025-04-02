
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank';
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  brand?: string;
  isDefault: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'basic' | 'premium' | 'vip' | 'trial';
  startDate: Date;
  endDate: Date | null;
  isActive: boolean;
  autoRenew: boolean;
  price: number;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  type: 'subscription' | 'gift' | 'withdrawal' | 'refund';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  timestamp: Date;
  description: string;
  paymentMethod?: string;
}

// Function to get subscription tiers
export const getSubscriptionTiers = () => {
  return [
    {
      id: 'basic',
      name: 'Basic',
      price: 0,
      features: [
        'Limited matches per day',
        'Basic profile visibility',
        'Standard support'
      ],
      isPopular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 9.99,
      features: [
        'Unlimited matches',
        'See who liked you',
        'Priority profile visibility',
        'Premium support',
        '5 Boosts per month'
      ],
      isPopular: true
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 19.99,
      features: [
        'All Premium features',
        'VIP profile badge',
        'Read receipts',
        'Unlimited Boosts',
        'Concierge service',
        'Access to exclusive events'
      ],
      isPopular: false
    }
  ];
};

// Function to get user's current subscription
export const getUserSubscription = async (userId: string): Promise<Subscription | null> => {
  try {
    // For now, we'll get the premium_status from the profiles table
    // since we don't have a separate subscriptions table yet
    const { data, error } = await supabase
      .from('profiles')
      .select('premium_status, trial_end_date')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
    
    if (!data) {
      return null;
    }

    const now = new Date();
    const trialEndDate = data.trial_end_date ? new Date(data.trial_end_date) : null;
    const isActive = trialEndDate ? now < trialEndDate : true;
    
    // Create a subscription object based on the premium_status
    const subscription: Subscription = {
      id: `sub-${userId}`, // Fake ID
      userId,
      plan: data.premium_status as 'basic' | 'premium' | 'vip' | 'trial',
      startDate: new Date(new Date().setDate(new Date().getDate() - 30)), // Fake start date (30 days ago)
      endDate: trialEndDate,
      isActive,
      autoRenew: data.premium_status !== 'basic' && data.premium_status !== 'trial',
      price: data.premium_status === 'premium' ? 9.99 : data.premium_status === 'vip' ? 19.99 : 0
    };
    
    return subscription;
  } catch (error) {
    console.error('Error in getUserSubscription:', error);
    return null;
  }
};

// Function to toggle auto-renew status
export const toggleAutoRenew = async (userId: string): Promise<boolean> => {
  try {
    const subscription = await getUserSubscription(userId);
    
    if (!subscription) {
      toast.error('No active subscription found');
      return false;
    }
    
    // In a real app, this would update the subscription in the database
    // For now, we'll just show a toast message
    const newStatus = !subscription.autoRenew;
    
    toast.success(`Auto-renew has been ${newStatus ? 'enabled' : 'disabled'}`);
    return true;
  } catch (error) {
    console.error('Error toggling auto-renew:', error);
    toast.error('Failed to update auto-renew settings');
    return false;
  }
};

// Function to cancel subscription
export const cancelSubscription = async (userId: string): Promise<boolean> => {
  try {
    const subscription = await getUserSubscription(userId);
    
    if (!subscription) {
      toast.error('No active subscription found');
      return false;
    }
    
    // In a real app, this would update the subscription in the database
    // For now, we'll update the premium_status to 'basic'
    const { error } = await supabase
      .from('profiles')
      .update({ premium_status: 'basic' })
      .eq('id', userId);
      
    if (error) {
      throw error;
    }
    
    toast.success('Your subscription has been canceled');
    return true;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    toast.error('Failed to cancel subscription');
    return false;
  }
};

// Function to upgrade subscription
export const upgradeSubscription = async (userId: string, newPlan: 'premium' | 'vip'): Promise<boolean> => {
  try {
    // In a real app, this would update the subscription in the database
    // after processing payment
    const { error } = await supabase
      .from('profiles')
      .update({ 
        premium_status: newPlan,
        trial_end_date: null // Remove trial end date if upgrading
      })
      .eq('id', userId);
      
    if (error) {
      throw error;
    }
    
    toast.success(`Your subscription has been upgraded to ${newPlan}`);
    return true;
  } catch (error) {
    console.error('Error upgrading subscription:', error);
    toast.error('Failed to upgrade subscription');
    return false;
  }
};

// Function to get payment history
export const getPaymentHistory = async (userId: string): Promise<Transaction[]> => {
  try {
    // Since we don't have a real subscriptions or transactions table yet, 
    // we'll return mock data
    const mockTransactions: Transaction[] = [
      {
        id: `txn-${Date.now()}-1`,
        userId,
        amount: 9.99,
        currency: 'USD',
        type: 'subscription',
        status: 'completed',
        timestamp: new Date(new Date().setDate(new Date().getDate() - 30)),
        description: 'Premium Subscription - Monthly'
      },
      {
        id: `txn-${Date.now()}-2`,
        userId,
        amount: 4.99,
        currency: 'USD',
        type: 'gift',
        status: 'completed',
        timestamp: new Date(new Date().setDate(new Date().getDate() - 15)),
        description: 'Gift Pack Purchase - 5 Roses'
      }
    ];
    
    return mockTransactions;
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return [];
  }
};

// Function to add payment method
export const addPaymentMethod = async (userId: string, paymentMethod: Omit<PaymentMethod, 'id' | 'isDefault'>): Promise<boolean> => {
  try {
    // In a real app, this would add the payment method to the database
    // For now, we'll just show a toast message
    toast.success('Payment method added successfully');
    return true;
  } catch (error) {
    console.error('Error adding payment method:', error);
    toast.error('Failed to add payment method');
    return false;
  }
};

// Function to get current billing information
export const getBillingInfo = async (userId: string): Promise<any> => {
  try {
    // Mock billing info
    return {
      name: 'John Doe',
      email: 'john.doe@example.com',
      address: {
        line1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        postalCode: '12345',
        country: 'US'
      },
      paymentMethods: [
        {
          id: 'pm-1',
          type: 'card',
          last4: '4242',
          expiryMonth: 12,
          expiryYear: 2024,
          brand: 'Visa',
          isDefault: true
        }
      ]
    };
  } catch (error) {
    console.error('Error fetching billing info:', error);
    return null;
  }
};
