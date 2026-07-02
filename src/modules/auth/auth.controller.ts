import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db';
import { AuthService } from './auth.service';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../middlewares/error-handler';
import nodemailer from 'nodemailer';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, phone, role } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return next(new AppError('Email already registered', 400));
      }

      const hashedPassword = await AuthService.hashPassword(password);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
          role,
          isVerified: false,
        },
      });

      // If registered as an agent, automatically scaffold the Agent profile too
      if (role === 'AGENT') {
        await prisma.agent.create({
          data: {
            userId: user.id,
            verifiedStatus: false,
          },
        });
      }

      const payload = { id: user.id, email: user.email, role: user.role };
      const accessToken = AuthService.generateAccessToken(payload);
      const refreshToken = AuthService.generateRefreshToken(payload);

      // Remove password from user object in response
      const { password: _, ...userWithoutPassword } = user;

      return sendSuccess(res, 'User registered successfully', {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      }, 201);
    } catch (error) {
      return next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return next(new AppError('Invalid email or password', 401));
      }

      const isMatch = await AuthService.comparePasswords(password, user.password);
      if (!isMatch) {
        return next(new AppError('Invalid email or password', 401));
      }

      const payload = { id: user.id, email: user.email, role: user.role };
      const accessToken = AuthService.generateAccessToken(payload);
      const refreshToken = AuthService.generateRefreshToken(payload);

      const { password: _, ...userWithoutPassword } = user;

      return sendSuccess(res, 'Login successful', {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      const decoded = AuthService.verifyRefreshToken(refreshToken);
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) {
        return next(new AppError('User not found', 404));
      }

      const payload = { id: user.id, email: user.email, role: user.role };
      const newAccessToken = AuthService.generateAccessToken(payload);

      return sendSuccess(res, 'Token refreshed successfully', {
        accessToken: newAccessToken,
      });
    } catch (error) {
      return next(new AppError('Invalid refresh token', 401));
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        // Blacklist access token for 15 minutes (900 seconds)
        await AuthService.blacklistToken(token, 900);
      }
      return sendSuccess(res, 'Logged out successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        // Return success even if user not found to prevent user enumeration
        return sendSuccess(res, 'If that email exists, we have sent a reset password link');
      }

      const resetToken = AuthService.generatePasswordResetToken(email);

      // Simulate sending email (Nodemailer)
      if (env.EMAIL_HOST && env.EMAIL_USER && env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          host: env.EMAIL_HOST,
          port: env.EMAIL_PORT,
          auth: {
            user: env.EMAIL_USER,
            pass: env.EMAIL_PASS,
          },
        });

        const resetUrl = `http://localhost:5000/api/auth/reset-password?token=${resetToken}`;
        await transporter.sendMail({
          from: env.EMAIL_FROM,
          to: email,
          subject: 'Password Reset Request',
          text: `Please reset your password by clicking this link: ${resetUrl}`,
          html: `<p>Please reset your password by clicking <a href="${resetUrl}">here</a></p>`,
        });
      } else {
        logger.info(`Password reset token generated for ${email}: ${resetToken}`);
      }

      return sendSuccess(res, 'If that email exists, we have sent a reset password link', { token: resetToken });
    } catch (error) {
      return next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, password } = req.body;

      const decoded = AuthService.verifyPasswordResetToken(token);
      const email = decoded.email;

      const hashedPassword = await AuthService.hashPassword(password);
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      });

      return sendSuccess(res, 'Password reset successfully');
    } catch (error) {
      return next(new AppError('Invalid or expired reset token', 400));
    }
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Not authenticated', 401));
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { agent: true },
      });

      if (!user) {
        return next(new AppError('User not found', 404));
      }

      const { password: _, ...userWithoutPassword } = user;
      return sendSuccess(res, 'User details retrieved', { user: userWithoutPassword });
    } catch (error) {
      return next(error);
    }
  }
}
