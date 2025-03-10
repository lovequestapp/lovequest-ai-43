
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Rocket, Globe, MapPin, Check, CreditCard, Sparkles } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { toast } from "sonner";

interface ProfileBoostPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileBoostPopup: React.FC<ProfileBoostPopupProps> = ({ isOpen, onClose }) => {
  const { boostProfile } = useUser();
  const [boostType, setBoostType] = useState<'local' | 'international'>('local');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const prices = {
    local: 2.99,
    international: 4.99
  };
  
  const handleBoost = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const success = boostProfile(boostType);
      
      if (success) {
        toast.success(`Profile ${boostType} boost activated!`, {
          description: "Your profile will now appear at the top of the Discover view"
        });
        onClose();
      } else {
        toast.error("Could not process payment", {
          description: "Please try again or use a different payment method"
        });
      }
      
      setIsProcessing(false);
    }, 1500);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto bg-love-100 w-12 h-12 rounded-full flex items-center justify-center mb-2">
            <Rocket className="h-6 w-6 text-love-600" />
          </div>
          <DialogTitle className="text-center text-xl">Boost Your Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-center text-muted-foreground">
            Get 10x more visibility and matches with a profile boost!
          </p>
          
          <RadioGroup 
            value={boostType} 
            onValueChange={(value) => setBoostType(value as 'local' | 'international')}
            className="grid grid-cols-1 gap-4"
          >
            <div className={`relative flex flex-col items-start rounded-md border p-4 cursor-pointer hover:border-love-200 transition-colors ${
              boostType === 'local' ? 'border-love-500 bg-love-50' : ''
            }`}>
              <RadioGroupItem value="local" id="local" className="absolute right-4 top-4" />
              <div className="flex items-center mb-2">
                <div className="mr-2 h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <Label htmlFor="local" className="text-base font-medium">Local Boost</Label>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Show your profile at the top for users in your country
              </p>
              <Badge variant="outline" className="bg-amber-50 text-amber-700">
                ${prices.local} for 24 hours
              </Badge>
            </div>
            
            <div className={`relative flex flex-col items-start rounded-md border p-4 cursor-pointer hover:border-love-200 transition-colors ${
              boostType === 'international' ? 'border-love-500 bg-love-50' : ''
            }`}>
              <RadioGroupItem value="international" id="international" className="absolute right-4 top-4" />
              <div className="flex items-center mb-2">
                <div className="mr-2 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Globe className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <Label htmlFor="international" className="text-base font-medium">International Boost</Label>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Show your profile at the top for users across all countries
              </p>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                ${prices.international} for 24 hours
              </Badge>
            </div>
          </RadioGroup>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Sparkles className="h-4 w-4 text-amber-500 mr-1.5" />
              Boost Benefits
            </h4>
            <ul className="space-y-2">
              <li className="text-sm flex">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Appear at the top of Discover page</span>
              </li>
              <li className="text-sm flex">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Get up to 10x more profile views</span>
              </li>
              <li className="text-sm flex">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Increase your matches by up to 300%</span>
              </li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isProcessing}
          >
            Not Now
          </Button>
          <Button 
            className="bg-gradient-love hover:opacity-90"
            onClick={handleBoost}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay ${boostType === 'local' ? prices.local : prices.international}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileBoostPopup;
