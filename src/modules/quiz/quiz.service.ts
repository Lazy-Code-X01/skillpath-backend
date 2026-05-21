import { Quiz, IQuiz } from './quiz.model';

export class QuizService {
  /**
   * Create or generate a new quiz for a user.
   */
  async createQuiz(userId: string, data: Partial<IQuiz>): Promise<IQuiz> {
    const newQuiz = new Quiz({
      userId,
      ...data,
    });
    return await newQuiz.save();
  }

  /**
   * Retrieve all quizzes taken by/created for a user.
   */
  async getUserQuizzes(userId: string): Promise<IQuiz[]> {
    return Quiz.find({ userId }).sort({ createdAt: -1 });
  }

  /**
   * Fetch a specific quiz details.
   */
  async getQuizById(id: string): Promise<IQuiz | null> {
    return Quiz.findById(id);
  }

  /**
   * Submit answers and record the quiz score.
   */
  async submitQuiz(id: string, score: number): Promise<IQuiz | null> {
    return Quiz.findByIdAndUpdate(
      id,
      {
        $set: {
          score,
          completedAt: new Date(),
        },
      },
      { new: true }
    );
  }
}

export const quizService = new QuizService();
export default quizService;
