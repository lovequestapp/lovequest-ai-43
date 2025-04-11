
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center mr-auto pl-0">
      <Heart className="h-6 w-6 text-love-500 mr-2" />
      <h1 className="text-lg md:text-xl font-bold text-love-600 dark:text-love-400 font-display">LoveQuest</h1>
    </Link>
  );
};

export default Logo;
