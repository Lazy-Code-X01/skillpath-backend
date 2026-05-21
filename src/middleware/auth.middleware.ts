import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';
import { sendError } from '../utils/response';

export interface DecodedToken {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * Middleware to verify JWT token in the Authorization header.
 * Attaches the decoded payload to req.user on success.
 */
export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Access denied. No token provided.', 401);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };
    next();
  } catch (error) {
    sendError(res, 'Invalid or expired token.', 401);
  }
};
