import app from './app';
import { env } from './config/env';
import { prisma } from './config/db';
import { redisClient } from './config/redis';
import { logger } from './utils/logger';

const PORT = env.PORT || 5000;

async function startServer() {
  try {
    // Verify database connectivity
    await prisma.$connect();
    logger.info('Database connection established successfully');

    // Start Express Server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
      logger.info(`📝 Swagger documentation available at http://localhost:${PORT}/api-docs`);
    });

    // Graceful Shutdown Handling
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      
      server.close(async () => {
        logger.info('Http server closed.');
        
        try {
          await prisma.$disconnect();
          logger.info('Database connections closed.');
        } catch (dbErr) {
          logger.error('Error during database disconnect:', dbErr);
        }

        try {
          if (redisClient.isOpen) {
            await redisClient.quit();
            logger.info('Redis connection closed.');
          }
        } catch (redisErr) {
          logger.error('Error during Redis disconnect:', redisErr);
        }

        process.exit(0);
      });

      // Force close after 10s if graceful shutdown times out
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
