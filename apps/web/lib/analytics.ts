// Analytics utility for tracking user events

export const analytics = {
  // Page views
  pageView: (url: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
        page_path: url,
      });
    }
  },

  // Custom events
  event: ({
    action,
    category,
    label,
    value,
  }: {
    action: string;
    category: string;
    label?: string;
    value?: number;
  }) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  },

  // Track sign up
  signUp: (method: 'email' | 'google' | 'apple') => {
    analytics.event({
      action: 'sign_up',
      category: 'engagement',
      label: method,
    });
  },

  // Track login
  login: (method: 'email' | 'google' | 'apple') => {
    analytics.event({
      action: 'login',
      category: 'engagement',
      label: method,
    });
  },

  // Track habit completion
  habitComplete: (habitId: string) => {
    analytics.event({
      action: 'habit_complete',
      category: 'engagement',
      label: habitId,
    });
  },

  // Track goal creation
  goalCreate: (category: string) => {
    analytics.event({
      action: 'goal_create',
      category: 'engagement',
      label: category,
    });
  },

  // Track subscription
  subscribe: (plan: 'monthly' | 'yearly') => {
    analytics.event({
      action: 'subscribe',
      category: 'conversion',
      label: plan,
      value: plan === 'monthly' ? 19.99 : 99.99,
    });
  },
};

// Extend window type for gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}
