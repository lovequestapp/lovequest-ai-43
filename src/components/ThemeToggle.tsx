
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center justify-center"
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-love-500" />
      ) : (
        <Sun className="h-5 w-5 text-love-500" />
      )}
      <span className="sr-only">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
    </Button>
  );
};

export default ThemeToggle;
