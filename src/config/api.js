/**
 * Centralized API Configuration
 * Supports environment variable VITE_API_URL for production deployment
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const token = localStorage.getItem('velora_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn(`[API] Network error requesting ${endpoint}, using fallback:`, err.message);
    return { success: false, error: err.message, networkError: true };
  }
}
