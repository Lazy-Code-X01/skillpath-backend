import { Request, Response } from 'express';
import { userService } from './user.service';
import { sendSuccess, sendError } from '../../utils/response';

export class UserController {
  /**
   * Get current user's profile details.
   */
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const user = await userService.getUserById(userId);
      sendSuccess(res, { user }, 'Profile fetched successfully');
    } catch (error: any) {
      sendError(res, error.message, 404);
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { goal, currentLevel, dailyTime } = req.body;
      const user = await userService.updateUserPreferences(userId, { goal, currentLevel, dailyTime });
      sendSuccess(res, { user }, 'Profile updated successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}

export const userController = new UserController();
export default userController;
