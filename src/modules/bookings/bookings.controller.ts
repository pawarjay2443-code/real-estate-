import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../middlewares/error-handler';

export class BookingsController {
  static async createBooking(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Not authenticated', 401));
      }

      const { propertyId, scheduledDate, notes } = req.body;

      const property = await prisma.property.findUnique({
        where: { id: propertyId },
        include: { agent: true },
      });

      if (!property) {
        return next(new AppError('Property not found', 404));
      }

      const booking = await prisma.booking.create({
        data: {
          propertyId,
          userId: req.user.id,
          scheduledDate: new Date(scheduledDate),
          status: 'PENDING',
          notes,
        },
      });

      // Send notification to owner
      await prisma.notification.create({
        data: {
          userId: property.ownerId,
          title: 'New Booking Request',
          message: `A client has requested a site visit for property "${property.title}" on ${new Date(scheduledDate).toLocaleDateString()}`,
          type: 'BOOKING',
        },
      });

      // Send notification to agent, if any
      if (property.agent) {
        await prisma.notification.create({
          data: {
            userId: property.agent.userId,
            title: 'New Assigned Property Booking Request',
            message: `A client has requested a site visit for your assigned property "${property.title}" on ${new Date(scheduledDate).toLocaleDateString()}`,
            type: 'BOOKING',
          },
        });
      }

      return sendSuccess(res, 'Booking request submitted successfully', { booking }, 201);
    } catch (error) {
      return next(error);
    }
  }

  static async myBookings(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Not authenticated', 401));
      }

      let bookings;

      if (req.user.role === 'BUYER') {
        bookings = await prisma.booking.findMany({
          where: { userId: req.user.id },
          include: {
            property: {
              select: { id: true, title: true, address: true, city: true, price: true },
            },
          },
          orderBy: { scheduledDate: 'asc' },
        });
      } else {
        // Sellers & Agents: view bookings on properties they own or are assigned to
        const agent = req.user.role === 'AGENT'
          ? await prisma.agent.findUnique({ where: { userId: req.user.id } })
          : null;

        bookings = await prisma.booking.findMany({
          where: {
            OR: [
              { property: { ownerId: req.user.id } },
              agent ? { property: { agentId: agent.id } } : {},
            ],
          },
          include: {
            property: {
              select: { id: true, title: true, address: true, city: true, price: true },
            },
            user: {
              select: { name: true, email: true, phone: true },
            },
          },
          orderBy: { scheduledDate: 'asc' },
        });
      }

      return sendSuccess(res, 'Bookings retrieved successfully', { bookings });
    } catch (error) {
      return next(error);
    }
  }

  static async updateBooking(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Not authenticated', 401));
      }

      const { id } = req.params;
      const { status, scheduledDate, notes } = req.body;

      const booking = await prisma.booking.findUnique({
        where: { id },
        include: { property: true },
      });

      if (!booking) {
        return next(new AppError('Booking not found', 404));
      }

      const isBuyer = booking.userId === req.user.id;
      const isOwner = booking.property.ownerId === req.user.id;
      const isAgent = booking.property.agentId && (await prisma.agent.findUnique({ where: { id: booking.property.agentId } }))?.userId === req.user.id;
      const isAdmin = req.user.role === 'ADMIN';

      if (!isBuyer && !isOwner && !isAgent && !isAdmin) {
        return next(new AppError('Unauthorized to update this booking', 403));
      }

      const updateData: any = {};

      if (scheduledDate) {
        // Rescheduling is allowed by buyer, owner, agent or admin
        updateData.scheduledDate = new Date(scheduledDate);
      }

      if (notes) {
        updateData.notes = notes;
      }

      if (status) {
        // Business rule checks for Status Changes
        if (status === 'CONFIRMED' || status === 'COMPLETED') {
          // Only seller, agent or admin can confirm/complete visit
          if (!isOwner && !isAgent && !isAdmin) {
            return next(new AppError('Only hosts can confirm or complete booking visits', 403));
          }
        }
        updateData.status = status;
      }

      const updated = await prisma.booking.update({
        where: { id },
        data: updateData,
      });

      // Create status update notifications
      const notifyUserId = isBuyer ? booking.property.ownerId : booking.userId;
      await prisma.notification.create({
        data: {
          userId: notifyUserId,
          title: 'Booking Updated',
          message: `Your booking for "${booking.property.title}" has been updated. Status: ${status || booking.status}`,
          type: 'BOOKING',
        },
      });

      return sendSuccess(res, 'Booking updated successfully', { booking: updated });
    } catch (error) {
      return next(error);
    }
  }
}
