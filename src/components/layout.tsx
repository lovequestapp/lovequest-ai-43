
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import MobileToolbar from './MobileToolbar';

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
  hideHeader?: boolean;
  hideMobileToolbar?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  hideFooter = false, 
  hideHeader = false,
  hideMobileToolbar = false
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {!hideHeader && <Header />}
      <main className="flex-grow pb-16 md:pb-0">{children}</main>
      {!hideMobileToolbar && <MobileToolbar />}
      {!hideFooter && <Footer />}
    </div>
  );
};
