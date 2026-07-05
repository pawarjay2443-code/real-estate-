"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingSchema = exports.createBookingSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createBookingSchema = zod_1.z.object({
    body: zod_1.z.object({
        propertyId: zod_1.z.string().uuid('Invalid property ID format'),
        scheduledDate: zod_1.z.string().datetime({ message: 'Must be a valid ISO Date string' }),
        notes: zod_1.z.string().optional(),
    }),
});
exports.updateBookingSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.nativeEnum(client_1.BookingStatus).optional(),
        scheduledDate: zod_1.z.string().datetime().optional(),
        notes: zod_1.z.string().optional(),
    }),
});
