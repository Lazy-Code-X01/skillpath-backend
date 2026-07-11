import { Router } from 'express';
import { documentController } from './document.controller';
import { verifyToken } from '../../middleware/auth.middleware';
import { uploadPDF } from '../../middleware/upload.middleware';

const router = Router();

/**
 * @swagger
 * /api/document/upload:
 *   post:
 *     tags:
 *       - Document
 *     summary: Upload a PDF and get an AI-generated summary
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Returns document with overview, summary, and keyPoints
 *       400:
 *         description: No file uploaded or unreadable PDF
 */
router.post('/upload', verifyToken, uploadPDF.single('file'), documentController.uploadAndSummarise);

/**
 * @swagger
 * /api/document/:
 *   get:
 *     tags:
 *       - Document
 *     summary: Get all documents uploaded by the logged in user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns array of document objects
 */
router.get('/', verifyToken, documentController.getDocuments);

/**
 * @swagger
 * /api/document/{id}/summary:
 *   get:
 *     tags:
 *       - Document
 *     summary: Get a specific document summary by ID
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
 *         description: Returns document with full summary
 *       404:
 *         description: Document not found
 */
router.get('/:id/summary', verifyToken, documentController.getDocument);

export const documentRoutes = router;
export default documentRoutes;
