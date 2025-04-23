
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DiscoverFilters from '@/pages/discover/DiscoverFilters';

interface MobileFilterDisclosureProps {
  preferences: any; // Keep as any since UserPreferences type is complex, or import it if needed
  onPreferencesChange: (preferences: any) => void;
  onApplyFilters: () => void;
}

const MobileFilterDisclosure: React.FC<MobileFilterDisclosureProps> = ({
  preferences,
  onPreferencesChange,
  onApplyFilters,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="sm:hidden mb-4">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </Button>
      {showFilters && (
        <Card className="mt-4 max-w-screen-sm mx-auto">
          <CardContent>
            <DiscoverFilters
              className="p-0"
              preferences={preferences}
              onPreferencesChange={onPreferencesChange}
              onApplyFilters={() => {
                onApplyFilters();
                setShowFilters(false);
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MobileFilterDisclosure;
