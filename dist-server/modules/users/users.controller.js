"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const db_1 = require("../../config/db");
const response_1 = require("../../utils/response");
const error_handler_1 = require("../../middlewares/error-handler");
const auth_service_1 = require("../auth/auth.service");
class UsersController {
    static async getUser(req, res, next) {
        try {
            const { id } = req.params;
            const user = await db_1.prisma.user.findUnique({
                where: { id },
                include: { agent: true },
            });
            if (!user) {
                return next(new error_handler_1.AppError('User not found', 404));
            }
            const { password: _, ...userWithoutPassword } = user;
            return (0, response_1.sendSuccess)(res, 'User retrieved successfully', { user: userWithoutPassword });
        }
        catch (error) {
            return next(error);
        }
    }
    static async updateUser(req, res, next) {
        try {
            const { id } = req.params;
            const { name, phone, password } = req.body;
            // Check authorization (only owner or admin can update)
            if (req.user?.id !== id && req.user?.role !== 'ADMIN') {
                return next(new error_handler_1.AppError('Unauthorized to update this user profile', 403));
            }
            const dataToUpdate = {};
            if (name)
                dataToUpdate.name = name;
            if (phone)
                dataToUpdate.phone = phone;
            if (password) {
                dataToUpdate.password = await auth_service_1.AuthService.hashPassword(password);
            }
            const updatedUser = await db_1.prisma.user.update({
                where: { id },
                data: dataToUpdate,
            });
            const { password: _, ...userWithoutPassword } = updatedUser;
            return (0, response_1.sendSuccess)(res, 'User profile updated successfully', { user: userWithoutPassword });
        }
        catch (error) {
            return next(error);
        }
    }
    static async deleteUser(req, res, next) {
        try {
            const { id } = req.params;
            // Check authorization (only owner or admin can delete)
            if (req.user?.id !== id && req.user?.role !== 'ADMIN') {
                return next(new error_handler_1.AppError('Unauthorized to delete this user', 403));
            }
            await db_1.prisma.user.delete({ where: { id } });
            return (0, response_1.sendSuccess)(res, 'User account deleted successfully');
        }
        catch (error) {
            return next(error);
        }
    }
    static async uploadAvatar(req, res, next) {
        try {
            const { id } = req.params;
            // Check authorization (only owner can upload their avatar)
            if (req.user?.id !== id && req.user?.role !== 'ADMIN') {
                return next(new error_handler_1.AppError('Unauthorized to upload avatar for this user', 403));
            }
            if (!req.file) {
                return next(new error_handler_1.AppError('No file uploaded', 400));
            }
            const avatarUrl = `/uploads/${req.file.filename}`;
            const updatedUser = await db_1.prisma.user.update({
                where: { id },
                data: { profileImage: avatarUrl },
            });
            const { password: _, ...userWithoutPassword } = updatedUser;
            return (0, response_1.sendSuccess)(res, 'Avatar uploaded successfully', { user: userWithoutPassword });
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.UsersController = UsersController;
