import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();
  
  // Use a default value of 0 if useCart is not fully implemented yet
  let cartCount = 0;
  try {
    const cartContext = useCart();
    if (cartContext && cartContext.cartCount !== undefined) {
      cartCount = cartContext.cartCount;
    }
  } catch (error) {
    // Fallback if context is missing
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Collections', path: '/#collections' },
    { name: 'About Us', path: '/#brand-story' },
    { name: 'Contact', path: '#footer' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__logo">
          <Link to="/">VELORA</Link>
        </div>

        <ul className="navbar__links">
          {navLinks.map((link) => (
            <li key={link.name}>
              {link.path.startsWith('/#') || link.path.startsWith('#') ? (
                <a href={link.path} className="navbar__link">
                  {link.name}
                </a>
              ) : (
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
                  }
                >
                  {link.name}
                </NavLink>
              )}
            </li>
          ))}
        </ul>

        <div className="navbar__icons">
          <button 
            className="navbar__icon navbar__icon-btn" 
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          
          <Link to="/profile" className="navbar__icon" aria-label="User Profile">
            <User size={20} />
          </Link>
          
          <Link to="/cart" className="navbar__icon navbar__cart-icon" aria-label="Shopping Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="navbar__badge">{cartCount}</span>}
          </Link>
          
          <button 
            className="navbar__hamburger"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            className="search-overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="search-overlay__content">
              <Search size={20} className="search-overlay__icon" />
              <input 
                type="text" 
                placeholder="Search for fragrances..." 
                autoFocus
              />
              <button 
                className="search-overlay__close"
                onClick={() => setSearchOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.4 }}
          >
            <button 
              className="mobile-menu__close"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={32} />
            </button>
            
            <div className="mobile-menu__links">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  {link.path.startsWith('/#') || link.path.startsWith('#') ? (
                    <a href={link.path} className="mobile-menu__link" onClick={() => setMobileMenuOpen(false)}>
                      {link.name}
                    </a>
                  ) : (
                    <Link to={link.path} className="mobile-menu__link" onClick={() => setMobileMenuOpen(false)}>
                      {link.name}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
