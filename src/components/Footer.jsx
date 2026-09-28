import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';
import { apiRequest } from '../config/api';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        await apiRequest('/newsletter', {
          method: 'POST',
          body: JSON.stringify({ email })
        });
      } catch {
        // Fallback
      }
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="footer" id="footer">
      <div className="footer__grid">
        {/* Column 1: Brand */}
        <div className="footer__col">
          <div className="footer__logo">VELORA</div>
          <p className="footer__tagline">
            Discover the essence of luxury. Crafted with the finest ingredients from around the world for the modern connoisseur.
          </p>
          <div className="footer__social">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer__social-icon" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer__social-icon" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer__social-icon" aria-label="Twitter">
              <Twitter size={18} />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer__col">
          <h3 className="footer__heading">Explore</h3>
          <ul className="footer__links">
            <li><Link to="/" className="footer__link">Home</Link></li>
            <li><Link to="/shop" className="footer__link">Shop All</Link></li>
            <li><a href="/#collections" className="footer__link">Collections</a></li>
            <li><a href="/#brand-story" className="footer__link">About Us</a></li>
          </ul>
        </div>

        {/* Column 3: Customer Service */}
        <div className="footer__col">
          <h3 className="footer__heading">Assistance</h3>
          <ul className="footer__links">
            <li><Link to="/contact" className="footer__link">Contact Us</Link></li>
            <li><Link to="/shipping" className="footer__link">Shipping & Returns</Link></li>
            <li><Link to="/privacy" className="footer__link">Privacy Policy</Link></li>
            <li><Link to="/terms" className="footer__link">Terms & Conditions</Link></li>
            <li><Link to="/faq" className="footer__link">FAQ</Link></li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div className="footer__col">
          <h3 className="footer__heading">The Velora List</h3>
          <p className="footer__tagline">
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          <form className="footer__newsletter" onSubmit={handleSubscribe}>
            <div className="footer__newsletter-input">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" aria-label="Subscribe">
                {subscribed ? '✓' : 'Subscribe'}
              </button>
            </div>
            {subscribed && <p className="footer__success-msg">Welcome to the inner circle.</p>}
          </form>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} VELORA. All rights reserved.</p>
        <p>Crafted with elegance</p>
      </div>
    </footer>
  );
};

export default Footer;
