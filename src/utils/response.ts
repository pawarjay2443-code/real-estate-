import { Response } from 'express';

export function sendSuccess(res: Response, message: string, data: any = null, statusCode: number = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendError(res: Response, message: string, statusCode: number = 500, errors: any = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}
