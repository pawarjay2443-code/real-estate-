"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviewSchema = void 0;
const zod_1 = require("zod");
exports.createReviewSchema = zod_1.z.object({
    body: zod_1.z.object({
        propertyId: zod_1.z.string().uuid().optional(),
        agentId: zod_1.z.string().uuid().optional(),
        rating: zod_1.z.coerce.number().int().min(1).max(5),
        comment: zod_1.z.string().min(3, 'Comment must be at least 3 characters'),
    }).refine((data) => data.propertyId || data.agentId, {
        message: 'Either propertyId or agentId must be provided',
        path: ['propertyId'],
    }),
});
