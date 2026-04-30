import { Request, Response, NextFunction } from 'express';
import * as hostsService from '../services/hosts.service';
import * as propertiesService from '../services/properties.service';
import * as bookingsService from '../services/bookings.service';
import { sendSuccess, sendError } from '../utils/response.util';
import { Prisma } from '@prisma/client';

// Profile
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await hostsService.getHostProfile(req.user!.id)); }
  catch (err) { next(err); }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, phone, avatar } = req.body;
    sendSuccess(res, await hostsService.updateHostProfile(req.user!.id, { name, phone, avatar }));
  } catch (err) { next(err); }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return sendError(res, 'Passwords required', 400);
    if (newPassword.length < 8) return sendError(res, 'New password must be at least 8 characters', 400);
    await hostsService.updateHostPassword(req.user!.id, currentPassword, newPassword);
    sendSuccess(res, null, 200, 'Password updated');
  } catch (err) { next(err); }
};

export const updateBankDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    sendSuccess(res, await hostsService.updateBankDetails(req.user!.id, req.body));
  } catch (err) { next(err); }
};

// Dashboard
export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await hostsService.getHostDashboardStats(req.user!.id)); }
  catch (err) { next(err); }
};

// Properties
export const listProperties = async (req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await hostsService.getHostProperties(req.user!.id)); }
  catch (err) { next(err); }
};

export const createProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const property = await propertiesService.createProperty(req.user!.id, req.body as Prisma.PropertyCreateInput);
    sendSuccess(res, property, 201, 'Property created');
  } catch (err) { next(err); }
};

export const updateProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const property = await propertiesService.updateProperty(req.params.propertyId, req.user!.id, req.body);
    sendSuccess(res, property);
  } catch (err) { next(err); }
};

export const deleteProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await propertiesService.deleteProperty(req.params.propertyId, req.user!.id);
    sendSuccess(res, null, 200, 'Property deactivated');
  } catch (err) { next(err); }
};

// Bookings
export const listBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, page, limit } = req.query;
    const result = await bookingsService.getHostBookings(
      req.user!.id,
      status as 'CONFIRMED' | undefined,
      page ? parseInt(page as string) : 1,
      limit ? parseInt(limit as string) : 20
    );
    sendSuccess(res, result);
  } catch (err) { next(err); }
};

export const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    if (!status) return sendError(res, 'Status required', 400);
    const booking = await bookingsService.updateBookingStatus(req.params.bookingId, status, req.user!.id);
    sendSuccess(res, booking);
  } catch (err) { next(err); }
};

// Reviews
export const listReviews = async (req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await hostsService.getHostReviews(req.user!.id)); }
  catch (err) { next(err); }
};

export const replyToReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reply } = req.body;
    if (!reply) return sendError(res, 'Reply required', 400);
    const review = await hostsService.replyToReview(req.user!.id, req.params.reviewId, reply);
    sendSuccess(res, review);
  } catch (err) { next(err); }
};

// Notifications
export const listNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await hostsService.getHostNotifications(req.user!.id)); }
  catch (err) { next(err); }
};

export const markNotificationRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await hostsService.markNotificationRead(req.user!.id, req.params.notificationId);
    sendSuccess(res, null, 200, 'Marked as read');
  } catch (err) { next(err); }
};

// Messages
export const listMessages = async (req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await hostsService.getHostMessages(req.user!.id)); }
  catch (err) { next(err); }
};

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId, guestName, guestEmail, content } = req.body;
    if (!bookingId || !content) return sendError(res, 'bookingId and content required', 400);
    const msg = await hostsService.sendMessage({
      bookingId, hostId: req.user!.id, guestName, guestEmail, sender: 'host', content,
    });
    sendSuccess(res, msg, 201);
  } catch (err) { next(err); }
};

// Payouts
export const listPayouts = async (req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await hostsService.getHostPayouts(req.user!.id)); }
  catch (err) { next(err); }
};

// Analytics
export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await hostsService.getHostAnalytics(req.user!.id)); }
  catch (err) { next(err); }
};

// Promotions
export const listPromotions = async (req: Request, res: Response, next: NextFunction) => {
  try { sendSuccess(res, await hostsService.getHostPromotions(req.user!.id)); }
  catch (err) { next(err); }
};

export const createPromotion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const promo = await hostsService.createPromotion(req.user!.id, req.body);
    sendSuccess(res, promo, 201, 'Promotion created');
  } catch (err) { next(err); }
};
