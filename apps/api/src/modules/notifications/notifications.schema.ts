import { z } from 'zod';

export const notificationsQuerySchema = z.object({
  unreadOnly: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().max(100).optional(),
});

export type NotificationsQueryInput = z.infer<typeof notificationsQuerySchema>;
