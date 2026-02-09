export type FinancialGoalType = 'BUDGET' | 'SAVINGS' | 'DEBT_PAYOFF' | 'INVESTMENT';
export type ContributionType = 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT' | 'ADJUSTMENT';
export type PaceStatus = 'ahead' | 'on_track' | 'behind';

export interface FinancialGoal {
  id: string;
  userId: string;
  type: FinancialGoalType;
  title: string;
  description: string | null;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  startDate: string;
  targetDate: string | null;
  interestRate: number | null;
  minimumPayment: number | null;
  monthlyBudget: number | null;
  budgetCategory: string | null;
  isActive: boolean;
  color: string;
  icon: string;
  sortOrder: number;
  projectedCompletionDate: string | null;
  paceStatus: PaceStatus | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface Contribution {
  id: string;
  financialGoalId: string;
  type: ContributionType;
  amount: number;
  date: string;
  note: string | null;
  createdAt: string;
}

export interface FinancialForecast {
  projectedCompletionDate: string | null;
  paceStatus: PaceStatus;
  requiredMonthlyAmount: number;
  requiredWeeklyAmount: number;
  requiredDailyAmount: number;
  averageMonthlyPace: number;
  daysRemaining: number | null;
  percentComplete: number;
  confidenceLevel: 'high' | 'medium' | 'low';
}

export interface FinancialSummary {
  totalSavingsProgress: number;
  totalSavingsTarget: number;
  totalDebtRemaining: number;
  totalDebtOriginal: number;
  monthlyBudgetUtilization: number; // 0.0 to 1.0
  activeGoals: number;
  goalsOnTrack: number;
  goalsBehind: number;
}

export interface CreateFinancialGoalInput {
  type: FinancialGoalType;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount?: number;
  currency?: string;
  targetDate?: string;
  interestRate?: number;
  minimumPayment?: number;
  monthlyBudget?: number;
  budgetCategory?: string;
  color?: string;
  icon?: string;
}

export interface UpdateFinancialGoalInput {
  title?: string;
  description?: string;
  targetAmount?: number;
  targetDate?: string;
  interestRate?: number;
  minimumPayment?: number;
  monthlyBudget?: number;
  budgetCategory?: string;
  isActive?: boolean;
  color?: string;
  icon?: string;
  sortOrder?: number;
}

export interface CreateContributionInput {
  type: ContributionType;
  amount: number;
  date?: string;
  note?: string;
}
