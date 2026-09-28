import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, LogOut, Package, Mail, Lock, ShieldCheck } from 'lucide-react';
import { apiRequest } from '../config/api';
import './ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Check current session
  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('velora_token');
      if (token) {
        setLoading(true);
        const res = await apiRequest('/auth/me');
        if (res.success && res.data?.user) {
          setUser(res.data.user);
          loadOrders();
        } else {
          localStorage.removeItem('velora_token');
        }
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const loadOrders = async () => {
    const res = await apiRequest('/orders/my-orders');
    if (res.success && Array.isArray(res.data)) {
      setOrders(res.data);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const endpoint = isLoginMode ? '/auth/login' : '/auth/register';
      const payload = isLoginMode
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const res = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.success && res.data?.token) {
        localStorage.setItem('velora_token', res.data.token);
        setUser(res.data.user);
        setMessage(res.message || 'Welcome to VELORA.');
        loadOrders();
      } else {
        setError(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setError(err.message || 'Service unavailable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('velora_token');
    setUser(null);
    setOrders([]);
    setMessage('You have been signed out.');
  };

  return (
    <motion.div 
      className="profile-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile-container">
        {user ? (
          <div className="profile-dashboard">
            <div className="profile-header">
              <div className="profile-avatar">
                <User size={32} color="#c8a45e" />
              </div>
              <div className="profile-info">
                <span className="profile-badge">VELORA CONNOISSEUR</span>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
              </div>
              <button onClick={handleLogout} className="btn-logout" title="Sign Out">
                <LogOut size={18} /> Sign Out
              </button>
            </div>

            <div className="profile-orders">
              <div className="orders-header">
                <Package size={22} color="#c8a45e" />
                <h3>Your Fragrance Archives ({orders.length})</h3>
              </div>

              {orders.length === 0 ? (
                <div className="empty-orders">
                  <p>You have not placed any orders yet.</p>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-top">
                        <span className="order-id">{order.id}</span>
                        <span className="order-status">{order.status.toUpperCase()}</span>
                      </div>
                      <div className="order-details">
                        <p className="order-date">Date: {new Date(order.created_at).toLocaleDateString()}</p>
                        <p className="order-total">Total: ${order.total.toFixed(2)}</p>
                      </div>
                      <div className="order-items">
                        {order.items && order.items.map((item, idx) => (
                          <span key={idx} className="order-item-chip">
                            {item.quantity}x {item.name} ({typeof item.selectedSize === 'object' ? `${item.selectedSize.ml}ml` : item.selectedSize})
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="auth-card">
            <div className="auth-header">
              <span className="auth-eyebrow">✦ PRIVATE CLIENT PORTAL</span>
              <h2>{isLoginMode ? 'Welcome Back' : 'Create an Account'}</h2>
              <p>Experience personalized curation and bespoke fragrance reserves.</p>
            </div>

            {error && <div className="auth-alert auth-error">{error}</div>}
            {message && <div className="auth-alert auth-success">{message}</div>}

            <form onSubmit={handleAuthSubmit} className="auth-form">
              {!isLoginMode && (
                <div className="auth-field">
                  <label>Full Name</label>
                  <div className="input-wrap">
                    <User size={16} />
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      value={formData.name} 
                      onChange={handleChange}
                      placeholder="e.g. Eleanor Vance" 
                    />
                  </div>
                </div>
              )}

              <div className="auth-field">
                <label>Email Address</label>
                <div className="input-wrap">
                  <Mail size={16} />
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    value={formData.email} 
                    onChange={handleChange}
                    placeholder="client@luxury.com" 
                  />
                </div>
              </div>

              <div className="auth-field">
                <label>Password</label>
                <div className="input-wrap">
                  <Lock size={16} />
                  <input 
                    type="password" 
                    name="password" 
                    required 
                    value={formData.password} 
                    onChange={handleChange}
                    placeholder="••••••••" 
                  />
                </div>
              </div>

              <button type="submit" className="btn-auth-submit" disabled={loading}>
                {loading ? 'PROCESSING...' : (isLoginMode ? 'SIGN IN' : 'CREATE ACCOUNT')}
              </button>
            </form>

            <div className="auth-switch">
              {isLoginMode ? (
                <p>
                  New to VELORA?{' '}
                  <button type="button" onClick={() => { setIsLoginMode(false); setError(''); }}>
                    Register for private access
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button type="button" onClick={() => { setIsLoginMode(true); setError(''); }}>
                    Sign in
                  </button>
                </p>
              )}
            </div>

            <div className="demo-credentials">
              <ShieldCheck size={14} color="#c8a45e" />
              <span>Demo Customer: customer@velora.com / VeloraCustomer2026!</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfilePage;
