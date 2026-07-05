"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const db_1 = require("../../config/db");
const response_1 = require("../../utils/response");
class AdminController {
    static async listUsers(req, res, next) {
        try {
            const { role } = req.query;
            const whereClause = {};
            if (role) {
                whereClause.role = role;
            }
            const users = await db_1.prisma.user.findMany({
                where: whereClause,
                include: { agent: true },
                orderBy: { createdAt: 'desc' },
            });
            // Format to remove passwords
            const formatted = users.map((u) => {
                const { password: _, ...userWithoutPassword } = u;
                return userWithoutPassword;
            });
            return (0, response_1.sendSuccess)(res, 'All users retrieved successfully', { users: formatted });
        }
        catch (error) {
            return next(error);
        }
    }
    static async listProperties(req, res, next) {
        try {
            const properties = await db_1.prisma.property.findMany({
                include: {
                    owner: { select: { name: true, email: true } },
                    agent: { include: { user: { select: { name: true } } } },
                },
                orderBy: { createdAt: 'desc' },
            });
            return (0, response_1.sendSuccess)(res, 'All properties retrieved successfully', { properties });
        }
        catch (error) {
            return next(error);
        }
    }
    static async approveProperty(req, res, next) {
        try {
            const { id } = req.params;
            const { approve = true } = req.body;
            const property = await db_1.prisma.property.update({
                where: { id },
                data: {
                    isFeatured: approve, // Admin highlights/approves as featured
                },
            });
            await db_1.prisma.notification.create({
                data: {
                    userId: property.ownerId,
                    title: 'Property Approved',
                    message: `Your property listing "${property.title}" has been approved/featured by the Admin.`,
                    type: 'ADMIN',
                },
            });
            return (0, response_1.sendSuccess)(res, `Property status updated successfully`, { property });
        }
        catch (error) {
            return next(error);
        }
    }
    static async getAnalytics(req, res, next) {
        try {
            const [totalListings, activeUsers] = await db_1.prisma.$transaction([
                db_1.prisma.property.count(),
                db_1.prisma.user.count(),
            ]);
            // TODO: Add a Payment model to the Prisma schema and uncomment revenue aggregation
            // const revenueAgg = await prisma.payment.aggregate({
            //   where: { status: 'SUCCESS' },
            //   _sum: { amount: true },
            // });
            // const totalRevenue = revenueAgg._sum.amount || 0;
            const totalRevenue = 0;
            return (0, response_1.sendSuccess)(res, 'Admin analytics retrieved successfully', {
                totalListings,
                activeUsers,
                totalRevenue,
            });
        }
        catch (error) {
            return next(error);
        }
    }
    static async deleteUser(req, res, next) {
        try {
            const { id } = req.params;
            await db_1.prisma.user.delete({ where: { id } });
            return (0, response_1.sendSuccess)(res, 'User account deleted by admin successfully');
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.AdminController = AdminController;
