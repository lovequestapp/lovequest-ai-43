
import { useState, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';

/**
 * A custom hook for gift functionality
 */
export const useGifts = () => {
  const { 
    sendGift, 
    getGiftInventory, 
    purchaseGifts: contextPurchaseGifts
  } = useUser();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [giftError, setGiftError] = useState<string | null>(null);
  const [inventory, setInventory] = useState(getGiftInventory());
  
  const updateInventory = useCallback(() => {
    setInventory(getGiftInventory());
  }, [getGiftInventory]);
  
  const sendGiftToUser = useCallback(
    async (recipientId: string, giftType: 'rose' | 'heart' | 'teddy') => {
      setIsProcessing(true);
      setGiftError(null);
      
      try {
        const success = await sendGift(recipientId, giftType);
        if (success) {
          updateInventory();
          toast.success(`${giftType} sent successfully!`);
          return true;
        } else {
          throw new Error('Failed to send gift');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        setGiftError(errorMessage);
        toast.error(errorMessage);
        return false;
      } finally {
        setIsProcessing(false);
      }
    },
    [sendGift, updateInventory]
  );
  
  const purchaseGifts = useCallback(
    async (giftType: 'rose' | 'heart' | 'teddy', quantity: number) => {
      setIsProcessing(true);
      setGiftError(null);
      
      try {
        const success = await contextPurchaseGifts(giftType, quantity);
        if (success) {
          updateInventory();
          toast.success(`Purchased ${quantity} ${giftType}(s)!`);
          return true;
        } else {
          throw new Error('Failed to purchase gifts');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        setGiftError(errorMessage);
        toast.error(errorMessage);
        return false;
      } finally {
        setIsProcessing(false);
      }
    },
    [contextPurchaseGifts, updateInventory]
  );
  
  return {
    inventory,
    isProcessing,
    giftError,
    sendGift: sendGiftToUser,
    purchaseGifts,
    updateInventory
  };
};
