import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CartPage.css';

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

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  
  const subtotal = getCartTotal();
  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal > 0 ? subtotal + shipping : 0;

  if (cartItems.length === 0) {
    return (
      <motion.div
        className="cart cart--empty"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ShoppingBag size={64} className="cart-empty-icon" />
        <h2>Your bag is empty</h2>
        <p>Discover our exclusive collections and find your signature scent.</p>
        <Link to="/shop" className="btn-continue-shopping">Continue Shopping</Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="cart"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="cart__header">
        <h1>Shopping Bag <span>({cartItems.length} items)</span></h1>
      </div>

      <div className="cart__container">
        <div className="cart__items">
          {cartItems.map((item, idx) => {
            const sizeLabel = typeof item.selectedSize === 'object' ? `${item.selectedSize.ml}ml` : item.selectedSize;
            return (
              <div key={`${item.id}-${sizeLabel}-${idx}`} className="cart-item">
                <div className="cart-item__image">
                  <img 
                    src={imageMap[item.image] || imageMap['velora_noir.jpg']} 
                    alt={item.name} 
                  />
                </div>
                
                <div className="cart-item__details">
                  <div className="cart-item__info">
                    <h3>{item.name}</h3>
                    <p>Size: {sizeLabel}</p>
                    <div className="cart-item__price">${item.price.toFixed(2)}</div>
                  </div>

                  <div className="cart-item__actions">
                    <div className="cart-quantity">
                      <button onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}>
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <button 
                      className="btn-remove"
                      onClick={() => removeFromCart(item.id, item.selectedSize)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="cart-item__total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart__summary">
          <h2>Order Summary</h2>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </div>
          
          {shipping > 0 && (
            <div className="summary-notice">
              Spend ${(200 - subtotal).toFixed(2)} more for free shipping!
            </div>
          )}

          <div className="promo-code">
            <input 
              type="text" 
              placeholder="Promo code" 
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button>Apply</button>
          </div>

          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button 
            className="btn-checkout"
            onClick={() => navigate('/checkout')}
          >
            PROCEED TO CHECKOUT
          </button>
          
          <Link to="/shop" className="link-continue">Continue Shopping</Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;
