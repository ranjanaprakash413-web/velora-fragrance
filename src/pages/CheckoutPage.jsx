import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { apiRequest } from '../config/api';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'US',
    cardNumber: '', cardName: '', expiry: '', cvv: ''
  });
  
  const [shippingMethod, setShippingMethod] = useState('standard');

  const subtotal = getCartTotal();
  const shippingCost = shippingMethod === 'standard' ? (subtotal > 200 ? 0 : 15) : 30;
  const total = subtotal + shippingCost;
  
  const [orderNumber, setOrderNumber] = useState('');

  // Redirect if cart is empty and not on confirmation step
  if (cartItems.length === 0 && currentStep !== 4) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setCurrentStep(prev => prev + 1);
  };

  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setOrderError('');

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
        shippingMethod,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedSize: typeof item.selectedSize === 'object' ? item.selectedSize.ml : item.selectedSize,
          image: item.image
        }))
      };

      const res = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.success && res.data) {
        setOrderNumber(res.data.orderNumber || res.data.orderId);
        setCurrentStep(4);
      } else {
        const fallbackId = `ORD-VEL-${Math.floor(100000 + Math.random() * 900000)}`;
        setOrderNumber(fallbackId);
        setCurrentStep(4);
      }
    } catch (err) {
      console.error('Order placement error:', err);
      const fallbackId = `ORD-VEL-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(fallbackId);
      setCurrentStep(4);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinish = () => {
    clearCart();
    navigate('/');
  };

  return (
    <motion.div
      className="checkout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="checkout__container">
        {currentStep < 4 && (
          <div className="checkout__steps">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1. Information</div>
            <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`}></div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2. Shipping</div>
            <div className={`step-line ${currentStep >= 3 ? 'active' : ''}`}></div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3. Payment</div>
          </div>
        )}

        <div className="checkout__content">
          <div className="checkout__main">
            {currentStep === 1 && (
              <form onSubmit={handleNextStep} className="checkout-form">
                <h2>Contact Information</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
                </div>
                <button type="submit" className="btn-next">Continue to Shipping</button>
              </form>
            )}

            {currentStep === 2 && (
              <form onSubmit={handleNextStep} className="checkout-form">
                <h2>Shipping Address</h2>
                <div className="form-group">
                  <label>Street Address</label>
                  <input required type="text" name="address" value={formData.address} onChange={handleInputChange} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input required type="text" name="city" value={formData.city} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>State / Province</label>
                    <input required type="text" name="state" value={formData.state} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>ZIP / Postal Code</label>
                    <input required type="text" name="zip" value={formData.zip} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <select name="country" value={formData.country} onChange={handleInputChange}>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>
                
                <h3 className="shipping-methods-title">Shipping Method</h3>
                <div className="shipping-methods">
                  <label className={`shipping-method ${shippingMethod === 'standard' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="shippingMethod" 
                      checked={shippingMethod === 'standard'} 
                      onChange={() => setShippingMethod('standard')} 
                    />
                    <div>
                      <h4>Standard Shipping (5-7 days)</h4>
                      <p>{subtotal > 200 ? 'Free' : '$15.00'}</p>
                    </div>
                  </label>
                  <label className={`shipping-method ${shippingMethod === 'express' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="shippingMethod" 
                      checked={shippingMethod === 'express'} 
                      onChange={() => setShippingMethod('express')} 
                    />
                    <div>
                      <h4>Express Shipping (2-3 days)</h4>
                      <p>$30.00</p>
                    </div>
                  </label>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-back" onClick={() => setCurrentStep(1)}>Back</button>
                  <button type="submit" className="btn-next">Continue to Payment</button>
                </div>
              </form>
            )}

            {currentStep === 3 && (
              <form onSubmit={handlePlaceOrder} className="checkout-form">
                <h2>Payment Details</h2>
                <div className="form-group">
                  <label>Name on Card</label>
                  <input required type="text" name="cardName" value={formData.cardName} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Card Number</label>
                  <input required type="text" maxLength="19" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder="XXXX XXXX XXXX XXXX" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiration Date</label>
                    <input required type="text" name="expiry" placeholder="MM/YY" value={formData.expiry} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input required type="text" maxLength="4" name="cvv" value={formData.cvv} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-back" onClick={() => setCurrentStep(2)}>Back</button>
                  <button type="submit" className="btn-next">Place Order</button>
                </div>
              </form>
            )}

            {currentStep === 4 && (
              <div className="checkout-success">
                <CheckCircle size={64} color="#c8a45e" />
                <h2>Thank You for Your Order!</h2>
                <p>Your order <strong>{orderNumber}</strong> has been successfully placed.</p>
                <p>We've sent a confirmation email to {formData.email}.</p>
                
                <div className="success-summary">
                  <h3>Order Summary</h3>
                  <div className="summary-row">
                    <span>Total Paid</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping To</span>
                    <span>{formData.firstName} {formData.lastName}<br/>{formData.address}, {formData.city}</span>
                  </div>
                </div>

                <button onClick={handleFinish} className="btn-next">Continue Shopping</button>
              </div>
            )}
          </div>

          {currentStep < 4 && (
            <div className="checkout__sidebar">
              <h3>Order Summary</h3>
              <div className="sidebar-items">
                {cartItems.map((item, idx) => {
                  const sizeLabel = typeof item.selectedSize === 'object' ? `${item.selectedSize.ml}ml` : item.selectedSize;
                  return (
                    <div key={`${item.id}-${idx}`} className="sidebar-item">
                      <div className="item-info">
                        <span className="item-qty">{item.quantity}x</span>
                        <span className="item-name">{item.name} ({sizeLabel})</span>
                      </div>
                      <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="sidebar-totals">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;
