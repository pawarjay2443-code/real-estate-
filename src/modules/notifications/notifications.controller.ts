import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../middlewares/error-handler';

export class NotificationsController {
  static async getMyNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Not authenticated', 401));
      }

      const notifications = await prisma.notification.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
      });

      return sendSuccess(res, 'Notifications retrieved successfully', { notifications });
    } catch (error) {
      return next(error);
    }
  }

  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Not authenticated', 401));
      }

      const { id } = req.params;

      const notification = await prisma.notification.findUnique({ where: { id } });
      if (!notification) {
        return next(new AppError('Notification not found', 404));
      }

      if (notification.userId !== req.user.id) {
        return next(new AppError('Unauthorized to access this notification', 403));
      }

      const updated = await prisma.notification.update({
        where: { id },
        data: { isRead: true },
      });

      return sendSuccess(res, 'Notification marked as read', { notification: updated });
    } catch (error) {
      return next(error);
    }
  }
}
