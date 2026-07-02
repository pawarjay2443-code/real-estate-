import { Router } from 'express';
import { PaymentsController } from './payments.controller';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/auth';
import { createPaymentIntentSchema } from './payments.validation';
import express from 'express';

const router = Router();

// Stripe Webhook needs the RAW body buffer to verify signature, so we override body parsing for this route.
router.post('/webhook', express.raw({ type: 'application/json' }), PaymentsController.handleWebhook);

router.post('/create-intent', authenticate, validate(createPaymentIntentSchema), PaymentsController.createPaymentIntent);
router.get('/my', authenticate, PaymentsController.myPayments);

export default router;
