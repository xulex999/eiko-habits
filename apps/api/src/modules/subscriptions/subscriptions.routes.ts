import { Router } from 'express';
import express from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createCheckoutSchema, verifyReceiptSchema } from './subscriptions.schema.js';
import * as subController from './subscriptions.controller.js';

export const subscriptionsRoutes = Router();

subscriptionsRoutes.get('/status', requireAuth, subController.getStatus);
subscriptionsRoutes.post('/checkout', requireAuth, validate(createCheckoutSchema), subController.createCheckout);
subscriptionsRoutes.post('/cancel', requireAuth, subController.cancel);
subscriptionsRoutes.post('/restore', requireAuth, validate(verifyReceiptSchema), subController.restore);

// Stripe webhook needs raw body for signature verification
subscriptionsRoutes.post(
  '/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  subController.stripeWebhook,
);
