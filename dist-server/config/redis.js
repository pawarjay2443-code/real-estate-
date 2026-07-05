"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const redis_1 = require("redis");
const env_1 = require("./env");
const logger_1 = require("../utils/logger");
exports.redisClient = (0, redis_1.createClient)({
    url: env_1.env.REDIS_URL,
});
exports.redisClient.on('error', (err) => {
    logger_1.logger.error('Redis client error:', err);
});
exports.redisClient.on('connect', () => {
    logger_1.logger.info('Redis client connected successfully');
});
// Immediately connect to Redis
if (env_1.env.NODE_ENV !== 'test') {
    exports.redisClient.connect().catch((err) => {
        logger_1.logger.error('Failed to connect to Redis:', err);
    });
}
