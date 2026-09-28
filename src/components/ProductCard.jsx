import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

import noirImg from '../assets/generated/velora_noir.jpg';
import goldImg from '../assets/generated/velora_gold.jpg';
import oudImg from '../assets/generated/velora_oud.jpg';
import bloomImg from '../assets/generated/velora_bloom.jpg';

const imageMap = {
  'velora_noir.jpg': noirImg,
  'velora_gold.jpg': goldImg,
  'velora_oud.jpg': oudImg,
  'velora_bloom.jpg': bloomImg,
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, product.sizes[0]);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  const imageSrc = imageMap[product.image] || noirImg;

  return (
    <motion.div
      className="product-card"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="product-card__image">
        <span className="product-card__category">{product.category}</span>
        <img src={imageSrc} alt={product.name} />
      </div>
      
      <div className="product-card__content">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__tagline">{product.tagline}</p>
        
        <StarRating rating={product.rating} />
        
        <div className="product-card__price">
          ${product.price.toFixed(2)}
        </div>
        
        <div className="product-card__actions">
          <button 
            className={`product-card__btn product-card__btn--primary ${added ? 'added' : ''}`}
            onClick={handleAddToCart}
          >
            {added ? (
              <>
                <Check size={16} /> ADDED
              </>
            ) : (
              <>
                <ShoppingBag size={16} /> ADD TO CART
              </>
            )}
          </button>
          <Link to={`/product/${product.id}`} className="product-card__btn product-card__btn--secondary">
            <Eye size={16} /> VIEW DETAILS
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
