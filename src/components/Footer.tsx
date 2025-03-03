
import React from 'react';
import { Mail, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';

const Footer = () => {
  return (
    <footer className="w-full bg-black/30 border-t border-white/10 mt-16 py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center mb-6 md:mb-0">
            <div className="flex items-center mb-4 md:mb-0 md:mr-6">
              <div className="relative overflow-hidden rounded-full border-2 border-highlight w-16 h-16 mr-4">
                <img 
                  src="https://profile-images.xing.com/images/0bac708fee0a79e6e7186a5fb08af312-26/marc-achsnich.1024x1024.jpg" 
                  alt="Marc Achsnich" 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Marc Achsnich</h3>
                <p className="text-sm text-white/70">Head of Cloud</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a 
              href="mailto:sales@synaigy.com" 
              className={cn(
                "flex items-center space-x-2 px-5 py-2 rounded-full",
                "glass-morphism hover:highlight-glow",
                "transition-all duration-300"
              )}
            >
              <Mail size={18} className="text-highlight" />
              <span>sales@synaigy.com</span>
            </a>
            <a 
              href="https://www.linkedin.com/in/achsnich/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={cn(
                "flex items-center space-x-2 px-5 py-2 rounded-full",
                "glass-morphism hover:highlight-glow",
                "transition-all duration-300"
              )}
            >
              <Linkedin size={18} className="text-highlight" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-white/50">
          <p>© {new Date().getFullYear()} Synaigy GmbH. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
