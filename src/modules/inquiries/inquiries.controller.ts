import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../middlewares/error-handler';

export class InquiriesController {
  static async createInquiry(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Not authenticated', 401));
      }

      const { propertyId, message } = req.body;

      const property = await prisma.property.findUnique({
        where: { id: propertyId },
        include: { agent: true },
      });

      if (!property) {
        return next(new AppError('Property not found', 404));
      }

      const inquiry = await prisma.inquiry.create({
        data: {
          propertyId,
          userId: req.user.id,
          message,
          status: 'NEW',
        },
      });

      // Create notification for property owner
      await prisma.notification.create({
        data: {
          userId: property.ownerId,
          title: 'New Lead Inquiry',
          message: `A user has inquired about your property: "${property.title}"`,
          type: 'INQUIRY',
        },
      });

      // Create notification for assigned agent, if any
      if (property.agent) {
        await prisma.notification.create({
          data: {
            userId: property.agent.userId,
            title: 'New Assigned Property Inquiry',
            message: `A user has inquired about your assigned property: "${property.title}"`,
            type: 'INQUIRY',
          },
        });
      }

      return sendSuccess(res, 'Inquiry submitted successfully', { inquiry }, 201);
    } catch (error) {
      return next(error);
    }
  }

  static async myInquiries(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Not authenticated', 401));
      }

      const inquiries = await prisma.inquiry.findMany({
        where: { userId: req.user.id },
        include: {
          property: {
            select: { id: true, title: true, address: true, city: true, price: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return sendSuccess(res, 'My inquiries retrieved successfully', { inquiries });
    } catch (error) {
      return next(error);
    }
  }

  static async propertyInquiries(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Not authenticated', 401));
      }

      const { propertyId } = req.params;

      const property = await prisma.property.findUnique({
        where: { id: propertyId },
      });

      if (!property) {
        return next(new AppError('Property not found', 404));
      }

      // Authorization check (only property owner, assigned agent, or admin can see leads)
      const isOwner = property.ownerId === req.user.id;
      const isAgent = property.agentId && (await prisma.agent.findUnique({ where: { id: property.agentId } }))?.userId === req.user.id;
      const isAdmin = req.user.role === 'ADMIN';

      if (!isOwner && !isAgent && !isAdmin) {
        return next(new AppError('Unauthorized to view inquiries for this property', 403));
      }

      const inquiries = await prisma.inquiry.findMany({
        where: { propertyId },
        include: {
          user: {
            select: { name: true, email: true, phone: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return sendSuccess(res, 'Property inquiries retrieved successfully', { inquiries });
    } catch (error) {
      return next(error);
    }
  }

  static async updateInquiryStatus(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Not authenticated', 401));
      }

      const { id } = req.params;
      const { status } = req.body;

      const inquiry = await prisma.inquiry.findUnique({
        where: { id },
        include: { property: true },
      });

      if (!inquiry) {
        return next(new AppError('Inquiry not found', 404));
      }

      // Check authorizations (owner of property, assigned agent, or admin)
      const isOwner = inquiry.property.ownerId === req.user.id;
      const isAgent = inquiry.property.agentId && (await prisma.agent.findUnique({ where: { id: inquiry.property.agentId } }))?.userId === req.user.id;
      const isAdmin = req.user.role === 'ADMIN';

      if (!isOwner && !isAgent && !isAdmin) {
        return next(new AppError('Unauthorized to update this inquiry status', 403));
      }

      const updated = await prisma.inquiry.update({
        where: { id },
        data: { status },
      });

      return sendSuccess(res, `Inquiry status updated to ${status}`, { inquiry: updated });
    } catch (error) {
      return next(error);
    }
  }
}
