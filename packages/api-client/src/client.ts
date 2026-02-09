import type {
  ApiResponse,
  AuthResponse,
  LoginInput,
  RegisterInput,
  DashboardOverview,
  Goal,
  CreateGoalInput,
  UpdateGoalInput,
  Habit,
  HabitStats,
  HabitWithTodayStatus,
  CreateHabitInput,
  UpdateHabitInput,
  CheckInInput,
  BatchCheckInInput,
  FinancialGoal,
  FinancialForecast,
  FinancialSummary,
  CreateFinancialGoalInput,
  CreateContributionInput,
  Contribution,
  AIRecommendation,
  Subscription,
  User,
} from '@eiko/shared-types';

export interface ApiClientConfig {
  baseUrl: string;
  getAccessToken: () => string | null;
  onUnauthorized?: () => void;
}

export interface ApiClient {
  // Auth
  login(input: LoginInput): Promise<ApiResponse<AuthResponse>>;
  register(input: RegisterInput): Promise<ApiResponse<AuthResponse>>;
  refreshToken(): Promise<ApiResponse<{ tokens: { accessToken: string; expiresIn: number } }>>;
  logout(): Promise<ApiResponse<void>>;

  // Users
  getProfile(): Promise<ApiResponse<User>>;
  updateProfile(data: Partial<User>): Promise<ApiResponse<User>>;

  // Dashboard
  getDashboardOverview(): Promise<ApiResponse<DashboardOverview>>;

  // Goals
  listGoals(params?: { status?: string; category?: string }): Promise<ApiResponse<Goal[]>>;
  createGoal(data: CreateGoalInput): Promise<ApiResponse<Goal>>;
  getGoal(id: string): Promise<ApiResponse<Goal>>;
  updateGoal(id: string, data: UpdateGoalInput): Promise<ApiResponse<Goal>>;
  deleteGoal(id: string): Promise<ApiResponse<void>>;

  // Habits
  listHabits(params?: { active?: boolean }): Promise<ApiResponse<Habit[]>>;
  createHabit(data: CreateHabitInput): Promise<ApiResponse<Habit>>;
  getHabit(id: string): Promise<ApiResponse<Habit>>;
  updateHabit(id: string, data: UpdateHabitInput): Promise<ApiResponse<Habit>>;
  deleteHabit(id: string): Promise<ApiResponse<void>>;
  checkIn(habitId: string, data?: CheckInInput): Promise<ApiResponse<void>>;
  batchCheckIn(data: BatchCheckInInput): Promise<ApiResponse<void>>;
  getHabitStats(id: string): Promise<ApiResponse<HabitStats>>;
  getTodaysHabits(): Promise<ApiResponse<HabitWithTodayStatus[]>>;

  // Finance
  listFinancialGoals(params?: { type?: string }): Promise<ApiResponse<FinancialGoal[]>>;
  createFinancialGoal(data: CreateFinancialGoalInput): Promise<ApiResponse<FinancialGoal>>;
  getFinancialGoal(id: string): Promise<ApiResponse<FinancialGoal>>;
  addContribution(goalId: string, data: CreateContributionInput): Promise<ApiResponse<Contribution>>;
  getFinancialForecast(goalId: string): Promise<ApiResponse<FinancialForecast>>;
  getFinancialSummary(): Promise<ApiResponse<FinancialSummary>>;

  // AI
  getRecommendations(): Promise<ApiResponse<AIRecommendation[]>>;
  generateHabitRoutine(data?: { focusAreas?: string[] }): Promise<ApiResponse<AIRecommendation>>;
  generateFinancialPlan(data?: { financialGoalId?: string }): Promise<ApiResponse<AIRecommendation>>;
  generateWeeklyReview(): Promise<ApiResponse<AIRecommendation>>;
  chat(message: string): Promise<ApiResponse<{ text: string }>>;

  // Subscriptions
  getSubscriptionStatus(): Promise<ApiResponse<Subscription>>;
  createCheckout(priceType: 'monthly' | 'annual'): Promise<ApiResponse<{ checkoutUrl: string }>>;
  cancelSubscription(): Promise<ApiResponse<void>>;
}

export function createApiClient(config: ApiClientConfig): ApiClient {
  async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const token = config.getAccessToken();
    const res = await fetch(`${config.baseUrl}/api/v1${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
      credentials: 'include',
    });

    if (res.status === 401) {
      config.onUnauthorized?.();
    }

    return res.json();
  }

  function get<T>(path: string) {
    return request<T>(path);
  }

  function post<T>(path: string, body?: unknown) {
    return request<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  function patch<T>(path: string, body?: unknown) {
    return request<T>(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  function del<T>(path: string) {
    return request<T>(path, { method: 'DELETE' });
  }

  return {
    // Auth
    login: (input) => post('/auth/login', input),
    register: (input) => post('/auth/register', input),
    refreshToken: () => post('/auth/refresh'),
    logout: () => post('/auth/logout'),

    // Users
    getProfile: () => get('/users/me'),
    updateProfile: (data) => patch('/users/me', data),

    // Dashboard
    getDashboardOverview: () => get('/dashboard/overview'),

    // Goals
    listGoals: (params) => {
      const qs = new URLSearchParams(params as Record<string, string>).toString();
      return get(`/goals${qs ? `?${qs}` : ''}`);
    },
    createGoal: (data) => post('/goals', data),
    getGoal: (id) => get(`/goals/${id}`),
    updateGoal: (id, data) => patch(`/goals/${id}`, data),
    deleteGoal: (id) => del(`/goals/${id}`),

    // Habits
    listHabits: (params) => {
      const qs = params ? new URLSearchParams(params as any).toString() : '';
      return get(`/habits${qs ? `?${qs}` : ''}`);
    },
    createHabit: (data) => post('/habits', data),
    getHabit: (id) => get(`/habits/${id}`),
    updateHabit: (id, data) => patch(`/habits/${id}`, data),
    deleteHabit: (id) => del(`/habits/${id}`),
    checkIn: (habitId, data) => post(`/habits/${habitId}/check-in`, data || {}),
    batchCheckIn: (data) => post('/habits/batch-check-in', data),
    getHabitStats: (id) => get(`/habits/${id}/stats`),
    getTodaysHabits: () => get('/habits/today'),

    // Finance
    listFinancialGoals: (params) => {
      const qs = params ? new URLSearchParams(params as any).toString() : '';
      return get(`/finance/goals${qs ? `?${qs}` : ''}`);
    },
    createFinancialGoal: (data) => post('/finance/goals', data),
    getFinancialGoal: (id) => get(`/finance/goals/${id}`),
    addContribution: (goalId, data) => post(`/finance/goals/${goalId}/contributions`, data),
    getFinancialForecast: (goalId) => get(`/finance/goals/${goalId}/forecast`),
    getFinancialSummary: () => get('/finance/summary'),

    // AI
    getRecommendations: () => get('/ai/recommendations'),
    generateHabitRoutine: (data) => post('/ai/habit-routine', data || {}),
    generateFinancialPlan: (data) => post('/ai/financial-plan', data || {}),
    generateWeeklyReview: () => post('/ai/weekly-review'),
    chat: (message) => post('/ai/chat', { message }),

    // Subscriptions
    getSubscriptionStatus: () => get('/subscriptions/status'),
    createCheckout: (priceType) => post('/subscriptions/checkout', { priceType }),
    cancelSubscription: () => post('/subscriptions/cancel'),
  };
}
