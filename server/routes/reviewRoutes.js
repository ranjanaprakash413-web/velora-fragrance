import { Router } from 'express';
import { getReviews, createReview } from '../controllers/reviewController.js';
import { submissionLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/', getReviews);
router.post('/', submissionLimiter, createReview);

export default router;
