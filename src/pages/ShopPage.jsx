import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import './ShopPage.css';

const categories = ['All', 'Woody & Spicy', 'Oriental & Amber', 'Oriental & Oud', 'Floral & Elegant'];

const ShopPage = () => {
  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Featured');

  const filteredAndSortedProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }

    result = [...result];
    switch (sortBy) {
      case 'Price Low-High':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'Price High-Low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'Rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'Name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, sortBy]);

  return (
    <motion.div
      className="shop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="shop__hero">
        <h1>Our Collection</h1>
      </div>

      <div className="shop__controls">
        <div className="shop__search">
          <Search size={20} />
          <input 
            type="text" 
            placeholder="Search fragrances..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="shop__filters">
          {categories.map(category => (
            <button
              key={category}
              className={`shop__filter-btn ${selectedCategory === category ? 'shop__filter-btn--active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <select 
          className="shop__sort" 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="Featured">Featured</option>
          <option value="Price Low-High">Price Low-High</option>
          <option value="Price High-Low">Price High-Low</option>
          <option value="Rating">Rating</option>
          <option value="Name">Name</option>
        </select>
      </div>

      <motion.div 
        className="shop__grid"
        layout
      >
        {filteredAndSortedProducts.length > 0 ? (
          filteredAndSortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="shop__empty">No products found matching your criteria.</div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ShopPage;
