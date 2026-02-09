import Stripe from 'stripe';
import { prisma } from '../../config/database.js';
import { env } from '../../config/env.js';
import { NotFoundError, AppError } from '../../utils/errors.js';

const MONTHLY_PRICE = 19.99;
const ANNUAL_PRICE = 99.99;

function getStripe(): Stripe | null {
  if (!env.STRIPE_SECRET_KEY) return null;
  return new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2024-12-18.acacia' as any });
}

export async function getStatus(userId: string) {
  const sub = await prisma.subscription.findUnique({ where: { userId } });
  return sub || { tier: 'FREE', status: 'ACTIVE', platform: null };
}

export async function createStripeCheckout(userId: string, priceType: 'monthly' | 'annual') {
  const stripe = getStripe();
  if (!stripe) throw new AppError(503, 'PAYMENTS_UNAVAILABLE', 'Payment processing is not configured');

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
  if (!user) throw new NotFoundError('User');

  const priceId =
    priceType === 'monthly' ? env.STRIPE_MONTHLY_PRICE_ID : env.STRIPE_ANNUAL_PRICE_ID;

  if (!priceId) {
    throw new AppError(503, 'PRICE_NOT_CONFIGURED', `${priceType} price not configured`);
  }

  const session = await stripe.checkout.sessions.create({
    customer_email: user.email,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${env.WEB_URL}/settings?subscription=success`,
    cancel_url: `${env.WEB_URL}/pricing?subscription=canceled`,
    metadata: { userId },
    subscription_data: {
      metadata: { userId },
      trial_period_days: 7,
    },
  });

  return { checkoutUrl: session.url };
}

export async function cancelSubscription(userId: string) {
  const sub = await prisma.subscription.findUnique({ where: { userId } });
  if (!sub || sub.tier === 'FREE') {
    throw new AppError(400, 'NO_SUBSCRIPTION', 'No active premium subscription');
  }

  if (sub.platform === 'STRIPE' && sub.externalId) {
    const stripe = getStripe();
    if (stripe) {
      await stripe.subscriptions.update(sub.externalId, {
        cancel_at_period_end: true,
      });
    }
  }

  await prisma.subscription.update({
    where: { userId },
    data: { cancelAtPeriodEnd: true },
  });

  return { cancelAtPeriodEnd: true };
}

export async function handleStripeWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (!userId) break;

      await prisma.subscription.upsert({
        where: { userId },
        update: {
          tier: 'PREMIUM',
          status: 'ACTIVE',
          platform: 'STRIPE',
          externalId: session.subscription as string,
          currentPeriodStart: new Date(),
          priceId: session.amount_total === ANNUAL_PRICE * 100 ? 'annual_99.99' : 'monthly_19.99',
        },
        create: {
          userId,
          tier: 'PREMIUM',
          status: 'ACTIVE',
          platform: 'STRIPE',
          externalId: session.subscription as string,
          currentPeriodStart: new Date(),
          priceId: session.amount_total === ANNUAL_PRICE * 100 ? 'annual_99.99' : 'monthly_19.99',
        },
      });
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (!userId) break;

      const statusMap: Record<string, string> = {
        active: 'ACTIVE',
        past_due: 'PAST_DUE',
        canceled: 'CANCELED',
        trialing: 'TRIALING',
      };

      await prisma.subscription.update({
        where: { userId },
        data: {
          status: (statusMap[subscription.status] || 'ACTIVE') as any,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (!userId) break;

      await prisma.subscription.update({
        where: { userId },
        data: {
          tier: 'FREE',
          status: 'EXPIRED',
          currentPeriodEnd: new Date(),
        },
      });
      break;
    }
  }
}

export async function restorePurchases(userId: string, platform: string, receipt: string) {
  // Placeholder for App Store / Play Store receipt validation
  // In production, validate receipt with Apple/Google servers
  // then update subscription status accordingly
  return { restored: false, message: 'Receipt validation not yet implemented' };
}
