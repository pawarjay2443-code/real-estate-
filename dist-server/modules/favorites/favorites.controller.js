"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoritesController = void 0;
const db_1 = require("../../config/db");
const response_1 = require("../../utils/response");
const error_handler_1 = require("../../middlewares/error-handler");
class FavoritesController {
    static async addFavorite(req, res, next) {
        try {
            if (!req.user) {
                return next(new error_handler_1.AppError('Not authenticated', 401));
            }
            const { propertyId } = req.params;
            const property = await db_1.prisma.property.findUnique({ where: { id: propertyId } });
            if (!property) {
                return next(new error_handler_1.AppError('Property not found', 404));
            }
            const favorite = await db_1.prisma.favorite.upsert({
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
            return (0, response_1.sendSuccess)(res, 'Property added to favorites', { favorite });
        }
        catch (error) {
            return next(error);
        }
    }
    static async removeFavorite(req, res, next) {
        try {
            if (!req.user) {
                return next(new error_handler_1.AppError('Not authenticated', 401));
            }
            const { propertyId } = req.params;
            await db_1.prisma.favorite.delete({
                where: {
                    userId_propertyId: {
                        userId: req.user.id,
                        propertyId,
                    },
                },
            });
            return (0, response_1.sendSuccess)(res, 'Property removed from favorites');
        }
        catch (error) {
            // If it doesn't exist, we can just return success to be idempotent
            return (0, response_1.sendSuccess)(res, 'Property removed from favorites');
        }
    }
    static async myFavorites(req, res, next) {
        try {
            if (!req.user) {
                return next(new error_handler_1.AppError('Not authenticated', 401));
            }
            const favorites = await db_1.prisma.favorite.findMany({
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
            return (0, response_1.sendSuccess)(res, 'My favorites retrieved successfully', { favorites });
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.FavoritesController = FavoritesController;
