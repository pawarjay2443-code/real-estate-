import { z } from 'zod';
import { InquiryStatus } from '@prisma/client';

export const createInquirySchema = z.object({
  body: z.object({
    propertyId: z.string().uuid('Invalid property ID format'),
    message: z.string().min(5, 'Message must be at least 5 characters'),
  }),
});

export const updateInquiryStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(InquiryStatus),
  }),
});
export const getPropertyInquiriesSchema = z.object({
  params: z.object({
    propertyId: z.string().uuid('Invalid property ID format'),
  }),
});
