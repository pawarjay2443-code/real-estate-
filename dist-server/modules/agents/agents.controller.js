"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentsController = void 0;
const db_1 = require("../../config/db");
const response_1 = require("../../utils/response");
const error_handler_1 = require("../../middlewares/error-handler");
class AgentsController {
    static async applyAgent(req, res, next) {
        try {
            if (!req.user) {
                return next(new error_handler_1.AppError('Not authenticated', 401));
            }
            const { agencyName, licenseNumber, bio, yearsOfExperience } = req.body;
            // Update user's role to AGENT
            await db_1.prisma.user.update({
                where: { id: req.user.id },
                data: { role: 'AGENT' },
            });
            // Find or upsert agent profile
            const agent = await db_1.prisma.agent.upsert({
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
            return (0, response_1.sendSuccess)(res, 'Successfully applied to become an agent. Awaiting admin verification.', { agent });
        }
        catch (error) {
            return next(error);
        }
    }
    static async getAgent(req, res, next) {
        try {
            const { id } = req.params;
            const agent = await db_1.prisma.agent.findUnique({
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
                return next(new error_handler_1.AppError('Agent not found', 404));
            }
            return (0, response_1.sendSuccess)(res, 'Agent retrieved successfully', { agent });
        }
        catch (error) {
            return next(error);
        }
    }
    static async listAgents(req, res, next) {
        try {
            const { city, minRating } = req.query;
            const whereClause = {};
            if (minRating) {
                whereClause.rating = { gte: parseFloat(minRating) };
            }
            if (city) {
                // Find agents who have properties in the given city
                whereClause.properties = {
                    some: {
                        city: {
                            equals: city,
                            mode: 'insensitive',
                        },
                    },
                };
            }
            const agents = await db_1.prisma.agent.findMany({
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
            return (0, response_1.sendSuccess)(res, 'Agents listed successfully', { agents });
        }
        catch (error) {
            return next(error);
        }
    }
    static async verifyAgent(req, res, next) {
        try {
            const { id } = req.params;
            const { verifiedStatus } = req.body;
            const agent = await db_1.prisma.agent.update({
                where: { id },
                data: { verifiedStatus },
            });
            return (0, response_1.sendSuccess)(res, `Agent verification status updated to ${verifiedStatus}`, { agent });
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.AgentsController = AgentsController;
