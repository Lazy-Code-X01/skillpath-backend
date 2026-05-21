import { Schema, model, Document } from 'mongoose';

export interface ILearningMaterial extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  type: 'article' | 'video' | 'book' | 'interactive';
  contentUrl?: string;
  notes?: string;
  progress: number; // percentage completed
  isCompleted: boolean;
  createdAt: Date;
}

const LearningMaterialSchema = new Schema<ILearningMaterial>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['article', 'video', 'book', 'interactive'],
    default: 'article',
  },
  contentUrl: String,
  notes: String,
  progress: { type: Number, default: 0, min: 0, max: 100 },
  isCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const LearningMaterial = model<ILearningMaterial>('LearningMaterial', LearningMaterialSchema);
export default LearningMaterial;
