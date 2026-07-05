"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const redis_1 = require("../../config/redis");
class AuthService {
    static async hashPassword(password) {
        return bcrypt_1.default.hash(password, 10);
    }
    static async comparePasswords(password, hashed) {
        return bcrypt_1.default.compare(password, hashed);
    }
    static generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_ACCESS_SECRET, {
            expiresIn: env_1.env.JWT_ACCESS_EXPIRES_IN,
        });
    }
    static generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_REFRESH_SECRET, {
            expiresIn: env_1.env.JWT_REFRESH_EXPIRES_IN,
        });
    }
    static verifyAccessToken(token) {
        return jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACCESS_SECRET);
    }
    static verifyRefreshToken(token) {
        return jsonwebtoken_1.default.verify(token, env_1.env.JWT_REFRESH_SECRET);
    }
    static async blacklistToken(token, expirySeconds = 900) {
        if (redis_1.redisClient.isOpen) {
            await redis_1.redisClient.setEx(`blacklist:${token}`, expirySeconds, 'true');
        }
    }
    static generatePasswordResetToken(email) {
        return jsonwebtoken_1.default.sign({ email }, env_1.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
    }
    static verifyPasswordResetToken(token) {
        return jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACCESS_SECRET);
    }
}
exports.AuthService = AuthService;
