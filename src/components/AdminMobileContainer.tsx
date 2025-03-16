
import React, { useEffect } from 'react';
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
  
  // Add a style to hide export/import buttons
  useEffect(() => {
    // Create a style element
    const style = document.createElement('style');
    // Add CSS to hide export/import buttons
    style.textContent = `
      .admin-dashboard button:has([data-export-users]),
      .admin-dashboard button:has([data-import-users]) {
        display: none !important;
      }
    `;
    // Append the style to the document head
    document.head.appendChild(style);

    // Cleanup function
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
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
