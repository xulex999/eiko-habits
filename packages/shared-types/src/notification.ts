export type NotificationType =
  | 'STREAK_MILESTONE'
  | 'GOAL_DEADLINE'
  | 'HABIT_REMINDER'
  | 'FINANCIAL_ALERT'
  | 'AI_INSIGHT'
  | 'SYSTEM';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata: Record<string, unknown> | null;
  isRead: boolean;
  actionUrl: string | null;
  createdAt: string;
}
