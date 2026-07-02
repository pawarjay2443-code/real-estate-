import request from 'supertest';
import app from '../app';
import { prisma } from '../config/db';
import { AuthService } from '../modules/auth/auth.service';

jest.mock('../config/db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    agent: {
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

describe('Auth Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new buyer user successfully', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 'user-uuid',
        name: 'Alice',
        email: 'alice@example.com',
        phone: '+1234567890',
        role: 'BUYER',
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Alice',
          email: 'alice@example.com',
          password: 'password123',
          phone: '+1234567890',
          role: 'BUYER',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('alice@example.com');
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('refreshToken');
    });

    it('should fail if email is already registered', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'existing-id' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Alice',
          email: 'alice@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Email already registered');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const hashedPassword = await AuthService.hashPassword('password123');
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-uuid',
        name: 'Alice',
        email: 'alice@example.com',
        password: hashedPassword,
        role: 'BUYER',
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'alice@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('alice@example.com');
      expect(res.body.data).toHaveProperty('accessToken');
    });

    it('should fail login with incorrect password', async () => {
      const hashedPassword = await AuthService.hashPassword('password123');
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-uuid',
        name: 'Alice',
        email: 'alice@example.com',
        password: hashedPassword,
        role: 'BUYER',
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'alice@example.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email or password');
    });
  });
});
