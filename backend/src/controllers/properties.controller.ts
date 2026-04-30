import { Request, Response, NextFunction } from 'express';
import * as propertiesService from '../services/properties.service';
import { sendSuccess, sendError } from '../utils/response.util';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { location, type, minPrice, maxPrice, minGuests, rating, checkIn, checkOut, amenities, tag, page, limit, sort } = req.query;
    const result = await propertiesService.getAllProperties({
      location: location as string,
      type: type as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      minGuests: minGuests ? parseInt(minGuests as string) : undefined,
      rating: rating ? parseFloat(rating as string) : undefined,
      checkIn: checkIn as string,
      checkOut: checkOut as string,
      amenities: amenities ? (amenities as string).split(',') : undefined,
      tag: tag as string,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 20,
      sort: sort as string,
    });
    sendSuccess(res, result);
  } catch (err) { next(err); }
};

export const locations = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    sendSuccess(res, await propertiesService.getPropertyLocations());
  } catch (err) { next(err); }
};

export const tags = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    sendSuccess(res, await propertiesService.getPropertyTags());
  } catch (err) { next(err); }
};

export const exclusive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 12;
    sendSuccess(res, await propertiesService.getExclusiveProperties(limit));
  } catch (err) { next(err); }
};

export const byTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 12;
    sendSuccess(res, await propertiesService.getPropertiesByTag(req.params.tag, limit));
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
