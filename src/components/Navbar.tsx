
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, ExternalLink } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Tutorial', path: '/tutorial' },
    { 
      name: 'AI Endpoint', 
      path: 'https://endpoints.ai.cloud.ovh.net',
      external: true 
    }
  ];

  return (
    <nav 
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        scrolled ? 'py-3 glass-morphism' : 'py-5 bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="https://kampagnen.synaigy.com/hs-fs/hubfs/synaigy/synaigy_Assets_2021/synaigy_logo_weiß.png" 
              alt="synaigy Logo" 
              className="h-8 w-auto"
            />
            <span className="text-xl md:text-2xl font-bold highlight-text">OVHcloud AI Endpoint</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              item.external ? (
                <a
                  key={item.name}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 hover:highlight-text font-medium px-1 py-2 flex items-center gap-1"
                >
                  {item.name}
                  <ExternalLink size={14} />
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    'text-white/90 hover:highlight-text font-medium px-1 py-2',
                    location.pathname === item.path && 'highlight-text'
                  )}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden absolute top-full left-0 w-full glass-morphism transition-all duration-300 overflow-hidden',
          mobileMenuOpen ? 'max-h-60 py-4' : 'max-h-0 py-0'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              item.external ? (
                <a
                  key={item.name}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 hover:highlight-text font-medium px-1 py-2 flex items-center gap-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                  <ExternalLink size={14} />
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    'text-white/90 hover:highlight-text font-medium px-1 py-2',
                    location.pathname === item.path && 'highlight-text'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
