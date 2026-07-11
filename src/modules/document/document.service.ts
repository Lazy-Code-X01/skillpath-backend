import { Document, IDocument } from './document.model';
import { extractTextFromPDF, cleanupFile } from '../../utils/pdfParser';
import { callClaude } from '../../utils/anthropic';

export class DocumentService {
  async summarisePDF(
    userId: string,
    filePath: string,
    filename: string,
    fileSize: number
  ): Promise<IDocument> {
    const { text, pageCount } = await extractTextFromPDF(filePath);

    if (!text || text.trim().length < 50) {
      cleanupFile(filePath);
      throw new Error('PDF appears to be empty or unreadable');
    }

    const truncatedText = text.length > 8000 ? text.slice(0, 8000) : text;

    const doc = await new Document({
      userId,
      filename,
      fileSize,
      pageCount,
      summary: '',
      overview: '',
      keyPoints: [],
      status: 'processing',
    }).save();

    try {
      const systemPrompt =
        'You are an expert document summariser. Your job is to extract key information from documents and present it clearly. You must respond ONLY with valid JSON — no explanation, no markdown, no backticks, no preamble. Return only the raw JSON object.';

      const userPrompt = `Summarise the following document content and extract the most important information.

Document: ${filename}
Content:
${truncatedText}

Return a JSON object with this exact structure:
{
  "overview": "string — one clear paragraph summarising what this document is about",
  "summary": "string — a detailed 2-3 paragraph summary of the main content",
  "keyPoints": ["string", "string", "string"] — array of 5 to 8 key points or takeaways
}

Rules:
- overview should be 2-3 sentences max
- summary should cover the main ideas thoroughly
- keyPoints should be specific and actionable, not generic
- Write in clear, simple English`;

      const raw = await callClaude(systemPrompt, userPrompt);
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      const updated = await Document.findByIdAndUpdate(
        doc._id,
        {
          $set: {
            overview: parsed.overview,
            summary: parsed.summary,
            keyPoints: parsed.keyPoints,
            extractedText: truncatedText,
            status: 'done',
          },
        },
        { new: true }
      );

      cleanupFile(filePath);
      return updated!;
    } catch (error) {
      await Document.findByIdAndUpdate(doc._id, { $set: { status: 'failed' } });
      cleanupFile(filePath);
      throw error;
    }
  }

  async getDocumentById(documentId: string, userId: string): Promise<IDocument> {
    const doc = await Document.findOne({ _id: documentId, userId });
    if (!doc) throw new Error('Document not found');
    return doc;
  }

  async getUserDocuments(userId: string): Promise<IDocument[]> {
    return Document.find({ userId }).sort({ createdAt: -1 });
  }
}

export const documentService = new DocumentService();
export default documentService;
