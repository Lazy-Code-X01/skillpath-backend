import { Quiz, QuizAttempt, IQuiz, IQuizAttempt } from './quiz.model';
import { Course } from '../learning/learning.model';
import { callClaude } from '../../utils/anthropic';

const stripAnswers = (quiz: IQuiz) => ({
  _id: quiz._id,
  lessonId: quiz.lessonId,
  courseId: quiz.courseId,
  title: quiz.title,
  passMark: quiz.passMark,
  timeLimit: quiz.timeLimit,
  createdAt: quiz.createdAt,
  questions: quiz.questions.map((q) => ({
    _id: q._id,
    question: q.question,
    options: q.options,
    explanation: q.explanation,
  })),
});

export class QuizService {
  async generateQuizForLesson(lessonId: string, courseId: string): Promise<any> {
    const course = await Course.findById(courseId);
    if (!course) throw new Error('Course not found');

    let lesson: any = null;
    for (const mod of course.modules) {
      const found = mod.lessons.find((l: any) => l._id?.toString() === lessonId);
      if (found) { lesson = found; break; }
    }
    if (!lesson) throw new Error('Lesson not found');

    const existing = await Quiz.findOne({ lessonId });
    if (existing) return stripAnswers(existing);

    const systemPrompt =
      'You are an expert quiz generator for a learning platform. Generate quiz questions based on lesson content. You must respond ONLY with valid JSON — no explanation, no markdown, no backticks, no preamble. Return only the raw JSON object.';

    const userPrompt = `Generate a quiz for this lesson:
Title: ${lesson.title}
Content: ${lesson.content}

Return a JSON object with this exact structure:
{
  "title": "string — quiz title based on lesson",
  "questions": [
    {
      "question": "string — the question",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string — must be one of the options exactly",
      "explanation": "string — brief explanation of why this is correct"
    }
  ]
}

Rules:
- Generate exactly 5 questions
- Each question must have exactly 4 options
- correctAnswer must match one of the options exactly word for word
- Questions should test understanding of the lesson content
- Keep questions clear and concise`;

    const raw = await callClaude(systemPrompt, userPrompt);
    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const quiz = new Quiz({
      lessonId,
      courseId,
      title: parsed.title,
      questions: parsed.questions,
      passMark: 70,
      timeLimit: 15,
    });

    const saved = await quiz.save();
    return stripAnswers(saved);
  }

  async getQuizByLesson(lessonId: string): Promise<any> {
    const quiz = await Quiz.findOne({ lessonId });
    if (!quiz) throw new Error('Quiz not found for this lesson');
    return stripAnswers(quiz);
  }

  async submitQuizAnswers(
    userId: string,
    quizId: string,
    answers: string[],
    timeTaken: number
  ): Promise<any> {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) throw new Error('Quiz not found');

    if (answers.length !== quiz.questions.length) {
      throw new Error('Invalid number of answers submitted');
    }

    let correctCount = 0;
    const breakdown = quiz.questions.map((q, i) => {
      const isCorrect = answers[i] === q.correctAnswer;
      if (isCorrect) correctCount++;
      return {
        question: q.question,
        yourAnswer: answers[i],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        isCorrect,
      };
    });

    const wrongCount = quiz.questions.length - correctCount;
    const score = Math.round((correctCount / quiz.questions.length) * 1000) / 10;
    const passed = score >= quiz.passMark;

    await new QuizAttempt({
      userId,
      quizId,
      answers,
      score,
      passed,
      correctCount,
      wrongCount,
      timeTaken,
    }).save();

    return {
      score,
      passed,
      correctCount,
      wrongCount,
      totalQuestions: quiz.questions.length,
      passMark: quiz.passMark,
      timeTaken,
      breakdown,
    };
  }

  async getQuizAttempts(userId: string, quizId: string): Promise<IQuizAttempt[]> {
    return QuizAttempt.find({ userId, quizId }).sort({ attemptedAt: -1 });
  }
}

export const quizService = new QuizService();
export default quizService;
