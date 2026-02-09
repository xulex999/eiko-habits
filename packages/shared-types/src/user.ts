export type AuthProvider = 'EMAIL' | 'GOOGLE' | 'APPLE';

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  authProvider: AuthProvider;
  timezone: string;
  onboardingComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingData {
  id: string;
  userId: string;
  topGoals: string[];
  currentSituation: {
    incomeBracket?: string;
    lifeStage?: string;
    biggestChallenge?: string;
    interestedInFinance?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreference {
  id: string;
  userId: string;
  channel: 'PUSH' | 'EMAIL';
  enabled: boolean;
  habitReminders: boolean;
  streakAlerts: boolean;
  weeklyReviews: boolean;
  aiInsights: boolean;
  financialAlerts: boolean;
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
  aiCheckInTimes: string[]; // Array of "HH:mm" strings
}

export interface UserDevice {
  id: string;
  userId: string;
  pushToken: string | null;
  platform: 'ios' | 'android' | 'web';
  deviceName: string | null;
  lastActiveAt: string;
}
