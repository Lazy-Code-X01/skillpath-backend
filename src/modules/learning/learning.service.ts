import { LearningMaterial, ILearningMaterial } from './learning.model';

export class LearningService {
  /**
   * Add a new learning material tracking record.
   */
  async addMaterial(userId: string, data: Partial<ILearningMaterial>): Promise<ILearningMaterial> {
    const newMaterial = new LearningMaterial({
      userId,
      ...data,
    });
    return await newMaterial.save();
  }

  /**
   * Get all learning materials tracked by a user.
   */
  async getUserMaterials(userId: string): Promise<ILearningMaterial[]> {
    return LearningMaterial.find({ userId }).sort({ createdAt: -1 });
  }

  /**
   * Fetch details of a specific learning material.
   */
  async getMaterialById(id: string): Promise<ILearningMaterial | null> {
    return LearningMaterial.findById(id);
  }

  /**
   * Update the progress, notes, or details of a material.
   */
  async updateMaterial(id: string, updates: Partial<ILearningMaterial>): Promise<ILearningMaterial | null> {
    if (updates.progress === 100) {
      updates.isCompleted = true;
    }
    return LearningMaterial.findByIdAndUpdate(id, { $set: updates }, { new: true });
  }

  /**
   * Delete a learning material record.
   */
  async deleteMaterial(id: string): Promise<ILearningMaterial | null> {
    return LearningMaterial.findByIdAndDelete(id);
  }
}

export const learningService = new LearningService();
export default learningService;
