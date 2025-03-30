
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationInfo, getCurrentLocation, formatLocationMessage } from '@/utils/messageActions';
import { toast } from 'sonner';
import { MapPin, Loader2 } from 'lucide-react';

interface ShareLocationActionProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (message: string) => void;
}

const ShareLocationAction: React.FC<ShareLocationActionProps> = ({
  isOpen,
  onClose,
  onShare
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [customName, setCustomName] = useState('');
  const [customAddress, setCustomAddress] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      getCurrentLocation()
        .then(loc => {
          if (loc) {
            setLocation(loc);
            setCustomName(loc.name);
            setCustomAddress(loc.address);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen]);

  const handleShare = () => {
    if (!customName.trim() || !customAddress.trim()) {
      toast.error("Please enter both name and address");
      return;
    }

    const locationInfo: LocationInfo = {
      name: customName,
      address: customAddress,
      coordinates: location?.coordinates
    };

    const message = formatLocationMessage(locationInfo);
    onShare(message);
    onClose();
    
    toast.success("Location shared!", {
      description: `You've shared your location at ${customName}`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Location</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-love-500 mb-4" />
              <p className="text-muted-foreground">Detecting your location...</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <Label htmlFor="locationName">Location Name</Label>
                <Input
                  id="locationName"
                  placeholder="Coffee Shop, Restaurant, etc."
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St, City"
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                />
              </div>

              <div className="bg-love-50 p-3 rounded-md flex items-start gap-3 mt-2">
                <MapPin className="text-love-500 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-muted-foreground">
                  This will share your location with your match. You can edit the details above before sending.
                </p>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleShare} 
            disabled={isLoading || !customName.trim() || !customAddress.trim()}
          >
            Share Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareLocationAction;
