
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Gift, Diamond, Sparkles, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendGift: (giftType: 'rose' | 'heart' | 'teddy') => void;
}

export const GiftModal: React.FC<GiftModalProps> = ({ isOpen, onClose, onSendGift }) => {
  const gifts = [
    { 
      id: 'rose', 
      name: 'Rose', 
      description: 'Send a beautiful rose to express interest',
      icon: <Heart className="text-red-500" />, 
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700'
    },
    { 
      id: 'heart', 
      name: 'Heart', 
      description: 'Share your feelings with a lovely heart',
      icon: <Heart className="text-love-500 fill-love-500" />, 
      bgColor: 'bg-love-50',
      borderColor: 'border-love-200',
      textColor: 'text-love-700'
    },
    { 
      id: 'teddy', 
      name: 'Teddy Bear', 
      description: 'Make them smile with an adorable teddy bear',
      icon: <Gift className="text-amber-700" />,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200', 
      textColor: 'text-amber-700'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center text-xl">
            <Gift className="h-5 w-5 text-love-500" />
            <span>Send a Gift</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-1">
          <div className="grid grid-cols-1 gap-4 mt-2">
            {gifts.map((gift) => (
              <div 
                key={gift.id}
                onClick={() => onSendGift(gift.id as 'rose' | 'heart' | 'teddy')}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all",
                  `${gift.bgColor} ${gift.borderColor} hover:shadow-md`
                )}
              >
                <div className={cn(
                  "flex items-center justify-center rounded-full p-3",
                  gift.bgColor
                )}>
                  <div className="text-2xl">{gift.icon}</div>
                </div>
                
                <div className="flex-1">
                  <h3 className={cn("font-medium mb-1", gift.textColor)}>{gift.name}</h3>
                  <p className="text-sm text-gray-500">{gift.description}</p>
                  
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className={cn("bg-white/50", gift.borderColor)}>
                      <Sparkles className="h-3 w-3 mr-1" />
                      Special Gift
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="sm:justify-start gap-2 mt-2">
          <div className="w-full flex justify-between items-center">
            <Button 
              variant="ghost" 
              onClick={onClose} 
              className="text-gray-500"
            >
              Cancel
            </Button>
            
            <Button 
              variant="outline"
              className="border-love-200 text-love-700 hover:bg-love-50 hover:text-love-800"
              onClick={() => window.location.href = "/shop"}
            >
              <Gift className="h-4 w-4 mr-2" />
              Visit Gift Shop
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
