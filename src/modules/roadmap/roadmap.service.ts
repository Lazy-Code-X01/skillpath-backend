import { Roadmap, IRoadmap } from './roadmap.model';

export class RoadmapService {
  /**
   * Create a new learning roadmap for a user.
   */
  async createRoadmap(userId: string, data: Partial<IRoadmap>): Promise<IRoadmap> {
    const newRoadmap = new Roadmap({
      userId,
      ...data,
    });
    return await newRoadmap.save();
  }

  /**
   * Retrieve all roadmaps for a user.
   */
  async getUserRoadmaps(userId: string): Promise<IRoadmap[]> {
    return Roadmap.find({ userId }).sort({ createdAt: -1 });
  }

  /**
   * Fetch a specific roadmap by its ID.
   */
  async getRoadmapById(id: string): Promise<IRoadmap | null> {
    return Roadmap.findById(id);
  }

  /**
   * Update steps or info inside a roadmap.
   */
  async updateRoadmap(id: string, updates: Partial<IRoadmap>): Promise<IRoadmap | null> {
    return Roadmap.findByIdAndUpdate(id, { $set: updates }, { new: true });
  }
}

export const roadmapService = new RoadmapService();
export default roadmapService;
