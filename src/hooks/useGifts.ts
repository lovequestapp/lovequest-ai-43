
import { useState, useCallback, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type GiftType = 'rose' | 'heart' | 'teddy';

interface GiftInventoryItem {
  count: number;
  value: number;
}

interface GiftInventory {
  rose: GiftInventoryItem | number;
  heart: GiftInventoryItem | number;
  teddy: GiftInventoryItem | number;
}

/**
 * A custom hook for gift functionality
 */
export const useGifts = () => {
  const { currentUser } = useUser();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [giftError, setGiftError] = useState<string | null>(null);
  const [inventory, setInventory] = useState<GiftInventory>({
    rose: { count: 0, value: 1 },
    heart: { count: 0, value: 3 },
    teddy: { count: 0, value: 5 }
  });
  
  const updateInventory = useCallback(async () => {
    if (!currentUser?.id) return;
    
    try {
      // Using a more direct query approach for tables that might not be in TypeScript definitions yet
      const { data, error } = await supabase
        .from('profiles')
        .select('gift_inventory')
        .eq('id', currentUser.id)
        .single();
        
      if (error) {
        console.error('Error fetching inventory:', error);
        return;
      }
      
      if (data?.gift_inventory) {
        // Type assertion to ensure we're safely converting the JSON to our expected type
        const giftInventory = data.gift_inventory as unknown as GiftInventory;
        
        // Validate the structure before setting it
        if (
          typeof giftInventory === 'object' && 
          ('rose' in giftInventory) && 
          ('heart' in giftInventory) && 
          ('teddy' in giftInventory)
        ) {
          setInventory(giftInventory);
        } else {
          console.error('Invalid gift inventory structure:', giftInventory);
        }
      }
    } catch (err) {
      console.error('Failed to update inventory:', err);
    }
  }, [currentUser?.id]);
  
  // Initialize inventory from currentUser
  useEffect(() => {
    if (currentUser?.giftInventory) {
      // Type assertion to ensure we're safely converting the giftInventory to our expected type
      const giftInventory = currentUser.giftInventory as unknown as GiftInventory;
      
      // Validate the structure before setting it
      if (
        typeof giftInventory === 'object' && 
        ('rose' in giftInventory) && 
        ('heart' in giftInventory) && 
        ('teddy' in giftInventory)
      ) {
        setInventory(giftInventory);
      }
    }
  }, [currentUser?.giftInventory]);
  
  const sendGift = useCallback(
    async (recipientId: string, giftType: GiftType) => {
      if (!currentUser?.id) {
        toast.error('You must be logged in to send gifts');
        return false;
      }
      
      setIsProcessing(true);
      setGiftError(null);
      
      try {
        // Check if user has this gift in inventory
        const giftItem = inventory[giftType];
        const giftCount = typeof giftItem === 'object' ? giftItem.count : giftItem;
        
        if (!giftCount || giftCount < 1) {
          throw new Error(`You don't have any ${giftType}s to send`);
        }
        
        // Add a transaction record using a more direct approach
        const { error } = await supabase
          .from('gift_transactions')
          .insert({
            sender_id: currentUser.id,
            recipient_id: recipientId,
            gift_type: giftType,
            transaction_type: 'gift',
            amount: 1
          });
          
        if (error) {
          throw new Error(error.message);
        }
        
        // Update local inventory
        await updateInventory();
        
        toast.success(`${giftType} sent successfully!`);
        return true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        setGiftError(errorMessage);
        toast.error(errorMessage);
        return false;
      } finally {
        setIsProcessing(false);
      }
    },
    [currentUser?.id, inventory, updateInventory]
  );
  
  const purchaseGifts = useCallback(
    async (giftType: GiftType, quantity: number) => {
      if (!currentUser?.id) {
        toast.error('You must be logged in to purchase gifts');
        return false;
      }
      
      if (quantity < 1) {
        toast.error('Please select at least 1 item to purchase');
        return false;
      }
      
      setIsProcessing(true);
      setGiftError(null);
      
      const prices = {
        rose: 4.99,
        heart: 9.99,
        teddy: 14.99
      };
      
      try {
        // Record the purchase transaction using a more direct approach
        const { error } = await supabase
          .from('gift_transactions')
          .insert({
            sender_id: currentUser.id,
            gift_type: giftType,
            transaction_type: 'purchase',
            amount: quantity,
            purchase_amount: prices[giftType] * quantity
          });
          
        if (error) {
          throw new Error(error.message);
        }
        
        // Update local inventory
        await updateInventory();
        
        toast.success(`Purchased ${quantity} ${giftType}(s)!`);
        return true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        setGiftError(errorMessage);
        toast.error(errorMessage);
        return false;
      } finally {
        setIsProcessing(false);
      }
    },
    [currentUser?.id, updateInventory]
  );
  
  // Initialize inventory on mount
  useEffect(() => {
    updateInventory();
  }, [updateInventory]);
  
  return {
    inventory,
    isProcessing,
    giftError,
    sendGift,
    purchaseGifts,
    updateInventory
  };
};
