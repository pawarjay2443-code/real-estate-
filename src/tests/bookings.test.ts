import request from 'supertest';
import app from '../app';
import { prisma } from '../config/db';
import { AuthService } from '../modules/auth/auth.service';

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
  let buyerToken: string;

  beforeAll(() => {
    buyerToken = AuthService.generateAccessToken({
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

      (prisma.property.findUnique as jest.Mock).mockResolvedValue(mockProperty);
      (prisma.booking.create as jest.Mock).mockResolvedValue(mockBooking);

      const res = await request(app)
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
      expect(prisma.notification.create).toHaveBeenCalled();
    });
  });
});
