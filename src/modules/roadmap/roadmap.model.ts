import { Schema, model, Document } from 'mongoose';

export interface IRoadmap extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  description?: string;
  steps: {
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    resources?: string[];
  }[];
  createdAt: Date;
}

const RoadmapSchema = new Schema<IRoadmap>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  steps: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
      resources: [String],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Roadmap = model<IRoadmap>('Roadmap', RoadmapSchema);
export default Roadmap;
