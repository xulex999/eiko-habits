export type HabitFrequency = 'DAILY' | 'WEEKDAYS' | 'WEEKENDS' | 'SPECIFIC_DAYS' | 'WEEKLY' | 'MONTHLY';

export interface Habit {
  id: string;
  userId: string;
  goalId: string | null;
  title: string;
  description: string | null;
  frequency: HabitFrequency;
  daysOfWeek: number; // Bitmask: Mon=1, Tue=2, Wed=4, Thu=8, Fri=16, Sat=32, Sun=64
  targetPerPeriod: number;
  reminderTime: string | null; // "HH:mm"
  isActive: boolean;
  color: string;
  icon: string;
  sortOrder: number;
  currentStreak: number;
  longestStreak: number;
  consistencyScore: number; // 0.0 to 1.0
  createdAt: string;
  updatedAt: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  completedAt: string;
  date: string; // "YYYY-MM-DD"
  value: number;
  note: string | null;
  skipped: boolean;
  createdAt: string;
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  consistencyScore: number;
  last7Days: number;
  last30Days: number;
  calendarHeatmap: Record<string, number>; // "YYYY-MM-DD" -> value
}

export interface HabitWithTodayStatus extends Habit {
  completedToday: boolean;
  todayLog: HabitLog | null;
}

export interface CreateHabitInput {
  title: string;
  description?: string;
  goalId?: string;
  frequency?: HabitFrequency;
  daysOfWeek?: number;
  targetPerPeriod?: number;
  reminderTime?: string;
  color?: string;
  icon?: string;
}

export interface UpdateHabitInput {
  title?: string;
  description?: string;
  goalId?: string | null;
  frequency?: HabitFrequency;
  daysOfWeek?: number;
  targetPerPeriod?: number;
  reminderTime?: string | null;
  isActive?: boolean;
  color?: string;
  icon?: string;
  sortOrder?: number;
}

export interface CheckInInput {
  value?: number;
  note?: string;
  date?: string; // "YYYY-MM-DD", defaults to today
}

export interface BatchCheckInInput {
  habitIds: string[];
  date?: string;
}
