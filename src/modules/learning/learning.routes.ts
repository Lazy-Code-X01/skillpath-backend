import { Router } from 'express';
import { learningController } from './learning.controller';
import { verifyToken } from '../../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/learning:
 *   get:
 *     tags:
 *       - Learning
 *     summary: Get all available courses
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns list of courses
 *       401:
 *         description: Unauthorized
 */
router.get('/', verifyToken, learningController.getCourses);

/**
 * @swagger
 * /api/learning/{courseId}:
 *   get:
 *     tags:
 *       - Learning
 *     summary: Get a single course by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns course object with modules and lessons
 *       404:
 *         description: Course not found
 */
router.get('/:courseId', verifyToken, learningController.getCourse);

/**
 * @swagger
 * /api/learning/lessons/complete:
 *   patch:
 *     tags:
 *       - Learning
 *     summary: Mark a lesson as completed
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - lessonId
 *             properties:
 *               courseId:
 *                 type: string
 *               lessonId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lesson marked as complete
 *       400:
 *         description: Missing fields or lesson not found
 */
router.patch('/lessons/complete', verifyToken, learningController.completeLesson);

export const learningRoutes = router;
export default learningRoutes;
