import { Router } from 'express';
import { getProducts, getFeaturedProducts, getProductById, createProduct } from '../controllers/productController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);
router.post('/', authenticateToken, requireAdmin, createProduct);

export default router;
