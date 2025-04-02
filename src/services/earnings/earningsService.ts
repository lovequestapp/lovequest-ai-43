
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

/**
 * Calculates total earnings from gifts and other sources
 */
export const calculateTotalEarnings = async (userId: string): Promise<number> => {
  try {
    // Fetch the user's profile to get their received gifts
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('received_gifts')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching profile for earnings calculation:', error);
      return 0;
    }
    
    if (!profile || !profile.received_gifts) {
      return 0;
    }
    
    // Calculate earnings from gifts
    // In a real app, you would have a more complex calculation based on gift values
    const giftValues = {
      rose: 0.50,
      heart: 2.00,
      teddy: 5.00
    };
    
    const receivedGifts = profile.received_gifts;
    let totalEarnings = 0;
    
    // Calculate earnings from each gift type
    Object.entries(receivedGifts).forEach(([giftType, count]) => {
      if (giftType in giftValues && typeof count === 'number') {
        totalEarnings += (giftValues[giftType as keyof typeof giftValues] * count);
      }
    });
    
    return totalEarnings;
  } catch (error: any) {
    console.error('Error calculating earnings:', error.message);
    return 0;
  }
};

/**
 * Gets a breakdown of earnings by source
 */
export const getEarningsBreakdown = async (userId: string): Promise<{
  gifts: { [key: string]: { count: number; value: number } };
  total: number;
}> => {
  try {
    // Fetch the user's profile to get their received gifts
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('received_gifts')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching profile for earnings breakdown:', error);
      return { gifts: {}, total: 0 };
    }
    
    if (!profile || !profile.received_gifts) {
      return { gifts: {}, total: 0 };
    }
    
    // Gift values
    const giftValues = {
      rose: 0.50,
      heart: 2.00,
      teddy: 5.00
    };
    
    const receivedGifts = profile.received_gifts;
    let totalEarnings = 0;
    const gifts: { [key: string]: { count: number; value: number } } = {};
    
    // Calculate earnings from each gift type
    Object.entries(receivedGifts).forEach(([giftType, count]) => {
      if (giftType in giftValues && typeof count === 'number') {
        const value = giftValues[giftType as keyof typeof giftValues] * count;
        gifts[giftType] = { count, value };
        totalEarnings += value;
      }
    });
    
    return {
      gifts,
      total: totalEarnings
    };
  } catch (error: any) {
    console.error('Error calculating earnings breakdown:', error.message);
    return { gifts: {}, total: 0 };
  }
};

/**
 * Converts gift earnings to a withdrawable balance
 */
export const convertGiftsToBalance = async (userId: string): Promise<boolean> => {
  try {
    // In a real app, this would update the user's balance in the database
    // For this example, we'll just calculate the earnings and show a success message
    
    const earnings = await calculateTotalEarnings(userId);
    
    if (earnings <= 0) {
      toast.error("No earnings available to convert");
      return false;
    }
    
    // Here you would update the user's balance in your database
    // For now, just show a success message
    toast.success(`${earnings.toFixed(2)} added to your balance`);
    return true;
  } catch (error: any) {
    console.error('Error converting gifts to balance:', error.message);
    toast.error("Failed to convert gifts to balance");
    return false;
  }
};
