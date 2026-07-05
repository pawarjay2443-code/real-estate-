"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.errorHandler = errorHandler;
const logger_1 = require("../utils/logger");
const response_1 = require("../utils/response");
const env_1 = require("../config/env");
class AppError extends Error {
    statusCode;
    errors;
    constructor(message, statusCode = 500, errors = null) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const errors = err.errors || null;
    logger_1.logger.error(`${req.method} ${req.originalUrl} - Error: ${message}`, {
        stack: err.stack,
        errors,
    });
    return (0, response_1.sendError)(res, message, statusCode, env_1.env.NODE_ENV === 'development' ? { errors, stack: err.stack } : errors);
}
