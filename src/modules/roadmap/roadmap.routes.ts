import { Router } from 'express';
import { roadmapController } from './roadmap.controller';
import { verifyToken } from '../../middleware/auth.middleware';

const router = Router();

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
 *       400:
 *         description: AI generation failed or onboarding incomplete
 */
router.post('/generate', verifyToken, roadmapController.generateRoadmap);

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
router.get('/:userId', verifyToken, roadmapController.getRoadmap);

export const roadmapRoutes = router;
export default roadmapRoutes;
