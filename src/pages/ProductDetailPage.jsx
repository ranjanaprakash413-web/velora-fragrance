import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Minus, Plus, Heart } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import './ProductDetailPage.css';

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

const ProductDetailPage = () => {
  const { id } = useParams();
  const { products } = useProducts();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [mainImage, setMainImage] = useState('');
  const [thumbnails, setThumbnails] = useState([]);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedSize(foundProduct.sizes[0]);
      setMainImage(imageMap[foundProduct.image] || imageMap['velora_noir.jpg']);
      
      // Mock thumbnails using the image sequence
      setThumbnails([
        imageMap[foundProduct.image] || imageMap['velora_noir.jpg'],
        '/image/ezgif-frame-010.jpg',
        '/image/ezgif-frame-020.jpg',
        '/image/ezgif-frame-030.jpg'
      ]);
    }
  }, [id, products]);

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <Link to="/shop">Return to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
  };

  const relatedProducts = products
    .filter(p => p.id !== id && p.category === product.category)
    .slice(0, 3);

  return (
    <motion.div
      className="product-detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="product-detail__breadcrumb">
        <Link to="/">Home</Link> &gt; <Link to="/shop">Shop</Link> &gt; <span>{product.name}</span>
      </div>

      <div className="product-detail__container">
        <div className="product-detail__gallery">
          <div className="product-detail__main-image">
            <img src={mainImage} alt={product.name} />
          </div>
          <div className="product-detail__thumbnails">
            {thumbnails.map((thumb, index) => (
              <div 
                key={index} 
                className={`product-detail__thumb ${mainImage === thumb ? 'active' : ''}`}
                onClick={() => setMainImage(thumb)}
              >
                <img src={thumb} alt={`${product.name} view ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="product-detail__info">
          <h1 className="product-detail__name">{product.name}</h1>
          
          <div className="product-detail__rating">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "#c8a45e" : "transparent"} color="#c8a45e" />
            ))}
            <span>({Math.floor(product.rating * 20)} reviews)</span>
          </div>

          <div className="product-detail__price">${((selectedSize?.price || product.price)).toFixed(2)}</div>
          
          <p className="product-detail__desc">{product.description}</p>

          {product.notes && (
            <div className="product-detail__notes">
              <div className="note-group">
                <h4>Top Notes</h4>
                <div className="note-tags">
                  {product.notes.top.map((note, i) => <span key={i}>{note}</span>)}
                </div>
              </div>
              <div className="note-group">
                <h4>Heart Notes</h4>
                <div className="note-tags">
                  {product.notes.heart.map((note, i) => <span key={i}>{note}</span>)}
                </div>
              </div>
              <div className="note-group">
                <h4>Base Notes</h4>
                <div className="note-tags">
                  {product.notes.base.map((note, i) => <span key={i}>{note}</span>)}
                </div>
              </div>
            </div>
          )}

          <div className="product-detail__size">
            <h4>Size</h4>
            <div className="size-options">
              {product.sizes && product.sizes.map((size, idx) => {
                const label = typeof size === 'object' ? `${size.ml}ml` : size;
                const isSelected = typeof size === 'object' 
                  ? selectedSize?.ml === size.ml 
                  : selectedSize === size;
                return (
                  <button 
                    key={idx}
                    className={isSelected ? 'active' : ''}
                    onClick={() => setSelectedSize(size)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="product-detail__actions">
            <div className="quantity-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16} /></button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}><Plus size={16} /></button>
            </div>
            
            <button className="btn-add-cart" onClick={handleAddToCart}>
              ADD TO BAG
            </button>
            
            <button className="btn-wishlist">
              <Heart size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="product-detail__tabs">
        <div className="tab-headers">
          <button 
            className={activeTab === 'description' ? 'active' : ''} 
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            className={activeTab === 'reviews' ? 'active' : ''} 
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'description' && (
            <div className="content-desc">
              <p>{product.description}</p>
              <p>Crafted with the finest ingredients sourced from around the globe, this fragrance is an expression of pure luxury. The meticulous blending process ensures a scent that evolves beautifully on the skin throughout the day.</p>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="content-reviews">
              <div className="review">
                <div className="review-stars">
                  <Star size={14} fill="#c8a45e" color="#c8a45e" />
                  <Star size={14} fill="#c8a45e" color="#c8a45e" />
                  <Star size={14} fill="#c8a45e" color="#c8a45e" />
                  <Star size={14} fill="#c8a45e" color="#c8a45e" />
                  <Star size={14} fill="#c8a45e" color="#c8a45e" />
                </div>
                <h5>Absolutely Exquisite</h5>
                <p>This is by far the most captivating fragrance I've ever owned. The longevity is incredible, and the dry down is just magical.</p>
                <span>- Eleanor R.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="product-detail__related">
          <h2>You May Also Like</h2>
          <div className="related-grid">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductDetailPage;
