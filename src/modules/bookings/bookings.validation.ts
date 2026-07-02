import { z } from 'zod';
import { BookingStatus } from '@prisma/client';

export const createBookingSchema = z.object({
  body: z.object({
    propertyId: z.string().uuid('Invalid property ID format'),
    scheduledDate: z.string().datetime({ message: 'Must be a valid ISO Date string' }),
    notes: z.string().optional(),
  }),
});

export const updateBookingSchema = z.object({
  body: z.object({
    status: z.nativeEnum(BookingStatus).optional(),
    scheduledDate: z.string().datetime().optional(),
    notes: z.string().optional(),
  }),
});
