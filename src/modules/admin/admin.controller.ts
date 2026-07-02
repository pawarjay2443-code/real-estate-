import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../middlewares/error-handler';

export class AdminController {
  static async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { role } = req.query;

      const whereClause: any = {};
      if (role) {
        whereClause.role = role;
      }

      const users = await prisma.user.findMany({
        where: whereClause,
        include: { agent: true },
        orderBy: { createdAt: 'desc' },
      });

      // Format to remove passwords
      const formatted = users.map((u) => {
        const { password: _, ...userWithoutPassword } = u;
        return userWithoutPassword;
      });

      return sendSuccess(res, 'All users retrieved successfully', { users: formatted });
    } catch (error) {
      return next(error);
    }
  }

  static async listProperties(req: Request, res: Response, next: NextFunction) {
    try {
      const properties = await prisma.property.findMany({
        include: {
          owner: { select: { name: true, email: true } },
          agent: { include: { user: { select: { name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      });

      return sendSuccess(res, 'All properties retrieved successfully', { properties });
    } catch (error) {
      return next(error);
    }
  }

  static async approveProperty(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { approve = true } = req.body;

      const property = await prisma.property.update({
        where: { id },
        data: {
          isFeatured: approve, // Admin highlights/approves as featured
        },
      });

      await prisma.notification.create({
        data: {
          userId: property.ownerId,
          title: 'Property Approved',
          message: `Your property listing "${property.title}" has been approved/featured by the Admin.`,
          type: 'ADMIN',
        },
      });

      return sendSuccess(res, `Property status updated successfully`, { property });
    } catch (error) {
      return next(error);
    }
  }

  static async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const [totalListings, activeUsers, revenueAgg] = await prisma.$transaction([
        prisma.property.count(),
        prisma.user.count(),
        prisma.payment.aggregate({
          where: { status: 'SUCCESS' },
          _sum: { amount: true },
        }),
      ]);

      const totalRevenue = revenueAgg._sum.amount || 0;

      return sendSuccess(res, 'Admin analytics retrieved successfully', {
        totalListings,
        activeUsers,
        totalRevenue,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await prisma.user.delete({ where: { id } });

      return sendSuccess(res, 'User account deleted by admin successfully');
    } catch (error) {
      return next(error);
    }
  }
}
