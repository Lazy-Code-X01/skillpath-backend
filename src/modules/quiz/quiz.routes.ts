import { Router } from 'express';
import { quizController } from './quiz.controller';
import { verifyToken } from '../../middleware/auth.middleware';

const router = Router();

// Secure all endpoints below
router.use(verifyToken);

// Create quiz
router.post('/', quizController.create);

// Fetch all quizzes
router.get('/', quizController.getAll);

// Fetch details of a single quiz
/**
 * @swagger
 * /api/quiz/{lessonId}:
 *   get:
 *     tags:
 *       - Quiz
 *     summary: Get quiz for a specific lesson
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
 *         description: Returns quiz with questions
 *       404:
 *         description: Quiz not found
 */
router.get('/:id', quizController.getById);

// Submit quiz answers/score
/**
 * @swagger
 * /api/quiz/{quizId}/submit:
 *   post:
 *     tags:
 *       - Quiz
 *     summary: Submit quiz answers and get score
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
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Returns score and result breakdown
 *       400:
 *         description: Invalid submission
 */
router.post('/:id/submit', quizController.submit);

export const quizRoutes = router;
export default quizRoutes;
