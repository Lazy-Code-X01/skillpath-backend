import { Course, ICourse, UserProgress, IUserProgress } from './learning.model';

export class LearningService {
  async getAllCourses(): Promise<ICourse[]> {
    return Course.find();
  }

  async getCourseById(courseId: string): Promise<ICourse> {
    const course = await Course.findById(courseId);
    if (!course) throw new Error('Course not found');
    return course;
  }

  async markLessonComplete(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<IUserProgress> {
    const course = await Course.findById(courseId);
    if (!course) throw new Error('Course not found');

    const lessonExists = course.modules.some((m) =>
      m.lessons.some((l) => l._id?.toString() === lessonId)
    );
    if (!lessonExists) throw new Error('Lesson not found');

    await UserProgress.findOneAndUpdate(
      { userId, courseId },
      { $addToSet: { completedLessons: lessonId }, lastAccessedAt: new Date() },
      { upsert: true, new: true }
    );

    const progress = await UserProgress.findOne({ userId, courseId });
    const completedCount = progress!.completedLessons.length;
    const progressPercent = Math.round((completedCount / course.totalLessons) * 1000) / 10;

    return (await UserProgress.findOneAndUpdate(
      { userId, courseId },
      { $set: { progressPercent } },
      { new: true }
    ))!;
  }
}

export const learningService = new LearningService();
export default learningService;
