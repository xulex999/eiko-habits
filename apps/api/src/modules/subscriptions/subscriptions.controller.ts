import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { env } from '../../config/env.js';
import * as subService from './subscriptions.service.js';

export async function getStatus(req: Request, res: Response) {
  const status = await subService.getStatus(req.user!.id);
  res.json({ success: true, data: status });
}

export async function createCheckout(req: Request, res: Response) {
  const result = await subService.createStripeCheckout(req.user!.id, req.body.priceType);
  res.json({ success: true, data: result });
}

export async function cancel(req: Request, res: Response) {
  const result = await subService.cancelSubscription(req.user!.id);
  res.json({ success: true, data: result });
}

export async function restore(req: Request, res: Response) {
  const result = await subService.restorePurchases(
    req.user!.id,
    req.body.platform,
    req.body.receipt,
  );
  res.json({ success: true, data: result });
}

export async function stripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;
  if (!sig || !env.STRIPE_WEBHOOK_SECRET || !env.STRIPE_SECRET_KEY) {
    res.status(400).json({ error: 'Missing signature or config' });
    return;
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2024-12-18.acacia' as any });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch {
    res.status(400).json({ error: 'Invalid signature' });
    return;
  }

  await subService.handleStripeWebhook(event);
  res.json({ received: true });
}
