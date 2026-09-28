import { Router } from 'express';
import { subscribeNewsletter, submitContact } from '../controllers/contactController.js';
import { submissionLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/newsletter', submissionLimiter, subscribeNewsletter);
router.post('/contact', submissionLimiter, submitContact);

export default router;
