"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAgentSchema = exports.applyAgentSchema = void 0;
const zod_1 = require("zod");
exports.applyAgentSchema = zod_1.z.object({
    body: zod_1.z.object({
        agencyName: zod_1.z.string().min(2, 'Agency name is required').optional(),
        licenseNumber: zod_1.z.string().min(2, 'License number is required').optional(),
        bio: zod_1.z.string().optional(),
        yearsOfExperience: zod_1.z.coerce.number().min(0).default(0),
    }),
});
exports.verifyAgentSchema = zod_1.z.object({
    body: zod_1.z.object({
        verifiedStatus: zod_1.z.boolean(),
    }),
});
