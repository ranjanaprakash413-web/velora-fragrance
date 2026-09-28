import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import PerfumeBottle3D from './PerfumeBottle3D';
import './HeroSection.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero__container">
        <motion.div 
          className="hero__content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero__label" variants={itemVariants}>
            ✦ PREMIUM COLLECTION
          </motion.div>
          
          <motion.h1 className="hero__title" variants={itemVariants}>
            Move Ideas.<br />
            <span>Luxury</span> Dreams.
          </motion.h1>
          
          <motion.p className="hero__description" variants={itemVariants}>
            Discover VELORA — where every fragrance tells a story of elegance, passion, and timeless sophistication. Crafted for those who seek the extraordinary.
          </motion.p>
          
          <motion.div className="hero__buttons" variants={itemVariants}>
            <Link to="/shop" className="hero__btn-primary">
              EXPLORE COLLECTION
              <ArrowRight size={18} />
            </Link>
            <a href="#collections" className="hero__btn-secondary">
              VIEW LOOKBOOK
              <ArrowRight size={18} className="arrow-icon" />
            </a>
          </motion.div>
          
          <motion.div className="hero__stats" variants={itemVariants}>
            <div className="hero__stat">
              <div className="hero__stat-value">150+</div>
              <div className="hero__stat-label">Fragrances</div>
            </div>
            <div className="hero__stat">
              <div className="hero__stat-value">50K+</div>
              <div className="hero__stat-label">Customers</div>
            </div>
            <div className="hero__stat">
              <div className="hero__stat-value">4.9★</div>
              <div className="hero__stat-label">Rating</div>
            </div>
          </motion.div>
        </motion.div>
        
        <div className="hero__visual">
          <PerfumeBottle3D />
        </div>
      </div>
      
      <div className="hero__scroll-indicator">
        Scroll
        <ChevronDown size={20} />
      </div>
    </section>
  );
};

export default HeroSection;
