
import React, { ReactNode } from 'react';

interface MobileContainerProps {
  children: ReactNode;
  scrollable?: boolean;
  padding?: boolean;
  className?: string;
  fullWidth?: boolean; // Added fullWidth prop
}

const MobileContainer: React.FC<MobileContainerProps> = ({
  children,
  scrollable = false,
  padding = false,
  className = "",
  fullWidth = false, // Default to false for backward compatibility
}) => {
  return (
    <div className={`mx-auto ${fullWidth ? 'w-full' : 'max-w-md'} h-full bg-white shadow-md flex flex-col`}>
      <div
        className={`flex-1 ${scrollable ? 'overflow-y-auto' : ''} ${
          padding ? 'p-4' : ''
        } ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default MobileContainer;
