import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};

export const errorHandler = (
  err: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 && env.NODE_ENV === 'production' ? 'Internal server error' : err.message;

  if (env.NODE_ENV !== 'production') console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
