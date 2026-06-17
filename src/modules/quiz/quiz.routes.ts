import { Router } from 'express';
import { quizController } from './quiz.controller';
import { verifyToken } from '../../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/quiz/generate:
 *   post:
 *     tags:
 *       - Quiz
 *     summary: Generate an AI quiz for a specific lesson
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lessonId
 *               - courseId
 *             properties:
 *               lessonId:
 *                 type: string
 *               courseId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Quiz generated successfully. Returns quiz object with questions (no correct answers)
 *       400:
 *         description: Missing lessonId or courseId
 */
router.post('/generate', verifyToken, quizController.generateQuiz);

/**
 * @swagger
 * /api/quiz/lesson/{lessonId}:
 *   get:
 *     tags:
 *       - Quiz
 *     summary: Get quiz for a specific lesson (correct answers hidden)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns quiz object
 *       404:
 *         description: Quiz not found
 */
router.get('/lesson/:lessonId', verifyToken, quizController.getQuiz);

/**
 * @swagger
 * /api/quiz/{quizId}/submit:
 *   post:
 *     tags:
 *       - Quiz
 *     summary: Submit quiz answers and get score with breakdown
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answers
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: string
 *               timeTaken:
 *                 type: number
 *                 description: Seconds taken to complete the quiz
 *     responses:
 *       200:
 *         description: Returns score, passed, correctCount, wrongCount, and full breakdown
 *       400:
 *         description: Invalid submission
 */
router.post('/:quizId/submit', verifyToken, quizController.submitQuiz);

/**
 * @swagger
 * /api/quiz/{quizId}/attempts:
 *   get:
 *     tags:
 *       - Quiz
 *     summary: Get all previous attempts for a quiz by the logged in user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns array of attempt objects
 */
router.get('/:quizId/attempts', verifyToken, quizController.getAttempts);

export const quizRoutes = router;
export default quizRoutes;
