import { Router } from 'express';
import { roadmapController } from './roadmap.controller';
import { verifyToken } from '../../middleware/auth.middleware';

const router = Router();

// Apply authorization check globally on all roadmap routes
router.use(verifyToken);

// Create new roadmap
/**
 * @swagger
 * /api/roadmap/generate:
 *   post:
 *     tags:
 *       - Roadmap
 *     summary: Generate an AI learning roadmap based on user preferences
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Roadmap generated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: AI generation failed
 */
router.post('/', roadmapController.create);

// Get all roadmaps for the current user
router.get('/', roadmapController.getAll);

// Get roadmap by ID (or user's roadmap)
/**
 * @swagger
 * /api/roadmap/{userId}:
 *   get:
 *     tags:
 *       - Roadmap
 *     summary: Fetch a user's generated roadmap
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
 *         description: Returns roadmap object
 *       404:
 *         description: Roadmap not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', roadmapController.getById);

// Update roadmap by ID
router.put('/:id', roadmapController.update);

export const roadmapRoutes = router;
export default roadmapRoutes;
