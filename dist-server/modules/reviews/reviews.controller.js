"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsController = void 0;
const db_1 = require("../../config/db");
const response_1 = require("../../utils/response");
const error_handler_1 = require("../../middlewares/error-handler");
class ReviewsController {
    static async createReview(req, res, next) {
        try {
            if (!req.user) {
                return next(new error_handler_1.AppError('Not authenticated', 401));
            }
            const { propertyId, agentId, rating, comment } = req.body;
            const review = await db_1.prisma.review.create({
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
                const stats = await db_1.prisma.review.aggregate({
                    where: { agentId },
                    _avg: { rating: true },
                });
                await db_1.prisma.agent.update({
                    where: { id: agentId },
                    data: {
                        rating: stats._avg.rating || rating,
                    },
                });
            }
            return (0, response_1.sendSuccess)(res, 'Review submitted successfully', { review }, 201);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getPropertyReviews(req, res, next) {
        try {
            const { propertyId } = req.params;
            const reviews = await db_1.prisma.review.findMany({
                where: { propertyId },
                include: {
                    user: {
                        select: { name: true, profileImage: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
            return (0, response_1.sendSuccess)(res, 'Property reviews retrieved successfully', { reviews });
        }
        catch (error) {
            return next(error);
        }
    }
    static async getAgentReviews(req, res, next) {
        try {
            const { agentId } = req.params;
            const reviews = await db_1.prisma.review.findMany({
                where: { agentId },
                include: {
                    user: {
                        select: { name: true, profileImage: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
            return (0, response_1.sendSuccess)(res, 'Agent reviews retrieved successfully', { reviews });
        }
        catch (error) {
            return next(error);
        }
    }
    static async deleteReview(req, res, next) {
        try {
            if (!req.user) {
                return next(new error_handler_1.AppError('Not authenticated', 401));
            }
            const { id } = req.params;
            const review = await db_1.prisma.review.findUnique({ where: { id } });
            if (!review) {
                return next(new error_handler_1.AppError('Review not found', 404));
            }
            // Authorization (only writer or admin can delete)
            if (review.userId !== req.user.id && req.user.role !== 'ADMIN') {
                return next(new error_handler_1.AppError('Unauthorized to delete this review', 403));
            }
            await db_1.prisma.review.delete({ where: { id } });
            // Recalculate rating if it was an agent review
            if (review.agentId) {
                const stats = await db_1.prisma.review.aggregate({
                    where: { agentId: review.agentId },
                    _avg: { rating: true },
                });
                await db_1.prisma.agent.update({
                    where: { id: review.agentId },
                    data: {
                        rating: stats._avg.rating || 0.0,
                    },
                });
            }
            return (0, response_1.sendSuccess)(res, 'Review deleted successfully');
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.ReviewsController = ReviewsController;
