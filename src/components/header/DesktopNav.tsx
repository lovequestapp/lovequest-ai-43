
import React from 'react';
import NavItems from './NavItems';

interface DesktopNavProps {
  isAuthenticated: boolean;
}

const DesktopNav = ({ isAuthenticated }: DesktopNavProps) => {
  return (
    <nav className="hidden md:flex items-center space-x-1">
      <NavItems isAuthenticated={isAuthenticated} />
    </nav>
  );
};

export default DesktopNav;
