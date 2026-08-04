import { Request, Response } from 'express';
import { adminService } from './admin.service';
import { sendSuccess, sendError } from '../../utils/response';

export class AdminController {
  async overview(req: Request, res: Response): Promise<void> {
    try {
      const stats = await adminService.getOverviewStats();
      sendSuccess(res, { stats }, 'Overview fetched successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async userGrowth(req: Request, res: Response): Promise<void> {
    try {
      const growth = await adminService.getUserGrowth();
      sendSuccess(res, { growth }, 'User growth fetched successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async recentSignups(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const users = await adminService.getRecentSignups(limit);
      sendSuccess(res, { users }, 'Recent signups fetched successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async topCourses(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const courses = await adminService.getTopCourses(limit);
      sendSuccess(res, { courses }, 'Top courses fetched successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async platformActivity(req: Request, res: Response): Promise<void> {
    try {
      const activity = await adminService.getPlatformActivity();
      sendSuccess(res, { activity }, 'Platform activity fetched successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string | undefined;
      const result = await adminService.getAllUsers(page, limit, search);
      sendSuccess(res, result, 'Users fetched successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getUserDetail(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const result = await adminService.getUserDetail(userId);
      sendSuccess(res, result, 'User detail fetched successfully');
    } catch (error: any) {
      sendError(res, error.message, 404);
    }
  }

  async updateUserRole(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      if (!role) {
        sendError(res, 'role is required', 400);
        return;
      }
      const user = await adminService.updateUserRole(userId, role);
      sendSuccess(res, { user }, 'User role updated successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async createCourse(req: Request, res: Response): Promise<void> {
    try {
      const course = await adminService.createCourse(req.body);
      sendSuccess(res, { course }, 'Course created successfully', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async updateCourse(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const course = await adminService.updateCourse(courseId, req.body);
      sendSuccess(res, { course }, 'Course updated successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async deleteCourse(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const result = await adminService.deleteCourse(courseId);
      sendSuccess(res, result, 'Course deleted successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getQuizzes(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await adminService.getAllQuizzes(page, limit);
      sendSuccess(res, result, 'Quizzes fetched successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async createQuiz(req: Request, res: Response): Promise<void> {
    try {
      const { lessonId, courseId, title, questions, passMark, timeLimit } = req.body;
      const quiz = await adminService.createQuizManually(lessonId, courseId, title, questions, passMark, timeLimit);
      sendSuccess(res, { quiz }, 'Quiz created successfully', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async updateQuiz(req: Request, res: Response): Promise<void> {
    try {
      const { quizId } = req.params;
      const quiz = await adminService.updateQuiz(quizId, req.body);
      sendSuccess(res, { quiz }, 'Quiz updated successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async deleteQuiz(req: Request, res: Response): Promise<void> {
    try {
      const { quizId } = req.params;
      const result = await adminService.deleteQuiz(quizId);
      sendSuccess(res, result, 'Quiz deleted successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getSettings(req: Request, res: Response): Promise<void> {
    try {
      const settings = await adminService.getSettings();
      sendSuccess(res, { settings }, 'Settings fetched successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async updateSettings(req: Request, res: Response): Promise<void> {
    try {
      const settings = await adminService.updateSettings(req.body);
      sendSuccess(res, { settings }, 'Settings updated successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}

export const adminController = new AdminController();
export default adminController;
