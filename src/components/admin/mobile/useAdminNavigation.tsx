
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';

export const useAdminNavigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const navigate = useNavigate();
  const { logout } = useUser();
  
  useEffect(() => {
    const handleTabChange = (event: CustomEvent<string>) => {
      if (event.detail) {
        setActiveTab(event.detail);
      }
    };
    
    window.addEventListener('setAdminTab', handleTabChange as EventListener);
    return () => {
      window.removeEventListener('setAdminTab', handleTabChange as EventListener);
    };
  }, []);
  
  const handleTabChangeEvent = (tab: string) => {
    window.dispatchEvent(new CustomEvent('setAdminTab', { detail: tab }));
  };
  
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
  
  return {
    menuOpen,
    setMenuOpen,
    activeTab,
    setActiveTab,
    navigate,
    handleTabChangeEvent,
    handleLogout,
    handleExitAdmin
  };
};
