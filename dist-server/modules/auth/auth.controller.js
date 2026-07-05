"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const db_1 = require("../../config/db");
const auth_service_1 = require("./auth.service");
const response_1 = require("../../utils/response");
const error_handler_1 = require("../../middlewares/error-handler");
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../../config/env");
const logger_1 = require("../../utils/logger");
class AuthController {
    static async register(req, res, next) {
        try {
            const { name, email, password, phone, role } = req.body;
            const existingUser = await db_1.prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return next(new error_handler_1.AppError('Email already registered', 400));
            }
            const hashedPassword = await auth_service_1.AuthService.hashPassword(password);
            const user = await db_1.prisma.user.create({
                data: {
                    name,
                    email,
                    phone,
                    password: hashedPassword,
                    role,
                    isVerified: false,
                },
            });
            // If registered as an agent, automatically scaffold the Agent profile too
            if (role === 'AGENT') {
                await db_1.prisma.agent.create({
                    data: {
                        userId: user.id,
                        verifiedStatus: false,
                    },
                });
            }
            const payload = { id: user.id, email: user.email, role: user.role };
            const accessToken = auth_service_1.AuthService.generateAccessToken(payload);
            const refreshToken = auth_service_1.AuthService.generateRefreshToken(payload);
            // Remove password from user object in response
            const { password: _, ...userWithoutPassword } = user;
            return (0, response_1.sendSuccess)(res, 'User registered successfully', {
                user: userWithoutPassword,
                accessToken,
                refreshToken,
            }, 201);
        }
        catch (error) {
            return next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await db_1.prisma.user.findUnique({ where: { email } });
            if (!user) {
                return next(new error_handler_1.AppError('Invalid email or password', 401));
            }
            const isMatch = await auth_service_1.AuthService.comparePasswords(password, user.password);
            if (!isMatch) {
                return next(new error_handler_1.AppError('Invalid email or password', 401));
            }
            const payload = { id: user.id, email: user.email, role: user.role };
            const accessToken = auth_service_1.AuthService.generateAccessToken(payload);
            const refreshToken = auth_service_1.AuthService.generateRefreshToken(payload);
            const { password: _, ...userWithoutPassword } = user;
            return (0, response_1.sendSuccess)(res, 'Login successful', {
                user: userWithoutPassword,
                accessToken,
                refreshToken,
            });
        }
        catch (error) {
            return next(error);
        }
    }
    static async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const decoded = auth_service_1.AuthService.verifyRefreshToken(refreshToken);
            const user = await db_1.prisma.user.findUnique({ where: { id: decoded.id } });
            if (!user) {
                return next(new error_handler_1.AppError('User not found', 404));
            }
            const payload = { id: user.id, email: user.email, role: user.role };
            const newAccessToken = auth_service_1.AuthService.generateAccessToken(payload);
            return (0, response_1.sendSuccess)(res, 'Token refreshed successfully', {
                accessToken: newAccessToken,
            });
        }
        catch (error) {
            return next(new error_handler_1.AppError('Invalid refresh token', 401));
        }
    }
    static async logout(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.split(' ')[1];
                // Blacklist access token for 15 minutes (900 seconds)
                await auth_service_1.AuthService.blacklistToken(token, 900);
            }
            return (0, response_1.sendSuccess)(res, 'Logged out successfully');
        }
        catch (error) {
            return next(error);
        }
    }
    static async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const user = await db_1.prisma.user.findUnique({ where: { email } });
            if (!user) {
                // Return success even if user not found to prevent user enumeration
                return (0, response_1.sendSuccess)(res, 'If that email exists, we have sent a reset password link');
            }
            const resetToken = auth_service_1.AuthService.generatePasswordResetToken(email);
            // Simulate sending email (Nodemailer)
            if (env_1.env.EMAIL_HOST && env_1.env.EMAIL_USER && env_1.env.EMAIL_PASS) {
                const transporter = nodemailer_1.default.createTransport({
                    host: env_1.env.EMAIL_HOST,
                    port: env_1.env.EMAIL_PORT,
                    auth: {
                        user: env_1.env.EMAIL_USER,
                        pass: env_1.env.EMAIL_PASS,
                    },
                });
                const resetUrl = `http://localhost:5000/api/auth/reset-password?token=${resetToken}`;
                await transporter.sendMail({
                    from: env_1.env.EMAIL_FROM,
                    to: email,
                    subject: 'Password Reset Request',
                    text: `Please reset your password by clicking this link: ${resetUrl}`,
                    html: `<p>Please reset your password by clicking <a href="${resetUrl}">here</a></p>`,
                });
            }
            else {
                logger_1.logger.info(`Password reset token generated for ${email}: ${resetToken}`);
            }
            return (0, response_1.sendSuccess)(res, 'If that email exists, we have sent a reset password link', { token: resetToken });
        }
        catch (error) {
            return next(error);
        }
    }
    static async resetPassword(req, res, next) {
        try {
            const { token, password } = req.body;
            const decoded = auth_service_1.AuthService.verifyPasswordResetToken(token);
            const email = decoded.email;
            const hashedPassword = await auth_service_1.AuthService.hashPassword(password);
            await db_1.prisma.user.update({
                where: { email },
                data: { password: hashedPassword },
            });
            return (0, response_1.sendSuccess)(res, 'Password reset successfully');
        }
        catch (error) {
            return next(new error_handler_1.AppError('Invalid or expired reset token', 400));
        }
    }
    static async me(req, res, next) {
        try {
            if (!req.user) {
                return next(new error_handler_1.AppError('Not authenticated', 401));
            }
            const user = await db_1.prisma.user.findUnique({
                where: { id: req.user.id },
                include: { agent: true },
            });
            if (!user) {
                return next(new error_handler_1.AppError('User not found', 404));
            }
            const { password: _, ...userWithoutPassword } = user;
            return (0, response_1.sendSuccess)(res, 'User details retrieved', { user: userWithoutPassword });
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.AuthController = AuthController;
