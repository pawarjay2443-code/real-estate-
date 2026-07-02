import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { sendError } from '../utils/response';
import { env } from '../config/env';

export class AppError extends Error {
  statusCode: number;
  errors: any;

  constructor(message: string, statusCode: number = 500, errors: any = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors || null;

  logger.error(`${req.method} ${req.originalUrl} - Error: ${message}`, {
    stack: err.stack,
    errors,
  });

  return sendError(
    res,
    message,
    statusCode,
    env.NODE_ENV === 'development' ? { errors, stack: err.stack } : errors
  );
}
