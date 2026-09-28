import { Router } from 'express';
import { createOrder, getOrderById, getUserOrders } from '../controllers/orderController.js';
import { optionalAuth, authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/', optionalAuth, createOrder);
router.get('/my-orders', authenticateToken, getUserOrders);
router.get('/:id', getOrderById);

export default router;
