import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './InteractiveShowcase.css';

const InteractiveShowcase = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20; 
      const y = (e.clientY / innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="interactive-showcase">
      <div 
        className="interactive-showcase__bg" 
        style={{
          transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`
        }}
      ></div>
      <div className="interactive-showcase__overlay"></div>
      
      {/* Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 5}s`
          }}></div>
        ))}
      </div>

      <motion.div 
        className="interactive-showcase__content"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <span className="interactive-showcase__label">✦ SIGNATURE FRAGRANCE</span>
        <h2 className="interactive-showcase__title">The Essence of Elegance</h2>
        <p className="interactive-showcase__desc">
          Crafted with unparalleled artistry and the most exquisite ingredients from around the world. A symphony of notes designed to captivate the senses.
        </p>
        <Link to="/shop" className="interactive-showcase__btn">
          DISCOVER THE FRAGRANCE
        </Link>
      </motion.div>
    </section>
  );
};

export default InteractiveShowcase;
