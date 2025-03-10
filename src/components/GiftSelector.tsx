
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useUser } from '@/context/UserContext';

interface GiftSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSendGift: (giftType: 'rose' | 'heart' | 'teddy') => void;
}

const GiftSelector: React.FC<GiftSelectorProps> = ({ isOpen, onClose, onSendGift }) => {
  const { currentUser } = useUser();
  
  if (!currentUser || !currentUser.giftInventory) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send a Gift</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-muted-foreground">
            Choose a gift to send:
          </p>
          
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              className="flex flex-col items-center p-4" 
              onClick={() => onSendGift('rose')}
              disabled={currentUser.giftInventory.rose <= 0}
            >
              <span className="text-3xl mb-2">🌹</span>
              <span>Rose</span>
              <span className="text-xs text-muted-foreground mt-1">
                {currentUser.giftInventory.rose} available
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center p-4" 
              onClick={() => onSendGift('heart')}
              disabled={currentUser.giftInventory.heart <= 0}
            >
              <span className="text-3xl mb-2">❤️</span>
              <span>Heart</span>
              <span className="text-xs text-muted-foreground mt-1">
                {currentUser.giftInventory.heart} available
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center p-4" 
              onClick={() => onSendGift('teddy')}
              disabled={currentUser.giftInventory.teddy <= 0}
            >
              <span className="text-3xl mb-2">🧸</span>
              <span>Teddy</span>
              <span className="text-xs text-muted-foreground mt-1">
                {currentUser.giftInventory.teddy} available
              </span>
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GiftSelector;
