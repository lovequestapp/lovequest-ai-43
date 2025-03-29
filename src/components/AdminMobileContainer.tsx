
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile, useBreakpoint } from '@/hooks/use-mobile';
import { Menu, Users, BarChart2, Settings, LogOut, FileText, Bell, Home, X, ChevronRight, Edit, Save, Heart, Calendar, Search, MessageSquare, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';

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
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout, updateUserData } = useUser();
  
  // Hide export/import buttons and fix overflow
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
      
      /* Fix horizontal overflow issues */
      .admin-dashboard {
        max-width: 100vw !important;
        overflow-x: hidden !important;
      }
      
      /* Fix tables on mobile */
      .admin-table-container {
        max-width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
      
      .admin-horizontal-scroll {
        max-width: 100%;
        padding-left: 0;
        padding-right: 0;
      }
      
      /* Adjust responsive grid layouts */
      .admin-stats-grid {
        width: 100%;
        grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
        gap: 12px;
      }
      
      /* Fix overflowing content */
      .admin-card, .admin-panel {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
      }
      
      /* Truncate long text */
      .truncate-text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      /* Luxury styling */
      .luxury-card {
        background: linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(249,246,251,1) 100%);
        border: 1px solid rgba(237, 233, 254, 0.5);
        box-shadow: 0 10px 25px -5px rgba(215, 187, 247, 0.1), 0 8px 10px -6px rgba(166, 108, 212, 0.05);
        border-radius: 16px;
        transition: all 0.3s ease;
      }
      
      .luxury-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 30px -8px rgba(215, 187, 247, 0.2), 0 10px 15px -3px rgba(166, 108, 212, 0.1);
      }
      
      .luxury-gradient {
        background: linear-gradient(135deg, var(--love-200), var(--passion-200));
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
        border-radius: 0.75rem !important;
        width: 100% !important;
        border-color: rgba(226, 213, 250, 0.5) !important;
        background-color: rgba(255, 255, 255, 0.8) !important;
        transition: all 0.2s ease !important;
      }
      
      .admin-form input:focus,
      .admin-form select:focus,
      .admin-form textarea:focus {
        border-color: rgba(226, 213, 250, 0.8) !important;
        box-shadow: 0 0 0 2px rgba(226, 213, 250, 0.25) !important;
        background-color: white !important;
      }
      
      .admin-form .form-group,
      .admin-form .form-field {
        margin-bottom: 1.25rem !important;
      }
      
      .admin-form label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: var(--love-800);
      }
      
      /* Add user form styling */
      .add-user-form {
        background: rgba(255,255,255,0.9);
        backdrop-filter: blur(10px);
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 10px 25px -5px rgba(215, 187, 247, 0.1), 0 8px 10px -6px rgba(166, 108, 212, 0.05);
        border: 1px solid rgba(237, 233, 254, 0.5);
        margin-bottom: 2rem;
      }
      
      .add-user-form h3 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        font-size: 1.25rem;
        font-weight: 600;
        background: linear-gradient(to right, var(--love-600), var(--passion-600));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
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
      
      /* Table styling */
      .luxury-table {
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid rgba(243, 232, 255, 0.6);
      }
      
      .luxury-table thead tr {
        background: linear-gradient(to right, var(--love-50), var(--passion-50));
      }
      
      .luxury-table th {
        font-weight: 600;
        color: var(--love-800);
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.05em;
        padding: 12px 16px;
      }
      
      .luxury-table tr {
        border-bottom: 1px solid rgba(243, 232, 255, 0.4);
        transition: background-color 0.2s ease;
      }
      
      .luxury-table tr:hover {
        background-color: rgba(254, 242, 254, 0.5);
      }
      
      .luxury-table td {
        padding: 12px 16px;
      }
      
      /* Button enhancements */
      .btn-luxury {
        background: linear-gradient(to right, var(--love-500), var(--passion-500));
        border: none;
        color: white;
        font-weight: 500;
        padding: 10px 16px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(236, 72, 153, 0.15);
      }
      
      .btn-luxury:hover {
        box-shadow: 0 6px 16px rgba(236, 72, 153, 0.25);
        transform: translateY(-1px);
      }
      
      /* Exit Admin Button */
      .exit-admin {
        position: fixed;
        bottom: 80px;
        right: 16px;
        z-index: 999;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #ec4899, #8b5cf6);
        color: white;
        box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .exit-admin:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
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
    // Apply the actual update to the user data using the context function
    if (userFormData) {
      // Convert the userId to string since our User type uses string IDs
      updateUserData(String(userId), userFormData);
    }
    
    setEditingUser(null);
    setUserFormData({});
    toast.success("User updated successfully", {
      description: "The user's information has been saved"
    });
    
    // Remove animation class
    const row = document.querySelector(`[data-user-id="${userId}"]`);
    if (row) {
      row.classList.remove('edit-transition');
    }
    
    // Allow click events after a short delay
    setTimeout(() => {
      document.body.style.pointerEvents = 'auto';
    }, 300);
  }, [userFormData, updateUserData]);
  
  const handleCancelEdit = useCallback(() => {
    const row = document.querySelector(`[data-user-id="${editingUser}"]`);
    if (row) {
      row.classList.remove('edit-transition');
    }
    
    setEditingUser(null);
    setUserFormData({});
    
    // Allow click events again
    document.body.style.pointerEvents = 'auto';
  }, [editingUser]);
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      logout();
      toast.success("Logged out successfully");
      navigate('/login');
    } catch (error) {
      toast.error("Failed to log out");
    }
  };
  
  const handleExitAdmin = () => {
    navigate('/discover');
    toast.success("Exited admin mode");
  };
  
  // Side drawer menu for mobile
  const MobileMenu = () => {
    if (!menuOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn" onClick={() => setMenuOpen(false)}>
        <div className="absolute top-0 left-0 h-full w-3/4 max-w-xs bg-white shadow-xl animate-slideInLeft" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between p-4 border-b border-love-100 bg-gradient-to-r from-love-50 to-passion-50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-love flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <h2 className="font-bold text-lg text-love-800">Admin Panel</h2>
            </div>
            <button onClick={() => setMenuOpen(false)} className="p-2 rounded-full hover:bg-white/30">
              <X className="h-5 w-5 text-love-700" />
            </button>
          </div>
          
          <div className="p-2 mt-2">
            <div className="mb-4 px-2">
              <div className="flex items-center gap-3 p-3 bg-love-50 rounded-lg">
                <Avatar>
                  <AvatarImage src="https://i.pravatar.cc/150?u=admin" />
                  <AvatarFallback className="bg-love-200 text-love-700">
                    {currentUser?.name?.substring(0, 2).toUpperCase() || 'AD'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-love-900">{currentUser?.name || 'Admin User'}</div>
                  <div className="text-xs text-love-600">{currentUser?.email || 'admin@example.com'}</div>
                </div>
              </div>
            </div>
            <NavItem 
              icon={<Home />} 
              label="Dashboard" 
              active={location.pathname === '/admin'} 
              onClick={() => {
                navigate('/admin');
                setMenuOpen(false);
              }}
            />
            <NavItem 
              icon={<Users />} 
              label="User Management" 
              active={location.pathname === '/admin/users'} 
              onClick={() => {
                navigate('/admin');
                setMenuOpen(false);
                // Set active tab to users
                window.dispatchEvent(new CustomEvent('setAdminTab', { detail: 'users' }));
              }}
            />
            <NavItem 
              icon={<Calendar />} 
              label="Subscriptions" 
              active={location.pathname === '/admin/subscriptions'} 
              onClick={() => {
                navigate('/admin');
                setMenuOpen(false);
                // Set active tab to subscriptions
                window.dispatchEvent(new CustomEvent('setAdminTab', { detail: 'subscriptions' }));
              }}
            />
            <NavItem 
              icon={<MessageSquare />} 
              label="Content Moderation" 
              active={location.pathname === '/admin/moderation'} 
              onClick={() => {
                navigate('/admin');
                setMenuOpen(false);
                // Set active tab to moderation
                window.dispatchEvent(new CustomEvent('setAdminTab', { detail: 'moderation' }));
              }}
            />
            <NavItem 
              icon={<BarChart2 />} 
              label="Analytics" 
              active={location.pathname === '/admin/analytics'} 
              onClick={() => {
                navigate('/admin');
                setMenuOpen(false);
                // Set active tab to analytics
                window.dispatchEvent(new CustomEvent('setAdminTab', { detail: 'analytics' }));
              }}
            />
            <NavItem 
              icon={<Settings />} 
              label="Settings" 
              active={location.pathname === '/admin/settings'} 
              onClick={() => {
                navigate('/admin');
                setMenuOpen(false);
                // Set active tab to settings
                window.dispatchEvent(new CustomEvent('setAdminTab', { detail: 'settings' }));
              }}
            />
            
            <div className="px-2 mt-2 pt-2">
              <NavItem 
                icon={<Home />} 
                label="Exit to App" 
                onClick={() => {
                  handleExitAdmin();
                  setMenuOpen(false);
                }}
              />
            </div>
            
            <div className="border-t border-love-100 mt-2 pt-2">
              <NavItem 
                icon={<LogOut />} 
                label="Logout" 
                danger 
                onClick={handleLogout}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const NavItem = ({ icon, label, active = false, danger = false, onClick }) => (
    <div 
      className={cn(
        "flex items-center p-3 rounded-lg mb-1.5 cursor-pointer transition-all duration-200",
        active ? "bg-gradient-to-r from-love-500 to-passion-500 text-white shadow-md shadow-love-200" : 
        danger ? "text-red-600 hover:bg-red-50" :
        "hover:bg-love-50 text-love-800"
      )}
      onClick={onClick}
    >
      <div className={cn("mr-3", active ? "text-white" : danger ? "text-red-500" : "text-love-600")}>{icon}</div>
      <span className={cn(active ? "font-medium" : "")}>{label}</span>
      <ChevronRight className={cn("h-4 w-4 ml-auto", active ? "text-white" : danger ? "text-red-400" : "text-love-400")} />
    </div>
  );
  
  // Enhance input fields in any forms within AdminMobileContainer
  const enhanceInputs = (node: React.ReactNode): React.ReactNode => {
    if (!React.isValidElement(node)) {
      return node;
    }
    
    // If it's an Input component, add the large prop
    if (node.type === Input) {
      // Fixed TypeScript error by using proper typing for the props
      return React.cloneElement(node as React.ReactElement<any>, { 
        ...node.props,
        large: true 
      });
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
      // Fixed TypeScript error using proper typing
      enhancedChild = React.cloneElement(child as React.ReactElement<any>, {
        ...child.props,
        editingUser,
        userFormData,
        onEditUser: handleEditUser,
        onSaveUser: handleSaveUser,
        onCancelEdit: handleCancelEdit,
      });
    }
    
    // Add admin-form class to forms within the container
    if (child.props?.className?.includes('form') || 
        child.type === 'form' || 
        (typeof child.type === 'string' && child.type.toLowerCase() === 'form')) {
      // Fixed TypeScript error using proper typing
      const newClassName = `${child.props.className || ''} admin-form`;
      enhancedChild = React.cloneElement(enhancedChild as React.ReactElement<any>, { 
        ...enhancedChild.props,
        className: newClassName 
      });
    }
    
    // Enhance inputs recursively
    return enhanceInputs(enhancedChild);
  });
  
  return (
    <div className="min-h-screen flex w-full overflow-hidden bg-gradient-to-br from-white to-love-50">
      {/* Mobile Menu Overlay */}
      <MobileMenu />
      
      {/* Main Content */}
      <div 
        className={cn(
          "admin-dashboard relative flex-1",
          scrollable ? "overflow-y-auto" : "",
          "max-w-[100vw] overflow-x-hidden",
          breakpoint === 'xs' ? "pb-20" : "pb-16",
          className
        )}
      >
        {/* Header for mobile */}
        {isMobile && (
          <div className="sticky top-0 z-10 w-full bg-white/80 backdrop-blur-md shadow-md border-b border-love-100 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-love flex items-center justify-center shadow-md">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-love-800 truncate-text">Admin Dashboard</h1>
              </div>
              <button 
                onClick={() => setMenuOpen(true)}
                className="p-2 rounded-full hover:bg-love-50/50 text-love-700"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}
        
        {/* Main content area */}
        <div className={cn(
          "w-full",
          fullWidth ? "w-full" : "max-w-full mx-auto",
          padding ? "px-3 py-3 sm:px-4 sm:py-4" : ""
        )}>
          {/* Pass the enhanced children with edit functionality */}
          {enhancedChildren}
        </div>
      </div>
      
      {/* Bottom navigation for mobile */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg border-t border-love-100 z-40">
          <div className="flex justify-around items-center">
            <BottomNavItem 
              icon={<Home className="h-5 w-5" />} 
              label="Home" 
              active={location.pathname === '/admin'} 
              onClick={() => navigate('/admin')}
            />
            <BottomNavItem 
              icon={<Users className="h-5 w-5" />} 
              label="Users" 
              active={activeTab === 'users'}
              onClick={() => {
                window.dispatchEvent(new CustomEvent('setAdminTab', { detail: 'users' }));
              }}
            />
            <BottomNavItem 
              icon={<BarChart2 className="h-5 w-5" />} 
              label="Stats" 
              active={activeTab === 'analytics'}
              onClick={() => {
                window.dispatchEvent(new CustomEvent('setAdminTab', { detail: 'analytics' }));
              }}
            />
            <BottomNavItem 
              icon={<Settings className="h-5 w-5" />} 
              label="Settings" 
              active={activeTab === 'settings'}
              onClick={() => {
                window.dispatchEvent(new CustomEvent('setAdminTab', { detail: 'settings' }));
              }}
            />
          </div>
        </div>
      )}
      
      {/* Exit to App Button (visible on all devices) */}
      <div 
        className="exit-admin" 
        title="Exit to App"
        onClick={handleExitAdmin}
      >
        <Home className="h-5 w-5" />
      </div>
      
      {/* Edit mode indicators */}
      {editingUser !== null && (
        <div className="fixed bottom-16 right-4 p-4 bg-white shadow-lg rounded-lg z-50 flex space-x-3 border border-love-100">
          <button 
            onClick={() => handleSaveUser(editingUser)}
            className="flex items-center justify-center p-2 bg-gradient-to-r from-love-500 to-passion-500 text-white rounded-full hover:shadow-md transition-all duration-200"
          >
            <Save className="h-5 w-5" />
          </button>
          <button 
            onClick={handleCancelEdit}
            className="flex items-center justify-center p-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

// Helper components
const BottomNavItem = ({ icon, label, active = false, onClick }) => (
  <button 
    className={cn(
      "flex flex-col items-center justify-center py-3 px-2 w-full transition-colors duration-200",
      active ? "text-love-600" : "text-gray-500 hover:text-love-400"
    )}
    onClick={onClick}
  >
    {icon}
    <span className="text-xs mt-1 truncate-text">{label}</span>
  </button>
);

export default AdminMobileContainer;
