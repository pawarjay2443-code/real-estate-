import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../middlewares/error-handler';

export class FavoritesController {
  static async addFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Not authenticated', 401));
      }

      const { propertyId } = req.params;

      const property = await prisma.property.findUnique({ where: { id: propertyId } });
      if (!property) {
        return next(new AppError('Property not found', 404));
      }

      const favorite = await prisma.favorite.upsert({
        where: {
          userId_propertyId: {
            userId: req.user.id,
            propertyId,
          },
        },
        update: {},
        create: {
          userId: req.user.id,
          propertyId,
        },
      });

      return sendSuccess(res, 'Property added to favorites', { favorite });
    } catch (error) {
      return next(error);
    }
  }

  static async removeFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Not authenticated', 401));
      }

      const { propertyId } = req.params;

      await prisma.favorite.delete({
        where: {
          userId_propertyId: {
            userId: req.user.id,
            propertyId,
          },
        },
      });

      return sendSuccess(res, 'Property removed from favorites');
    } catch (error) {
      // If it doesn't exist, we can just return success to be idempotent
      return sendSuccess(res, 'Property removed from favorites');
    }
  }

  static async myFavorites(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Not authenticated', 401));
      }

      const favorites = await prisma.favorite.findMany({
        where: { userId: req.user.id },
        include: {
          property: {
            include: {
              images: { orderBy: { order: 'asc' } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return sendSuccess(res, 'My favorites retrieved successfully', { favorites });
    } catch (error) {
      return next(error);
    }
  }
}
