import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { useProducts } from '../context/ProductContext';
import './FeaturedCollection.css';

const FeaturedCollection = () => {
  const { products } = useProducts();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section id="collections" className="featured">
      <div className="featured__header">
        <span className="featured__label">✦ OUR COLLECTION</span>
        <h2 className="featured__title">Discover Your Signature Scent</h2>
        <p className="featured__description">
          Each VELORA fragrance is a masterpiece, crafted with the world's finest ingredients to create an unforgettable olfactory journey.
        </p>
      </div>

      <motion.div 
        className="featured__grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={itemVariants}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturedCollection;
