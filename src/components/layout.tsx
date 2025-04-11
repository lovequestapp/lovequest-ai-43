
import React from 'react';
import Header from './header/Header';
import Footer from './Footer';
import MobileToolbar from './MobileToolbar';

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
  hideHeader?: boolean;
  hideMobileToolbar?: boolean;
  headerOnly?: boolean;
  footerOnly?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  hideFooter = false, 
  hideHeader = false,
  hideMobileToolbar = false,
  headerOnly = false,
  footerOnly = false
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      {!hideHeader && <Header />}
      <main className="flex-grow pb-16 md:pb-0">{children}</main>
      {!hideMobileToolbar && !headerOnly && <MobileToolbar />}
      {!hideFooter && !headerOnly && <Footer />}
    </div>
  );
};
