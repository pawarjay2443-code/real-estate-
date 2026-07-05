"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorize = authorize;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const redis_1 = require("../config/redis");
const error_handler_1 = require("./error-handler");
async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new error_handler_1.AppError('No token provided, authorization denied', 401));
    }
    const token = authHeader.split(' ')[1];
    try {
        // Check if token is blacklisted in Redis
        if (redis_1.redisClient.isOpen) {
            const isBlacklisted = await redis_1.redisClient.get(`blacklist:${token}`);
            if (isBlacklisted) {
                return next(new error_handler_1.AppError('Token is expired or blacklisted', 401));
            }
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACCESS_SECRET);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };
        return next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return next(new error_handler_1.AppError('Token has expired', 401));
        }
        return next(new error_handler_1.AppError('Token is not valid', 401));
    }
}
function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return next(new error_handler_1.AppError('Not authenticated', 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new error_handler_1.AppError('Forbidden: Access is denied', 403));
        }
        return next();
    };
}
