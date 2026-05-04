import prisma from '../config/database';
import { BookingSource, BookingStatus, PaymentMethod } from '@prisma/client';
import {
  assertRoomsAvailable,
  calculateRoomsRequired,
  getNights,
  getRoomForInventory,
  parseStayDate,
} from './inventory.service';

export const createBooking = async (data: {
  propertyId?: string;
  roomId?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCount?: number;
  guests?: number;
  roomsRequired?: number;
  checkIn: string;
  checkOut: string;
  source?: BookingSource | string;
  paymentMethod?: string;
  notes?: string;
  userId?: string;
}) => {
  const checkIn = parseStayDate(data.checkIn, 'checkIn');
  const checkOut = parseStayDate(data.checkOut, 'checkOut');
  const nights = getNights(checkIn, checkOut);
  const guests = Number(data.guests ?? data.guestCount ?? 1);

  const roomId = data.roomId || (await getDefaultRoomId(data.propertyId));
  if (!roomId) {
    throw Object.assign(new Error('roomId is required'), { statusCode: 400 });
  }

  const source = normalizeSource(data.source);

  return prisma.$transaction(async (tx) => {
    const room = await getRoomForInventory(roomId, tx);
    const roomsRequired = data.roomsRequired
      ? Number(data.roomsRequired)
      : calculateRoomsRequired(guests, room.capacity);

    const expectedRooms = calculateRoomsRequired(guests, room.capacity);
    if (roomsRequired !== expectedRooms) {
      throw Object.assign(
        new Error(`${expectedRooms} room(s) required for ${guests} guest(s)`),
        { statusCode: 400 }
      );
    }

    await assertRoomsAvailable(roomId, roomsRequired, checkIn, checkOut, tx);

    const totalAmount = roomsRequired * room.nightlyPrice * nights;
    const platformFee = Math.round(totalAmount * 0.1);
    const hostEarnings = totalAmount - platformFee;

    const booking = await tx.booking.create({
      data: {
        propertyId: room.propertyId,
        roomId: room.id,
        hostId: room.property.hostId,
        ...(data.userId ? { userId: data.userId } : {}),
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        guestCount: guests,
        guests,
        rooms: roomsRequired,
        source,
        checkIn,
        checkOut,
        nights,
        pricePerNight: room.nightlyPrice,
        totalAmount,
        platformFee,
        hostEarnings,
        paymentMethod: normalizePaymentMethod(data.paymentMethod),
        notes: data.notes,
      },
      include: { room: true, property: { select: { name: true, city: true, state: true } } },
    });

    await tx.notification.create({
      data: {
        hostId: room.property.hostId,
        type: 'BOOKING',
        title: source === 'WALKIN' ? 'New Walk-in Booking!' : 'New Booking Received!',
        content: `${data.guestName} booked ${roomsRequired} room(s) for ${nights} night(s). Check-in: ${data.checkIn}`,
        actionUrl: `/host-portal?section=bookings`,
        actionLabel: 'View Booking',
      },
    });

    return {
      ...booking,
      roomsRequired,
      totalPrice: totalAmount,
      serviceFee: platformFee,
    };
  });
};

const getDefaultRoomId = async (propertyId?: string) => {
  if (!propertyId) return undefined;

  const room = await prisma.roomType.findFirst({
    where: { propertyId, status: 'available' },
    orderBy: { pricePerNight: 'asc' },
    select: { id: true },
  });

  return room?.id;
};

const normalizeSource = (source?: BookingSource | string): BookingSource => {
  const normalized = String(source || 'ONLINE').toUpperCase();
  if (normalized !== 'ONLINE' && normalized !== 'WALKIN') {
    throw Object.assign(new Error('source must be ONLINE or WALKIN'), { statusCode: 400 });
  }
  return normalized as BookingSource;
};

const normalizePaymentMethod = (paymentMethod?: string): PaymentMethod => {
  const normalized = String(paymentMethod || 'CARD').toUpperCase();
  if (!Object.values(PaymentMethod).includes(normalized as PaymentMethod)) {
    throw Object.assign(new Error('Invalid payment method'), { statusCode: 400 });
  }
  return normalized as PaymentMethod;
};

export const getBookingById = async (id: string, requesterId?: string, role?: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      room: true,
      property: { select: { name: true, images: true, city: true, state: true } },
      host: { select: { name: true, email: true } },
    },
  });
  if (!booking) throw Object.assign(new Error('Booking not found'), { statusCode: 404 });

  if (role === 'user' && booking.userId !== requesterId) {
    throw Object.assign(new Error('Forbidden'), { statusCode: 403 });
  }

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
      include: {
        room: true,
        property: { select: { name: true, images: true } },
      },
    }),
  ]);
  return { bookings, total, page, limit };
};
