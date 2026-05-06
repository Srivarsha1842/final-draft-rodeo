import { Prisma } from '@prisma/client';
import prisma from '../config/database';

const activeBookingStatuses = ['CONFIRMED', 'PENDING'] as const;

type PrismaClientLike = Prisma.TransactionClient | typeof prisma;

export const parseStayDate = (value: string, fieldName: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw Object.assign(new Error(`${fieldName} must be a valid date`), { statusCode: 400 });
  }
  return date;
};

export const getNights = (checkIn: Date, checkOut: Date) => {
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86_400_000);
  if (nights < 1) {
    throw Object.assign(new Error('Check-out must be after check-in'), { statusCode: 400 });
  }
  return nights;
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const toDateKey = (date: Date) => date.toISOString().slice(0, 10);

export const calculateRoomsRequired = (guests: number, capacity: number) => {
  if (!Number.isInteger(guests) || guests < 1) {
    throw Object.assign(new Error('Guests must be at least 1'), { statusCode: 400 });
  }
  if (!Number.isInteger(capacity) || capacity < 1) {
    throw Object.assign(new Error('Room capacity is invalid'), { statusCode: 500 });
  }
  return Math.ceil(guests / capacity);
};

export const getRoomForInventory = async (roomId: string, client: PrismaClientLike = prisma) => {
  const room = await client.roomType.findUnique({
    where: { id: roomId },
    include: {
      property: { select: { id: true, hostId: true, status: true } },
    },
  });

  if (!room || room.status !== 'available' || room.property.status !== 'ACTIVE') {
    throw Object.assign(new Error('Room not available'), { statusCode: 404 });
  }

  return {
    ...room,
    inventoryCount: room.totalCount || room.totalRooms,
    nightlyPrice: room.price || room.pricePerNight,
  };
};

export const getBookedRoomsForRange = async (
  roomId: string,
  checkIn: Date,
  checkOut: Date,
  client: PrismaClientLike = prisma
) => {
  const aggregate = await client.booking.aggregate({
    where: {
      roomId,
      status: { in: [...activeBookingStatuses] },
      checkIn: { lt: checkOut },
      checkOut: { gt: checkIn },
    },
    _sum: { rooms: true },
  });

  return aggregate._sum.rooms ?? 0;
};

export const getMinimumAvailableRooms = async (
  roomId: string,
  checkIn: Date,
  checkOut: Date,
  client: PrismaClientLike = prisma
) => {
  const calendar = await getCalendarAvailability(roomId, checkIn, checkOut, client);
  return calendar.reduce(
    (minimum, day) => Math.min(minimum, day.available),
    calendar[0]?.available ?? 0
  );
};

export const getAvailableRooms = async (
  roomId: string,
  checkIn: Date,
  checkOut: Date,
  client: PrismaClientLike = prisma
) => {
  const room = await getRoomForInventory(roomId, client);
  const calendar = await getCalendarAvailability(roomId, checkIn, checkOut, client);
  const availableRooms = calendar.reduce(
    (minimum, day) => Math.min(minimum, day.available),
    room.inventoryCount
  );

  return {
    room,
    totalRooms: room.inventoryCount,
    bookedRooms: room.inventoryCount - availableRooms,
    availableRooms,
  };
};

export const assertRoomsAvailable = async (
  roomId: string,
  requestedRooms: number,
  checkIn: Date,
  checkOut: Date,
  client: PrismaClientLike = prisma
) => {
  if (!Number.isInteger(requestedRooms) || requestedRooms < 1) {
    throw Object.assign(new Error('Requested rooms must be at least 1'), { statusCode: 400 });
  }

  const availability = await getAvailableRooms(roomId, checkIn, checkOut, client);
  if (requestedRooms > availability.availableRooms) {
    throw Object.assign(
      new Error(`Only ${availability.availableRooms} room(s) available for selected dates`),
      { statusCode: 409 }
    );
  }

  return availability;
};

export const getCalendarAvailability = async (
  roomId: string,
  startDate: string | Date,
  endDate: string | Date,
  client: PrismaClientLike = prisma
) => {
  const start = startDate instanceof Date ? startDate : parseStayDate(startDate, 'startDate');
  const end = endDate instanceof Date ? endDate : parseStayDate(endDate, 'endDate');
  getNights(start, end);

  const room = await getRoomForInventory(roomId, client);
  const bookings = await client.booking.findMany({
    where: {
      roomId,
      status: { in: [...activeBookingStatuses] },
      checkIn: { lt: end },
      checkOut: { gt: start },
    },
    select: { checkIn: true, checkOut: true, rooms: true },
  });

  const days: { date: string; available: number }[] = [];
  for (let cursor = new Date(start); cursor < end; cursor = addDays(cursor, 1)) {
    const nextDay = addDays(cursor, 1);
    const bookedRooms = bookings.reduce((sum, booking) => {
      const overlaps = booking.checkIn < nextDay && booking.checkOut > cursor;
      return overlaps ? sum + booking.rooms : sum;
    }, 0);

    days.push({
      date: toDateKey(cursor),
      available: Math.max(0, room.inventoryCount - bookedRooms),
    });
  }

  return days;
};
