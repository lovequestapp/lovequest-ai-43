
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun } from 'lucide-react';

const ThemeToggle = () => {
  // Since the app is using light mode only, this is purely decorative
  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center justify-center"
      aria-label="Theme"
    >
      <Sun className="h-5 w-5 text-love-500" />
      <span className="sr-only">Light Mode</span>
    </Button>
  );
};

export default ThemeToggle;
