import { Request, Response } from 'express';
import { quizService } from './quiz.service';
import { sendSuccess, sendError } from '../../utils/response';

export class QuizController {
  /**
   * Create a new quiz.
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        sendError(res, 'User identity not found in request context.', 401);
        return;
      }

      const quiz = await quizService.createQuiz(userId, req.body);
      sendSuccess(res, quiz, 'Quiz created successfully.', 201);
    } catch (error: any) {
      sendError(res, error.message || 'Failed to create quiz.', 500);
    }
  }

  /**
   * Get all quizzes for the logged-in user.
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        sendError(res, 'User identity not found in request context.', 401);
        return;
      }

      const quizzes = await quizService.getUserQuizzes(userId);
      sendSuccess(res, quizzes, 'User quizzes retrieved successfully.');
    } catch (error: any) {
      sendError(res, error.message || 'Failed to retrieve quizzes.', 500);
    }
  }

  /**
   * Get details of a single quiz.
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const quiz = await quizService.getQuizById(id);
      if (!quiz) {
        sendError(res, 'Quiz not found.', 404);
        return;
      }
      sendSuccess(res, quiz, 'Quiz retrieved successfully.');
    } catch (error: any) {
      sendError(res, error.message || 'Failed to retrieve quiz.', 500);
    }
  }

  /**
   * Submit completed quiz responses.
   */
  async submit(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { score } = req.body;

      if (typeof score !== 'number') {
        sendError(res, 'A numerical score is required for submission.', 400);
        return;
      }

      const completedQuiz = await quizService.submitQuiz(id, score);
      if (!completedQuiz) {
        sendError(res, 'Quiz not found or update failed.', 404);
        return;
      }

      sendSuccess(res, completedQuiz, 'Quiz submitted and graded successfully.');
    } catch (error: any) {
      sendError(res, error.message || 'Failed to submit quiz.', 500);
    }
  }
}

export const quizController = new QuizController();
export default quizController;
