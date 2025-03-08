
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun } from 'lucide-react';

// This component is no longer used as dark mode has been removed
const ThemeToggle = () => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      aria-label="Theme"
      disabled
    >
      <Sun className="h-5 w-5" />
      <span className="sr-only">Theme</span>
    </Button>
  );
};

export default ThemeToggle;
