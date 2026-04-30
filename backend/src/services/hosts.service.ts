import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/hash.util';

export const getHostProfile = async (hostId: string) => {
  const host = await prisma.host.findUnique({
    where: { id: hostId },
    select: {
      id: true, name: true, email: true, phone: true,
      avatar: true, package: true, status: true, joinedAt: true,
    },
  });
  if (!host) throw Object.assign(new Error('Host not found'), { statusCode: 404 });
  return host;
};

export const updateHostProfile = async (
  hostId: string,
  data: { name?: string; phone?: string; avatar?: string }
) => {
  return prisma.host.update({
    where: { id: hostId },
    data,
    select: { id: true, name: true, email: true, phone: true, avatar: true, package: true },
  });
};

export const updateHostPassword = async (
  hostId: string,
  currentPassword: string,
  newPassword: string
) => {
  const host = await prisma.host.findUnique({ where: { id: hostId } });
  if (!host) throw Object.assign(new Error('Host not found'), { statusCode: 404 });

  const valid = await comparePassword(currentPassword, host.password);
  if (!valid) throw Object.assign(new Error('Current password is incorrect'), { statusCode: 400 });

  const hashed = await hashPassword(newPassword);
  await prisma.host.update({ where: { id: hostId }, data: { password: hashed } });
};

export const updateBankDetails = async (hostId: string, details: Record<string, string>) => {
  return prisma.host.update({
    where: { id: hostId },
    data: { bankDetails: details },
  });
};

export const getHostDashboardStats = async (hostId: string) => {
  const [totalBookings, activeProperties, pendingBookings, totalRevenue] = await prisma.$transaction([
    prisma.booking.count({ where: { hostId } }),
    prisma.property.count({ where: { hostId, status: 'ACTIVE' } }),
    prisma.booking.count({ where: { hostId, status: 'PENDING' } }),
    prisma.booking.aggregate({
      where: { hostId, status: { in: ['CONFIRMED', 'COMPLETED'] } },
      _sum: { hostEarnings: true },
    }),
  ]);

  const upcomingBookings = await prisma.booking.findMany({
    where: { hostId, status: 'CONFIRMED', checkIn: { gte: new Date() } },
    orderBy: { checkIn: 'asc' },
    take: 5,
    include: { property: { select: { name: true } } },
  });

  return {
    totalBookings,
    activeProperties,
    pendingBookings,
    totalRevenue: totalRevenue._sum.hostEarnings ?? 0,
    upcomingBookings,
  };
};

export const getHostReviews = async (hostId: string, page = 1, limit = 10) => {
  const where = { hostId };
  const [total, reviews] = await prisma.$transaction([
    prisma.review.count({ where }),
    prisma.review.findMany({
      where,
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { property: { select: { name: true } } },
    }),
  ]);
  return { reviews, total, page, limit };
};

export const replyToReview = async (hostId: string, reviewId: string, reply: string) => {
  const review = await prisma.review.findFirst({ where: { id: reviewId, hostId } });
  if (!review) throw Object.assign(new Error('Review not found'), { statusCode: 404 });
  return prisma.review.update({
    where: { id: reviewId },
    data: { hostReply: reply, hostReplyDate: new Date() },
  });
};

export const getHostNotifications = async (hostId: string) => {
  const notifications = await prisma.notification.findMany({
    where: { hostId },
    orderBy: { timestamp: 'desc' },
    take: 50,
  });
  const unreadCount = await prisma.notification.count({ where: { hostId, read: false } });
  return { notifications, unreadCount };
};

export const markNotificationRead = async (hostId: string, notificationId: string) => {
  return prisma.notification.updateMany({
    where: { id: notificationId, hostId },
    data: { read: true },
  });
};

export const getHostMessages = async (hostId: string) => {
  return prisma.message.findMany({
    where: { hostId },
    orderBy: { timestamp: 'desc' },
    include: { booking: { select: { guestName: true, property: { select: { name: true } } } } },
  });
};

export const sendMessage = async (data: {
  bookingId: string;
  hostId: string;
  guestName: string;
  guestEmail: string;
  sender: string;
  content: string;
}) => {
  return prisma.message.create({ data });
};

export const getHostPayouts = async (hostId: string) => {
  return prisma.payout.findMany({
    where: { hostId },
    orderBy: { createdAt: 'desc' },
  });
};

export const getHostAnalytics = async (hostId: string) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [monthRevenue, monthBookings, yearRevenue, allTimeRevenue, topProperties] =
    await prisma.$transaction([
      prisma.booking.aggregate({
        where: { hostId, status: { in: ['CONFIRMED', 'COMPLETED'] }, createdAt: { gte: startOfMonth } },
        _sum: { hostEarnings: true },
      }),
      prisma.booking.count({
        where: { hostId, createdAt: { gte: startOfMonth } },
      }),
      prisma.booking.aggregate({
        where: {
          hostId,
          status: { in: ['CONFIRMED', 'COMPLETED'] },
          createdAt: { gte: new Date(now.getFullYear(), 0, 1) },
        },
        _sum: { hostEarnings: true },
      }),
      prisma.booking.aggregate({
        where: { hostId, status: { in: ['CONFIRMED', 'COMPLETED'] } },
        _sum: { hostEarnings: true },
      }),
      prisma.property.findMany({
        where: { hostId },
        include: {
          _count: { select: { bookings: true, reviews: true } },
        },
        orderBy: { rating: 'desc' },
        take: 5,
      }),
    ]);

  return {
    monthRevenue: monthRevenue._sum.hostEarnings ?? 0,
    monthBookings,
    yearRevenue: yearRevenue._sum.hostEarnings ?? 0,
    allTimeRevenue: allTimeRevenue._sum.hostEarnings ?? 0,
    topProperties,
  };
};

export const createPromotion = async (
  hostId: string,
  data: {
    title: string;
    description?: string;
    type: string;
    discountValue: number;
    promoCode: string;
    propertyIds: string[];
    startDate: string;
    endDate: string;
    minNights?: number;
    maxUsage?: number;
  }
) => {
  return prisma.promotion.create({
    data: {
      hostId,
      title: data.title,
      description: data.description,
      type: data.type as 'PERCENTAGE',
      discountValue: data.discountValue,
      promoCode: data.promoCode,
      propertyIds: data.propertyIds,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      minNights: data.minNights ?? 1,
      maxUsage: data.maxUsage ?? 100,
    },
  });
};

export const getHostPromotions = async (hostId: string) => {
  return prisma.promotion.findMany({
    where: { hostId },
    orderBy: { createdAt: 'desc' },
  });
};

export const getHostProperties = async (hostId: string) => {
  return prisma.property.findMany({
    where: { hostId },
    include: {
      roomTypes: true,
      _count: { select: { bookings: true, reviews: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getAllHosts = async (page = 1, limit = 20) => {
  const [total, hosts] = await prisma.$transaction([
    prisma.host.count(),
    prisma.host.findMany({
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true, name: true, email: true, phone: true,
        package: true, status: true, joinedAt: true,
        _count: { select: { properties: true, bookings: true } },
      },
      orderBy: { joinedAt: 'desc' },
    }),
  ]);
  return { hosts, total, page, limit };
};

export const updateHostStatus = async (hostId: string, status: 'ACTIVE' | 'SUSPENDED') => {
  return prisma.host.update({ where: { id: hostId }, data: { status } });
};
