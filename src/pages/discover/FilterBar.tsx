
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Flame, 
  MapPin, 
  Globe, 
  X,
  Rocket,
  UserSearch
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from '@/lib/utils';

// Define regions data
const regions = [
  { value: "north-america", label: "North America" },
  { value: "south-america", label: "South America" },
  { value: "europe", label: "Europe" },
  { value: "asia", label: "Asia" },
  { value: "africa", label: "Africa" },
  { value: "oceania", label: "Oceania" },
];

interface FilterBarProps {
  isFiltering: boolean;
  isNearbyFilterActive: boolean;
  isLocationFiltering: boolean;
  selectedRegions: string[];
  proximityRadius: number;
  userCoordinates: {latitude: number, longitude: number} | null;
  togglePopularFilter: () => void;
  toggleNearbyFilter: () => void;
  toggleLocationFilter: () => void;
  toggleRegion: (region: string) => void;
  handleRadiusChange: (value: number[]) => void;
  viewMode: 'swipe' | 'grid';
  setViewMode: (mode: 'swipe' | 'grid') => void;
  forceShowPopup: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  isFiltering,
  isNearbyFilterActive,
  isLocationFiltering,
  selectedRegions,
  proximityRadius,
  userCoordinates,
  togglePopularFilter,
  toggleNearbyFilter,
  toggleLocationFilter,
  toggleRegion,
  handleRadiusChange,
  viewMode,
  setViewMode,
  forceShowPopup
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant={isFiltering ? "default" : "outline"} 
        onClick={togglePopularFilter}
        className="flex items-center gap-2"
      >
        <Flame size={16} className={isFiltering ? "text-white" : ""} />
        <span>Popular</span>
      </Button>
      
      <Button 
        variant={isNearbyFilterActive ? "default" : "outline"}
        onClick={toggleNearbyFilter}
        className="flex items-center gap-2"
        disabled={!userCoordinates}
      >
        <MapPin size={16} className={isNearbyFilterActive ? "text-white" : ""} />
        <span>Nearby</span>
      </Button>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant={isLocationFiltering ? "default" : "outline"} 
            className="flex items-center gap-2"
          >
            <Globe size={16} className={isLocationFiltering ? "text-white" : ""} />
            <span>Regions</span>
            {selectedRegions.length > 0 && (
              <Badge variant="outline" className="ml-1 bg-background text-foreground">
                {selectedRegions.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <Command>
            <CommandInput placeholder="Search regions..." />
            <CommandList>
              <CommandEmpty>No region found.</CommandEmpty>
              <CommandGroup>
                {regions.map((region) => (
                  <CommandItem
                    key={region.value}
                    onSelect={() => toggleRegion(region.value)}
                    className="flex items-center justify-between"
                  >
                    <span>{region.label}</span>
                    {selectedRegions.includes(region.value) && (
                      <Badge className="ml-auto bg-love-500">Selected</Badge>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <div className="border-t p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium">Selected regions: {selectedRegions.length}</span>
                {selectedRegions.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => selectedRegions.forEach(region => toggleRegion(region))}
                    className="h-auto p-1"
                  >
                    <X size={14} />
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {selectedRegions.map(region => {
                  const regionLabel = regions.find(r => r.value === region)?.label || region;
                  return (
                    <Badge 
                      key={region} 
                      variant="secondary"
                      className="flex gap-1 items-center"
                    >
                      {regionLabel}
                      <X 
                        size={12} 
                        className="cursor-pointer"
                        onClick={() => toggleRegion(region)}
                      />
                    </Badge>
                  );
                })}
              </div>
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => selectedRegions.forEach(region => toggleRegion(region))}
                >
                  Clear All
                </Button>
                <Button 
                  size="sm"
                  onClick={toggleLocationFilter}
                  disabled={selectedRegions.length === 0}
                >
                  Apply Filter
                </Button>
              </div>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
      
      {isNearbyFilterActive && userCoordinates && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <span>{proximityRadius}km</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <h4 className="font-medium">Proximity Radius</h4>
              <div className="flex flex-col space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs">5km</span>
                  <span className="text-xs">500km</span>
                </div>
                <Slider
                  value={[proximityRadius]}
                  min={5}
                  max={500}
                  step={5}
                  onValueChange={handleRadiusChange}
                />
                <div className="flex justify-center mt-2">
                  <span className="text-sm font-medium">{proximityRadius}km</span>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
      
      <Button
        variant="outline"
        className="bg-love-50 text-love-700 border-love-200 hover:bg-love-100"
        onClick={forceShowPopup}
      >
        <Rocket size={16} className="mr-2" />
        Boost Profile
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "rounded-full",
          viewMode === 'grid' && "bg-love-50 border-love-200"
        )}
        onClick={() => setViewMode(viewMode === 'swipe' ? 'grid' : 'swipe')}
      >
        <UserSearch size={16} />
      </Button>
    </div>
  );
};

export default FilterBar;
