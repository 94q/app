import React from 'react';
import { motion } from 'framer-motion';
import { useScrollPosition } from '@/hooks/useScrollPosition';

interface NavigationProps {
  onNavigate?: (section: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onNavigate }) => {
  const { isScrolled } = useScrollPosition();

  const navLinks = [
    { label: 'HOME', section: 'home' },
    { label: 'SPEAKERS', section: 'speakers' },
    { label: 'TEAM', section: 'team' },
  ];

  const handleClick = (section: string) => {
    onNavigate?.(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/80 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-custom h-20 flex items-center justify-between">
        {/* Logo/Brand - Hidden as per design */}
        <div className="flex-1" />

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.section}
              onClick={() => handleClick(link.section)}
              className="text-white/80 hover:text-white text-sm font-medium tracking-wider transition-colors duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-purple transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex-1 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleClick('cta')}
            className="btn-primary"
          >
            BUY TICKETS
          </motion.button>
        </div>
      </nav>
    </motion.header>
  );
};

export default Navigation;
