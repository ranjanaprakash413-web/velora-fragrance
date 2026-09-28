import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { initDatabase } from './config/db.js';
import { runSeeds } from './seeds/seedData.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// 1. Initialize Database & Seed default data
initDatabase();
runSeeds();

// 2. Production Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin || allowedOrigins.includes(origin) || NODE_ENV === 'development') {
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS policy'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

if (NODE_ENV !== 'test') {
  app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// 3. Health & Documentation Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'VELORA Luxury Fragrance API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`
  });
});

// 4. API Routes
app.use('/api', apiLimiter);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api', contactRoutes); // provides /api/newsletter and /api/contact

// 5. Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// 6. Start Server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[VELORA API] Server running in ${NODE_ENV} mode on port ${PORT}`);
  console.log(`[VELORA API] Health endpoint: http://localhost:${PORT}/api/health`);
});

export default app;
