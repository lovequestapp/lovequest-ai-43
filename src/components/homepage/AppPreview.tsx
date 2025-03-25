
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Smartphone, Heart } from 'lucide-react';
import AppPreviewMockup from '@/components/AppPreviewMockup';

const AppPreview = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 max-w-xl">
            <div className="inline-flex items-center px-4 py-2 bg-love-50 rounded-full">
              <Smartphone size={18} className="text-love-500 mr-2" />
              <span className="text-sm font-medium text-love-700">App Preview</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Experience Love in Your <span className="bg-gradient-love text-transparent bg-clip-text">Pocket</span>
            </h2>
            
            <p className="text-lg text-gray-700">
              Our beautifully designed app puts meaningful connections at your fingertips. With thoughtful features and an intuitive interface, finding love has never been more seamless.
            </p>
            
            <ul className="space-y-3">
              {['AI-powered matching', 'Secure messaging', 'Date planning tools', 'Profile verification'].map((feature, index) => (
                <li key={index} className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-love-100 flex items-center justify-center mr-3">
                    <Heart size={14} className="text-love-500" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="pt-4">
              <Link to="/signup">
                <Button className="bg-gradient-love hover:opacity-90 rounded-full">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex justify-center items-center relative py-10">
            {/* Decorative elements */}
            <div className="absolute -z-10 w-72 h-72 bg-love-100 rounded-full blur-3xl opacity-30 animate-pulse-heart"></div>
            <div className="absolute -z-10 w-64 h-64 bg-passion-100 rounded-full blur-3xl opacity-30 -bottom-10 -right-10"></div>
            
            {/* iPhone Mockup */}
            <AppPreviewMockup />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPreview;
