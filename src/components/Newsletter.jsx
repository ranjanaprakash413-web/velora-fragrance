import React, { useState } from 'react';
import { apiRequest } from '../config/api';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await apiRequest('/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email })
      });

      if (res.success) {
        setIsSubmitted(true);
      } else {
        setError(res.error || 'Unable to subscribe at this moment.');
      }
    } catch {
      setIsSubmitted(true); // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="newsletter">
      <div className="newsletter__card">
        <h2 className="newsletter__title">Enter the World of VELORA</h2>
        <p className="newsletter__desc">
          Subscribe to discover exclusive fragrances, new collections, and special offers delivered to your inbox.
        </p>
        
        {isSubmitted ? (
          <div className="newsletter__success">
            <span className="newsletter__checkmark">✓</span>
            <p>Thank you for subscribing to our newsletter.</p>
          </div>
        ) : (
          <form className="newsletter__form" onSubmit={handleSubmit}>
            <div className="newsletter__input-group">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter__input"
              />
              <button type="submit" className="newsletter__btn">SUBSCRIBE</button>
            </div>
            {error && <p className="newsletter__error">{error}</p>}
          </form>
        )}
        
        <p className="newsletter__footer">
          By subscribing, you agree to our Privacy Policy
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
