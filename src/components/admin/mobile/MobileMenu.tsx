
import React from 'react';
import { Heart, X, Home, Users, Calendar, MessageSquare, BarChart2, Settings, LogOut, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from 'react-router-dom';
import NavItem from './NavItem';
import { useUser } from '@/context/UserContext';

interface MobileMenuProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  handleExitAdmin: () => void;
  handleLogout: () => void;
  location: any;
}

const MobileMenu = ({ menuOpen, setMenuOpen, handleExitAdmin, handleLogout, location }: MobileMenuProps) => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  
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

export default MobileMenu;
