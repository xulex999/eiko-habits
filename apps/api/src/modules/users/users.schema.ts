import { z } from 'zod';

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().nullable().optional(),
  timezone: z.string().min(1).max(100).optional(),
});

export const onboardingSchema = z.object({
  topGoals: z.array(z.string().min(1)).min(1).max(10),
  currentSituation: z.object({
    incomeBracket: z.string().optional(),
    lifeStage: z.string().optional(),
    biggestChallenge: z.string().optional(),
    interestedInFinance: z.boolean().optional(),
  }),
});

export const updateNotificationsSchema = z.object({
  channel: z.enum(['PUSH', 'EMAIL']),
  enabled: z.boolean(),
  habitReminders: z.boolean(),
  streakAlerts: z.boolean(),
  weeklyReviews: z.boolean(),
  aiInsights: z.boolean(),
  financialAlerts: z.boolean(),
  quietHoursStart: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Must be in HH:mm format')
    .nullable()
    .optional(),
  quietHoursEnd: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Must be in HH:mm format')
    .nullable()
    .optional(),
  aiCheckInTimes: z
    .array(z.string().regex(/^\d{2}:\d{2}$/, 'Must be in HH:mm format'))
    .optional(),
});

export const registerDeviceSchema = z.object({
  pushToken: z.string().nullable().optional(),
  platform: z.enum(['ios', 'android', 'web']),
  deviceName: z.string().nullable().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type UpdateNotificationsInput = z.infer<typeof updateNotificationsSchema>;
export type RegisterDeviceInput = z.infer<typeof registerDeviceSchema>;
