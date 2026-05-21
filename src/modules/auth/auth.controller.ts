import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { authService } from './auth.service';
import { sendSuccess, sendError } from '../../utils/response';

export class AuthController {
  /**
   * Handle user registration.
   */
  async register(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, errors.array()[0].msg, 422);
      return;
    }

    try {
      const { name, email, password } = req.body;
      const user = await authService.registerUser(name, email, password);
      sendSuccess(res, { user }, 'Account created successfully', 201);
    } catch (error: any) {
      sendError(res, error.message || 'Registration failed.', 400);
    }
  }

  /**
   * Handle user authentication.
   */
  async login(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, errors.array()[0].msg, 422);
      return;
    }

    try {
      const { email, password } = req.body;
      const { token, user } = await authService.loginUser(email, password);
      sendSuccess(res, { token, user }, 'Login successful');
    } catch (error: any) {
      sendError(res, error.message || 'Authentication failed.', 401);
    }
  }
}

export const authController = new AuthController();
export default authController;
