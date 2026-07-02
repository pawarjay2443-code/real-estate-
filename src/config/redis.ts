import { createClient } from 'redis';
import { env } from './env';
import { logger } from '../utils/logger';

export const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on('error', (err) => {
  logger.error('Redis client error:', err);
});

redisClient.on('connect', () => {
  logger.info('Redis client connected successfully');
});

// Immediately connect to Redis
if (env.NODE_ENV !== 'test') {
  redisClient.connect().catch((err) => {
    logger.error('Failed to connect to Redis:', err);
  });
}
