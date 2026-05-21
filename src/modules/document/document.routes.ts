import { Router } from 'express';
import { documentController } from './document.controller';
import { verifyToken } from '../../middleware/auth.middleware';
import { uploadPDF } from '../../middleware/upload.middleware';

const router = Router();

// Protect all document routes
router.use(verifyToken);

// Upload a single PDF file (using 'file' as key)
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
 *         description: Returns document record with summary
 *       400:
 *         description: Invalid file or upload error
 */
router.post('/upload', uploadPDF.single('file'), documentController.upload);

// Retrieve user's document history
router.get('/', documentController.getAll);

// Get specific document by ID (retrieving the summary)
/**
 * @swagger
 * /api/document/{id}/summary:
 *   get:
 *     tags:
 *       - Document
 *     summary: Retrieve a previously generated document summary
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
 *         description: Returns summary object
 *       404:
 *         description: Document not found
 */
router.get('/:id', documentController.getById);

// Delete a document by ID
router.delete('/:id', documentController.delete);

export const documentRoutes = router;
export default documentRoutes;
