import { Schema, model, Document } from 'mongoose';

export interface IRoadmap extends Document {
  _id: any;
  userId: Schema.Types.ObjectId;
  title: string;
  estimatedWeeks: number;
  stages: {
    stage: number;
    title: string;
    topics: {
      name: string;
      estimatedDays: number;
    }[];
  }[];
  generatedAt: Date;
}

const RoadmapSchema = new Schema<IRoadmap>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  estimatedWeeks: {
    type: Number,
    required: true,
  },
  stages: [
    {
      stage: Number,
      title: String,
      topics: [
        {
          name: String,
          estimatedDays: Number,
        },
      ],
    },
  ],
  generatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Roadmap = model<IRoadmap>('Roadmap', RoadmapSchema);
export default Roadmap;
