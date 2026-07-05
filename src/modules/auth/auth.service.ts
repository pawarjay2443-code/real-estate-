import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { Role } from '@prisma/client';
import { env } from '../../config/env';
import { redisClient } from '../../config/redis';

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async comparePasswords(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
  }

  static generateAccessToken(payload: { id: string; email: string; role: Role }): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as StringValue,
    });
  }

  static generateRefreshToken(payload: { id: string; email: string; role: Role }): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as StringValue,
    });
  }

  static verifyAccessToken(token: string) {
    return jwt.verify(token, env.JWT_ACCESS_SECRET);
  }

  static verifyRefreshToken(token: string) {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: string; email: string; role: Role };
  }

  static async blacklistToken(token: string, expirySeconds: number = 900): Promise<void> {
    if (redisClient.isOpen) {
      await redisClient.setEx(`blacklist:${token}`, expirySeconds, 'true');
    }
  }

  static generatePasswordResetToken(email: string): string {
    return jwt.sign({ email }, env.JWT_ACCESS_SECRET, { expiresIn: '1h' as StringValue });
  }

  static verifyPasswordResetToken(token: string): { email: string } {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as { email: string };
  }
}
