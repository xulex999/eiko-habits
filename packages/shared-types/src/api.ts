// API response envelope
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown[];
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  perPage?: number;
}

// Auth
export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  displayName: string;
}

export interface OAuthInput {
  idToken: string;
  provider: 'google' | 'apple';
}

export interface AuthTokens {
  accessToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: import('./user').User;
  tokens: AuthTokens;
}

// Dashboard
export interface DashboardOverview {
  greeting: string;
  todaysHabits: import('./habit').HabitWithTodayStatus[];
  activeGoalsCount: number;
  currentStreakHighlight: {
    habitTitle: string;
    streakDays: number;
  } | null;
  upcomingDeadlines: Array<{
    id: string;
    title: string;
    type: 'goal' | 'financial';
    targetDate: string;
    daysRemaining: number;
    percentComplete: number;
  }>;
  weeklySummary: {
    completionRates: number[]; // 7 values, Mon-Sun
    averageConsistency: number;
    habitsCompleted: number;
    habitsTotal: number;
    contributionsTotal: number;
  };
}
