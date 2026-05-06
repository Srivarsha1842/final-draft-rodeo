import { Request, Response, NextFunction } from 'express';
import * as bookingsService from '../services/bookings.service';
import { sendSuccess, sendError } from '../utils/response.util';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      propertyId,
      roomId,
      guestName,
      guestEmail,
      guestPhone,
      guestCount,
      guests,
      roomsRequired,
      checkIn,
      checkOut,
      paymentMethod,
      notes,
    } = req.body;
    if ((!roomId && !propertyId) || !guestName || !guestEmail || !guestPhone || !checkIn || !checkOut) {
      return sendError(res, 'Missing required booking fields', 400);
    }
    const booking = await bookingsService.createBooking({
      propertyId,
      roomId,
      guestName,
      guestEmail,
      guestPhone,
      guestCount: guestCount ? parseInt(guestCount) : undefined,
      guests: guests ? parseInt(guests) : undefined,
      roomsRequired: roomsRequired ? parseInt(roomsRequired) : undefined,
      checkIn,
      checkOut,
      source: 'ONLINE',
      paymentMethod,
      notes,
      userId: req.user?.id,
    });
    sendSuccess(res, booking, 201, 'Booking created');
  } catch (err) { next(err); }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await bookingsService.getBookingById(req.params.id, req.user?.id, req.user?.role);
    sendSuccess(res, booking);
  } catch (err) { next(err); }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    if (!status) return sendError(res, 'Status required', 400);
    const booking = await bookingsService.updateBookingStatus(
      req.params.id, status, req.user!.id
    );
    sendSuccess(res, booking);
  } catch (err) { next(err); }
};
