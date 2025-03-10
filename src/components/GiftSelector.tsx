
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Rocket, Globe, MapPin, Check } from 'lucide-react';
import { useUser } from '@/context/UserContext';

interface GiftSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSendGift: (giftType: 'rose' | 'heart' | 'teddy') => void;
}

const GiftSelector: React.FC<GiftSelectorProps> = ({ isOpen, onClose, onSendGift }) => {
  const { currentUser, boostProfile } = useUser();
  const [activeTab, setActiveTab] = useState<'gifts' | 'boost'>('gifts');
  const [boostType, setBoostType] = useState<'local' | 'international'>('local');
  
  if (!currentUser || !currentUser.giftInventory) return null;
  
  const handleBoost = () => {
    const success = boostProfile(boostType);
    if (success) {
      onClose();
    }
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
