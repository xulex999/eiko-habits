import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(2000).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export const updateTodoSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(2000).nullable().optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'SKIPPED']).optional(),
  sortOrder: z.number().int().min(0).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
});

export const todosQuerySchema = z.object({
  status: z.enum(['PENDING', 'COMPLETED', 'SKIPPED']).optional(),
  source: z.enum(['USER', 'AI_GENERATED']).optional(),
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().max(100).optional(),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type TodosQueryInput = z.infer<typeof todosQuerySchema>;
