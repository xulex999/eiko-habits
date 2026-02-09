import { z } from 'zod';

export const createJournalEntrySchema = z.object({
  title: z.string().max(200).optional(),
  content: z.string().min(1).max(10000),
  mood: z.number().int().min(1).max(5).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export const updateJournalEntrySchema = z.object({
  title: z.string().max(200).nullable().optional(),
  content: z.string().min(1).max(10000).optional(),
  mood: z.number().int().min(1).max(5).nullable().optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

export const journalQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().max(100).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export type CreateJournalEntryInput = z.infer<typeof createJournalEntrySchema>;
export type UpdateJournalEntryInput = z.infer<typeof updateJournalEntrySchema>;
export type JournalQueryInput = z.infer<typeof journalQuerySchema>;
