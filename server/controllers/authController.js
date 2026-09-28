import bcrypt from 'bcryptjs';
import db from '../config/db.js';
import { generateToken } from '../middleware/auth.js';

/**
 * POST /api/auth/register
 */
export function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
    }

    const emailClean = email.trim().toLowerCase();

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailClean)) {
      return res.status(400).json({ success: false, error: 'Please provide a valid email address' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(emailClean);
    if (existing) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const result = db.prepare(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, 'customer')
    `).run(name.trim(), emailClean, passwordHash);

    const user = {
      id: Number(result.lastInsertRowid),
      name: name.trim(),
      email: emailClean,
      role: 'customer'
    };

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: { user, token }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 */
export function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const emailClean = email.trim().toLowerCase();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(emailClean);

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const token = generateToken(userPayload);

    res.json({
      success: true,
      message: 'Logged in successfully',
      data: { user: userPayload, token }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 */
export function getMe(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    // Fetch order count for this user
    const orderStats = db.prepare(`
      SELECT COUNT(*) as order_count, COALESCE(SUM(total), 0) as total_spent
      FROM orders WHERE user_id = ? OR email = ?
    `).get(req.user.id, req.user.email);

    res.json({
      success: true,
      data: {
        user: req.user,
        stats: {
          ordersCount: orderStats.order_count,
          totalSpent: orderStats.total_spent
        }
      }
    });
  } catch (err) {
    next(err);
  }
}
