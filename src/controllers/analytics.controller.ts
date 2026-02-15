import { Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { sendResponse } from '../utils/response.util';
import { AuthRequest } from '../interfaces/auth.interface';

const analyticsService = new AnalyticsService();

export const getCreatorAnalytics = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await analyticsService.getCreatorDashboard(req.user!.id);
    sendResponse(res, 200, true, 'All-time creator analytics retrieved successfully', data);
  } catch (error) {
    next(error);
  }
};

export const getEventAnalytics = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { eventId } = req.params;
    const data = await analyticsService.getEventSpecificAnalytics(eventId, req.user!.id);
    sendResponse(res, 200, true, 'Event-specific analytics retrieved successfully', data);
  } catch (error) {
    next(error);
  }
};