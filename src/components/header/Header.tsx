
import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useIsMobile } from '@/hooks/use-mobile';
import ThemeToggle from '../ThemeToggle';
import Logo from './Logo';
import DesktopNav from './DesktopNav';
import NotificationsMenu from './NotificationsMenu';
import UserMenu from './UserMenu';
import AuthButtons from './AuthButtons';
import MobileMenu from './MobileMenu';

const Header = () => {
  const { isAuthenticated } = useUser();
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  return (
    <header className="border-b py-3 px-4 bg-white shadow-sm sticky top-0 z-50 dark:bg-slate-900/90 dark:border-slate-800">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        <DesktopNav isAuthenticated={isAuthenticated} />

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <>
              <NotificationsMenu />
              <UserMenu />
            </>
          ) : (
            <AuthButtons />
          )}

          <MobileMenu open={drawerOpen} onOpenChange={setDrawerOpen} />
        </div>
      </div>
    </header>
  );
};

export default Header;
