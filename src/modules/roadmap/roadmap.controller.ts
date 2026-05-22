import { Request, Response } from 'express';
import { roadmapService } from './roadmap.service';
import { sendSuccess, sendError } from '../../utils/response';

export class RoadmapController {
  async generateRoadmap(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const roadmap = await roadmapService.generateRoadmap(userId);
      sendSuccess(res, { roadmap }, 'Roadmap generated successfully', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getRoadmap(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const roadmap = await roadmapService.getRoadmapByUserId(userId);
      sendSuccess(res, { roadmap }, 'Roadmap fetched successfully');
    } catch (error: any) {
      sendError(res, error.message, 404);
    }
  }
}

export const roadmapController = new RoadmapController();
export default roadmapController;
