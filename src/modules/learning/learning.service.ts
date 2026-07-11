import { Course, ICourse, UserProgress, IUserProgress, Enrollment, IEnrollment } from './learning.model';

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

  async enrollUserInCourse(userId: string, courseId: string): Promise<IEnrollment> {
    const course = await Course.findById(courseId);
    if (!course) throw new Error('Course not found');

    const existing = await Enrollment.findOne({ userId, courseId });
    if (existing) throw new Error('Already enrolled in this course');

    const enrollment = new Enrollment({ userId, courseId });
    return await enrollment.save();
  }

  async getEnrolledCourses(userId: string): Promise<any[]> {
    const enrollments = await Enrollment.find({ userId, status: 'active' }).populate(
      'courseId',
      'title description category level instructor totalLessons modules'
    );

    return Promise.all(
      enrollments.map(async (enrollment) => {
        const progress = await UserProgress.findOne({ userId, courseId: enrollment.courseId });
        return {
          enrollment: {
            _id: enrollment._id,
            enrolledAt: enrollment.enrolledAt,
            status: enrollment.status,
          },
          course: enrollment.courseId,
          progress: progress
            ? {
                progressPercent: progress.progressPercent,
                completedLessons: progress.completedLessons,
                lastAccessedAt: progress.lastAccessedAt,
              }
            : null,
        };
      })
    );
  }

  async getUserProgressSummary(userId: string): Promise<any> {
    const progressDocs = await UserProgress.find({ userId }).populate('courseId', 'title category');

    const totalCoursesStarted = progressDocs.length;
    const totalLessonsCompleted = progressDocs.reduce(
      (sum, p) => sum + p.completedLessons.length,
      0
    );
    const averageProgress =
      totalCoursesStarted === 0
        ? 0
        : Math.round(
            (progressDocs.reduce((sum, p) => sum + p.progressPercent, 0) / totalCoursesStarted) * 10
          ) / 10;

    const courses = progressDocs.map((p) => {
      const course = p.courseId as any;
      return {
        courseTitle: course?.title ?? '',
        category: course?.category ?? '',
        progressPercent: p.progressPercent,
        completedLessons: p.completedLessons.length,
        lastAccessedAt: p.lastAccessedAt,
      };
    });

    return { totalCoursesStarted, totalLessonsCompleted, averageProgress, courses };
  }
}

export const learningService = new LearningService();
export default learningService;
