import { Request, Response, NextFunction } from 'express';
import * as inventoryService from '../services/inventory.service';
import { sendError, sendSuccess } from '../utils/response.util';

export const calendar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roomId, startDate, endDate } = req.query;
    if (!roomId || !startDate || !endDate) {
      return sendError(res, 'roomId, startDate and endDate are required', 400);
    }

    const availability = await inventoryService.getCalendarAvailability(
      roomId as string,
      startDate as string,
      endDate as string
    );
    sendSuccess(res, availability);
  } catch (err) {
    next(err);
  }
};
