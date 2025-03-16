
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile, useBreakpoint } from '@/hooks/use-mobile';
import { Menu, Users, BarChart2, Settings, LogOut, FileText, Bell, Home, X, ChevronRight } from 'lucide-react';

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
  const [menuOpen, setMenuOpen] = useState(false);
  
  console.log("AdminMobileContainer is rendering - Production Ready");
  
  // Hide export/import buttons
  useEffect(() => {
    // Create a style element
    const style = document.createElement('style');
    style.textContent = `
      /* Hide export/import buttons */
      .admin-dashboard button:has([data-export-users]),
      .admin-dashboard button:has([data-import-users]),
      .admin-dashboard button:has(span:contains("Export Users")),
      .admin-dashboard button:has(span:contains("Import Users")),
      .admin-dashboard .export-users-btn,
      .admin-dashboard .import-users-btn,
      .admin-dashboard button:contains("Export"),
      .admin-dashboard button:contains("Import") {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Side drawer menu for mobile
  const MobileMenu = () => {
    if (!menuOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 z-50 animate-fadeIn">
        <div className="absolute top-0 left-0 h-full w-3/4 max-w-xs bg-white shadow-xl animate-slideInLeft">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="font-bold text-lg">Admin Menu</h2>
            <button onClick={() => setMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-2">
            <NavItem icon={<Home />} label="Dashboard" active />
            <NavItem icon={<Users />} label="Users" />
            <NavItem icon={<BarChart2 />} label="Analytics" />
            <NavItem icon={<Bell />} label="Notifications" />
            <NavItem icon={<Settings />} label="Settings" />
            <NavItem icon={<LogOut />} label="Logout" />
          </div>
        </div>
      </div>
    );
  };
  
  const NavItem = ({ icon, label, active = false }) => (
    <div className={cn(
      "flex items-center p-3 rounded-lg mb-1 cursor-pointer",
      active ? "bg-blue-500 text-white" : "hover:bg-gray-100"
    )}>
      <div className="mr-3">{icon}</div>
      <span>{label}</span>
      <ChevronRight className="h-4 w-4 ml-auto" />
    </div>
  );
  
  return (
    <div className="min-h-screen flex w-full overflow-hidden bg-gray-50">
      {/* Mobile Menu Overlay */}
      <MobileMenu />
      
      {/* Main Content */}
      <div 
        className={cn(
          "admin-dashboard relative flex-1",
          scrollable ? "overflow-y-auto" : "",
          preventOverflow ? "max-w-[100vw] overflow-x-hidden" : "",
          breakpoint === 'xs' ? "pb-20" : "pb-16",
          className
        )}
      >
        {/* Header for mobile */}
        {isMobile && (
          <div className="sticky top-0 z-10 w-full bg-white shadow-md border-b p-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
              <button 
                onClick={() => setMenuOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Menu className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        )}
        
        {/* Main content area */}
        <div className={cn(
          "w-full",
          fullWidth ? "w-full" : "container mx-auto",
          padding ? "px-3 py-3 sm:px-4 sm:py-4" : ""
        )}>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <StatCard icon={<Users className="h-8 w-8 text-blue-500" />} title="Users" value="1,245" />
            <StatCard icon={<Bell className="h-8 w-8 text-blue-500" />} title="Alerts" value="18" />
            <StatCard icon={<BarChart2 className="h-8 w-8 text-blue-500" />} title="Matches" value="843" />
            <StatCard icon={<FileText className="h-8 w-8 text-blue-500" />} title="Reports" value="24" />
          </div>
          
          {children}
        </div>
      </div>
      
      {/* Bottom navigation for mobile */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t z-40">
          <div className="flex justify-around items-center">
            <BottomNavItem icon={<Home className="h-5 w-5" />} label="Home" active />
            <BottomNavItem icon={<Users className="h-5 w-5" />} label="Users" />
            <BottomNavItem icon={<BarChart2 className="h-5 w-5" />} label="Stats" />
            <BottomNavItem icon={<Settings className="h-5 w-5" />} label="Settings" />
          </div>
        </div>
      )}
    </div>
  );
};

// Helper components
const StatCard = ({ icon, title, value }) => (
  <div className="bg-white rounded-lg shadow-sm p-3 border flex flex-col items-center justify-center text-center">
    <div className="mb-1">{icon}</div>
    <h3 className="text-sm font-medium text-gray-600">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const BottomNavItem = ({ icon, label, active = false }) => (
  <button className={cn(
    "flex flex-col items-center justify-center py-3 px-2 w-full",
    active ? "text-blue-500" : "text-gray-500 hover:text-blue-400"
  )}>
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

export default AdminMobileContainer;
