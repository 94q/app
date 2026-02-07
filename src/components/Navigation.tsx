import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScrollPosition } from '@/hooks/useScrollPosition';

export const Navigation: React.FC = () => {
  const { isScrolled } = useScrollPosition();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const navLinks = [
    { label: 'HOME', href: '/', section: 'home' },
    { label: 'SPEAKERS', href: '/#speakers', section: 'speakers' },
    { label: 'TEAM', href: '/#team', section: 'team' },
    { label: 'FAQ', href: '/faq', section: 'faq' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string, href: string) => {
    if (isHomePage && section !== 'home' && href.startsWith('/#')) {
      // On home page, scroll to section
      e.preventDefault();
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (!isHomePage && href.startsWith('/#')) {
      // On other pages, navigate to home then scroll
      e.preventDefault();
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
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
        <div className="flex items-center gap-4 sm:gap-8 mr-3 sm:mr-0">
          {navLinks.map((link) => (
            <Link
              key={link.section}
              to={link.href}
              onClick={(e) => handleNavClick(e, link.section, link.href)}
              className="text-white/80 hover:text-white text-sm font-medium tracking-wider transition-colors duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-purple transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex-1 flex justify-end">
          <Link to="/tickets">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary text-[11px] px-3 py-1.5 md:text-sm md:px-6 md:py-3"
            >
              BUY TICKETS
            </motion.button>
          </Link>
        </div>
      </nav>
    </motion.header>
  );
};

export default Navigation;
