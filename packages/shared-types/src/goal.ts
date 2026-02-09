export type GoalStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';

export type GoalCategory =
  | 'HEALTH'
  | 'FITNESS'
  | 'CAREER'
  | 'EDUCATION'
  | 'FINANCE'
  | 'RELATIONSHIPS'
  | 'CREATIVITY'
  | 'MINDFULNESS'
  | 'CUSTOM';

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  category: GoalCategory;
  status: GoalStatus;
  targetDate: string | null;
  targetValue: number | null;
  currentValue: number;
  unit: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface GoalWithHabits extends Goal {
  habits: import('./habit').Habit[];
}

export interface CreateGoalInput {
  title: string;
  description?: string;
  category?: GoalCategory;
  targetDate?: string;
  targetValue?: number;
  unit?: string;
}

export interface UpdateGoalInput {
  title?: string;
  description?: string;
  category?: GoalCategory;
  status?: GoalStatus;
  targetDate?: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  sortOrder?: number;
}
