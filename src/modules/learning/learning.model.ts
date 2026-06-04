import { Schema, model, Document } from 'mongoose';

export interface ILesson {
  _id?: any;
  title: string;
  content: string;
  estimatedMinutes: number;
  order: number;
}

export interface IModule {
  _id?: any;
  title: string;
  order: number;
  lessons: ILesson[];
}

export interface ICourse extends Document {
  _id: any;
  title: string;
  description: string;
  category: string;
  level: string;
  instructor: string;
  totalLessons: number;
  modules: IModule[];
  createdAt: Date;
}

export interface IUserProgress extends Document {
  _id: any;
  userId: Schema.Types.ObjectId;
  courseId: Schema.Types.ObjectId;
  completedLessons: Schema.Types.ObjectId[];
  progressPercent: number;
  lastAccessedAt: Date;
}

const LessonSchema = new Schema<ILesson>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  estimatedMinutes: { type: Number, required: true },
  order: { type: Number, required: true },
});

const ModuleSchema = new Schema<IModule>({
  title: { type: String, required: true },
  order: { type: Number, required: true },
  lessons: [LessonSchema],
});

const CourseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Web Dev', 'Data Science', 'UI/UX', 'Python', 'Cloud', 'Mobile'],
  },
  level: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  instructor: { type: String, required: true },
  totalLessons: { type: Number, required: true },
  modules: [ModuleSchema],
  createdAt: { type: Date, default: Date.now },
});

const UserProgressSchema = new Schema<IUserProgress>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  completedLessons: [{ type: Schema.Types.ObjectId }],
  progressPercent: { type: Number, default: 0 },
  lastAccessedAt: { type: Date, default: Date.now },
});

UserProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const Course = model<ICourse>('Course', CourseSchema);
export const UserProgress = model<IUserProgress>('UserProgress', UserProgressSchema);
