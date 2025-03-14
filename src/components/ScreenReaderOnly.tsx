
import React from 'react';

type ScreenReaderOnlyProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * A component that visually hides content but keeps it accessible to screen readers
 */
const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <span 
      className={`sr-only ${className}`} 
      aria-live="polite"
    >
      {children}
    </span>
  );
};

export default ScreenReaderOnly;
