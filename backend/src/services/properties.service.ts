import prisma from '../config/database';
import { Prisma, PropertyStatus } from '@prisma/client';
import { getAvailableRooms, getCalendarAvailability, parseStayDate, getNights } from './inventory.service';

export const getAllProperties = async (filters: {
  location?: string;
  city?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  minGuests?: number;
  rating?: number;
  checkIn?: string;
  checkOut?: string;
  amenities?: string[];
  tag?: string;
  page?: number;
  limit?: number;
  sort?: string;
}) => {
  const {
    location,
    city,
    type,
    minPrice,
    maxPrice,
    minGuests,
    rating,
    checkIn,
    checkOut,
    amenities,
    tag,
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
  if (city) where.city = { contains: city, mode: 'insensitive' };
  if (type) where.type = type.toUpperCase() as Prisma.EnumPropertyTypeFilter;
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.pricePerNight = {};
    if (minPrice !== undefined) where.pricePerNight = { ...where.pricePerNight as object, gte: minPrice };
    if (maxPrice !== undefined) where.pricePerNight = { ...where.pricePerNight as object, lte: maxPrice };
  }
  if (minGuests) where.maxGuests = { gte: minGuests };
  if (rating) where.rating = { gte: rating };
  if (amenities && amenities.length > 0) where.amenities = { hasEvery: amenities };
  if (tag) where.tags = { has: tag };

  const orderBy: Prisma.PropertyOrderByWithRelationInput =
    sort === 'price_asc'
      ? { pricePerNight: 'asc' }
      : sort === 'price_desc'
      ? { pricePerNight: 'desc' }
      : sort === 'newest'
      ? { createdAt: 'desc' }
      : { rating: 'desc' };

  const include = {
    host: { select: { name: true, avatar: true } },
    roomTypes: true,
    _count: { select: { reviews: true } },
  } satisfies Prisma.PropertyInclude;

  const needsAvailabilityFilter = Boolean(checkIn && checkOut && minGuests);
  if (!needsAvailabilityFilter) {
    const [total, properties] = await prisma.$transaction([
      prisma.property.count({ where }),
      prisma.property.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include,
      }),
    ]);

    return { properties, total, page, limit, pages: Math.ceil(total / limit) };
  }

  const checkInDate = parseStayDate(checkIn!, 'checkIn');
  const checkOutDate = parseStayDate(checkOut!, 'checkOut');
  getNights(checkInDate, checkOutDate);

  const candidates = await prisma.property.findMany({
      where,
      orderBy,
      include,
  });

  const availability = await Promise.all(
    candidates.map(async (property) => {
      const roomChecks = await Promise.all(property.roomTypes.map(async (room) => {
      const roomsRequired = Math.ceil((minGuests ?? 1) / room.capacity);
        const { availableRooms } = await getAvailableRooms(room.id, checkInDate, checkOutDate);
        return roomsRequired <= availableRooms;
      }));
      return { property, available: roomChecks.some(Boolean) };
    })
  );

  const filtered = availability.filter((item) => item.available).map((item) => item.property);

  const paginated = filtered.slice((page - 1) * limit, page * limit);
  return { properties: paginated, total: filtered.length, page, limit, pages: Math.ceil(filtered.length / limit) };
};

const activeWhere: Prisma.PropertyWhereInput = {
  status: 'ACTIVE',
  verified: true,
};

export const getPropertyLocations = async () => {
  const rows = await prisma.property.findMany({
    where: activeWhere,
    select: { location: true, city: true, state: true },
    orderBy: { location: 'asc' },
  });

  return Array.from(
    new Set(
      rows
        .flatMap((p) => [p.location, p.city, p.state])
        .map((value) => value?.trim())
        .filter((value): value is string => Boolean(value))
    )
  ).sort((a, b) => a.localeCompare(b));
};

export const getPropertyTags = async () => {
  const rows = await prisma.property.findMany({
    where: activeWhere,
    select: { tags: true },
  });

  return Array.from(new Set(rows.flatMap((p) => p.tags))).sort((a, b) => a.localeCompare(b));
};

export const getExclusiveProperties = async (limit = 12) => {
  return prisma.property.findMany({
    where: { ...activeWhere, isExclusive: true },
    orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }],
    take: limit,
    include: { host: { select: { name: true, avatar: true, joinedAt: true } } },
  });
};

export const getPropertiesByTag = async (tag: string, limit = 12) => {
  return prisma.property.findMany({
    where: { ...activeWhere, tags: { has: tag } },
    orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }],
    take: limit,
    include: { host: { select: { name: true, avatar: true, joinedAt: true } } },
  });
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
  const rooms = await prisma.roomType.findMany({
    where: { propertyId: id, status: 'available' },
    select: { id: true, name: true },
  });
  const roomAvailability = await Promise.all(
    rooms.map(async (room) => ({
      room,
      calendar: await getCalendarAvailability(room.id, checkIn, checkOut),
    }))
  );

  return {
    available: roomAvailability.some(({ calendar }) => calendar.some((day) => day.available > 0)),
    rooms: roomAvailability,
  };
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
