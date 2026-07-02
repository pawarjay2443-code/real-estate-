import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../middlewares/error-handler';
import { AuthService } from '../auth/auth.service';

export class UsersController {
  static async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        include: { agent: true },
      });

      if (!user) {
        return next(new AppError('User not found', 404));
      }

      const { password: _, ...userWithoutPassword } = user;
      return sendSuccess(res, 'User retrieved successfully', { user: userWithoutPassword });
    } catch (error) {
      return next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, phone, password } = req.body;

      // Check authorization (only owner or admin can update)
      if (req.user?.id !== id && req.user?.role !== 'ADMIN') {
        return next(new AppError('Unauthorized to update this user profile', 403));
      }

      const dataToUpdate: any = {};
      if (name) dataToUpdate.name = name;
      if (phone) dataToUpdate.phone = phone;
      if (password) {
        dataToUpdate.password = await AuthService.hashPassword(password);
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: dataToUpdate,
      });

      const { password: _, ...userWithoutPassword } = updatedUser;
      return sendSuccess(res, 'User profile updated successfully', { user: userWithoutPassword });
    } catch (error) {
      return next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Check authorization (only owner or admin can delete)
      if (req.user?.id !== id && req.user?.role !== 'ADMIN') {
        return next(new AppError('Unauthorized to delete this user', 403));
      }

      await prisma.user.delete({ where: { id } });

      return sendSuccess(res, 'User account deleted successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async uploadAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Check authorization (only owner can upload their avatar)
      if (req.user?.id !== id && req.user?.role !== 'ADMIN') {
        return next(new AppError('Unauthorized to upload avatar for this user', 403));
      }

      if (!req.file) {
        return next(new AppError('No file uploaded', 400));
      }

      const avatarUrl = `/uploads/${req.file.filename}`;

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { profileImage: avatarUrl },
      });

      const { password: _, ...userWithoutPassword } = updatedUser;
      return sendSuccess(res, 'Avatar uploaded successfully', { user: userWithoutPassword });
    } catch (error) {
      return next(error);
    }
  }
}
