
import React from 'react';
import { Link } from 'react-router-dom';

export const FooterLinks = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
      <div>
        <h3 className="font-semibold mb-3 text-love-800">About</h3>
        <ul className="space-y-2 text-sm">
          <li><Link to="/safety" className="hover:text-love-500 transition-colors">Safety</Link></li>
          <li><Link to="/blog/about-us" className="hover:text-love-500 transition-colors">About Us</Link></li>
          <li><Link to="/blog/success-stories" className="hover:text-love-500 transition-colors">Success Stories</Link></li>
          <li><Link to="/blog/careers" className="hover:text-love-500 transition-colors">Careers</Link></li>
        </ul>
      </div>
      
      <div>
        <h3 className="font-semibold mb-3 text-love-800">Features</h3>
        <ul className="space-y-2 text-sm">
          <li><Link to="/discover" className="hover:text-love-500 transition-colors">Discover</Link></li>
          <li><Link to="/explore" className="hover:text-love-500 transition-colors">Explore</Link></li>
          <li><Link to="/dates" className="hover:text-love-500 transition-colors">Date Planning</Link></li>
          <li><Link to="/blog/premium" className="hover:text-love-500 transition-colors">Premium Features</Link></li>
        </ul>
      </div>
      
      <div>
        <h3 className="font-semibold mb-3 text-love-800">Support</h3>
        <ul className="space-y-2 text-sm">
          <li><Link to="/blog/faq" className="hover:text-love-500 transition-colors">FAQ</Link></li>
          <li><Link to="/blog/contact" className="hover:text-love-500 transition-colors">Contact Us</Link></li>
          <li><Link to="/blog/help" className="hover:text-love-500 transition-colors">Help Center</Link></li>
          <li><Link to="/blog/feedback" className="hover:text-love-500 transition-colors">Feedback</Link></li>
        </ul>
      </div>
      
      <div>
        <h3 className="font-semibold mb-3 text-love-800">Legal</h3>
        <ul className="space-y-2 text-sm">
          <li><Link to="/privacy-policy" className="hover:text-love-500 transition-colors">Privacy Policy</Link></li>
          <li><Link to="/terms-of-service" className="hover:text-love-500 transition-colors">Terms of Service</Link></li>
          <li><Link to="/blog/cookie-policy" className="hover:text-love-500 transition-colors">Cookie Policy</Link></li>
          <li><Link to="/blog/community-guidelines" className="hover:text-love-500 transition-colors">Community Guidelines</Link></li>
        </ul>
      </div>
    </div>
  );
};
