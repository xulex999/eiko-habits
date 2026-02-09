export type AIRecommendationType =
  | 'HABIT_ROUTINE'
  | 'FINANCIAL_PLAN'
  | 'WEEKLY_REVIEW'
  | 'GOAL_ADJUSTMENT'
  | 'MOTIVATION';

export interface AIRecommendation {
  id: string;
  userId: string;
  type: AIRecommendationType;
  title: string;
  content: string; // Markdown
  metadata: {
    provider?: string;
    model?: string;
    tokensUsed?: number;
    context?: string;
  } | null;
  isRead: boolean;
  isDismissed: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface AICheckInConfig {
  times: string[]; // Array of "HH:mm"
  enabled: boolean;
}

export interface GenerateRoutineInput {
  focusAreas?: string[];
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
}

export interface GenerateFinancialPlanInput {
  financialGoalId?: string;
}

export interface GenerateWeeklyReviewInput {
  weekStartDate?: string;
}
