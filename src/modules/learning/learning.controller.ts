import { Request, Response } from 'express';
import { learningService } from './learning.service';
import { sendSuccess, sendError } from '../../utils/response';

export class LearningController {
  /**
   * Add a learning material track.
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        sendError(res, 'User identity not found in request context.', 401);
        return;
      }

      const material = await learningService.addMaterial(userId, req.body);
      sendSuccess(res, material, 'Learning material added successfully.', 201);
    } catch (error: any) {
      sendError(res, error.message || 'Failed to add learning material.', 500);
    }
  }

  /**
   * Get all tracked materials for user.
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        sendError(res, 'User identity not found in request context.', 401);
        return;
      }

      const materials = await learningService.getUserMaterials(userId);
      sendSuccess(res, materials, 'Learning materials retrieved successfully.');
    } catch (error: any) {
      sendError(res, error.message || 'Failed to retrieve materials.', 500);
    }
  }

  /**
   * Get specific material details.
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const material = await learningService.getMaterialById(id);
      if (!material) {
        sendError(res, 'Learning material not found.', 404);
        return;
      }
      sendSuccess(res, material, 'Learning material retrieved successfully.');
    } catch (error: any) {
      sendError(res, error.message || 'Failed to retrieve learning material.', 500);
    }
  }

  /**
   * Update progress or details.
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await learningService.updateMaterial(id, req.body);
      if (!updated) {
        sendError(res, 'Learning material not found or update failed.', 404);
        return;
      }
      sendSuccess(res, updated, 'Learning material updated successfully.');
    } catch (error: any) {
      sendError(res, error.message || 'Failed to update learning material.', 500);
    }
  }

  /**
   * Delete a tracked material.
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await learningService.deleteMaterial(id);
      if (!deleted) {
        sendError(res, 'Learning material not found or already deleted.', 404);
        return;
      }
      sendSuccess(res, deleted, 'Learning material deleted successfully.');
    } catch (error: any) {
      sendError(res, error.message || 'Failed to delete learning material.', 500);
    }
  }
}

export const learningController = new LearningController();
export default learningController;
