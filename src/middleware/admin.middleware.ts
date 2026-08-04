import { Request, Response, NextFunction } from 'express';
import { User } from '../modules/user/user.model';
import { sendError } from '../utils/response';

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user || user.role !== 'admin') {
      sendError(res, 'Admin access required', 403);
      return;
    }
    next();
  } catch (error: any) {
    sendError(res, 'Admin check failed', 500);
  }
};
