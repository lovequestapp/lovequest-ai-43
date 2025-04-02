
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Search, MapPin, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

interface MapViewProps {
  location?: string;
  onLocationSelect?: (location: string, coordinates?: [number, number]) => void;
  height?: string;
  className?: string;
}

const MapView: React.FC<MapViewProps> = ({ 
  location, 
  onLocationSelect,
  height = "300px",
  className
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState(location || '');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  
  // Function to initialize map
  const initializeMap = (token: string) => {
    if (!mapContainer.current) return;
    
    try {
      setIsLoading(true);
      setError(null);
      mapboxgl.accessToken = token;
      
      const mapStyle = theme === 'dark' ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/streets-v12';
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: [-74.5, 40], // Default to NYC
        zoom: 12,
        attributionControl: false
      });
      
      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );
      
      // Add attribution in a specific position
      map.current.addControl(new mapboxgl.AttributionControl(), 'bottom-right');
      
      // Add geolocate control
      const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      });
      
      map.current.addControl(geolocateControl, 'top-right');
      
      // Handle map load event
      map.current.on('load', () => {
        setIsLoading(false);
        
        // If we have a location, search for it
        if (location && location.length > 0) {
          searchLocation(location);
        } else {
          // Try to use user's current location
          geolocateControl.trigger();
        }
      });
      
      // Handle map errors
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setError('An error occurred with the map. Please try again.');
        setIsLoading(false);
      });
      
    } catch (error) {
      console.error("Error initializing map:", error);
      setError("Could not initialize map. Please check your Mapbox token.");
      setIsLoading(false);
    }
  };
  
  // Function to search for a location
  const searchLocation = async (query: string) => {
    if (!mapboxgl.accessToken || !query.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&limit=1`
      );
      
      if (!response.ok) {
        throw new Error(`Network response error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        const placeName = data.features[0].place_name;
        
        if (map.current) {
          map.current.flyTo({
            center: [lng, lat],
            zoom: 13,
            essential: true
          });
          
          // Remove previous marker if exists
          if (marker.current) {
            marker.current.remove();
          }
          
          // Add a new marker
          marker.current = new mapboxgl.Marker({ color: '#f43f5e' })
            .setLngLat([lng, lat])
            .addTo(map.current);
            
          // If callback provided, call with location info
          if (onLocationSelect) {
            onLocationSelect(placeName, [lng, lat]);
          }
          
          setSearchQuery(placeName);
        }
      } else {
        toast.error("Location not found", {
          description: "Try a different search query"
        });
      }
    } catch (error) {
      console.error('Error searching location:', error);
      setError('Failed to search location. Please try again.');
      toast.error('Error searching location');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmitToken = () => {
    if (mapboxToken.trim()) {
      localStorage.setItem('mapbox_token', mapboxToken);
      setShowTokenInput(false);
      initializeMap(mapboxToken);
    } else {
      setError("Please enter a valid Mapbox token");
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchLocation(searchQuery);
    }
  };
  
  // Handle theme changes
  useEffect(() => {
    if (map.current) {
      const mapStyle = theme === 'dark' ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/streets-v12';
      map.current.setStyle(mapStyle);
    }
  }, [theme]);
  
  useEffect(() => {
    // Check if token exists in localStorage
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapboxToken(savedToken);
      setShowTokenInput(false);
      
      // Small delay to ensure container is ready
      setTimeout(() => {
        initializeMap(savedToken);
      }, 100);
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);
  
  return (
    <div className={cn("flex flex-col w-full rounded-md overflow-hidden", className)}>
      {showTokenInput ? (
        <div className={cn(
          "p-4 rounded-md", 
          theme === 'dark' ? "bg-secondary/20" : "bg-secondary/30"
        )}>
          <h3 className="text-sm font-medium mb-2">Mapbox API Token Required</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Please enter your Mapbox public token to enable map features. 
            You can get one from <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-love-500 underline">mapbox.com</a>.
          </p>
          <div className="flex gap-2">
            <Input 
              type="text" 
              value={mapboxToken} 
              onChange={(e) => setMapboxToken(e.target.value)} 
              placeholder="pk.eyJ1..." 
              className="text-xs"
            />
            <Button onClick={handleSubmitToken} size="sm">Save</Button>
          </div>
          {error && (
            <div className="mt-2 text-xs text-destructive flex items-center gap-1">
              <AlertTriangle size={12} />
              <span>{error}</span>
            </div>
          )}
        </div>
      ) : (
        <>
          <form onSubmit={handleSearch} className="flex gap-2 mb-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a location..."
                className="pl-8"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" size="sm" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Search'
              )}
            </Button>
          </form>
          
          <div className="relative">
            <div 
              ref={mapContainer} 
              style={{ height, minHeight: "200px" }} 
              className={cn(
                "rounded-md overflow-hidden border", 
                isLoading ? "opacity-50" : "opacity-100"
              )}
            />
            
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-love-500 mb-2" />
                  <span className="text-sm">Loading map...</span>
                </div>
              </div>
            )}
            
            {error && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                <div className="flex flex-col items-center bg-card p-4 rounded-lg shadow-lg max-w-xs text-center">
                  <AlertTriangle className="h-10 w-10 text-destructive mb-2" />
                  <p className="text-sm font-medium mb-2">{error}</p>
                  <Button 
                    size="sm" 
                    onClick={() => {
                      setError(null);
                      const token = localStorage.getItem('mapbox_token');
                      if (token) initializeMap(token);
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MapView;
