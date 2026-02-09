import { z } from 'zod';

const goalCategoryEnum = z.enum([
  'HEALTH',
  'FITNESS',
  'CAREER',
  'EDUCATION',
  'FINANCE',
  'RELATIONSHIPS',
  'CREATIVITY',
  'MINDFULNESS',
  'CUSTOM',
]);

const goalStatusEnum = z.enum(['ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED']);

export const createGoalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).nullable().optional(),
  category: goalCategoryEnum.optional(),
  targetDate: z.string().datetime().nullable().optional(),
  targetValue: z.number().positive().nullable().optional(),
  unit: z.string().max(50).nullable().optional(),
});

export const updateGoalSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).nullable().optional(),
  category: goalCategoryEnum.optional(),
  status: goalStatusEnum.optional(),
  targetDate: z.string().datetime().nullable().optional(),
  targetValue: z.number().positive().nullable().optional(),
  currentValue: z.number().min(0).optional(),
  unit: z.string().max(50).nullable().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export const updateProgressSchema = z.object({
  currentValue: z.number().min(0),
});

export const goalsQuerySchema = z.object({
  status: goalStatusEnum.optional(),
  category: goalCategoryEnum.optional(),
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().max(100).optional(),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
export type UpdateProgressInput = z.infer<typeof updateProgressSchema>;
export type GoalsQueryInput = z.infer<typeof goalsQuerySchema>;
