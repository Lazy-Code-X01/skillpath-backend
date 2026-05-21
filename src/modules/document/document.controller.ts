import { Request, Response } from 'express';
import { documentService } from './document.service';
import { sendSuccess, sendError } from '../../utils/response';

export class DocumentController {
  /**
   * Upload and process a PDF document.
   */
  async upload(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        sendError(res, 'User identity not found in request context.', 401);
        return;
      }

      const file = req.file;
      if (!file) {
        sendError(res, 'No PDF file uploaded.', 400);
        return;
      }

      const doc = await documentService.processUploadedDocument(userId, file);
      sendSuccess(res, doc, 'Document uploaded and processed successfully.', 201);
    } catch (error: any) {
      sendError(res, error.message || 'Failed to upload document.', 500);
    }
  }

  /**
   * Get list of all documents uploaded by user.
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        sendError(res, 'User identity not found in request context.', 401);
        return;
      }

      const docs = await documentService.getUserDocuments(userId);
      sendSuccess(res, docs, 'User documents retrieved successfully.');
    } catch (error: any) {
      sendError(res, error.message || 'Failed to retrieve documents.', 500);
    }
  }

  /**
   * Get specific document metadata.
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const doc = await documentService.getDocumentById(id);
      if (!doc) {
        sendError(res, 'Document not found.', 404);
        return;
      }
      sendSuccess(res, doc, 'Document retrieved successfully.');
    } catch (error: any) {
      sendError(res, error.message || 'Failed to retrieve document.', 500);
    }
  }

  /**
   * Delete uploaded document.
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await documentService.deleteDocument(id);
      if (!deleted) {
        sendError(res, 'Document not found or already deleted.', 404);
        return;
      }
      sendSuccess(res, deleted, 'Document deleted successfully.');
    } catch (error: any) {
      sendError(res, error.message || 'Failed to delete document.', 500);
    }
  }
}

export const documentController = new DocumentController();
export default documentController;
