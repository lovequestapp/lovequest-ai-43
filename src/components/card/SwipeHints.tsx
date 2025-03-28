
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface SwipeHintsProps {
  hints: {
    swipeRight: string;
    swipeLeft: string;
  };
}

const SwipeHints: React.FC<SwipeHintsProps> = ({ hints }) => {
  return (
    <>
      {/* Swipe hint arrows */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4 text-muted-foreground/30 hidden md:block">
        <ArrowLeft size={32} />
        <div className="mt-2 text-xs font-medium text-center">PASS</div>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-4 text-love-400/30 hidden md:block">
        <ArrowRight size={32} />
        <div className="mt-2 text-xs font-medium text-center">LIKE</div>
      </div>
    </>
  );
};

export default SwipeHints;
