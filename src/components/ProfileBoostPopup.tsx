import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useUser } from '@/context/UserContext';
import type { BoostType } from '@/types/user';

interface ProfileBoostPopupProps {
  open: boolean;
  onClose: () => void;
}

const ProfileBoostPopup: React.FC<ProfileBoostPopupProps> = ({ open, onClose }) => {
  const { boostProfile } = useUser();
  const [boostType, setBoostType] = useState<'local' | 'international'>('local');
  
  const handleBoost = () => {
    // Ensure we only pass 'local' or 'international', not 'super'
    const validBoostType = boostType as 'local' | 'international';
    const success = boostProfile(validBoostType);
    if (success) {
      onClose();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Boost Your Profile</DialogTitle>
          <DialogDescription>
            Get more visibility and increase your chances of finding a match.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup defaultValue="local" className="flex flex-col space-y-1" onValueChange={(value) => setBoostType(value as 'local' | 'international')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="local" id="r1" />
              <Label htmlFor="r1">Local Boost</Label>
            </div>
            <div className="pl-8">
              <p className="text-sm text-muted-foreground">
                Your profile will be featured in your local area for 24 hours.
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="international" id="r2" />
              <Label htmlFor="r2">International Boost</Label>
            </div>
            <div className="pl-8">
              <p className="text-sm text-muted-foreground">
                Your profile will be featured internationally for 24 hours.
              </p>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button onClick={handleBoost}>Boost Profile</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileBoostPopup;
