
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import MobileToolbar from './MobileToolbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow pb-16 md:pb-0">{children}</main>
      <MobileToolbar />
      <Footer />
    </div>
  );
};
