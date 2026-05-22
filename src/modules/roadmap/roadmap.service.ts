import { Roadmap, IRoadmap } from './roadmap.model';
import { User } from '../user/user.model';
import { callClaude } from '../../utils/anthropic';

export class RoadmapService {
  async generateRoadmap(userId: string): Promise<IRoadmap> {
    const user = await User.findById(userId).select('preferences');
    if (!user) throw new Error('User not found');

    const { goal, currentLevel, dailyTime } = user.preferences;
    if (!goal) throw new Error('Please complete onboarding before generating a roadmap');

    const systemPrompt =
      'You are an expert learning path generator. Your job is to create structured, personalized learning roadmaps. You must respond ONLY with valid JSON — no explanation, no markdown, no backticks, no preamble. Return only the raw JSON object.';

    const userPrompt = `Generate a personalized learning roadmap for someone with the following profile:
- Goal: ${goal}
- Current Level: ${currentLevel}
- Daily Time Available: ${dailyTime} minutes per day

Return a JSON object with this exact structure:
{
  "title": "string — name of the roadmap",
  "estimatedWeeks": number — realistic total duration,
  "stages": [
    {
      "stage": number,
      "title": "string — stage name",
      "topics": [
        {
          "name": "string — topic name",
          "estimatedDays": number
        }
      ]
    }
  ]
}

Rules:
- Generate between 4 and 6 stages
- Each stage should have between 3 and 6 topics
- estimatedDays per topic should be realistic based on dailyTime
- estimatedWeeks should be the sum of all topic days divided by 7, rounded up
- Be specific and practical, not generic`;

    const raw = await callClaude(systemPrompt, userPrompt);

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error('Failed to parse AI response');
    }

    const existing = await Roadmap.findOne({ userId });

    if (existing) {
      return (await Roadmap.findOneAndUpdate(
        { userId },
        { $set: { ...parsed, generatedAt: new Date() } },
        { new: true }
      ))!;
    }

    const roadmap = new Roadmap({ userId, ...parsed });
    return await roadmap.save();
  }

  async getRoadmapByUserId(userId: string): Promise<IRoadmap> {
    const roadmap = await Roadmap.findOne({ userId });
    if (!roadmap) throw new Error('Roadmap not found');
    return roadmap;
  }
}

export const roadmapService = new RoadmapService();
export default roadmapService;
