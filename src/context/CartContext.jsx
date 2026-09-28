import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const initialState = {
  items: []
};

function normalizeSize(size, defaultPrice) {
  if (typeof size === 'object' && size !== null) {
    return {
      ml: size.ml || 50,
      price: size.price || defaultPrice || 250,
      toString() { return `${this.ml}ml`; }
    };
  }
  const mlMatch = String(size || '').match(/\d+/);
  const ml = mlMatch ? parseInt(mlMatch[0], 10) : 50;
  return {
    ml,
    price: defaultPrice || 250,
    toString() { return `${ml}ml`; }
  };
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const payload = action.payload;
      const sizeObj = normalizeSize(payload.selectedSize, payload.price);
      const unitPrice = sizeObj.price || payload.price;

      const existingIndex = state.items.findIndex(
        item => item.id === payload.id && (item.selectedSize?.ml === sizeObj.ml || item.selectedSize === sizeObj.toString())
      );

      if (existingIndex >= 0) {
        const updated = [...state.items];
        updated[existingIndex].quantity += (payload.quantity || 1);
        return { ...state, items: updated };
      } else {
        const newItem = {
          ...payload,
          selectedSize: sizeObj,
          price: unitPrice,
          quantity: payload.quantity || 1
        };
        return { ...state, items: [...state.items, newItem] };
      }
    }
    case 'REMOVE_FROM_CART': {
      const { id, sizeMl } = action.payload;
      return {
        ...state,
        items: state.items.filter(item => {
          const itemMl = item.selectedSize?.ml || item.selectedSize;
          return !(item.id === id && (itemMl === sizeMl || String(item.selectedSize) === String(sizeMl)));
        })
      };
    }
    case 'UPDATE_QUANTITY': {
      const { id, sizeMl, quantity } = action.payload;
      return {
        ...state,
        items: state.items.map(item => {
          const itemMl = item.selectedSize?.ml || item.selectedSize;
          if (item.id === id && (itemMl === sizeMl || String(item.selectedSize) === String(sizeMl))) {
            return { ...item, quantity };
          }
          return item;
        })
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'LOAD_CART':
      return {
        ...state,
        items: (action.payload || []).map(item => ({
          ...item,
          selectedSize: normalizeSize(item.selectedSize, item.price)
        }))
      };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart on init
  useEffect(() => {
    const savedCart = localStorage.getItem('velora_cart');
    if (savedCart) {
      try {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
      } catch (e) {
        console.error('Failed to parse cart from local storage', e);
      }
    }
  }, []);

  // Save on every change
  useEffect(() => {
    localStorage.setItem('velora_cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product, arg2, arg3) => {
    let selectedSize;
    let quantity;

    if (typeof arg2 === 'number') {
      quantity = arg2;
      selectedSize = arg3 || product.sizes?.[0] || { ml: 50, price: product.price };
    } else {
      selectedSize = arg2 || product.sizes?.[0] || { ml: 50, price: product.price };
      quantity = typeof arg3 === 'number' ? arg3 : 1;
    }

    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...product, selectedSize, quantity }
    });
  };

  const removeFromCart = (id, sizeMl) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: { id, sizeMl }
    });
  };

  const updateQuantity = (id, sizeMl, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id, sizeMl);
    } else {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id, sizeMl, quantity }
      });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const cartCount = state.items.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = state.items.reduce(
    (total, item) => total + ((item.selectedSize?.price || item.price) * item.quantity),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart: state.items,
        cartItems: state.items, // Alias for CartPage & CheckoutPage
        cartCount,
        cartTotal,
        getCartTotal: () => cartTotal, // Method alias for CartPage & CheckoutPage
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        dispatch
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
