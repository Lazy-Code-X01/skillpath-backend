import { Request, Response } from 'express';
import { quizService } from './quiz.service';
import { sendSuccess, sendError } from '../../utils/response';

export class QuizController {
  async generateQuiz(req: Request, res: Response): Promise<void> {
    try {
      const { lessonId, courseId } = req.body;
      if (!lessonId || !courseId) {
        sendError(res, 'lessonId and courseId are required', 400);
        return;
      }
      const quiz = await quizService.generateQuizForLesson(lessonId, courseId);
      sendSuccess(res, { quiz }, 'Quiz generated successfully', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getQuiz(req: Request, res: Response): Promise<void> {
    try {
      const { lessonId } = req.params;
      const quiz = await quizService.getQuizByLesson(lessonId);
      sendSuccess(res, { quiz }, 'Quiz fetched successfully');
    } catch (error: any) {
      sendError(res, error.message, 404);
    }
  }

  async submitQuiz(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { quizId } = req.params;
      const { answers, timeTaken } = req.body;
      if (!answers || !Array.isArray(answers)) {
        sendError(res, 'Answers array is required', 400);
        return;
      }
      const result = await quizService.submitQuizAnswers(userId, quizId, answers, timeTaken || 0);
      sendSuccess(res, result, 'Quiz submitted successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getAttempts(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { quizId } = req.params;
      const attempts = await quizService.getQuizAttempts(userId, quizId);
      sendSuccess(res, { attempts }, 'Attempts fetched successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}

export const quizController = new QuizController();
export default quizController;
