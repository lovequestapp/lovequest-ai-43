
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile, useBreakpoint } from '@/hooks/use-mobile';
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Menu, Users, BarChart2, Settings, LogOut, FileText, Bell } from 'lucide-react';

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
    // Add CSS to hide export/import buttons using multiple selectors to be more robust
    style.textContent = `
      /* TEST CHANGE - OBVIOUS VISUAL CHANGE */
      .admin-dashboard {
        background-color: #f0f8ff !important;
      }
      
      /* Hide by data attribute if present */
      .admin-dashboard button:has([data-export-users]),
      .admin-dashboard button:has([data-import-users]),
      /* Hide by text content as fallback */
      .admin-dashboard button:has(span:contains("Export Users")),
      .admin-dashboard button:has(span:contains("Import Users")),
      /* Hide by class if they use specific classes */
      .admin-dashboard .export-users-btn,
      .admin-dashboard .import-users-btn,
      /* Hide any button that contains Export/Import in its text */
      .admin-dashboard button:contains("Export"),
      .admin-dashboard button:contains("Import") {
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
    <div className="min-h-screen flex w-full overflow-hidden bg-muted/20">
      {/* Mobile Admin Dashboard Layout */}
      <div 
        className={cn(
          "admin-dashboard relative flex-1",
          scrollable ? "overflow-y-auto" : "",
          preventOverflow ? "max-w-[100vw] overflow-x-hidden" : "",
          breakpoint === 'xs' ? "pb-20" : "pb-16", // Extra bottom padding for mobile toolbar
          className
        )}
      >
        {/* Header for mobile */}
        {isMobile && (
          <div className="sticky top-0 z-10 w-full bg-background shadow-sm border-b p-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Admin Dashboard - TEST CHANGE</h1>
              <Menu className="h-6 w-6" />
            </div>
          </div>
        )}
        
        {/* Main content area */}
        <div className={cn(
          "w-full",
          fullWidth ? "w-full" : "container mx-auto",
          padding ? "px-3 py-3 sm:px-4 sm:py-4" : ""
        )}>
          {/* Admin Cards Section */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="bg-white rounded-lg shadow-sm p-3 border flex flex-col items-center justify-center text-center">
              <Users className="h-8 w-8 text-primary mb-1" />
              <h3 className="text-sm font-medium">Users</h3>
              <p className="text-2xl font-bold">1,245</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-3 border flex flex-col items-center justify-center text-center">
              <Bell className="h-8 w-8 text-accent mb-1" />
              <h3 className="text-sm font-medium">Alerts</h3>
              <p className="text-2xl font-bold">18</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-3 border flex flex-col items-center justify-center text-center">
              <BarChart2 className="h-8 w-8 text-love-500 mb-1" />
              <h3 className="text-sm font-medium">Matches</h3>
              <p className="text-2xl font-bold">843</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-3 border flex flex-col items-center justify-center text-center">
              <FileText className="h-8 w-8 text-passion-500 mb-1" />
              <h3 className="text-sm font-medium">Reports</h3>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>
          
          {children}
        </div>
      </div>
      
      {/* Bottom navigation for mobile */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-card shadow-lg border-t z-50 admin-mobile-nav">
          <div className="flex justify-around items-center p-2">
            <button className="flex flex-col items-center justify-center p-2 text-primary">
              <Users className="h-5 w-5" />
              <span className="text-xs mt-1">Users</span>
            </button>
            <button className="flex flex-col items-center justify-center p-2 text-muted-foreground">
              <BarChart2 className="h-5 w-5" />
              <span className="text-xs mt-1">Stats</span>
            </button>
            <button className="flex flex-col items-center justify-center p-2 text-muted-foreground">
              <Settings className="h-5 w-5" />
              <span className="text-xs mt-1">Settings</span>
            </button>
            <button className="flex flex-col items-center justify-center p-2 text-muted-foreground">
              <LogOut className="h-5 w-5" />
              <span className="text-xs mt-1">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMobileContainer;
