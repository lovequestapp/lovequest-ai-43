
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Rocket, Globe, MapPin, Check, Sparkles } from 'lucide-react';
import { BoostType, useUser } from '@/context/UserContext';

interface ProfileBoostPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileBoostPopup: React.FC<ProfileBoostPopupProps> = ({ isOpen, onClose }) => {
  const { boostProfile, currentUser } = useUser();
  const [boostType, setBoostType] = useState<BoostType>('local');
  const [loading, setLoading] = useState(false);
  
  if (!currentUser) return null;
  
  const handleBoost = () => {
    setLoading(true);
    
    // Call the boostProfile function and check its result
    const success = boostProfile(boostType);
    
    setLoading(false);
    
    if (success) {
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <span>Boost Your Profile</span>
          </DialogTitle>
          <DialogDescription>
            Get more visibility and matches by boosting your profile.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div
            className={`relative flex flex-col items-start rounded-md border p-4 cursor-pointer hover:border-love-200 transition-colors ${
              boostType === 'local' ? 'border-love-500 bg-love-50' : ''
            }`}
            onClick={() => setBoostType('local')}
          >
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
          
          <div
            className={`relative flex flex-col items-start rounded-md border p-4 cursor-pointer hover:border-love-200 transition-colors ${
              boostType === 'international' ? 'border-love-500 bg-love-50' : ''
            }`}
            onClick={() => setBoostType('international')}
          >
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
              <li className="text-sm flex">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Increased match likelihood</span>
              </li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="bg-gradient-love hover:opacity-90" 
            onClick={handleBoost}
            disabled={loading}
          >
            <Rocket className="mr-2 h-4 w-4" />
            Activate {boostType === 'local' ? 'Local' : 'International'} Boost
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileBoostPopup;
