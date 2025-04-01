
import React from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={cn("py-6 border-t border-love-100 bg-background z-10", className)}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Heart size={20} className="text-love-500 fill-love-500" />
            <span className="font-display text-lg font-medium">LoveQuest</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Finding your perfect match with the power of AI
          </div>
          
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LoveQuest. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
