import { Schema, model, Document } from 'mongoose';

export interface IQuiz extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  questions: {
    questionText: string;
    options: string[];
    correctOptionIndex: number;
  }[];
  score?: number; // Score achieved by the user
  completedAt?: Date;
  createdAt: Date;
}

const QuizSchema = new Schema<IQuiz>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  questions: [
    {
      questionText: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctOptionIndex: { type: Number, required: true },
    },
  ],
  score: Number,
  completedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

export const Quiz = model<IQuiz>('Quiz', QuizSchema);
export default Quiz;
