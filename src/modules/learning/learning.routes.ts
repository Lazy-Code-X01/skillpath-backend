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
 * /api/learning/enroll:
 *   post:
 *     tags:
 *       - Learning
 *     summary: Enroll the logged in user in a course
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
 *             properties:
 *               courseId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Enrolled successfully
 *       400:
 *         description: Already enrolled or course not found
 */
router.post('/enroll', verifyToken, learningController.enrollCourse);

/**
 * @swagger
 * /api/learning/enrollments:
 *   get:
 *     tags:
 *       - Learning
 *     summary: Get all courses the logged in user is enrolled in with progress
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns array of enrollment objects with course data and progress
 */
router.get('/enrollments', verifyToken, learningController.getEnrollments);

/**
 * @swagger
 * /api/learning/progress/summary:
 *   get:
 *     tags:
 *       - Learning
 *     summary: Get overall progress summary for the logged in user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns summary with totalCoursesStarted, totalLessonsCompleted, averageProgress, and per-course breakdown
 */
router.get('/progress/summary', verifyToken, learningController.getProgressSummary);

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
