import { Router } from 'express';
import { learningController } from './learning.controller';
import { verifyToken } from '../../middleware/auth.middleware';

const router = Router();

// Apply auth middleware to all routes
router.use(verifyToken);

// Create new tracking
router.post('/', learningController.create);

// Fetch all materials
/**
 * @swagger
 * /api/learning/courses:
 *   get:
 *     tags:
 *       - Learning
 *     summary: Get all available courses
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns list of courses
 */
router.get('/', learningController.getAll);

// Fetch specific material by ID
router.get('/:id', learningController.getById);

// Update progress/details (Marking completed)
/**
 * @swagger
 * /api/learning/lessons/{id}/complete:
 *   patch:
 *     tags:
 *       - Learning
 *     summary: Mark a lesson as completed
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lesson marked as complete
 *       404:
 *         description: Lesson not found
 */
router.put('/:id', learningController.update);

// Delete tracked item
router.delete('/:id', learningController.delete);

export const learningRoutes = router;
export default learningRoutes;
