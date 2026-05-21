import { Router } from 'express';
import { userController } from './user.controller';
import { verifyToken } from '../../middleware/auth.middleware';

const router = Router();

// Retrieve profile (protected)
/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     tags:
 *       - User
 *     summary: Get authenticated user's profile
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user profile object
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', verifyToken, userController.getProfile);

// Update profile (protected)
/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     tags:
 *       - User
 *     summary: Update user preferences (goal, currentLevel, dailyTime)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               goal:
 *                 type: string
 *               currentLevel:
 *                 type: string
 *                 enum: ["beginner","intermediate","advanced"]
 *               dailyTime:
 *                 type: number
 *                 example: 30
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Unauthorized
 */
router.put('/profile', verifyToken, userController.updateProfile);

export const userRoutes = router;
export default userRoutes;
