
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, MapPin } from 'lucide-react';

interface MapViewProps {
  location?: string;
  onLocationSelect?: (location: string, coordinates?: [number, number]) => void;
  height?: string;
}

const MapView: React.FC<MapViewProps> = ({ 
  location, 
  onLocationSelect,
  height = "300px" 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState(location || '');
  const [showTokenInput, setShowTokenInput] = useState(true);
  
  // Function to initialize map
  const initializeMap = (token: string) => {
    if (!mapContainer.current) return;
    
    mapboxgl.accessToken = token;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-74.5, 40], // Default to NYC
        zoom: 12
      });
      
      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );
      
      // If we have a location, search for it
      if (location && location.length > 0) {
        searchLocation(location);
      }
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  };
  
  // Function to search for a location
  const searchLocation = async (query: string) => {
    if (!mapboxgl.accessToken || !query.trim()) return;
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&limit=1`
      );
      
      if (!response.ok) throw new Error('Network response was not ok');
      
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
          
          // Add a marker
          new mapboxgl.Marker({ color: '#f43f5e' })
            .setLngLat([lng, lat])
            .addTo(map.current);
            
          // If callback provided, call with location info
          if (onLocationSelect) {
            onLocationSelect(placeName, [lng, lat]);
          }
        }
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };
  
  const handleSubmitToken = () => {
    if (mapboxToken.trim()) {
      localStorage.setItem('mapbox_token', mapboxToken);
      setShowTokenInput(false);
      initializeMap(mapboxToken);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchLocation(searchQuery);
  };
  
  useEffect(() => {
    // Check if token exists in localStorage
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapboxToken(savedToken);
      setShowTokenInput(false);
      initializeMap(savedToken);
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);
  
  return (
    <div className="flex flex-col w-full rounded-md overflow-hidden">
      {showTokenInput ? (
        <div className="p-4 bg-secondary/30 rounded-md">
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
              />
            </div>
            <Button type="submit" size="sm">Search</Button>
          </form>
          <div 
            ref={mapContainer} 
            style={{ height, minHeight: "200px" }} 
            className="rounded-md overflow-hidden border"
          />
        </>
      )}
    </div>
  );
};

export default MapView;
