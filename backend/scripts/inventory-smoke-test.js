process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { PrismaClient } = require('@prisma/client');
const servicePrisma = require('../dist/config/database').default;
const bookings = require('../dist/services/bookings.service');
const inventory = require('../dist/services/inventory.service');

const prisma = new PrismaClient({ log: ['error'] });

const toDate = (value) => new Date(value);

const createRoom = (propertyId, name, totalRooms, capacity = 2) =>
  prisma.roomType.create({
    data: {
      propertyId,
      name,
      totalRooms,
      totalCount: totalRooms,
      pricePerNight: 1000,
      price: 1000,
      capacity,
      bedType: 'Queen',
      amenities: [],
      images: [],
      status: 'available',
    },
  });

const availableRooms = async (roomId, checkIn, checkOut) => {
  const result = await inventory.getAvailableRooms(roomId, toDate(checkIn), toDate(checkOut));
  return result.availableRooms;
};

const createBooking = (data) =>
  bookings.createBooking({
    guestPhone: '9999999999',
    paymentMethod: 'CARD',
    ...data,
  });

const assertCase = (results, name, ok, details) => {
  results.push({ name, ok, details });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name} :: ${details}`);
};

const cleanup = async (hostIds, propertyId) => {
  if (propertyId) {
    await prisma.booking.deleteMany({ where: { propertyId } });
    await prisma.roomType.deleteMany({ where: { propertyId } });
    await prisma.property.deleteMany({ where: { id: propertyId } });
  }

  if (hostIds.length) {
    await prisma.notification.deleteMany({ where: { hostId: { in: hostIds } } });
    await prisma.host.deleteMany({ where: { id: { in: hostIds } } });
  }
};

const main = async () => {
  const tag = `prod-inventory-test-${Date.now()}`;
  const results = [];
  let host;
  let otherHost;
  let property;

  try {
    host = await prisma.host.create({
      data: {
        email: `${tag}@example.com`,
        password: 'x',
        name: 'Inventory Test Host',
        status: 'ACTIVE',
      },
    });

    otherHost = await prisma.host.create({
      data: {
        email: `${tag}-other@example.com`,
        password: 'x',
        name: 'Other Host',
        status: 'ACTIVE',
      },
    });

    property = await prisma.property.create({
      data: {
        hostId: host.id,
        name: 'Inventory Test Property',
        description: 'test',
        location: 'Test',
        fullAddress: 'Test',
        city: 'Test',
        state: 'Test',
        pricePerNight: 1000,
        type: 'HOTEL',
        status: 'ACTIVE',
        verified: true,
        bedrooms: 1,
        bathrooms: 1,
        maxGuests: 2,
        images: [],
        tags: [],
        amenities: [],
      },
    });

    const onlineRoom = await createRoom(property.id, 'Online Only', 10);
    await createBooking({
      roomId: onlineRoom.id,
      guestName: 'Online Seven',
      guestEmail: `${tag}-online@example.com`,
      guests: 14,
      checkIn: '2031-01-10',
      checkOut: '2031-01-12',
      source: 'ONLINE',
    });
    let available = await availableRooms(onlineRoom.id, '2031-01-10', '2031-01-12');
    assertCase(results, 'Online booking only', available === 3, `total=10 online=7 available=${available}`);

    const walkRoom = await createRoom(property.id, 'Walk-in Only', 10);
    await createBooking({
      roomId: walkRoom.id,
      guestName: 'Walk-in Two',
      guestEmail: `${tag}-walkin@example.com`,
      guests: 4,
      checkIn: '2031-01-10',
      checkOut: '2031-01-12',
      source: 'WALKIN',
      paymentMethod: 'CASH',
      hostId: host.id,
    });
    available = await availableRooms(walkRoom.id, '2031-01-10', '2031-01-12');
    assertCase(results, 'Walk-in booking only', available === 8, `total=10 walkin=2 available=${available}`);

    const mixedRoom = await createRoom(property.id, 'Mixed Edge', 10);
    await createBooking({
      roomId: mixedRoom.id,
      guestName: 'Online Seven Mixed',
      guestEmail: `${tag}-mixed-online@example.com`,
      guests: 14,
      checkIn: '2031-01-10',
      checkOut: '2031-01-12',
      source: 'ONLINE',
    });
    await createBooking({
      roomId: mixedRoom.id,
      guestName: 'Walk-in Two Mixed',
      guestEmail: `${tag}-mixed-walkin@example.com`,
      guests: 4,
      checkIn: '2031-01-10',
      checkOut: '2031-01-12',
      source: 'WALKIN',
      paymentMethod: 'CASH',
      hostId: host.id,
    });
    available = await availableRooms(mixedRoom.id, '2031-01-10', '2031-01-12');
    assertCase(
      results,
      'Mixed online + walk-in edge case',
      available === 1,
      `total=10 online=7 walkin=2 available=${available}`
    );

    const dateRoom = await createRoom(property.id, 'Date-wise Split', 2);
    await createBooking({
      roomId: dateRoom.id,
      guestName: 'Night One',
      guestEmail: `${tag}-night1@example.com`,
      guests: 2,
      checkIn: '2031-04-01',
      checkOut: '2031-04-02',
      source: 'ONLINE',
    });
    await createBooking({
      roomId: dateRoom.id,
      guestName: 'Night Two',
      guestEmail: `${tag}-night2@example.com`,
      guests: 2,
      checkIn: '2031-04-02',
      checkOut: '2031-04-03',
      source: 'ONLINE',
    });

    let splitAccepted = true;
    try {
      await createBooking({
        roomId: dateRoom.id,
        guestName: 'Two-night One-room',
        guestEmail: `${tag}-twonight@example.com`,
        guests: 2,
        checkIn: '2031-04-01',
        checkOut: '2031-04-03',
        source: 'ONLINE',
      });
    } catch {
      splitAccepted = false;
    }
    const calendar = await inventory.getCalendarAvailability(dateRoom.id, '2031-04-01', '2031-04-03');
    assertCase(
      results,
      'Date-wise validation uses each night',
      splitAccepted && calendar.every((day) => day.available === 0),
      `split booking accepted; calendar=${JSON.stringify(calendar)}`
    );

    const securityRoom = await createRoom(property.id, 'Walk-in Security', 5);
    let unauthRejected = false;
    try {
      await createBooking({
        roomId: securityRoom.id,
        guestName: 'Bad Walk-in',
        guestEmail: `${tag}-badwalkin@example.com`,
        guests: 2,
        checkIn: '2031-05-01',
        checkOut: '2031-05-02',
        source: 'WALKIN',
        paymentMethod: 'CASH',
      });
    } catch (error) {
      unauthRejected = error.statusCode === 403;
    }
    assertCase(results, 'Walk-in requires host auth', unauthRejected, 'unauthenticated WALKIN rejected');

    let wrongHostRejected = false;
    try {
      await createBooking({
        roomId: securityRoom.id,
        guestName: 'Wrong Host Walk-in',
        guestEmail: `${tag}-wronghost@example.com`,
        guests: 2,
        checkIn: '2031-05-01',
        checkOut: '2031-05-02',
        source: 'WALKIN',
        paymentMethod: 'CASH',
        hostId: otherHost.id,
      });
    } catch (error) {
      wrongHostRejected = error.statusCode === 403;
    }
    assertCase(results, 'Walk-in host ownership enforced', wrongHostRejected, 'different host rejected');

    const raceRoom = await createRoom(property.id, 'Race Last Room', 1);
    const raceBase = {
      roomId: raceRoom.id,
      guestPhone: '9999999999',
      guests: 1,
      checkIn: '2031-06-01',
      checkOut: '2031-06-02',
      source: 'ONLINE',
      paymentMethod: 'CARD',
    };
    const race = await Promise.allSettled([
      createBooking({ ...raceBase, guestName: 'Race A', guestEmail: `${tag}-race-a@example.com` }),
      createBooking({ ...raceBase, guestName: 'Race B', guestEmail: `${tag}-race-b@example.com` }),
    ]);
    const fulfilled = race.filter((result) => result.status === 'fulfilled').length;
    const rejected = race.filter((result) => result.status === 'rejected').length;
    available = await availableRooms(raceRoom.id, '2031-06-01', '2031-06-02');
    assertCase(
      results,
      'Parallel last-room booking',
      fulfilled === 1 && rejected === 1 && available === 0,
      `fulfilled=${fulfilled} rejected=${rejected} available=${available}`
    );

    const failed = results.filter((result) => !result.ok);
    console.log(`SUMMARY ${failed.length ? 'FAILED' : 'PASSED'} ${results.length - failed.length}/${results.length}`);
    if (failed.length) process.exitCode = 1;
  } finally {
    await cleanup([host?.id, otherHost?.id].filter(Boolean), property?.id);
    await prisma.$disconnect();
    await servicePrisma.$disconnect();
  }
};

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  await servicePrisma.$disconnect();
  process.exit(1);
});
