import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Crown } from 'lucide-react';
import './BrandStory.css';
import brandStoryImg from '../assets/generated/brand_story.jpg';

const BrandStory = () => {
  return (
    <section id="brand-story" className="brand-story">
      <div className="brand-story__container">
        <motion.div 
          className="brand-story__image-wrapper"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="brand-story__image-corner brand-story__image-corner--tl"></div>
          <div className="brand-story__image-corner brand-story__image-corner--br"></div>
          <img src={brandStoryImg} alt="Velora Brand Heritage" className="brand-story__image" />
        </motion.div>

        <motion.div 
          className="brand-story__content"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="brand-story__label">✦ OUR STORY</span>
          <h2 className="brand-story__title">The Art of Timeless Fragrance</h2>
          
          <div className="brand-story__text">
            <p>For over five decades, VELORA has defined the pinnacle of luxury perfumery, blending traditional artisan craftsmanship with avant-garde innovation to create olfactory masterpieces.</p>
            <p>Every bottle is a testament to our dedication to perfection, utilizing only the rarest absolutes and purest extracts harvested from the world's most prestigious botanical gardens.</p>
          </div>

          <div className="brand-story__features">
            <div className="brand-feature">
              <Sparkles className="brand-feature__icon" size={24} />
              <div className="brand-feature__info">
                <h4>Master Craftsmen</h4>
                <p>Over 50 years of perfumery expertise</p>
              </div>
            </div>
            <div className="brand-feature">
              <Heart className="brand-feature__icon" size={24} />
              <div className="brand-feature__info">
                <h4>Finest Ingredients</h4>
                <p>Sourced from the world's most prestigious origins</p>
              </div>
            </div>
            <div className="brand-feature">
              <Crown className="brand-feature__icon" size={24} />
              <div className="brand-feature__info">
                <h4>Timeless Legacy</h4>
                <p>Creating unforgettable moments since 1972</p>
              </div>
            </div>
          </div>

          <Link to="/about" className="brand-story__btn">DISCOVER OUR STORY</Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BrandStory;
