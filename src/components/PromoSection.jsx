import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './PromoSection.css';

const PromoSection = () => {
  return (
    <section className="promo-section">
      <div className="promo-section__sweep"></div>
      {/* Particles */}
      <div className="promo-particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="promo-particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}></div>
        ))}
      </div>

      <motion.div 
        className="promo-section__content"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <span className="promo-section__label">EXCLUSIVE OFFER</span>
        <h2 className="promo-section__title">Luxury That Lasts Beyond Time</h2>
        <p className="promo-section__desc">
          Experience fragrances crafted with the world's finest ingredients to leave an eternal impression.
        </p>
        <Link to="/shop" className="promo-section__btn">SHOP THE COLLECTION</Link>
      </motion.div>
    </section>
  );
};

export default PromoSection;
