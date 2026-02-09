import { z } from 'zod';

export const createFinancialGoalSchema = z.object({
  type: z.enum(['BUDGET', 'SAVINGS', 'DEBT_PAYOFF', 'INVESTMENT']),
  title: z.string().min(1, 'Title is required').max(200),
  targetAmount: z.number().positive('Target amount must be positive'),
  description: z.string().max(1000).optional(),
  currentAmount: z.number().min(0).optional(),
  currency: z.string().length(3).optional(),
  targetDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  interestRate: z.number().min(0).max(100).optional(),
  minimumPayment: z.number().min(0).optional(),
  monthlyBudget: z.number().min(0).optional(),
  budgetCategory: z.string().max(100).optional(),
  color: z.string().max(20).optional(),
  icon: z.string().max(50).optional(),
});

export const updateFinancialGoalSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).nullable().optional(),
  targetAmount: z.number().positive().optional(),
  targetDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).nullable().optional(),
  interestRate: z.number().min(0).max(100).nullable().optional(),
  minimumPayment: z.number().min(0).nullable().optional(),
  monthlyBudget: z.number().min(0).nullable().optional(),
  budgetCategory: z.string().max(100).nullable().optional(),
  isActive: z.boolean().optional(),
  color: z.string().max(20).optional(),
  icon: z.string().max(50).optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export const createContributionSchema = z.object({
  type: z.enum(['DEPOSIT', 'WITHDRAWAL', 'PAYMENT', 'ADJUSTMENT']),
  amount: z.number().positive('Amount must be positive'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').optional(),
  note: z.string().max(500).optional(),
});

export const financialGoalQuerySchema = z.object({
  type: z.enum(['BUDGET', 'SAVINGS', 'DEBT_PAYOFF', 'INVESTMENT']).optional(),
  active: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
  page: z.coerce.number().int().min(1).optional(),
  perPage: z.coerce.number().int().min(1).max(100).optional(),
});

export const contributionQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  perPage: z.coerce.number().int().min(1).max(100).optional(),
});

export type CreateFinancialGoalInput = z.infer<typeof createFinancialGoalSchema>;
export type UpdateFinancialGoalInput = z.infer<typeof updateFinancialGoalSchema>;
export type CreateContributionInput = z.infer<typeof createContributionSchema>;
export type FinancialGoalQuery = z.infer<typeof financialGoalQuerySchema>;
