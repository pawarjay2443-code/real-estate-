import { z } from 'zod';

export const applyAgentSchema = z.object({
  body: z.object({
    agencyName: z.string().min(2, 'Agency name is required').optional(),
    licenseNumber: z.string().min(2, 'License number is required').optional(),
    bio: z.string().optional(),
    yearsOfExperience: z.coerce.number().min(0).default(0),
  }),
});

export const verifyAgentSchema = z.object({
  body: z.object({
    verifiedStatus: z.boolean(),
  }),
});
