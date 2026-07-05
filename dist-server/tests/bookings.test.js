"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const db_1 = require("../config/db");
const auth_service_1 = require("../modules/auth/auth.service");
jest.mock('../config/db', () => ({
    prisma: {
        booking: {
            create: jest.fn(),
            findMany: jest.fn(),
        },
        property: {
            findUnique: jest.fn(),
        },
        notification: {
            create: jest.fn(),
        },
    },
}));
jest.mock('../config/redis', () => ({
    redisClient: {
        isOpen: true,
        get: jest.fn().mockResolvedValue(null),
        setEx: jest.fn().mockResolvedValue('OK'),
    },
}));
describe('Bookings Integration Tests', () => {
    let buyerToken;
    beforeAll(() => {
        buyerToken = auth_service_1.AuthService.generateAccessToken({
            id: 'buyer-user-uuid',
            email: 'buyer@example.com',
            role: 'BUYER',
        });
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('POST /api/bookings', () => {
        it('should schedule a booking successfully', async () => {
            const mockProperty = {
                id: 'prop-uuid',
                title: 'Modern House',
                ownerId: 'owner-uuid',
                agent: null,
            };
            const mockBooking = {
                id: 'booking-uuid',
                propertyId: 'prop-uuid',
                userId: 'buyer-user-uuid',
                scheduledDate: new Date('2026-08-01T10:00:00.000Z'),
                status: 'PENDING',
                notes: 'Site visit request',
            };
            db_1.prisma.property.findUnique.mockResolvedValue(mockProperty);
            db_1.prisma.booking.create.mockResolvedValue(mockBooking);
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/api/bookings')
                .set('Authorization', `Bearer ${buyerToken}`)
                .send({
                propertyId: 'prop-uuid',
                scheduledDate: '2026-08-01T10:00:00.000Z',
                notes: 'Site visit request',
            });
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.booking.propertyId).toBe('prop-uuid');
            expect(db_1.prisma.notification.create).toHaveBeenCalled();
        });
    });
});
