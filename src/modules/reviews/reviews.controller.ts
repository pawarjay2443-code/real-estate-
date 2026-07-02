import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../middlewares/error-handler';

export class ReviewsController {
  static async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Not authenticated', 401));
      }

      const { propertyId, agentId, rating, comment } = req.body;

      const review = await prisma.review.create({
        data: {
          propertyId: propertyId || null,
          agentId: agentId || null,
          userId: req.user.id,
          rating,
          comment,
        },
      });

      // If review is for an agent, recalculate the agent's average rating
      if (agentId) {
        const stats = await prisma.review.aggregate({
          where: { agentId },
          _avg: { rating: true },
        });

        await prisma.agent.update({
          where: { id: agentId },
          data: {
            rating: stats._avg.rating || rating,
          },
        });
      }

      return sendSuccess(res, 'Review submitted successfully', { review }, 201);
    } catch (error) {
      return next(error);
    }
  }

  static async getPropertyReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { propertyId } = req.params;

      const reviews = await prisma.review.findMany({
        where: { propertyId },
        include: {
          user: {
            select: { name: true, profileImage: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return sendSuccess(res, 'Property reviews retrieved successfully', { reviews });
    } catch (error) {
      return next(error);
    }
  }

  static async getAgentReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { agentId } = req.params;

      const reviews = await prisma.review.findMany({
        where: { agentId },
        include: {
          user: {
            select: { name: true, profileImage: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return sendSuccess(res, 'Agent reviews retrieved successfully', { reviews });
    } catch (error) {
      return next(error);
    }
  }

  static async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Not authenticated', 401));
      }

      const { id } = req.params;

      const review = await prisma.review.findUnique({ where: { id } });
      if (!review) {
        return next(new AppError('Review not found', 404));
      }

      // Authorization (only writer or admin can delete)
      if (review.userId !== req.user.id && req.user.role !== 'ADMIN') {
        return next(new AppError('Unauthorized to delete this review', 403));
      }

      await prisma.review.delete({ where: { id } });

      // Recalculate rating if it was an agent review
      if (review.agentId) {
        const stats = await prisma.review.aggregate({
          where: { agentId: review.agentId },
          _avg: { rating: true },
        });

        await prisma.agent.update({
          where: { id: review.agentId },
          data: {
            rating: stats._avg.rating || 0.0,
          },
        });
      }

      return sendSuccess(res, 'Review deleted successfully');
    } catch (error) {
      return next(error);
    }
  }
}
