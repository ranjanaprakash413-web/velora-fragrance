import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { products as initialProducts } from '../data/products';
import { apiRequest } from '../config/api';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchProductsFromBackend() {
      try {
        setLoading(true);
        const res = await apiRequest('/products');
        if (isMounted && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setProducts(res.data);
        }
      } catch (err) {
        console.warn('[ProductContext] Using initial fallback products:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProductsFromBackend();
    return () => { isMounted = false; };
  }, []);

  const getProductById = (id) => {
    return products.find(p => p.id === id);
  };

  const getProductsByCategory = (category) => {
    if (!category || category === 'All') return products;
    return products.filter(p => p.category === category);
  };

  const searchProducts = (query) => {
    if (!query) return products;
    const lowerQuery = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
    );
  };

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return Array.from(cats);
  }, [products]);

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      getProductById,
      getProductsByCategory,
      searchProducts,
      categories
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
