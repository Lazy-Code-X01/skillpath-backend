import { Router } from 'express';
import { adminController } from './admin.controller';
import { verifyToken } from '../../middleware/auth.middleware';
import { adminMiddleware } from '../../middleware/admin.middleware';

const router = Router();

// ─── Dashboard ───────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/admin/overview:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get platform overview stats
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns totalUsers, totalCourses, totalLessonsCompleted, totalDocuments, averageCompletionRate, newUsersThisWeek, newUsersThisMonth
 *       403:
 *         description: Admin access required
 */
router.get('/overview', verifyToken, adminMiddleware, adminController.overview);

/**
 * @swagger
 * /api/admin/growth:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get user growth data for the last 6 months
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns monthly user growth array
 *       403:
 *         description: Admin access required
 */
router.get('/growth', verifyToken, adminMiddleware, adminController.userGrowth);

/**
 * @swagger
 * /api/admin/activity:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get recent platform activity feed
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns unified activity feed array
 *       403:
 *         description: Admin access required
 */
router.get('/activity', verifyToken, adminMiddleware, adminController.platformActivity);

// ─── Users ───────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all users with pagination and search
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Results per page (default 20)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *     responses:
 *       200:
 *         description: Returns { users, total, page, totalPages }
 *       403:
 *         description: Admin access required
 */
router.get('/users', verifyToken, adminMiddleware, adminController.getUsers);

/**
 * @swagger
 * /api/admin/users/recent:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get recent user signups
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Number of results to return (default 10)
 *     responses:
 *       200:
 *         description: Returns array of recent users
 *       403:
 *         description: Admin access required
 */
router.get('/users/recent', verifyToken, adminMiddleware, adminController.recentSignups);

/**
 * @swagger
 * /api/admin/users/{userId}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get full detail for a specific user including roadmap and progress
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns { user, roadmap, enrollments, progress }
 *       404:
 *         description: User not found
 */
router.get('/users/:userId', verifyToken, adminMiddleware, adminController.getUserDetail);

/**
 * @swagger
 * /api/admin/users/{userId}/role:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Update a user's role (user or admin)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: Role updated
 *       400:
 *         description: Invalid role
 */
router.patch('/users/:userId/role', verifyToken, adminMiddleware, adminController.updateUserRole);

// ─── Courses ─────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/admin/courses/top:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get top courses by enrollment
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Number of results to return (default 5)
 *     responses:
 *       200:
 *         description: Returns top courses with enrollment count and average progress
 *       403:
 *         description: Admin access required
 */
router.get('/courses/top', verifyToken, adminMiddleware, adminController.topCourses);

/**
 * @swagger
 * /api/admin/courses:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Create a new course with modules and lessons
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - level
 *               - instructor
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               level:
 *                 type: string
 *               instructor:
 *                 type: string
 *               modules:
 *                 type: array
 *     responses:
 *       201:
 *         description: Course created
 *       400:
 *         description: Missing required fields
 */
router.post('/courses', verifyToken, adminMiddleware, adminController.createCourse);

/**
 * @swagger
 * /api/admin/courses/{courseId}:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Update an existing course
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
 *         description: Course updated
 *       404:
 *         description: Course not found
 */
router.put('/courses/:courseId', verifyToken, adminMiddleware, adminController.updateCourse);

/**
 * @swagger
 * /api/admin/courses/{courseId}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete a course and all related data
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
 *         description: Course deleted
 *       404:
 *         description: Course not found
 */
router.delete('/courses/:courseId', verifyToken, adminMiddleware, adminController.deleteCourse);

// ─── Quizzes ─────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/admin/quizzes:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all quizzes with pagination
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Returns paginated quizzes
 */
router.get('/quizzes', verifyToken, adminMiddleware, adminController.getQuizzes);

/**
 * @swagger
 * /api/admin/quizzes:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Manually create a quiz for a lesson
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
 *               - title
 *               - questions
 *             properties:
 *               lessonId:
 *                 type: string
 *               courseId:
 *                 type: string
 *               title:
 *                 type: string
 *               questions:
 *                 type: array
 *               passMark:
 *                 type: number
 *               timeLimit:
 *                 type: number
 *     responses:
 *       201:
 *         description: Quiz created
 *       400:
 *         description: Validation error or quiz already exists
 */
router.post('/quizzes', verifyToken, adminMiddleware, adminController.createQuiz);

/**
 * @swagger
 * /api/admin/quizzes/{quizId}:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Update an existing quiz
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
 *         description: Quiz updated
 *       404:
 *         description: Quiz not found
 */
router.put('/quizzes/:quizId', verifyToken, adminMiddleware, adminController.updateQuiz);

/**
 * @swagger
 * /api/admin/quizzes/{quizId}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete a quiz
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
 *         description: Quiz deleted
 *       404:
 *         description: Quiz not found
 */
router.delete('/quizzes/:quizId', verifyToken, adminMiddleware, adminController.deleteQuiz);

// ─── Settings ─────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/admin/settings:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get platform settings
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns settings object
 */
router.get('/settings', verifyToken, adminMiddleware, adminController.getSettings);

/**
 * @swagger
 * /api/admin/settings:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Update platform settings
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               platformName:
 *                 type: string
 *               maintenanceMode:
 *                 type: boolean
 *               allowNewRegistrations:
 *                 type: boolean
 *               maxPDFSizeMB:
 *                 type: number
 *               quizPassMark:
 *                 type: number
 *               quizTimeLimit:
 *                 type: number
 *     responses:
 *       200:
 *         description: Settings updated
 */
router.patch('/settings', verifyToken, adminMiddleware, adminController.updateSettings);

export const adminRoutes = router;
export default adminRoutes;
