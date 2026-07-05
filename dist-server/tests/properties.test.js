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
        property: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            count: jest.fn(),
        },
        agent: {
            findUnique: jest.fn(),
        },
    },
}));
jest.mock('../config/redis', () => ({
    redisClient: {
        isOpen: true,
        get: jest.fn().mockResolvedValue(null),
        setEx: jest.fn().mockResolvedValue('OK'),
        del: jest.fn().mockResolvedValue(1),
    },
}));
describe('Properties Integration Tests', () => {
    let agentToken;
    beforeAll(() => {
        // Generate valid JWT token for an AGENT
        agentToken = auth_service_1.AuthService.generateAccessToken({
            id: 'agent-user-uuid',
            email: 'agent@example.com',
            role: 'AGENT',
        });
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('POST /api/properties', () => {
        it('should create a property listing successfully when user is an AGENT', async () => {
            const mockProperty = {
                id: 'prop-uuid',
                title: 'Luxury Apartment',
                description: 'Spectacular downtown luxury apartment.',
                propertyType: 'APARTMENT',
                listingType: 'SALE',
                price: 450000,
                area: 1200,
                bedrooms: 2,
                bathrooms: 2,
                address: '456 Wall St',
                city: 'New York',
                state: 'NY',
                pincode: '10005',
                latitude: 40.706,
                longitude: -74.009,
                ownerId: 'agent-user-uuid',
                agentId: null,
                status: 'AVAILABLE',
            };
            db_1.prisma.property.create.mockResolvedValue(mockProperty);
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/api/properties')
                .set('Authorization', `Bearer ${agentToken}`)
                .send({
                title: 'Luxury Apartment',
                description: 'Spectacular downtown luxury apartment.',
                propertyType: 'APARTMENT',
                listingType: 'SALE',
                price: 450000,
                area: 1200,
                bedrooms: 2,
                bathrooms: 2,
                address: '456 Wall St',
                city: 'New York',
                state: 'NY',
                pincode: '10005',
                latitude: 40.706,
                longitude: -74.009,
            });
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.property.title).toBe('Luxury Apartment');
        });
        it('should fail creation if user is a BUYER', async () => {
            const buyerToken = auth_service_1.AuthService.generateAccessToken({
                id: 'buyer-user-uuid',
                email: 'buyer@example.com',
                role: 'BUYER',
            });
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/api/properties')
                .set('Authorization', `Bearer ${buyerToken}`)
                .send({
                title: 'Luxury Apartment',
                description: 'Spectacular downtown luxury apartment.',
                propertyType: 'APARTMENT',
                listingType: 'SALE',
                price: 450000,
                area: 1200,
                bedrooms: 2,
                bathrooms: 2,
                address: '456 Wall St',
                city: 'New York',
                state: 'NY',
                pincode: '10005',
                latitude: 40.706,
                longitude: -74.009,
            });
            expect(res.status).toBe(403);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Unauthorized');
        });
    });
    describe('GET /api/properties', () => {
        it('should retrieve list of properties with pagination info', async () => {
            db_1.prisma.property.findMany.mockResolvedValue([
                { id: 'prop1', title: 'Prop 1', price: 100000 },
                { id: 'prop2', title: 'Prop 2', price: 120000 },
            ]);
            db_1.prisma.property.count.mockResolvedValue(2);
            const res = await (0, supertest_1.default)(app_1.default).get('/api/properties?city=New York');
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.properties).toHaveLength(2);
            expect(res.body.data.pagination.total).toBe(2);
        });
    });
});
