import prisma from '../config/database';
import { BookingStatus } from '@prisma/client';

export const createBooking = async (data: {
  propertyId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCount: number;
  checkIn: string;
  checkOut: string;
  paymentMethod?: string;
  notes?: string;
  userId?: string;
}) => {
  const property = await prisma.property.findUnique({
    where: { id: data.propertyId },
    select: { id: true, hostId: true, pricePerNight: true, status: true },
  });
  if (!property || property.status !== 'ACTIVE')
    throw Object.assign(new Error('Property not available'), { statusCode: 404 });

  const checkIn = new Date(data.checkIn);
  const checkOut = new Date(data.checkOut);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  if (nights < 1) throw Object.assign(new Error('Invalid dates'), { statusCode: 400 });

  const conflict = await prisma.booking.findFirst({
    where: {
      propertyId: data.propertyId,
      status: { in: ['CONFIRMED', 'PENDING'] },
      checkIn: { lt: checkOut },
      checkOut: { gt: checkIn },
    },
  });
  if (conflict) throw Object.assign(new Error('Property not available for selected dates'), { statusCode: 409 });

  const totalAmount = property.pricePerNight * nights;
  const platformFee = totalAmount * 0.1;
  const hostEarnings = totalAmount - platformFee;

  const booking = await prisma.booking.create({
    data: {
      propertyId: data.propertyId,
      hostId: property.hostId,
      ...(data.userId ? { userId: data.userId } : {}),
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      guestCount: data.guestCount,
      checkIn,
      checkOut,
      nights,
      pricePerNight: property.pricePerNight,
      totalAmount,
      platformFee,
      hostEarnings,
      paymentMethod: (data.paymentMethod?.toUpperCase() as 'CARD') || 'CARD',
      notes: data.notes,
    },
  });

  // Create notification for host
  await prisma.notification.create({
    data: {
      hostId: property.hostId,
      type: 'BOOKING',
      title: 'New Booking Received!',
      content: `${data.guestName} booked your property for ${nights} night(s). Check-in: ${data.checkIn}`,
      actionUrl: `/host-portal?section=bookings`,
      actionLabel: 'View Booking',
    },
  });

  return booking;
};

export const getBookingById = async (id: string, requesterId?: string, role?: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      property: { select: { name: true, images: true, city: true, state: true } },
      host: { select: { name: true, email: true } },
    },
  });
  if (!booking) throw Object.assign(new Error('Booking not found'), { statusCode: 404 });

  // Guests can only see their own bookings
  if (role === 'user' && booking.userId !== requesterId)
    throw Object.assign(new Error('Forbidden'), { statusCode: 403 });

  return booking;
};

export const updateBookingStatus = async (
  id: string,
  status: BookingStatus,
  hostId: string
) => {
  const booking = await prisma.booking.findFirst({ where: { id, hostId } });
  if (!booking) throw Object.assign(new Error('Booking not found'), { statusCode: 404 });

  return prisma.booking.update({ where: { id }, data: { status } });
};

export const getHostBookings = async (
  hostId: string,
  status?: BookingStatus,
  page = 1,
  limit = 20
) => {
  const where = { hostId, ...(status ? { status } : {}) };
  const [total, bookings] = await prisma.$transaction([
    prisma.booking.count({ where }),
    prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { property: { select: { name: true, images: true } } },
    }),
  ]);
  return { bookings, total, page, limit };
};
