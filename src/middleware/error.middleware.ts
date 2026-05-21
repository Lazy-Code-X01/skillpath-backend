import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

/**
 * Global Express error handling middleware.
 * Logs error details and returns a standardized 500 error response.
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Unhandled Server Error:', err);
  const message = err instanceof Error ? err.message : 'Internal Server Error';
  sendError(res, message, 500);
};
