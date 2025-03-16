
import React from 'react';
import { cn } from '@/lib/utils';

interface AdminMobileContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  scrollable?: boolean;
}

const AdminMobileContainer = ({
  children,
  className,
  fullWidth = false,
  scrollable = true,
}: AdminMobileContainerProps) => {
  return (
    <div 
      className={cn(
        "admin-dashboard",
        fullWidth ? "w-full" : "container",
        scrollable ? "admin-content-scroll" : "",
        className
      )}
    >
      {children}
    </div>
  );
};

export default AdminMobileContainer;
