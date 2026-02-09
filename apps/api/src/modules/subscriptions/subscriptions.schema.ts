import { z } from 'zod';

export const createCheckoutSchema = z.object({
  priceType: z.enum(['monthly', 'annual']),
});

export const verifyReceiptSchema = z.object({
  platform: z.enum(['APP_STORE', 'PLAY_STORE']),
  receipt: z.string().min(1),
});
