import prisma from '../config/database';
import { Prisma, PropertyStatus } from '@prisma/client';

export const getAllProperties = async (filters: {
  location?: string;
  city?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  minGuests?: number;
  checkIn?: string;
  checkOut?: string;
  amenities?: string[];
  page?: number;
  limit?: number;
  sort?: string;
}) => {
  const {
    location,
    type,
    minPrice,
    maxPrice,
    minGuests,
    amenities,
    page = 1,
    limit = 20,
    sort = 'rating',
  } = filters;

  const where: Prisma.PropertyWhereInput = {
    status: 'ACTIVE',
    verified: true,
  };

  if (location) {
    where.OR = [
      { city: { contains: location, mode: 'insensitive' } },
      { state: { contains: location, mode: 'insensitive' } },
      { location: { contains: location, mode: 'insensitive' } },
    ];
  }
  if (type) where.type = type.toUpperCase() as Prisma.EnumPropertyTypeFilter;
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.pricePerNight = {};
    if (minPrice !== undefined) where.pricePerNight = { ...where.pricePerNight as object, gte: minPrice };
    if (maxPrice !== undefined) where.pricePerNight = { ...where.pricePerNight as object, lte: maxPrice };
  }
  if (minGuests) where.maxGuests = { gte: minGuests };
  if (amenities && amenities.length > 0) where.amenities = { hasEvery: amenities };

  const orderBy: Prisma.PropertyOrderByWithRelationInput =
    sort === 'price_asc'
      ? { pricePerNight: 'asc' }
      : sort === 'price_desc'
      ? { pricePerNight: 'desc' }
      : sort === 'newest'
      ? { createdAt: 'desc' }
      : { rating: 'desc' };

  const [total, properties] = await prisma.$transaction([
    prisma.property.count({ where }),
    prisma.property.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        host: { select: { name: true, avatar: true } },
        _count: { select: { reviews: true } },
      },
    }),
  ]);

  return { properties, total, page, limit, pages: Math.ceil(total / limit) };
};

export const getPropertyById = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      host: { select: { id: true, name: true, avatar: true, joinedAt: true } },
      roomTypes: true,
      addOns: true,
      reviews: {
        orderBy: { date: 'desc' },
        take: 20,
      },
      seoMeta: true,
    },
  });
  if (!property) throw Object.assign(new Error('Property not found'), { statusCode: 404 });
  return property;
};

export const getPropertyReviews = async (
  id: string,
  page = 1,
  limit = 10
) => {
  const [total, reviews] = await prisma.$transaction([
    prisma.review.count({ where: { propertyId: id } }),
    prisma.review.findMany({
      where: { propertyId: id },
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);
  return { reviews, total, page, limit };
};

export const getPropertyAvailability = async (
  id: string,
  checkIn: string,
  checkOut: string
) => {
  const booked = await prisma.booking.findMany({
    where: {
      propertyId: id,
      status: { in: ['CONFIRMED', 'PENDING'] },
      OR: [
        { checkIn: { lte: new Date(checkOut) }, checkOut: { gte: new Date(checkIn) } },
      ],
    },
    select: { checkIn: true, checkOut: true },
  });
  return { available: booked.length === 0, blockedDates: booked };
};

export const createProperty = async (hostId: string, data: Prisma.PropertyCreateInput) => {
  return prisma.property.create({
    data: { ...data, host: { connect: { id: hostId } } },
  });
};

export const updateProperty = async (id: string, hostId: string, data: Prisma.PropertyUpdateInput) => {
  const property = await prisma.property.findFirst({ where: { id, hostId } });
  if (!property) throw Object.assign(new Error('Property not found'), { statusCode: 404 });
  return prisma.property.update({ where: { id }, data });
};

export const deleteProperty = async (id: string, hostId: string) => {
  const property = await prisma.property.findFirst({ where: { id, hostId } });
  if (!property) throw Object.assign(new Error('Property not found'), { statusCode: 404 });
  return prisma.property.update({
    where: { id },
    data: { status: PropertyStatus.INACTIVE },
  });
};

export const recalcPropertyRating = async (propertyId: string) => {
  const agg = await prisma.review.aggregate({
    where: { propertyId },
    _avg: { rating: true },
    _count: { rating: true },
  });
  await prisma.property.update({
    where: { id: propertyId },
    data: {
      rating: agg._avg.rating ?? 0,
      reviewCount: agg._count.rating,
    },
  });
};
