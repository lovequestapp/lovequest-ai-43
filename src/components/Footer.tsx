
import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-6 border-t border-love-100 fixed bottom-0 left-0 right-0 bg-background z-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Heart size={20} className="text-love-500 fill-love-500" />
            <span className="font-display text-lg font-medium">AAE Love</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Finding your perfect match with the power of AI
          </div>
          
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Adam & Eve. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
