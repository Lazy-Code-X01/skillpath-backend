import { Request, Response } from 'express';
import { learningService } from './learning.service';
import { sendSuccess, sendError } from '../../utils/response';

export class LearningController {
  async getCourses(req: Request, res: Response): Promise<void> {
    try {
      const courses = await learningService.getAllCourses();
      sendSuccess(res, { courses }, 'Courses fetched successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getCourse(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const course = await learningService.getCourseById(courseId);
      sendSuccess(res, { course }, 'Course fetched successfully');
    } catch (error: any) {
      sendError(res, error.message, 404);
    }
  }

  async completeLesson(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { courseId, lessonId } = req.body;
      if (!courseId || !lessonId) {
        sendError(res, 'courseId and lessonId are required', 400);
        return;
      }
      const progress = await learningService.markLessonComplete(userId, courseId, lessonId);
      sendSuccess(res, { progress }, 'Lesson marked as complete');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async enrollCourse(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { courseId } = req.body;
      if (!courseId) {
        sendError(res, 'courseId is required', 400);
        return;
      }
      const enrollment = await learningService.enrollUserInCourse(userId, courseId);
      sendSuccess(res, { enrollment }, 'Enrolled successfully', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getEnrollments(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const enrollments = await learningService.getEnrolledCourses(userId);
      sendSuccess(res, { enrollments }, 'Enrolled courses fetched successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getProgressSummary(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const summary = await learningService.getUserProgressSummary(userId);
      sendSuccess(res, { summary }, 'Progress summary fetched successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}

export const learningController = new LearningController();
export default learningController;
