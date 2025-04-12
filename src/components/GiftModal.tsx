
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Gift, Diamond, Sparkles, Crown, Star, Flower, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendGift: (giftType: 'rose' | 'heart' | 'teddy') => void;
}

export const GiftModal: React.FC<GiftModalProps> = ({ isOpen, onClose, onSendGift }) => {
  const [hoveredGift, setHoveredGift] = useState<string | null>(null);
  
  const gifts = [
    { 
      id: 'rose', 
      name: 'Elegant Rose', 
      description: 'A timeless classic to express your genuine interest',
      icon: <Flower className="text-red-500" />, 
      bgColor: 'bg-gradient-to-br from-red-50 to-red-100',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      hoverBg: 'hover:bg-red-100'
    },
    { 
      id: 'heart', 
      name: 'Crystal Heart', 
      description: 'Share your deepest affection with this exquisite gift',
      icon: <Heart className="text-love-500 fill-love-500" />, 
      bgColor: 'bg-gradient-to-br from-love-50 to-love-100',
      borderColor: 'border-love-200',
      textColor: 'text-love-700',
      hoverBg: 'hover:bg-love-100'
    },
    { 
      id: 'teddy', 
      name: 'Luxury Teddy Bear', 
      description: 'Delight them with this premium handcrafted gift',
      icon: <ShoppingBag className="text-amber-700" />,
      bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100',
      borderColor: 'border-amber-200', 
      textColor: 'text-amber-700',
      hoverBg: 'hover:bg-amber-100'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-xl border-0 shadow-2xl bg-white">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="flex items-center gap-2 text-center text-xl font-serif tracking-tight">
            <Crown className="h-5 w-5 text-amber-500" />
            <span className="text-gray-800 font-medium">Premium Gifts</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-1 pt-4">
          <div className="grid grid-cols-1 gap-4 mt-2">
            {gifts.map((gift) => (
              <motion.div 
                key={gift.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => onSendGift(gift.id as 'rose' | 'heart' | 'teddy')}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300",
                  `${gift.bgColor} ${gift.borderColor} ${gift.hoverBg} hover:shadow-lg`,
                  hoveredGift === gift.id ? "scale-[1.02] shadow-md" : ""
                )}
                onMouseEnter={() => setHoveredGift(gift.id)}
                onMouseLeave={() => setHoveredGift(null)}
              >
                <div className={cn(
                  "flex items-center justify-center rounded-full p-3 shadow-inner",
                  gift.bgColor
                )}>
                  <div className="text-2xl">{gift.icon}</div>
                </div>
                
                <div className="flex-1">
                  <h3 className={cn("font-medium mb-1 font-serif tracking-tight", gift.textColor)}>
                    {gift.name}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{gift.description}</p>
                  
                  <div className="mt-3 flex items-center gap-2">
                    <Badge variant="outline" className={cn(
                      "bg-white/90 shadow-sm transition-all", 
                      gift.borderColor,
                      hoveredGift === gift.id ? "animate-pulse" : ""
                    )}>
                      <Star className="h-3 w-3 mr-1 fill-amber-400 stroke-amber-500" />
                      <span className="font-medium">Premium Gift</span>
                    </Badge>
                  </div>
                </div>

                <motion.div 
                  className="self-center text-amber-500"
                  animate={{ 
                    opacity: hoveredGift === gift.id ? 1 : 0.6,
                    scale: hoveredGift === gift.id ? 1.1 : 1
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Sparkles className="h-5 w-5" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        <DialogFooter className="sm:justify-between gap-4 pt-3 border-t border-gray-100">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            Cancel
          </Button>
          
          <Button 
            variant="outline"
            className="border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
            onClick={() => window.location.href = "/shop"}
          >
            <Gift className="h-4 w-4 mr-2" />
            Visit Gift Gallery
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
