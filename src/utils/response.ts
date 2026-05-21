import { Response } from 'express';

export const sendSuccess = (
  res: Response,
  data: any = null,
  message: string = 'Success',
  statusCode: number = 200
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message: string = 'An error occurred',
  statusCode: number = 400
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
