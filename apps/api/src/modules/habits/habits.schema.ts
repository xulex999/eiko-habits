import { z } from 'zod';

const habitFrequencyEnum = z.enum([
  'DAILY',
  'WEEKDAYS',
  'WEEKENDS',
  'SPECIFIC_DAYS',
  'WEEKLY',
  'MONTHLY',
]);

export const createHabitSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).nullable().optional(),
  goalId: z.string().cuid().nullable().optional(),
  frequency: habitFrequencyEnum.optional(),
  daysOfWeek: z.number().int().min(0).max(127).optional(),
  targetPerPeriod: z.number().int().positive().optional(),
  reminderTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Must be in HH:mm format')
    .nullable()
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color')
    .optional(),
  icon: z.string().min(1).max(50).optional(),
});

export const updateHabitSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).nullable().optional(),
  goalId: z.string().cuid().nullable().optional(),
  frequency: habitFrequencyEnum.optional(),
  daysOfWeek: z.number().int().min(0).max(127).optional(),
  targetPerPeriod: z.number().int().positive().optional(),
  reminderTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Must be in HH:mm format')
    .nullable()
    .optional(),
  isActive: z.boolean().optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color')
    .optional(),
  icon: z.string().min(1).max(50).optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export const checkInSchema = z.object({
  value: z.number().positive().default(1),
  note: z.string().max(500).nullable().optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be in YYYY-MM-DD format')
    .optional(),
});

export const batchCheckInSchema = z.object({
  habitIds: z.array(z.string().cuid()).min(1).max(50),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be in YYYY-MM-DD format')
    .optional(),
});

export const habitsQuerySchema = z.object({
  active: z.coerce.boolean().optional(),
  goalId: z.string().cuid().optional(),
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().max(100).optional(),
});

export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;
export type CheckInInput = z.infer<typeof checkInSchema>;
export type BatchCheckInInput = z.infer<typeof batchCheckInSchema>;
export type HabitsQueryInput = z.infer<typeof habitsQuerySchema>;
