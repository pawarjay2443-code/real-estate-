"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const redis_1 = require("./config/redis");
const logger_1 = require("./utils/logger");
const PORT = env_1.env.PORT || 5000;
async function startServer() {
    try {
        // Verify database connectivity
        await db_1.prisma.$connect();
        logger_1.logger.info('Database connection established successfully');
        // Start Express Server
        const server = app_1.default.listen(PORT, () => {
            logger_1.logger.info(`🚀 Server running in ${env_1.env.NODE_ENV} mode on port ${PORT}`);
            logger_1.logger.info(`📝 Swagger documentation available at http://localhost:${PORT}/api-docs`);
        });
        // Graceful Shutdown Handling
        const shutdown = async (signal) => {
            logger_1.logger.info(`Received ${signal}. Shutting down gracefully...`);
            server.close(async () => {
                logger_1.logger.info('Http server closed.');
                try {
                    await db_1.prisma.$disconnect();
                    logger_1.logger.info('Database connections closed.');
                }
                catch (dbErr) {
                    logger_1.logger.error('Error during database disconnect:', dbErr);
                }
                try {
                    if (redis_1.redisClient.isOpen) {
                        await redis_1.redisClient.quit();
                        logger_1.logger.info('Redis connection closed.');
                    }
                }
                catch (redisErr) {
                    logger_1.logger.error('Error during Redis disconnect:', redisErr);
                }
                process.exit(0);
            });
            // Force close after 10s if graceful shutdown times out
            setTimeout(() => {
                logger_1.logger.error('Could not close connections in time, forcefully shutting down');
                process.exit(1);
            }, 10000);
        };
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
