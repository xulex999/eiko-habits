export type SubscriptionTier = 'FREE' | 'PREMIUM';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'EXPIRED' | 'TRIALING';
export type SubscriptionPlatform = 'STRIPE' | 'APP_STORE' | 'PLAY_STORE';

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  platform: SubscriptionPlatform | null;
  externalId: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  priceId: string | null;
  trialEndsAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const PRICING = {
  monthly: {
    amount: 19.99,
    currency: 'USD',
    interval: 'month' as const,
    label: '$19.99/month',
  },
  annual: {
    amount: 99.99,
    currency: 'USD',
    interval: 'year' as const,
    label: '$99.99/year',
    savings: '58%',
  },
} as const;

export const FREE_TIER_LIMITS = {
  maxActiveGoals: 3,
  maxActiveHabits: 5,
  hasAICoach: false,
  hasAdvancedAnalytics: false,
} as const;

export const PREMIUM_TIER_LIMITS = {
  maxActiveGoals: Infinity,
  maxActiveHabits: Infinity,
  hasAICoach: true,
  hasAdvancedAnalytics: true,
} as const;
