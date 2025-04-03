
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, X, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Google Maps Places script loader
const loadGoogleMapsScript = (callback: () => void) => {
  // Check if script already exists to avoid duplicates
  if (document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')) {
    if (window.google && window.google.maps) {
      callback();
    } else {
      setTimeout(() => loadGoogleMapsScript(callback), 500);
    }
    return;
  }

  // Try to get API key from localStorage first
  const apiKey = localStorage.getItem('google_maps_api_key');
  
  if (!apiKey) {
    // Skip if no API key, user will need to enter it manually
    return;
  }

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  script.async = true;
  script.defer = true;
  script.addEventListener('load', callback);
  document.head.appendChild(script);
};

interface LocationSelectorProps {
  location: string;
  onLocationSelect: (location: string) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  location, 
  onLocationSelect 
}) => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('google_maps_api_key') || '');
  const [inputValue, setInputValue] = useState(location);
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const sessionToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  
  // Initialize Google Maps Places API
  useEffect(() => {
    if (!apiKey) return;
    
    loadGoogleMapsScript(() => {
      try {
        if (window.google && window.google.maps && window.google.maps.places) {
          autocompleteService.current = new google.maps.places.AutocompleteService();
          sessionToken.current = new google.maps.places.AutocompleteSessionToken();
          
          // Create a dummy element for PlacesService (required)
          const dummyElement = document.createElement('div');
          placesService.current = new google.maps.places.PlacesService(dummyElement);
        } else {
          console.error("Google Maps Places API not available");
        }
      } catch (error) {
        console.error('Error initializing Google Places API:', error);
      }
    });
  }, [apiKey]);

  // Handle input change for location search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (!value.trim() || !autocompleteService.current) {
      setSuggestions([]);
      return;
    }
    
    setLoading(true);
    
    autocompleteService.current.getPlacePredictions(
      {
        input: value,
        sessionToken: sessionToken.current,
        types: ['(cities)'], // Restrict to cities
      },
      (predictions, status) => {
        setLoading(false);
        
        if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
          setSuggestions([]);
          return;
        }
        
        setSuggestions(predictions);
      }
    );
  };
  
  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: google.maps.places.AutocompletePrediction) => {
    setInputValue(suggestion.description);
    onLocationSelect(suggestion.description);
    setSuggestions([]);
    
    // Get detailed place information if needed
    if (placesService.current && suggestion.place_id) {
      placesService.current.getDetails(
        {
          placeId: suggestion.place_id,
          fields: ['formatted_address', 'geometry'],
          sessionToken: sessionToken.current
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            // Use place details if needed (coordinates, etc.)
            console.log('Place details:', place);
          }
        }
      );
      
      // Create a new session token for the next search
      sessionToken.current = new google.maps.places.AutocompleteSessionToken();
    }
  };
  
  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      if (suggestions[focusedIndex]) {
        handleSelectSuggestion(suggestions[focusedIndex]);
      }
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setFocusedIndex(-1);
    }
  };
  
  // Save Google Maps API key
  const handleSaveApiKey = () => {
    if (apiKey.trim() === '') {
      toast.error('Please enter a valid API key');
      return;
    }
    
    localStorage.setItem('google_maps_api_key', apiKey);
    setShowApiKeyInput(false);
    
    // Initialize Google Maps after setting API key
    loadGoogleMapsScript(() => {
      try {
        if (window.google && window.google.maps && window.google.maps.places) {
          autocompleteService.current = new google.maps.places.AutocompleteService();
          sessionToken.current = new google.maps.places.AutocompleteSessionToken();
          
          const dummyElement = document.createElement('div');
          placesService.current = new google.maps.places.PlacesService(dummyElement);
          
          toast.success('API key saved successfully');
        } else {
          throw new Error("Google Maps Places API not available");
        }
      } catch (error) {
        console.error('Error initializing Google Places API:', error);
        toast.error('Error initializing Google API');
      }
    });
  };
  
  // Reset API key input
  const handleResetApiKey = () => {
    setShowApiKeyInput(true);
    localStorage.removeItem('google_maps_api_key');
  };
  
  // Handle manual location input (when API key is not available)
  const handleManualLocationSubmit = () => {
    if (inputValue.trim()) {
      onLocationSelect(inputValue);
      toast.success('Location updated');
    }
  };

  return (
    <div className="space-y-4">
      {showApiKeyInput ? (
        <div className="space-y-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <div>
            <h4 className="text-sm font-medium mb-1">Google Maps API Key Required</h4>
            <p className="text-xs text-muted-foreground mb-3">
              To enable location autocomplete, please enter your Google Maps API key with Places API enabled.
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter Google Maps API key"
              className="flex-1"
            />
            <button
              onClick={handleSaveApiKey}
              className="px-3 py-2 bg-love-500 hover:bg-love-600 text-white rounded-md text-sm"
            >
              Save
            </button>
          </div>
          
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
            <p className="text-xs text-muted-foreground">
              Don't have an API key? You can still enter your location manually.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-end">
          <button 
            onClick={handleResetApiKey}
            className="text-xs text-love-500 hover:text-love-600"
          >
            Change API key
          </button>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="location">Your Location</Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <MapPin size={18} />
          </div>
          <Input
            id="location"
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter your city"
            className="pl-10"
            autoComplete="off"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 size={18} className="animate-spin text-muted-foreground" />
            </div>
          )}
          {inputValue && !loading && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
              onClick={() => {
                setInputValue('');
                setSuggestions([]);
                inputRef.current?.focus();
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.place_id}
                onClick={() => handleSelectSuggestion(suggestion)}
                className={cn(
                  "cursor-pointer select-none py-2 pl-10 pr-4 relative",
                  index === focusedIndex 
                    ? "bg-love-50 dark:bg-love-900/20 text-love-600 dark:text-love-400" 
                    : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                )}
              >
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <MapPin size={16} />
                </div>
                <span className="block truncate">{suggestion.description}</span>
              </li>
            ))}
          </ul>
        )}
        
        {!apiKey && (
          <div className="flex justify-end mt-2">
            <button
              onClick={handleManualLocationSubmit}
              className="text-sm text-love-500 hover:text-love-600"
            >
              Confirm manual location
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSelector;
