import { z } from 'zod';

export const chatSchema = z.object({
  message: z.string().min(1).max(2000),
});

export const generateRoutineSchema = z.object({
  focusAreas: z.array(z.string()).optional(),
  timeOfDay: z.enum(['morning', 'afternoon', 'evening']).optional(),
});

export const generateFinancialPlanSchema = z.object({
  financialGoalId: z.string().optional(),
});

export const generateWeeklyReviewSchema = z.object({
  weekStartDate: z.string().optional(),
});
