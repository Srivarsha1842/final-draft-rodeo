import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt.util';
import { sendError } from '../utils/response.util';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    sendError(res, 'Unauthorized', 401);
    return;
  }
  const token = header.split(' ')[1];
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    sendError(res, 'Token expired or invalid', 401);
  }
};

export const requireRole =
  (...roles: TokenPayload['role'][]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      sendError(res, 'Forbidden', 403);
      return;
    }
    next();
  };
