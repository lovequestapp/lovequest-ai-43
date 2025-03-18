import React, { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile, useBreakpoint } from '@/hooks/use-mobile';
import { Menu, Users, BarChart2, Settings, LogOut, FileText, Bell, Home, X, ChevronRight, Edit, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";

interface AdminMobileContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  scrollable?: boolean;
  padding?: boolean;
  preventOverflow?: boolean;
}

// Define the extended props for admin tables
interface AdminTableProps {
  editingUser?: number | null;
  userFormData?: any;
  onEditUser?: (userId: number, userData: any) => void;
  onSaveUser?: (userId: number) => void;
  onCancelEdit?: () => void;
  className?: string;
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
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [userFormData, setUserFormData] = useState({});
  
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
      
      /* Smooth transitions for edit mode */
      .edit-transition {
        transition: all 0.3s ease-in-out;
      }
      
      /* Prevent layout shifts during editing */
      .admin-table-row {
        min-height: 64px;
      }
      
      /* Admin form styling */
      .admin-form input,
      .admin-form select,
      .admin-form textarea {
        height: 42px !important;
        padding: 0.75rem 1rem !important;
        font-size: 1rem !important;
        border-radius: 0.5rem !important;
        width: 100% !important;
      }
      
      .admin-form .form-group,
      .admin-form .form-field {
        margin-bottom: 1rem !important;
      }
      
      .admin-form label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #374151;
      }
      
      /* Add user form styling */
      .add-user-form {
        background: white;
        padding: 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        margin-bottom: 2rem;
      }
      
      .add-user-form h3 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        font-size: 1.25rem;
        font-weight: 600;
        color: #111827;
      }
      
      /* Form grid for better layout */
      .form-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      @media (min-width: 640px) {
        .form-grid {
          grid-template-columns: 1fr 1fr;
        }
      }
      
      @media (min-width: 1024px) {
        .form-grid {
          grid-template-columns: 1fr 1fr 1fr;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Enhanced edit mode handlers
  const handleEditUser = useCallback((userId: number, userData: any) => {
    // Prevent multiple edit sessions
    if (editingUser !== null) {
      handleCancelEdit();
    }
    
    setEditingUser(userId);
    setUserFormData(userData);
    // Add smooth animation class to the edited row
    const row = document.querySelector(`[data-user-id="${userId}"]`);
    if (row) {
      row.classList.add('edit-transition');
    }
  }, [editingUser]);
  
  const handleSaveUser = useCallback((userId: number) => {
    // Here you would typically save to API
    // For now, we'll just simulate success
    
    setTimeout(() => {
      setEditingUser(null);
      setUserFormData({});
      toast.success("User updated successfully");
      
      // Remove animation class
      const row = document.querySelector(`[data-user-id="${userId}"]`);
      if (row) {
        row.classList.remove('edit-transition');
      }
    }, 300);
  }, []);
  
  const handleCancelEdit = useCallback(() => {
    const row = document.querySelector(`[data-user-id="${editingUser}"]`);
    if (row) {
      row.classList.remove('edit-transition');
    }
    
    setEditingUser(null);
    setUserFormData({});
  }, [editingUser]);
  
  // Side drawer menu for mobile
  const MobileMenu = () => {
    if (!menuOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 z-50 animate-fadeIn" onClick={() => setMenuOpen(false)}>
        <div className="absolute top-0 left-0 h-full w-3/4 max-w-xs bg-white shadow-xl animate-slideInLeft" onClick={e => e.stopPropagation()}>
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
  
  // Enhance input fields in any forms within AdminMobileContainer
  const enhanceInputs = (node: React.ReactNode): React.ReactNode => {
    if (!React.isValidElement(node)) {
      return node;
    }
    
    // If it's an Input component, add the large prop
    if (node.type === Input) {
      return React.cloneElement(node, { large: true });
    }
    
    // If it has children, recursively enhance them
    if (node.props.children) {
      const children = React.Children.map(node.props.children, enhanceInputs);
      return React.cloneElement(node, {}, children);
    }
    
    return node;
  };
  
  // Create modified children with edit functionality and enhanced inputs
  const enhancedChildren = React.Children.map(children, child => {
    if (!React.isValidElement(child)) {
      return child;
    }
    
    let enhancedChild = child;
    
    // Check if it's an admin table that needs edit functionality
    if (child.props?.className?.includes('admin-table')) {
      enhancedChild = React.cloneElement(child, {
        editingUser,
        userFormData,
        onEditUser: handleEditUser,
        onSaveUser: handleSaveUser,
        onCancelEdit: handleCancelEdit,
      } as AdminTableProps);
    }
    
    // Add admin-form class to forms within the container
    if (child.props?.className?.includes('form') || 
        child.type === 'form' || 
        (typeof child.type === 'string' && child.type.toLowerCase() === 'form')) {
      const newClassName = `${child.props.className || ''} admin-form`;
      enhancedChild = React.cloneElement(enhancedChild, { className: newClassName });
    }
    
    // Enhance inputs recursively
    return enhanceInputs(enhancedChild);
  });
  
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
          
          {/* Pass the enhanced children with edit functionality */}
          {enhancedChildren}
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
      
      {/* Edit mode indicators */}
      {editingUser !== null && (
        <div className="fixed bottom-16 right-4 p-4 bg-white shadow-lg rounded-lg z-50 flex space-x-3">
          <button 
            onClick={() => handleSaveUser(editingUser)}
            className="flex items-center justify-center p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
          >
            <Save className="h-5 w-5" />
          </button>
          <button 
            onClick={handleCancelEdit}
            className="flex items-center justify-center p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
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
