"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertyInquiriesSchema = exports.updateInquiryStatusSchema = exports.createInquirySchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createInquirySchema = zod_1.z.object({
    body: zod_1.z.object({
        propertyId: zod_1.z.string().uuid('Invalid property ID format'),
        message: zod_1.z.string().min(5, 'Message must be at least 5 characters'),
    }),
});
exports.updateInquiryStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.nativeEnum(client_1.InquiryStatus),
    }),
});
exports.getPropertyInquiriesSchema = zod_1.z.object({
    params: zod_1.z.object({
        propertyId: zod_1.z.string().uuid('Invalid property ID format'),
    }),
});
