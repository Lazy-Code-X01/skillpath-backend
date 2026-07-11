import { Request, Response } from 'express';
import { documentService } from './document.service';
import { sendSuccess, sendError } from '../../utils/response';

export class DocumentController {
  async uploadAndSummarise(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        sendError(res, 'No PDF file uploaded', 400);
        return;
      }
      const userId = req.user?.id;
      if (!userId) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const { originalname: filename, size: fileSize, path: filePath } = req.file;
      const document = await documentService.summarisePDF(userId, filePath, filename, fileSize);
      sendSuccess(res, { document }, 'PDF summarised successfully', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getDocument(req: Request, res: Response): Promise<void> {
    try {
      const { id: documentId } = req.params;
      const userId = req.user!.id;
      const document = await documentService.getDocumentById(documentId, userId);
      sendSuccess(res, { document }, 'Document fetched successfully');
    } catch (error: any) {
      sendError(res, error.message, 404);
    }
  }

  async getDocuments(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const documents = await documentService.getUserDocuments(userId);
      sendSuccess(res, { documents }, 'Documents fetched successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}

export const documentController = new DocumentController();
export default documentController;
