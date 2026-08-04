import { Schema, model } from 'mongoose';
import { User } from '../user/user.model';
import { Course, UserProgress, Enrollment } from '../learning/learning.model';
import { Document } from '../document/document.model';
import { Quiz, QuizAttempt } from '../quiz/quiz.model';
import { Roadmap } from '../roadmap/roadmap.model';

const SettingsSchema = new Schema({
  platformName: { type: String, default: 'SkillPath AI' },
  maintenanceMode: { type: Boolean, default: false },
  allowNewRegistrations: { type: Boolean, default: true },
  maxPDFSizeMB: { type: Number, default: 20 },
  quizPassMark: { type: Number, default: 70 },
  quizTimeLimit: { type: Number, default: 15 },
  updatedAt: { type: Date, default: Date.now },
});

const Settings = model('Settings', SettingsSchema);

export class AdminService {
  async getOverviewStats(): Promise<any> {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalCourses,
      totalDocuments,
      newUsersThisWeek,
      newUsersThisMonth,
      lessonsAgg,
      progressAgg,
    ] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Document.countDocuments(),
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      UserProgress.aggregate([
        { $project: { count: { $size: '$completedLessons' } } },
        { $group: { _id: null, total: { $sum: '$count' } } },
      ]),
      UserProgress.aggregate([
        { $group: { _id: null, avg: { $avg: '$progressPercent' } } },
      ]),
    ]);

    return {
      totalUsers,
      totalCourses,
      totalDocuments,
      newUsersThisWeek,
      newUsersThisMonth,
      totalLessonsCompleted: lessonsAgg[0]?.total ?? 0,
      averageCompletionRate: Math.round((progressAgg[0]?.avg ?? 0) * 10) / 10,
    };
  }

  async getUserGrowth(): Promise<any[]> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const results = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return results.map((r) => ({
      month: monthNames[r._id.month - 1],
      year: r._id.year,
      count: r.count,
    }));
  }

  async getRecentSignups(limit: number = 10): Promise<any[]> {
    return User.find()
      .select('name email createdAt preferences.goal')
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async getTopCourses(limit: number = 5): Promise<any[]> {
    const results = await UserProgress.aggregate([
      {
        $group: {
          _id: '$courseId',
          enrollmentCount: { $sum: 1 },
          averageProgress: { $avg: '$progressPercent' },
        },
      },
      { $sort: { enrollmentCount: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course',
        },
      },
      { $unwind: { path: '$course', preserveNullAndEmptyArrays: true } },
    ]);

    return results.map((r) => ({
      courseTitle: r.course?.title ?? 'Unknown',
      category: r.course?.category ?? 'Unknown',
      enrollmentCount: r.enrollmentCount,
      averageProgress: Math.round((r.averageProgress ?? 0) * 10) / 10,
    }));
  }

  async getPlatformActivity(): Promise<any[]> {
    const [quizAttempts, docUploads, lessonActivity] = await Promise.all([
      QuizAttempt.find().sort({ attemptedAt: -1 }).limit(5).populate('userId', 'name'),
      Document.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name'),
      UserProgress.find()
        .sort({ lastAccessedAt: -1 })
        .limit(5)
        .populate('userId', 'name')
        .populate('courseId', 'title'),
    ]);

    const feed: { type: string; description: string; timestamp: Date }[] = [];

    for (const a of quizAttempts) {
      const user = a.userId as any;
      feed.push({
        type: 'quiz_attempt',
        description: `${user?.name ?? 'Someone'} scored ${a.score}% on a quiz`,
        timestamp: a.attemptedAt,
      });
    }

    for (const d of docUploads) {
      const user = d.userId as any;
      feed.push({
        type: 'pdf_upload',
        description: `${user?.name ?? 'Someone'} uploaded and summarised a PDF`,
        timestamp: d.createdAt,
      });
    }

    for (const p of lessonActivity) {
      const user = p.userId as any;
      const course = p.courseId as any;
      feed.push({
        type: 'lesson_complete',
        description: `${user?.name ?? 'Someone'} completed a lesson in ${course?.title ?? 'a course'}`,
        timestamp: p.lastAccessedAt,
      });
    }

    return feed.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
  }

  async getAllUsers(page: number = 1, limit: number = 20, search?: string): Promise<any> {
    const query: any = search
      ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
      : {};
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(query).select('-password').skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);
    return { users, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getUserDetail(userId: string): Promise<any> {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new Error('User not found');

    const [roadmap, enrollments, progress] = await Promise.all([
      Roadmap.findOne({ userId }),
      Enrollment.find({ userId }).populate('courseId', 'title category'),
      UserProgress.find({ userId }).populate('courseId', 'title'),
    ]);

    return { user, roadmap, enrollments, progress };
  }

  async updateUserRole(userId: string, role: string): Promise<any> {
    if (role !== 'user' && role !== 'admin') throw new Error('Invalid role');
    const user = await User.findByIdAndUpdate(userId, { $set: { role } }, { new: true }).select('-password');
    if (!user) throw new Error('User not found');
    return user;
  }

  async createCourse(courseData: any): Promise<any> {
    const { title, description, category, level, instructor, modules } = courseData;
    if (!title || !description || !category || !level || !instructor) {
      throw new Error('Missing required course fields');
    }
    const totalLessons = (modules ?? []).reduce(
      (sum: number, m: any) => sum + (m.lessons?.length ?? 0),
      0
    );
    const course = new Course({ ...courseData, totalLessons });
    return await course.save();
  }

  async updateCourse(courseId: string, courseData: any): Promise<any> {
    const existing = await Course.findById(courseId);
    if (!existing) throw new Error('Course not found');

    if (courseData.modules) {
      courseData.totalLessons = courseData.modules.reduce(
        (sum: number, m: any) => sum + (m.lessons?.length ?? 0),
        0
      );
    }

    return Course.findByIdAndUpdate(courseId, { $set: courseData }, { new: true });
  }

  async deleteCourse(courseId: string): Promise<any> {
    const course = await Course.findById(courseId);
    if (!course) throw new Error('Course not found');

    await Promise.all([
      Course.findByIdAndDelete(courseId),
      UserProgress.deleteMany({ courseId }),
      Enrollment.deleteMany({ courseId }),
      Quiz.deleteMany({ courseId }),
    ]);

    return { message: 'Course deleted successfully' };
  }

  async getAllQuizzes(page: number = 1, limit: number = 20): Promise<any> {
    const skip = (page - 1) * limit;
    const [quizzes, total] = await Promise.all([
      Quiz.find().populate('courseId', 'title category').skip(skip).limit(limit),
      Quiz.countDocuments(),
    ]);
    return { quizzes, total, page, totalPages: Math.ceil(total / limit) };
  }

  async createQuizManually(
    lessonId: string,
    courseId: string,
    title: string,
    questions: any[],
    passMark: number = 70,
    timeLimit: number = 15
  ): Promise<any> {
    if (!lessonId || !courseId || !title || !questions) throw new Error('Missing required quiz fields');
    if (!questions.length) throw new Error('Questions array must have at least 1 item');

    for (const q of questions) {
      if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || !q.correctAnswer || !q.explanation) {
        throw new Error('Each question must have: question, options (4), correctAnswer, explanation');
      }
    }

    const existing = await Quiz.findOne({ lessonId });
    if (existing) throw new Error('Quiz already exists for this lesson');

    const quiz = new Quiz({ lessonId, courseId, title, questions, passMark, timeLimit });
    return await quiz.save();
  }

  async updateQuiz(quizId: string, updateData: any): Promise<any> {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) throw new Error('Quiz not found');
    return Quiz.findByIdAndUpdate(quizId, { $set: updateData }, { new: true });
  }

  async deleteQuiz(quizId: string): Promise<any> {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) throw new Error('Quiz not found');
    await Quiz.findByIdAndDelete(quizId);
    return { message: 'Quiz deleted successfully' };
  }

  async getSettings(): Promise<any> {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await new Settings({}).save();
    }
    return settings;
  }

  async updateSettings(settingsData: any): Promise<any> {
    const settings = await Settings.findOneAndUpdate(
      {},
      { $set: { ...settingsData, updatedAt: new Date() } },
      { new: true, upsert: true }
    );
    return settings;
  }
}

export const adminService = new AdminService();
export default adminService;
