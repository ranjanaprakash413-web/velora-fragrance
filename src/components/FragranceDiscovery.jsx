import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './FragranceDiscovery.css';
import imgWoody from '../assets/generated/fragrance_woody.jpg';
import imgAquatic from '../assets/generated/fragrance_aquatic.jpg';
import imgFloral from '../assets/generated/fragrance_floral.jpg';
import imgOriental from '../assets/generated/fragrance_oriental.jpg';

const categories = [
  { id: 1, name: 'Woody & Spicy', img: imgWoody, desc: 'Bold warmth with notes of cedar, sandalwood, and exotic spices' },
  { id: 2, name: 'Fresh & Aquatic', img: imgAquatic, desc: 'Crisp ocean breeze with citrus and aromatic herbs' },
  { id: 3, name: 'Floral & Elegant', img: imgFloral, desc: 'Graceful bouquets of rose, jasmine, and delicate blooms' },
  { id: 4, name: 'Oriental & Oud', img: imgOriental, desc: 'Rich oud, amber, and precious resins from the East' }
];

const FragranceDiscovery = () => {
  return (
    <section className="fragrance-discovery">
      <div className="fragrance-discovery__container">
        <motion.div 
          className="fragrance-discovery__header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="fragrance-discovery__label">✦ COLLECTIONS</span>
          <h2 className="fragrance-discovery__title">Find Your Signature Fragrance</h2>
          <p className="fragrance-discovery__desc">Discover our masterfully blended collections tailored to every olfactory preference.</p>
        </motion.div>

        <div className="fragrance-discovery__grid">
          {categories.map((cat, index) => (
            <motion.div 
              key={cat.id}
              className="fragrance-card"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="fragrance-card__bg" style={{ backgroundImage: `url(${cat.img})` }}></div>
              <div className="fragrance-card__content">
                <h3 className="fragrance-card__title">{cat.name}</h3>
                <p className="fragrance-card__desc">{cat.desc}</p>
                <Link to="/shop" className="fragrance-card__btn">Explore</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FragranceDiscovery;
