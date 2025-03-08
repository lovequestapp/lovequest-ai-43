import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Shield } from 'lucide-react';

// Cookie consent options
interface ConsentOptions {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieConsent = () => {
  const [open, setOpen] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [consentOptions, setConsentOptions] = useState<ConsentOptions>({
    necessary: true, // Always required
    functional: false,
    analytics: false,
    marketing: false
  });
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [isEuRegion, setIsEuRegion] = useState(false);

  useEffect(() => {
    // Check if consent was previously given
    const hasConsent = localStorage.getItem('cookieConsent');
    
    if (hasConsent) {
      setConsentGiven(true);
      try {
        const savedOptions = JSON.parse(localStorage.getItem('consentOptions') || '{}');
        setConsentOptions(prev => ({ ...prev, ...savedOptions }));
      } catch (e) {
        console.error('Error parsing consent options:', e);
      }
    } else {
      // Try to detect user's location
      detectUserLocation();
    }
  }, []);

  useEffect(() => {
    // Show consent dialog for EU users or if consent hasn't been given
    if ((isEuRegion || userCountry === null) && !consentGiven) {
      setOpen(true);
    }
  }, [isEuRegion, userCountry, consentGiven]);

  const detectUserLocation = async () => {
    try {
      // Using a geolocation API to determine country
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      setUserCountry(data.country_name);
      
      // EU country codes - this is a simplified list
      const euCountries = [
        'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
        'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
        'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB' // GB included for GDPR
      ];
      
      setIsEuRegion(euCountries.includes(data.country_code));
    } catch (error) {
      console.error('Error detecting location:', error);
      // If we can't detect location, assume we need consent
      setOpen(true);
    }
  };

  const handleOptionChange = (option: keyof ConsentOptions) => {
    if (option === 'necessary') return; // Can't change necessary cookies
    setConsentOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    
    setConsentOptions(allAccepted);
    saveConsent(allAccepted);
    setOpen(false);
  };

  const handleSavePreferences = () => {
    saveConsent(consentOptions);
    setOpen(false);
  };

  const saveConsent = (options: ConsentOptions) => {
    localStorage.setItem('cookieConsent', 'true');
    localStorage.setItem('consentOptions', JSON.stringify(options));
    setConsentGiven(true);
    
    // Here you would implement the actual cookie management
    // based on user preferences
    applyConsentPreferences(options);
  };

  const applyConsentPreferences = (options: ConsentOptions) => {
    // Simulated function that would actually enable/disable cookies
    // based on user preferences
    console.log('Applied consent preferences:', options);
    
    // In a real implementation, you would:
    // 1. Always keep necessary cookies
    // 2. Enable/disable functional cookies
    // 3. Enable/disable analytics (like Google Analytics)
    // 4. Enable/disable marketing cookies
  };

  const handleManageConsent = () => {
    setOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-love-500" />
              Privacy Preferences
            </DialogTitle>
            <DialogDescription>
              We value your privacy. This site uses cookies to enhance your experience, show relevant ads, and analyze our traffic.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-start space-x-3 space-y-0">
              <Checkbox 
                id="necessary" 
                checked={consentOptions.necessary} 
                disabled 
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor="necessary" className="font-medium">
                  Necessary Cookies
                </Label>
                <p className="text-sm text-muted-foreground">
                  Essential for the website to function properly. Cannot be disabled.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 space-y-0">
              <Checkbox 
                id="functional" 
                checked={consentOptions.functional}
                onCheckedChange={() => handleOptionChange('functional')}
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor="functional" className="font-medium">
                  Functional Cookies
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enable personalized features and remember your preferences.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 space-y-0">
              <Checkbox 
                id="analytics" 
                checked={consentOptions.analytics}
                onCheckedChange={() => handleOptionChange('analytics')}
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor="analytics" className="font-medium">
                  Analytics Cookies
                </Label>
                <p className="text-sm text-muted-foreground">
                  Help us understand how visitors interact with our website.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 space-y-0">
              <Checkbox 
                id="marketing" 
                checked={consentOptions.marketing}
                onCheckedChange={() => handleOptionChange('marketing')}
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor="marketing" className="font-medium">
                  Marketing Cookies
                </Label>
                <p className="text-sm text-muted-foreground">
                  Used to track you across websites for marketing purposes.
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleSavePreferences}
            >
              Save Preferences
            </Button>
            <Button
              type="button"
              onClick={handleAcceptAll}
              className="bg-love-500 hover:bg-love-600"
            >
              Accept All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Fixed button at the bottom of the page for managing consent */}
      {consentGiven && (
        <div className="fixed bottom-4 left-4 z-50">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleManageConsent}
            className="flex items-center gap-1.5 shadow-md"
          >
            <Shield className="h-4 w-4" />
            Privacy Settings
          </Button>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
