import { z } from 'zod';
import { PaymentType } from '@prisma/client';

export const createPaymentIntentSchema = z.object({
  body: z.object({
    propertyId: z.string().uuid('Invalid property ID format'),
    amount: z.coerce.number().positive('Amount must be positive'),
    currency: z.string().default('usd'),
    type: z.nativeEnum(PaymentType),
  }),
});
