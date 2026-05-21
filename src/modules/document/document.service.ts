import fs from 'fs';
import { Document, IDocument } from './document.model';
import { parsePDF } from '../../utils/pdfParser';

export class DocumentService {
  /**
   * Register a uploaded document record and extract text.
   */
  async processUploadedDocument(
    userId: string,
    file: Express.Multer.File
  ): Promise<IDocument> {
    let parsedText = '';

    if (file.mimetype === 'application/pdf') {
      try {
        const fileBuffer = fs.readFileSync(file.path);
        const pdfData = await parsePDF(fileBuffer);
        parsedText = pdfData.text;
      } catch (err) {
        console.error('Error parsing PDF content in DocumentService:', err);
      }
    }

    const doc = new Document({
      userId,
      fileName: file.filename,
      originalName: file.originalname,
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
      parsedText,
    });

    return await doc.save();
  }

  /**
   * Retrieve all uploaded documents for a user.
   */
  async getUserDocuments(userId: string): Promise<IDocument[]> {
    return Document.find({ userId }).sort({ createdAt: -1 });
  }

  /**
   * Retrieve a specific document details.
   */
  async getDocumentById(id: string): Promise<IDocument | null> {
    return Document.findById(id);
  }

  /**
   * Delete a document and its local file.
   */
  async deleteDocument(id: string): Promise<IDocument | null> {
    const doc = await Document.findById(id);
    if (doc) {
      if (fs.existsSync(doc.filePath)) {
        fs.unlinkSync(doc.filePath);
      }
      await doc.deleteOne();
    }
    return doc;
  }
}

export const documentService = new DocumentService();
export default documentService;
