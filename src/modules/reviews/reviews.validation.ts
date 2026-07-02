import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    propertyId: z.string().uuid().optional(),
    agentId: z.string().uuid().optional(),
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().min(3, 'Comment must be at least 3 characters'),
  }).refine((data) => data.propertyId || data.agentId, {
    message: 'Either propertyId or agentId must be provided',
    path: ['propertyId'],
  }),
});
