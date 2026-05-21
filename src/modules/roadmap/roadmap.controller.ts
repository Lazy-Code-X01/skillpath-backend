import { Request, Response } from 'express';
import { roadmapService } from './roadmap.service';
import { sendSuccess, sendError } from '../../utils/response';

export class RoadmapController {
  /**
   * Create a new roadmap.
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        sendError(res, 'User identity not found in request context.', 401);
        return;
      }

      const roadmap = await roadmapService.createRoadmap(userId, req.body);
      sendSuccess(res, roadmap, 'Roadmap created successfully.', 201);
    } catch (error: any) {
      sendError(res, error.message || 'Failed to create roadmap.', 500);
    }
  }

  /**
   * Get all roadmaps for the logged-in user.
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        sendError(res, 'User identity not found in request context.', 401);
        return;
      }

      const roadmaps = await roadmapService.getUserRoadmaps(userId);
      sendSuccess(res, roadmaps, 'User roadmaps retrieved successfully.');
    } catch (error: any) {
      sendError(res, error.message || 'Failed to retrieve roadmaps.', 500);
    }
  }

  /**
   * Get a specific roadmap by ID.
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const roadmap = await roadmapService.getRoadmapById(id);
      if (!roadmap) {
        sendError(res, 'Roadmap not found.', 404);
        return;
      }
      sendSuccess(res, roadmap, 'Roadmap retrieved successfully.');
    } catch (error: any) {
      sendError(res, error.message || 'Failed to retrieve roadmap.', 500);
    }
  }

  /**
   * Update details of a specific roadmap.
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await roadmapService.updateRoadmap(id, req.body);
      if (!updated) {
        sendError(res, 'Roadmap not found or update failed.', 404);
        return;
      }
      sendSuccess(res, updated, 'Roadmap updated successfully.');
    } catch (error: any) {
      sendError(res, error.message || 'Failed to update roadmap.', 500);
    }
  }
}

export const roadmapController = new RoadmapController();
export default roadmapController;
