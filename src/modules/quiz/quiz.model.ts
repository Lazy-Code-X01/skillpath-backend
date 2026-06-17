import { Schema, model, Document } from 'mongoose';

export interface IQuestion {
  _id?: any;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface IQuiz extends Document {
  _id: any;
  lessonId: Schema.Types.ObjectId;
  courseId: Schema.Types.ObjectId;
  title: string;
  questions: IQuestion[];
  passMark: number;
  timeLimit: number;
  createdAt: Date;
}

export interface IQuizAttempt extends Document {
  _id: any;
  userId: Schema.Types.ObjectId;
  quizId: Schema.Types.ObjectId;
  answers: string[];
  score: number;
  passed: boolean;
  correctCount: number;
  wrongCount: number;
  timeTaken: number;
  attemptedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String, required: true },
});

const QuizSchema = new Schema<IQuiz>({
  lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true, unique: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  questions: [QuestionSchema],
  passMark: { type: Number, default: 70 },
  timeLimit: { type: Number, default: 15 },
  createdAt: { type: Date, default: Date.now },
});

const QuizAttemptSchema = new Schema<IQuizAttempt>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: [String],
  score: Number,
  passed: Boolean,
  correctCount: Number,
  wrongCount: Number,
  timeTaken: Number,
  attemptedAt: { type: Date, default: Date.now },
});

QuizAttemptSchema.index({ userId: 1, quizId: 1 });

export const Quiz = model<IQuiz>('Quiz', QuizSchema);
export const QuizAttempt = model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);
