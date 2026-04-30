import { Request, Response, NextFunction } from 'express';
import * as propertiesService from '../services/properties.service';
import { sendSuccess, sendError } from '../utils/response.util';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { location, type, minPrice, maxPrice, minGuests, checkIn, checkOut, amenities, page, limit, sort } = req.query;
    const result = await propertiesService.getAllProperties({
      location: location as string,
      type: type as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      minGuests: minGuests ? parseInt(minGuests as string) : undefined,
      checkIn: checkIn as string,
      checkOut: checkOut as string,
      amenities: amenities ? (amenities as string).split(',') : undefined,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 20,
      sort: sort as string,
    });
    sendSuccess(res, result);
  } catch (err) { next(err); }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const property = await propertiesService.getPropertyById(req.params.id);
    sendSuccess(res, property);
  } catch (err) { next(err); }
};

export const getReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = req.query;
    const result = await propertiesService.getPropertyReviews(
      req.params.id,
      page ? parseInt(page as string) : 1,
      limit ? parseInt(limit as string) : 10
    );
    sendSuccess(res, result);
  } catch (err) { next(err); }
};

export const checkAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { checkIn, checkOut } = req.query;
    if (!checkIn || !checkOut) return sendError(res, 'checkIn and checkOut required', 400);
    const result = await propertiesService.getPropertyAvailability(
      req.params.id, checkIn as string, checkOut as string
    );
    sendSuccess(res, result);
  } catch (err) { next(err); }
};
