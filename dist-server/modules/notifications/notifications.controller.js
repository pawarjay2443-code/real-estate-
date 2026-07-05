"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = void 0;
const db_1 = require("../../config/db");
const response_1 = require("../../utils/response");
const error_handler_1 = require("../../middlewares/error-handler");
class NotificationsController {
    static async getMyNotifications(req, res, next) {
        try {
            if (!req.user) {
                return next(new error_handler_1.AppError('Not authenticated', 401));
            }
            const notifications = await db_1.prisma.notification.findMany({
                where: { userId: req.user.id },
                orderBy: { createdAt: 'desc' },
            });
            return (0, response_1.sendSuccess)(res, 'Notifications retrieved successfully', { notifications });
        }
        catch (error) {
            return next(error);
        }
    }
    static async markAsRead(req, res, next) {
        try {
            if (!req.user) {
                return next(new error_handler_1.AppError('Not authenticated', 401));
            }
            const { id } = req.params;
            const notification = await db_1.prisma.notification.findUnique({ where: { id } });
            if (!notification) {
                return next(new error_handler_1.AppError('Notification not found', 404));
            }
            if (notification.userId !== req.user.id) {
                return next(new error_handler_1.AppError('Unauthorized to access this notification', 403));
            }
            const updated = await db_1.prisma.notification.update({
                where: { id },
                data: { isRead: true },
            });
            return (0, response_1.sendSuccess)(res, 'Notification marked as read', { notification: updated });
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.NotificationsController = NotificationsController;
