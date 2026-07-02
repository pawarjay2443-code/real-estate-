import { Router } from 'express';
import { ReviewsController } from './reviews.controller';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/auth';
import { createReviewSchema } from './reviews.validation';

const router = Router();

router.post('/', authenticate, validate(createReviewSchema), ReviewsController.createReview);
router.get('/property/:propertyId', ReviewsController.getPropertyReviews);
router.get('/agent/:agentId', ReviewsController.getAgentReviews);
router.delete('/:id', authenticate, ReviewsController.deleteReview);

export default router;
