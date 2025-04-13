
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Rocket, Globe, MapPin, Check, Gift, ShoppingBag, Flower, Heart, BearIcon } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useGifts } from '@/hooks/useGifts';
import { useNavigate } from 'react-router-dom';

interface GiftSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSendGift: (giftType: 'rose' | 'heart' | 'teddy') => void;
  recipientId?: string;
}

const GiftSelector: React.FC<GiftSelectorProps> = ({ isOpen, onClose, onSendGift, recipientId }) => {
  const { currentUser, boostProfile } = useUser();
  const { inventory, sendGift, isProcessing, updateInventory } = useGifts();
  const [activeTab, setActiveTab] = useState<'gifts' | 'boost'>('gifts');
  const [boostType, setBoostType] = useState<'local' | 'international'>('local');
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isOpen) {
      updateInventory();
    }
  }, [isOpen, updateInventory]);
  
  if (!currentUser) return null;
  
  const handleSendGift = async (giftType: 'rose' | 'heart' | 'teddy') => {
    if (!recipientId || isProcessing) return;
    
    const success = await sendGift(recipientId, giftType);
    if (success) {
      onSendGift(giftType);
      onClose();
    }
  };
  
  const handleBoost = () => {
    const success = boostProfile(boostType);
    if (success) {
      onClose();
    }
  };
  
  const renderGiftCount = (type: 'rose' | 'heart' | 'teddy') => {
    const giftItem = inventory[type];
    const count = typeof giftItem === 'object' ? giftItem.count : giftItem;
    return count || 0;
  };
  
  const goToShop = () => {
    onClose();
    navigate('/shop');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Send a Gift or Boost</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="gifts" value={activeTab} onValueChange={(value) => setActiveTab(value as 'gifts' | 'boost')}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="gifts">Send Gifts</TabsTrigger>
            <TabsTrigger value="boost">Boost Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gifts" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose a gift to send:
            </p>
            
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                className="flex flex-col items-center p-4" 
                onClick={() => handleSendGift('rose')}
                disabled={isProcessing || renderGiftCount('rose') <= 0}
              >
                <Flower className="h-8 w-8 text-red-500 mb-2" />
                <span>Rose</span>
                <span className="text-xs text-muted-foreground mt-1">
                  {renderGiftCount('rose')} available
                </span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col items-center p-4" 
                onClick={() => handleSendGift('heart')}
                disabled={isProcessing || renderGiftCount('heart') <= 0}
              >
                <Heart className="h-8 w-8 text-love-500 mb-2" />
                <span>Heart</span>
                <span className="text-xs text-muted-foreground mt-1">
                  {renderGiftCount('heart')} available
                </span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col items-center p-4" 
                onClick={() => handleSendGift('teddy')}
                disabled={isProcessing || renderGiftCount('teddy') <= 0}
              >
                <BearIcon className="h-8 w-8 text-amber-500 mb-2" />
                <span>Teddy</span>
                <span className="text-xs text-muted-foreground mt-1">
                  {renderGiftCount('teddy')} available
                </span>
              </Button>
            </div>
            
            {(renderGiftCount('rose') <= 0 && renderGiftCount('heart') <= 0 && renderGiftCount('teddy') <= 0) && (
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground mb-3">
                  You don't have any gifts in your inventory.
                </p>
                <Button 
                  variant="default" 
                  onClick={goToShop} 
                  className="flex items-center gap-2"
                >
                  <ShoppingBag size={16} />
                  <span>Go to Shop</span>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="boost" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Boost your profile visibility:
            </p>
            
            <div className="grid grid-cols-1 gap-4">
              <div className={`relative flex flex-col items-start rounded-md border p-4 cursor-pointer hover:border-love-200 transition-colors ${
                boostType === 'local' ? 'border-love-500 bg-love-50' : ''
              }`} onClick={() => setBoostType('local')}>
                <div className="flex items-center mb-2">
                  <div className="mr-2 h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium">Local Boost</h4>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Show your profile at the top for users in your country
                </p>
                <Badge variant="outline" className="bg-amber-50 text-amber-700">
                  $2.99 for 24 hours
                </Badge>
              </div>
              
              <div className={`relative flex flex-col items-start rounded-md border p-4 cursor-pointer hover:border-love-200 transition-colors ${
                boostType === 'international' ? 'border-love-500 bg-love-50' : ''
              }`} onClick={() => setBoostType('international')}>
                <div className="flex items-center mb-2">
                  <div className="mr-2 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Globe className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium">International Boost</h4>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Show your profile at the top for users across all countries
                </p>
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  $4.99 for 24 hours
                </Badge>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="text-sm font-medium mb-2">Boost Benefits</h4>
              <ul className="space-y-2">
                <li className="text-sm flex">
                  <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Appear at the top of Discover page</span>
                </li>
                <li className="text-sm flex">
                  <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Get up to 10x more profile views</span>
                </li>
              </ul>
            </div>
            
            <Button 
              onClick={handleBoost}
              className="w-full bg-gradient-love hover:opacity-90"
            >
              <Rocket className="mr-2 h-4 w-4" />
              Activate {boostType === 'local' ? 'Local' : 'International'} Boost
            </Button>
          </TabsContent>
        </Tabs>
        
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
