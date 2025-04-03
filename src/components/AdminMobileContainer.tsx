
import React from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile, useBreakpoint } from '@/hooks/use-mobile';
import { Home } from 'lucide-react';
import { useAdminEditing } from './admin/mobile/useAdminEditing';
import { useAdminNavigation } from './admin/mobile/useAdminNavigation';
import AdminStyleProvider from './admin/mobile/AdminStyleProvider';
import MobileMenu from './admin/mobile/MobileMenu';
import MobileHeader from './admin/mobile/MobileHeader';
import MobileBottomNav from './admin/mobile/MobileBottomNav';
import EditControls from './admin/mobile/EditControls';
import ExitAdminButton from './admin/mobile/ExitAdminButton';

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
  const location = useLocation();
  
  // Custom hooks for admin functionality
  const {
    editingUser,
    userFormData,
    handleEditUser,
    handleSaveUser,
    handleCancelEdit
  } = useAdminEditing();
  
  const {
    menuOpen,
    setMenuOpen,
    activeTab,
    navigate,
    handleTabChangeEvent,
    handleLogout,
    handleExitAdmin
  } = useAdminNavigation();
  
  // Enhance children with editing capabilities
  const enhancedChildren = React.Children.map(children, child => {
    if (!React.isValidElement(child)) {
      return child;
    }
    
    let enhancedChild = child;
    
    if (child.props?.className?.includes('admin-table')) {
      enhancedChild = React.cloneElement(child as React.ReactElement<any>, {
        ...child.props,
        editingUser,
        userFormData,
        onEditUser: handleEditUser,
        onSaveUser: handleSaveUser,
        onCancelEdit: handleCancelEdit,
      });
    }
    
    if (child.props?.className?.includes('form') || 
        child.type === 'form' || 
        (typeof child.type === 'string' && child.type.toLowerCase() === 'form')) {
      const newClassName = `${child.props.className || ''} admin-form`;
      enhancedChild = React.cloneElement(enhancedChild as React.ReactElement<any>, { 
        ...enhancedChild.props,
        className: newClassName 
      });
    }
    
    return enhancedChild;
  });
  
  return (
    <div className="min-h-screen flex w-full overflow-hidden bg-gradient-to-br from-white to-love-50">
      {/* Apply admin styles */}
      <AdminStyleProvider />
      
      {/* Mobile menu */}
      <MobileMenu 
        menuOpen={menuOpen} 
        setMenuOpen={setMenuOpen} 
        handleExitAdmin={handleExitAdmin} 
        handleLogout={handleLogout}
        location={location}
      />
      
      {/* Main content */}
      <div 
        className={cn(
          "admin-dashboard relative flex-1",
          scrollable ? "overflow-y-auto" : "",
          "max-w-[100vw] overflow-x-hidden",
          breakpoint === 'xs' ? "pb-20" : "pb-16",
          className
        )}
      >
        {/* Mobile header */}
        {isMobile && <MobileHeader setMenuOpen={setMenuOpen} />}
        
        {/* Content area */}
        <div className={cn(
          "w-full",
          fullWidth ? "w-full" : "max-w-full mx-auto",
          padding ? "px-3 py-3 sm:px-4 sm:py-4" : ""
        )}>
          {enhancedChildren}
        </div>
      </div>
      
      {/* Mobile bottom navigation */}
      {isMobile && (
        <MobileBottomNav 
          activeTab={activeTab}
          location={location}
          navigate={navigate}
          handleTabChange={handleTabChangeEvent}
        />
      )}
      
      {/* Exit admin button */}
      <ExitAdminButton onClick={handleExitAdmin} />
      
      {/* Edit controls */}
      <EditControls 
        editingUser={editingUser} 
        handleSaveUser={handleSaveUser} 
        handleCancelEdit={handleCancelEdit} 
      />
    </div>
  );
};

export default AdminMobileContainer;
