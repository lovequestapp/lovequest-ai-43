
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile, useBreakpoint } from '@/hooks/use-mobile';

interface AdminMobileContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  scrollable?: boolean;
  padding?: boolean;
  preventOverflow?: boolean;
}

const AdminMobileContainer = ({
  children,
  className,
  fullWidth = false,
  scrollable = true,
  padding = true,
  preventOverflow = true,
}: AdminMobileContainerProps) => {
  const isMobile = useIsMobile();
  const breakpoint = useBreakpoint();
  
  return (
    <div 
      className={cn(
        "admin-dashboard relative",
        fullWidth ? "w-full" : "container mx-auto",
        scrollable ? "admin-content-scroll" : "",
        padding ? "px-2 sm:px-4 py-3 sm:py-4" : "",
        isMobile && preventOverflow ? "max-w-[100vw] overflow-x-hidden" : "",
        breakpoint === 'xs' ? "pb-20" : "pb-16", // Extra bottom padding for mobile toolbar
        className
      )}
    >
      {children}
    </div>
  );
};

export default AdminMobileContainer;
