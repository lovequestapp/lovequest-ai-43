
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DiscoverContent from './DiscoverContent';

const Discover = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <DiscoverContent />
      <Footer />
    </div>
  );
};

export default Discover;
