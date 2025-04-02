
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendGift: (giftType: 'rose' | 'heart' | 'teddy') => void;
}

export const GiftModal: React.FC<GiftModalProps> = ({ isOpen, onClose, onSendGift }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send a Gift</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 py-4">
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center p-6"
            onClick={() => onSendGift('rose')}
          >
            <span className="text-2xl mb-2">🌹</span>
            <span>Rose</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center p-6"
            onClick={() => onSendGift('heart')}
          >
            <span className="text-2xl mb-2">❤️</span>
            <span>Heart</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center p-6"
            onClick={() => onSendGift('teddy')}
          >
            <span className="text-2xl mb-2">🧸</span>
            <span>Teddy</span>
          </Button>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
