"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = void 0;
const zod_1 = require("zod");
exports.updateUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters').optional(),
        phone: zod_1.z.string().optional(),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters').optional(),
    }),
});
