// App-wide constants

export const APP_NAME = 'Eiko Habits';
export const APP_DESCRIPTION = 'Build better habits, track your finances, and reach your goals with AI-powered coaching.';

export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/eikohabits',
  github: 'https://github.com/eikohabits',
  instagram: 'https://instagram.com/eikohabits',
};

export const PRICING = {
  free: {
    name: 'Free',
    price: 0,
    interval: 'forever',
    features: [
      'Up to 3 active goals',
      'Up to 5 active habits',
      'Daily check-ins & streaks',
      'Basic finance tracking',
      'Progress dashboard',
    ],
  },
  monthly: {
    name: 'Premium',
    price: 19.99,
    interval: 'month',
    features: [
      'Unlimited goals & habits',
      'AI Coach — personalized routines',
      'AI financial action plans',
      'Weekly AI progress reviews',
      'AI check-in notifications',
      'Advanced analytics & forecasts',
      'Priority support',
    ],
  },
  yearly: {
    name: 'Premium',
    price: 99.99,
    interval: 'year',
    savingsPercent: 58,
    features: [
      'Unlimited goals & habits',
      'AI Coach — personalized routines',
      'AI financial action plans',
      'Weekly AI progress reviews',
      'AI check-in notifications',
      'Advanced analytics & forecasts',
      'Priority support',
    ],
  },
};

export const ROUTES = {
  home: '/',
  pricing: '/pricing',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  habits: '/habits',
  goals: '/goals',
  finance: '/finance',
  coach: '/coach',
  analytics: '/analytics',
  settings: '/settings',
};

export const API_ROUTES = {
  auth: {
    login: '/api/v1/auth/login',
    register: '/api/v1/auth/register',
    logout: '/api/v1/auth/logout',
    refresh: '/api/v1/auth/refresh',
  },
  dashboard: {
    overview: '/api/v1/dashboard/overview',
  },
  habits: {
    list: '/api/v1/habits',
    create: '/api/v1/habits',
    update: (id: string) => `/api/v1/habits/${id}`,
    delete: (id: string) => `/api/v1/habits/${id}`,
    complete: (id: string) => `/api/v1/habits/${id}/complete`,
  },
  goals: {
    list: '/api/v1/goals',
    create: '/api/v1/goals',
    update: (id: string) => `/api/v1/goals/${id}`,
    delete: (id: string) => `/api/v1/goals/${id}`,
  },
  finance: {
    list: '/api/v1/finance',
    create: '/api/v1/finance',
    update: (id: string) => `/api/v1/finance/${id}`,
    delete: (id: string) => `/api/v1/finance/${id}`,
  },
};
