import { supabase } from '@/lib/supabase';

// Get Stripe key from environment variable
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Essential features for casual dating',
    price: 9.99,
    interval: 'month',
    features: [
      '10 likes per day',
      'Basic matching algorithm',
      'Message up to 10 matches',
      'View who liked you'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Enhanced features for serious daters',
    price: 19.99,
    interval: 'month',
    features: [
      'Unlimited likes',
      'Advanced AI matching',
      'Message unlimited matches',
      'See who liked you',
      '1 Boost per month',
      'Advanced filters'
    ]
  },
  {
    id: 'vip',
    name: 'VIP',
    description: 'Ultimate dating experience',
    price: 29.99,
    interval: 'month',
    features: [
      'All Premium features',
      'Priority in discovery',
      '5 Boosts per month',
      'International matching',
      'Read receipts',
      'VIP support'
    ]
  }
];

export interface BoostProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  boostAmount: number;
}

export const boostProducts: BoostProduct[] = [
  {
    id: 'boost-1',
    name: 'Single Boost',
    description: 'Get 1 profile boost',
    price: 3.99,
    boostAmount: 1
  },
  {
    id: 'boost-5',
    name: 'Boost Pack',
    description: 'Get 5 profile boosts',
    price: 14.99,
    boostAmount: 5
  },
  {
    id: 'boost-10',
    name: 'Super Boost Pack',
    description: 'Get 10 profile boosts',
    price: 24.99,
    boostAmount: 10
  }
];

const isStripeConfigured = !!stripePublishableKey && stripePublishableKey !== 'YOUR_STRIPE_PUBLISHABLE_KEY';

// Type definition for window.Stripe
interface Window {
  Stripe?: (key: string) => any;
}

export const paymentService = {
  /**
   * Check if Stripe is properly configured
   */
  isConfigured: () => isStripeConfigured,
  
  /**
   * Initialize Stripe with your publishable key
   */
  initializeStripe: async () => {
    if (!isStripeConfigured) {
      console.warn('Stripe is not configured. Please set VITE_STRIPE_PUBLISHABLE_KEY in your environment.');
      return null;
    }
    
    try {
      // Fix: Add proper type checking for window.Stripe
      if (!(window as any).Stripe) {
        // Load Stripe.js dynamically if not already available
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.async = true;
        document.body.appendChild(script);
        
        return new Promise((resolve) => {
          script.onload = () => {
            // Use type assertion to access Stripe
            const stripe = (window as any).Stripe(stripePublishableKey);
            resolve(stripe);
          };
        });
      } else {
        // Use type assertion to access Stripe
        return (window as any).Stripe(stripePublishableKey);
      }
    } catch (error) {
      console.error('Error initializing Stripe:', error);
      return null;
    }
  },

  
  /**
   * Create a checkout session for subscription
   */
  createCheckoutSession: async (planId: string, userId: string): Promise<string | null> => {
    if (!isStripeConfigured) {
      console.warn('Stripe is not configured. Using mock implementation.');
      // Return a mock checkout URL for development
      return `https://checkout.stripe.com/mock-checkout/${planId}/${userId}`;
    }
    
    try {
      // In a real implementation, this would call a serverless function or API endpoint
      // that creates a Stripe checkout session server-side
      
      // For now, we'll simulate this with a direct call to Supabase edge functions
      // (When you have a real Supabase setup with edge functions)
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { planId, userId }
      });
      
      if (error) throw error;
      return data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return null;
    }
  },

  /**
   * Process a subscription payment
   */
  processSubscription: async (planId: string, paymentMethodId: string, userId: string): Promise<boolean> => {
    if (!isStripeConfigured) {
      console.warn('Stripe is not configured. Using mock implementation.');
      // Simulate successful payment processing
      console.log(`Processing subscription for plan ${planId} with payment method ${paymentMethodId}`);
      return true;
    }
    
    try {
      // In a real implementation, this would call a serverless function or API endpoint
      // that processes the subscription server-side
      
      // For now, we'll simulate this with a direct call to Supabase edge functions
      const { data, error } = await supabase.functions.invoke('process-subscription', {
        body: { planId, paymentMethodId, userId }
      });
      
      if (error) throw error;
      return data.success;
    } catch (error) {
      console.error('Error processing subscription:', error);
      return false;
    }
  },
  
  /**
   * Get user's current subscription
   */
  getCurrentSubscription: async (userId: string) => {
    if (!userId) return null;
    
    try {
      // In production, you would query Supabase for the user's subscription
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting subscription:', error);
      return null;
    }
  },
  
  /**
   * Purchase boosts
   */
  purchaseBoosts: async (boostId: string, userId: string): Promise<boolean> => {
    if (!isStripeConfigured) {
      console.warn('Stripe is not configured. Using mock implementation.');
      // Simulate successful boost purchase
      console.log(`Processing boost purchase for ${boostId} by user ${userId}`);
      return true;
    }
    
    try {
      // In a real implementation, this would create a one-time checkout session
      const { data, error } = await supabase.functions.invoke('purchase-boost', {
        body: { boostId, userId }
      });
      
      if (error) throw error;
      return data.success;
    } catch (error) {
      console.error('Error purchasing boosts:', error);
      return false;
    }
  },
  
  /**
   * Get all available subscription plans
   */
  getSubscriptionPlans: () => {
    return subscriptionPlans;
  },
  
  /**
   * Get all available boost products
   */
  getBoostProducts: () => {
    return boostProducts;
  }
};
