import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../middlewares/error-handler';

export class AgentsController {
  static async applyAgent(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Not authenticated', 401));
      }

      const { agencyName, licenseNumber, bio, yearsOfExperience } = req.body;

      // Update user's role to AGENT
      await prisma.user.update({
        where: { id: req.user.id },
        data: { role: 'AGENT' },
      });

      // Find or upsert agent profile
      const agent = await prisma.agent.upsert({
        where: { userId: req.user.id },
        update: {
          agencyName,
          licenseNumber,
          bio,
          yearsOfExperience,
        },
        create: {
          userId: req.user.id,
          agencyName,
          licenseNumber,
          bio,
          yearsOfExperience,
          verifiedStatus: false, // Must be verified by admin
        },
      });

      return sendSuccess(res, 'Successfully applied to become an agent. Awaiting admin verification.', { agent });
    } catch (error) {
      return next(error);
    }
  }

  static async getAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const agent = await prisma.agent.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
              profileImage: true,
            },
          },
          properties: {
            where: { status: 'AVAILABLE' },
            take: 5,
          },
        },
      });

      if (!agent) {
        return next(new AppError('Agent not found', 404));
      }

      return sendSuccess(res, 'Agent retrieved successfully', { agent });
    } catch (error) {
      return next(error);
    }
  }

  static async listAgents(req: Request, res: Response, next: NextFunction) {
    try {
      const { city, minRating } = req.query;

      const whereClause: any = {};

      if (minRating) {
        whereClause.rating = { gte: parseFloat(minRating as string) };
      }

      if (city) {
        // Find agents who have properties in the given city
        whereClause.properties = {
          some: {
            city: {
              equals: city as string,
              mode: 'insensitive',
            },
          },
        };
      }

      const agents = await prisma.agent.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
              profileImage: true,
            },
          },
        },
      });

      return sendSuccess(res, 'Agents listed successfully', { agents });
    } catch (error) {
      return next(error);
    }
  }

  static async verifyAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { verifiedStatus } = req.body;

      const agent = await prisma.agent.update({
        where: { id },
        data: { verifiedStatus },
      });

      return sendSuccess(res, `Agent verification status updated to ${verifiedStatus}`, { agent });
    } catch (error) {
      return next(error);
    }
  }
}
