"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsController = void 0;
const db_1 = require("../../config/db");
const response_1 = require("../../utils/response");
const error_handler_1 = require("../../middlewares/error-handler");
class BookingsController {
    static async createBooking(req, res, next) {
        try {
            if (!req.user) {
                return next(new error_handler_1.AppError('Not authenticated', 401));
            }
            const { propertyId, scheduledDate, notes } = req.body;
            const property = await db_1.prisma.property.findUnique({
                where: { id: propertyId },
                include: { agent: true },
            });
            if (!property) {
                return next(new error_handler_1.AppError('Property not found', 404));
            }
            const booking = await db_1.prisma.booking.create({
                data: {
                    propertyId,
                    userId: req.user.id,
                    scheduledDate: new Date(scheduledDate),
                    status: 'PENDING',
                    notes,
                },
            });
            // Send notification to owner
            await db_1.prisma.notification.create({
                data: {
                    userId: property.ownerId,
                    title: 'New Booking Request',
                    message: `A client has requested a site visit for property "${property.title}" on ${new Date(scheduledDate).toLocaleDateString()}`,
                    type: 'BOOKING',
                },
            });
            // Send notification to agent, if any
            if (property.agent) {
                await db_1.prisma.notification.create({
                    data: {
                        userId: property.agent.userId,
                        title: 'New Assigned Property Booking Request',
                        message: `A client has requested a site visit for your assigned property "${property.title}" on ${new Date(scheduledDate).toLocaleDateString()}`,
                        type: 'BOOKING',
                    },
                });
            }
            return (0, response_1.sendSuccess)(res, 'Booking request submitted successfully', { booking }, 201);
        }
        catch (error) {
            return next(error);
        }
    }
    static async myBookings(req, res, next) {
        try {
            if (!req.user) {
                return next(new error_handler_1.AppError('Not authenticated', 401));
            }
            let bookings;
            if (req.user.role === 'BUYER') {
                bookings = await db_1.prisma.booking.findMany({
                    where: { userId: req.user.id },
                    include: {
                        property: {
                            select: { id: true, title: true, address: true, city: true, price: true },
                        },
                    },
                    orderBy: { scheduledDate: 'asc' },
                });
            }
            else {
                // Sellers & Agents: view bookings on properties they own or are assigned to
                const agent = req.user.role === 'AGENT'
                    ? await db_1.prisma.agent.findUnique({ where: { userId: req.user.id } })
                    : null;
                bookings = await db_1.prisma.booking.findMany({
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
            return (0, response_1.sendSuccess)(res, 'Bookings retrieved successfully', { bookings });
        }
        catch (error) {
            return next(error);
        }
    }
    static async updateBooking(req, res, next) {
        try {
            if (!req.user) {
                return next(new error_handler_1.AppError('Not authenticated', 401));
            }
            const { id } = req.params;
            const { status, scheduledDate, notes } = req.body;
            const booking = await db_1.prisma.booking.findUnique({
                where: { id },
                include: { property: true },
            });
            if (!booking) {
                return next(new error_handler_1.AppError('Booking not found', 404));
            }
            const isBuyer = booking.userId === req.user.id;
            const isOwner = booking.property.ownerId === req.user.id;
            const isAgent = booking.property.agentId && (await db_1.prisma.agent.findUnique({ where: { id: booking.property.agentId } }))?.userId === req.user.id;
            const isAdmin = req.user.role === 'ADMIN';
            if (!isBuyer && !isOwner && !isAgent && !isAdmin) {
                return next(new error_handler_1.AppError('Unauthorized to update this booking', 403));
            }
            const updateData = {};
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
                        return next(new error_handler_1.AppError('Only hosts can confirm or complete booking visits', 403));
                    }
                }
                updateData.status = status;
            }
            const updated = await db_1.prisma.booking.update({
                where: { id },
                data: updateData,
            });
            // Create status update notifications
            const notifyUserId = isBuyer ? booking.property.ownerId : booking.userId;
            await db_1.prisma.notification.create({
                data: {
                    userId: notifyUserId,
                    title: 'Booking Updated',
                    message: `Your booking for "${booking.property.title}" has been updated. Status: ${status || booking.status}`,
                    type: 'BOOKING',
                },
            });
            return (0, response_1.sendSuccess)(res, 'Booking updated successfully', { booking: updated });
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.BookingsController = BookingsController;
