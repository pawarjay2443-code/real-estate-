import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middlewares/error-handler';
import { apiLimiter } from './middlewares/rate-limit';
import { logger } from './utils/logger';
import swaggerDocument from './config/swagger.json';

// Import Routes
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import agentsRoutes from './modules/agents/agents.routes';
import propertiesRoutes from './modules/properties/properties.routes';
import inquiriesRoutes from './modules/inquiries/inquiries.routes';
import bookingsRoutes from './modules/bookings/bookings.routes';
import paymentsRoutes from './modules/payments/payments.routes';
import reviewsRoutes from './modules/reviews/reviews.routes';
import favoritesRoutes from './modules/favorites/favorites.routes';
import adminRoutes from './modules/admin/admin.routes';
import notificationsRoutes from './modules/notifications/notifications.routes';

const app = express();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows displaying local images in frontend
}));
app.use(cors());

// General Rate Limiter
app.use('/api/', apiLimiter);

// Custom Body Parser middleware to skip JSON parsing for Stripe webhook
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payments/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(express.urlencoded({ extended: true }));

// Request Logging
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(
  morgan(morganFormat, {
    stream: { write: (message) => logger.http(message.trim()) },
  })
);

// Serve static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));

// Swagger UI Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'UP',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// Register API Module Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/agents', agentsRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/inquiries', inquiriesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationsRoutes);

// Catch-all route for unmatched paths
app.use('*', (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global Centralized Error Handler
app.use(errorHandler);

export default app;
