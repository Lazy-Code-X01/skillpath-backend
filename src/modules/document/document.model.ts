import { Schema, model, Document as MongooseDocument } from 'mongoose';

export interface IDocument extends MongooseDocument {
  _id: any;
  userId: Schema.Types.ObjectId;
  filename: string;
  fileSize: number;
  pageCount: number;
  summary?: string;
  keyPoints: string[];
  overview?: string;
  extractedText?: string;
  status: 'processing' | 'done' | 'failed';
  createdAt: Date;
}

const DocumentSchema = new Schema<IDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  fileSize: { type: Number, required: true },
  pageCount: { type: Number, default: 0 },
  summary: { type: String, default: '' },
  keyPoints: [String],
  overview: { type: String, default: '' },
  extractedText: String,
  status: { type: String, enum: ['processing', 'done', 'failed'], default: 'processing' },
  createdAt: { type: Date, default: Date.now },
});

export const Document = model<IDocument>('Document', DocumentSchema);
export default Document;
