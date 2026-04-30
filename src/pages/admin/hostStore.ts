import { HostData, HostAccount, HostProperty, HostBooking, HostMessage, HostNotification, BlockedDate, HostReview, Promotion } from './types';

const HOST_STORAGE_KEY = 'triprodeo_host_data';

const mockBookings: HostBooking[] = [
  {
    id: 'b001',
    propertyId: 'hp1',
    propertyName: 'Sunrise Beach Villa',
    hostId: 'host1',
    guestName: 'Arjun Kapoor',
    guestEmail: 'arjun.kapoor@gmail.com',
    guestPhone: '+91 98123 45678',
    guestCount: 4,
    checkIn: '2025-04-15',
    checkOut: '2025-04-18',
    nights: 3,
    pricePerNight: 18000,
    totalAmount: 54000,
    platformFee: 5400,
    hostEarnings: 48600,
    status: 'confirmed',
    bookedAt: '2025-04-02T10:30:00Z',
    paymentMethod: 'UPI',
  },
  {
    id: 'b002',
    propertyId: 'hp1',
    propertyName: 'Sunrise Beach Villa',
    hostId: 'host1',
    guestName: 'Meera Patel',
    guestEmail: 'meera.patel@gmail.com',
    guestPhone: '+91 90011 23456',
    guestCount: 2,
    checkIn: '2025-04-22',
    checkOut: '2025-04-25',
    nights: 3,
    pricePerNight: 18000,
    totalAmount: 54000,
    platformFee: 5400,
    hostEarnings: 48600,
    status: 'confirmed',
    bookedAt: '2025-04-05T14:15:00Z',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'b003',
    propertyId: 'hp2',
    propertyName: 'Mountain Retreat Cottage',
    hostId: 'host1',
    guestName: 'Ravi Shankar',
    guestEmail: 'ravi.shankar@yahoo.com',
    guestPhone: '+91 77889 12345',
    guestCount: 6,
    checkIn: '2025-03-28',
    checkOut: '2025-04-01',
    nights: 4,
    pricePerNight: 12000,
    totalAmount: 48000,
    platformFee: 4800,
    hostEarnings: 43200,
    status: 'completed',
    bookedAt: '2025-03-10T09:00:00Z',
    paymentMethod: 'Net Banking',
  },
  {
    id: 'b004',
    propertyId: 'hp2',
    propertyName: 'Mountain Retreat Cottage',
    hostId: 'host1',
    guestName: 'Sneha Nair',
    guestEmail: 'sneha.nair@gmail.com',
    guestPhone: '+91 88234 56789',
    guestCount: 3,
    checkIn: '2025-05-02',
    checkOut: '2025-05-04',
    nights: 2,
    pricePerNight: 12000,
    totalAmount: 24000,
    platformFee: 2400,
    hostEarnings: 21600,
    status: 'pending',
    bookedAt: '2025-04-08T16:45:00Z',
    paymentMethod: 'UPI',
  },
  {
    id: 'b005',
    propertyId: 'hp1',
    propertyName: 'Sunrise Beach Villa',
    hostId: 'host1',
    guestName: 'Deepak Verma',
    guestEmail: 'deepak.verma@hotmail.com',
    guestPhone: '+91 96543 21098',
    guestCount: 5,
    checkIn: '2025-03-10',
    checkOut: '2025-03-13',
    nights: 3,
    pricePerNight: 18000,
    totalAmount: 54000,
    platformFee: 5400,
    hostEarnings: 48600,
    status: 'completed',
    bookedAt: '2025-02-25T11:20:00Z',
    paymentMethod: 'Debit Card',
  },
];

const mockMessages: HostMessage[] = [
  {
    id: 'm001',
    bookingId: 'b001',
    hostId: 'host1',
    guestName: 'Arjun Kapoor',
    guestEmail: 'arjun.kapoor@gmail.com',
    propertyName: 'Sunrise Beach Villa',
    sender: 'guest',
    content: 'Hi! We are so excited about our upcoming stay. Can we get an early check-in around 11 AM? Our flight lands early.',
    timestamp: '2025-04-03T09:15:00Z',
    read: false,
  },
  {
    id: 'm002',
    bookingId: 'b001',
    hostId: 'host1',
    guestName: 'Arjun Kapoor',
    guestEmail: 'arjun.kapoor@gmail.com',
    propertyName: 'Sunrise Beach Villa',
    sender: 'host',
    content: 'Hello Arjun! Absolutely, early check-in at 11 AM works perfectly. I will have the villa ready for you. Looking forward to welcoming you!',
    timestamp: '2025-04-03T14:30:00Z',
    read: true,
  },
  {
    id: 'm003',
    bookingId: 'b002',
    hostId: 'host1',
    guestName: 'Meera Patel',
    guestEmail: 'meera.patel@gmail.com',
    propertyName: 'Sunrise Beach Villa',
    sender: 'guest',
    content: 'Is there a kitchen we can use? We would love to cook some meals during our stay.',
    timestamp: '2025-04-06T11:20:00Z',
    read: false,
  },
  {
    id: 'm004',
    bookingId: 'b003',
    hostId: 'host1',
    guestName: 'Ravi Shankar',
    guestEmail: 'ravi.shankar@yahoo.com',
    propertyName: 'Mountain Retreat Cottage',
    sender: 'guest',
    content: 'Thank you for the wonderful stay! The cottage was beautiful and the views were breathtaking. We will definitely be back!',
    timestamp: '2025-04-02T08:45:00Z',
    read: true,
  },
  {
    id: 'm005',
    bookingId: 'b003',
    hostId: 'host1',
    guestName: 'Ravi Shankar',
    guestEmail: 'ravi.shankar@yahoo.com',
    propertyName: 'Mountain Retreat Cottage',
    sender: 'host',
    content: 'Thank you so much Ravi! It was a pleasure hosting you. Hope to see you again soon!',
    timestamp: '2025-04-02T10:00:00Z',
    read: true,
  },
];

const mockReviews: HostReview[] = [
  {
    id: 'rev001',
    hostId: 'host1',
    propertyId: 'hp1',
    propertyName: 'Sunrise Beach Villa',
    bookingId: 'b005',
    guestName: 'Deepak Verma',
    guestAvatar: 'https://readdy.ai/api/search-image?query=indian%20man%20smiling%20casual%20portrait%20headshot&width=80&height=80&seq=guestva1&orientation=squarish',
    rating: 5,
    cleanlinessRating: 5,
    communicationRating: 5,
    locationRating: 5,
    valueRating: 4,
    comment: 'Absolutely stunning property! The infinity pool overlooking the ocean was breathtaking. Ananya was incredibly responsive and helpful throughout our stay. The villa was spotlessly clean and even better than the photos. Will definitely be coming back!',
    date: '2025-03-14T10:00:00Z',
    hostReply: 'Thank you so much Deepak! It was a pleasure having you and your family. We are thrilled you loved the pool! Hope to see you again soon.',
    hostReplyDate: '2025-03-15T09:00:00Z',
  },
  {
    id: 'rev002',
    hostId: 'host1',
    propertyId: 'hp2',
    propertyName: 'Mountain Retreat Cottage',
    bookingId: 'b003',
    guestName: 'Ravi Shankar',
    guestAvatar: 'https://readdy.ai/api/search-image?query=indian%20man%20confident%20portrait%20headshot%20casual%20warm&width=80&height=80&seq=guestva2&orientation=squarish',
    rating: 5,
    cleanlinessRating: 5,
    communicationRating: 5,
    locationRating: 5,
    valueRating: 5,
    comment: 'Absolutely magical experience! The cottage was cozy, warm, and beautifully decorated. Waking up to those Himalayan views every morning was surreal. The fireplace was perfect for cold evenings. Ananya left thoughtful welcome touches — local honey, fresh flowers. A true home away from home.',
    date: '2025-04-02T08:45:00Z',
  },
  {
    id: 'rev003',
    hostId: 'host1',
    propertyId: 'hp1',
    propertyName: 'Sunrise Beach Villa',
    bookingId: 'b001',
    guestName: 'Priya Mehta',
    guestAvatar: 'https://readdy.ai/api/search-image?query=indian%20woman%20smiling%20casual%20portrait%20headshot%20friendly&width=80&height=80&seq=guestva3&orientation=squarish',
    rating: 4,
    cleanlinessRating: 5,
    communicationRating: 4,
    locationRating: 5,
    valueRating: 3,
    comment: 'Beautiful villa with incredible views. The location is unbeatable — right on the cliff with direct beach access. Only minor thing is the price is a bit steep but you do get what you pay for. The kitchen was well-stocked and the beds were super comfortable. Would recommend.',
    date: '2025-01-10T14:30:00Z',
    hostReply: 'Thank you for your kind review Priya! We are glad you loved the location and amenities. We do offer seasonal discounts — do follow us for offers on your next stay!',
    hostReplyDate: '2025-01-11T10:00:00Z',
  },
  {
    id: 'rev004',
    hostId: 'host1',
    propertyId: 'hp2',
    propertyName: 'Mountain Retreat Cottage',
    bookingId: 'b004',
    guestName: 'Sanjay Bose',
    guestAvatar: 'https://readdy.ai/api/search-image?query=indian%20man%20middle%20aged%20professional%20portrait%20headshot&width=80&height=80&seq=guestva4&orientation=squarish',
    rating: 4,
    cleanlinessRating: 4,
    communicationRating: 5,
    locationRating: 5,
    valueRating: 4,
    comment: 'Great weekend escape from the city! The cottage is charming and the surroundings are peaceful. Communication with the host was seamless and check-in was smooth. The views are stunning and the air is so fresh. Perfect for families and couples looking to disconnect.',
    date: '2025-02-20T09:15:00Z',
  },
  {
    id: 'rev005',
    hostId: 'host1',
    propertyId: 'hp1',
    propertyName: 'Sunrise Beach Villa',
    bookingId: 'b002',
    guestName: 'Kavitha Reddy',
    guestAvatar: 'https://readdy.ai/api/search-image?query=south%20indian%20woman%20professional%20portrait%20headshot%20confident&width=80&height=80&seq=guestva5&orientation=squarish',
    rating: 5,
    cleanlinessRating: 5,
    communicationRating: 5,
    locationRating: 4,
    valueRating: 5,
    comment: 'One of the best stays I have ever had! The villa is luxurious yet feels like home. The private pool is divine and the sunset views are unreal. Ananya was attentive and even arranged a surprise birthday decoration for us. Small details that made it extra special.',
    date: '2025-03-02T16:00:00Z',
  },
];

const mockNotifications: HostNotification[] = [
  {
    id: 'n001',
    hostId: 'host1',
    type: 'booking',
    title: 'New Booking Confirmed',
    content: 'Arjun Kapoor booked Sunrise Beach Villa for Apr 15-18. Total earnings: ₹48,600',
    timestamp: '2025-04-02T10:30:00Z',
    read: false,
    actionUrl: '/host-portal?section=bookings',
    actionLabel: 'View Booking',
  },
  {
    id: 'n002',
    hostId: 'host1',
    type: 'message',
    title: 'New Message from Guest',
    content: 'Meera Patel sent a message about kitchen facilities at Sunrise Beach Villa',
    timestamp: '2025-04-06T11:20:00Z',
    read: false,
    actionUrl: '/host-portal?section=messages',
    actionLabel: 'Reply',
  },
  {
    id: 'n003',
    hostId: 'host1',
    type: 'payout',
    title: 'Payout Processing',
    content: 'Your March 2025 earnings of ₹91,800 are being processed. Expected in your account by April 7.',
    timestamp: '2025-04-01T00:00:00Z',
    read: true,
    actionUrl: '/host-portal?section=payouts',
    actionLabel: 'View Payouts',
  },
  {
    id: 'n004',
    hostId: 'host1',
    type: 'review',
    title: 'New 5-Star Review!',
    content: 'Ravi Shankar left a glowing review for Mountain Retreat Cottage. "Absolutely magical experience!"',
    timestamp: '2025-04-02T09:00:00Z',
    read: true,
  },
  {
    id: 'n005',
    hostId: 'host1',
    type: 'system',
    title: 'Property Verification Complete',
    content: 'Your Sunrise Beach Villa has been verified. You now have the verified badge on your listing.',
    timestamp: '2025-03-15T14:00:00Z',
    read: true,
  },
];

const mockPromotions: Promotion[] = [
  {
    id: 'promo1',
    hostId: 'host1',
    title: 'Summer Splash Deal',
    description: 'Beat the heat with our special summer discount. Book now for June & July stays!',
    type: 'percentage',
    discountValue: 20,
    promoCode: 'SUMMER20',
    propertyIds: ['hp1'],
    startDate: '2025-06-01',
    endDate: '2025-07-31',
    minNights: 2,
    maxUsage: 50,
    usageCount: 14,
    status: 'scheduled',
    createdAt: '2025-04-01T00:00:00Z',
  },
  {
    id: 'promo2',
    hostId: 'host1',
    title: 'Early Bird April',
    description: 'Book 30 days in advance for our mountain cottage and save big!',
    type: 'early_bird',
    discountValue: 15,
    promoCode: 'EARLYBIRD15',
    propertyIds: ['hp2'],
    startDate: '2025-04-01',
    endDate: '2025-04-30',
    minNights: 3,
    usageCount: 7,
    status: 'active',
    createdAt: '2025-03-20T00:00:00Z',
  },
  {
    id: 'promo3',
    hostId: 'host1',
    title: 'Long Stay Saver',
    description: 'Stay 7+ nights and enjoy a flat ₹5,000 off. Perfect for remote workers!',
    type: 'long_stay',
    discountValue: 5000,
    propertyIds: [],
    startDate: '2025-03-01',
    endDate: '2025-05-31',
    minNights: 7,
    usageCount: 3,
    status: 'active',
    createdAt: '2025-03-01T00:00:00Z',
  },
  {
    id: 'promo4',
    hostId: 'host1',
    title: 'New Year Getaway',
    description: 'Celebrate the new year with a special flat discount on all properties.',
    type: 'flat',
    discountValue: 3000,
    promoCode: 'NY2025',
    propertyIds: [],
    startDate: '2024-12-25',
    endDate: '2025-01-05',
    minNights: 2,
    maxUsage: 30,
    usageCount: 30,
    status: 'expired',
    createdAt: '2024-12-01T00:00:00Z',
  },
];

const defaultHostData: HostData = {
  accounts: [
    {
      id: 'host1',
      name: 'Ananya Krishnan',
      email: 'ananya@triprodeo.com',
      password: 'host1234',
      phone: '+91 98765 43210',
      createdAt: '2025-01-15T00:00:00Z',
      status: 'active',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20indian%20woman%20host%20portrait%20warm%20smile%20confident%20modern&width=200&height=200&seq=hostava1&orientation=squarish',
    },
    {
      id: 'host2',
      name: 'Vikram Sinha',
      email: 'vikram@triprodeo.com',
      password: 'host5678',
      phone: '+91 87654 32109',
      createdAt: '2025-02-20T00:00:00Z',
      status: 'active',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20indian%20man%20host%20portrait%20confident%20warm%20smile%20business%20casual&width=200&height=200&seq=hostava2&orientation=squarish',
    },
  ],
  properties: [
    {
      id: 'hp1',
      hostId: 'host1',
      name: 'Sunrise Beach Villa',
      location: 'Vagator, Goa',
      city: 'Goa',
      state: 'Goa',
      pricePerNight: 18000,
      originalPrice: 22000,
      rating: 4.8,
      reviewCount: 47,
      images: ['https://readdy.ai/api/search-image?query=luxury%20beach%20villa%20private%20pool%20ocean%20view%20goa%20india%20white%20architecture%20tropical&width=800&height=600&seq=hp1&orientation=landscape'],
      tags: ['Beachfront', 'Private Pool', 'Sunset View'],
      type: 'villa',
      verified: true,
      bedrooms: 3,
      bathrooms: 3,
      maxGuests: 6,
      description: 'A stunning beachfront villa perched above Vagator beach with panoramic ocean views and a private infinity pool.',
      status: 'active',
      createdAt: '2025-01-20T00:00:00Z',
    },
    {
      id: 'hp2',
      hostId: 'host1',
      name: 'Mountain Retreat Cottage',
      location: 'Kasauli, Himachal Pradesh',
      city: 'Kasauli',
      state: 'Himachal Pradesh',
      pricePerNight: 12000,
      rating: 4.7,
      reviewCount: 32,
      images: ['https://readdy.ai/api/search-image?query=cozy%20mountain%20cottage%20himachal%20pradesh%20pine%20trees%20snow%20landscape%20warm%20lights%20india&width=800&height=600&seq=hp2&orientation=landscape'],
      tags: ['Mountain View', 'Fireplace', 'Quiet'],
      type: 'cottage',
      verified: true,
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      description: 'A charming cedar-wood cottage nestled among deodar trees with breathtaking valley views.',
      status: 'active',
      createdAt: '2025-01-25T00:00:00Z',
    },
    {
      id: 'hp3',
      hostId: 'host2',
      name: 'Heritage Haveli Suite',
      location: 'Jodhpur, Rajasthan',
      city: 'Jodhpur',
      state: 'Rajasthan',
      pricePerNight: 9500,
      rating: 4.6,
      reviewCount: 19,
      images: ['https://readdy.ai/api/search-image?query=heritage%20haveli%20suite%20rajasthan%20blue%20city%20jodhpur%20india%20royal%20architecture%20courtyard&width=800&height=600&seq=hp3&orientation=landscape'],
      tags: ['Heritage', 'City View', 'Cultural'],
      type: 'boutique',
      verified: false,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      description: 'Stay in a 200-year-old restored haveli in the heart of the blue city with original Rajasthani architecture.',
      status: 'pending',
      createdAt: '2025-03-10T00:00:00Z',
    },
  ],
  bookings: mockBookings,
  messages: mockMessages,
  notifications: mockNotifications,
  blockedDates: [],
  reviews: mockReviews,
  promotions: mockPromotions,
};

export function loadHostData(): HostData {
  try {
    const stored = localStorage.getItem(HOST_STORAGE_KEY);
    if (stored) return JSON.parse(stored) as HostData;
  } catch {
    // fallback
  }
  return defaultHostData;
}

export function saveHostData(data: HostData): void {
  localStorage.setItem(HOST_STORAGE_KEY, JSON.stringify(data));
}

export function authenticateHost(email: string, password: string): HostAccount | null {
  const data = loadHostData();
  return data.accounts.find(
    (a) => a.email === email && a.password === password && a.status === 'active'
  ) ?? null;
}

export function getHostProperties(hostId: string): HostProperty[] {
  const data = loadHostData();
  return data.properties.filter((p) => p.hostId === hostId);
}

export function getHostBookings(hostId: string): HostBooking[] {
  const data = loadHostData();
  return data.bookings.filter((b) => b.hostId === hostId);
}

export function getHostMessages(hostId: string): HostMessage[] {
  const data = loadHostData();
  return data.messages.filter((m) => m.hostId === hostId);
}

export function addHostMessage(message: HostMessage): void {
  const data = loadHostData();
  data.messages.push(message);
  saveHostData(data);
}

export function markMessagesAsRead(hostId: string, bookingId: string): void {
  const data = loadHostData();
  data.messages = data.messages.map((m) =>
    m.hostId === hostId && m.bookingId === bookingId && m.sender === 'guest' ? { ...m, read: true } : m
  );
  saveHostData(data);
}

export function getUnreadMessageCount(hostId: string): number {
  const data = loadHostData();
  return data.messages.filter((m) => m.hostId === hostId && m.sender === 'guest' && !m.read).length;
}

export function getHostNotifications(hostId: string): HostNotification[] {
  const data = loadHostData();
  return data.notifications
    .filter((n) => n.hostId === hostId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function markNotificationAsRead(hostId: string, notificationId: string): void {
  const data = loadHostData();
  data.notifications = data.notifications.map((n) =>
    n.hostId === hostId && n.id === notificationId ? { ...n, read: true } : n
  );
  saveHostData(data);
}

export function markAllNotificationsAsRead(hostId: string): void {
  const data = loadHostData();
  data.notifications = data.notifications.map((n) =>
    n.hostId === hostId ? { ...n, read: true } : n
  );
  saveHostData(data);
}

export function getUnreadNotificationCount(hostId: string): number {
  const data = loadHostData();
  return data.notifications.filter((n) => n.hostId === hostId && !n.read).length;
}

export function getHostReviews(hostId: string): HostReview[] {
  const data = loadHostData();
  if (!data.reviews) return [];
  return data.reviews
    .filter((r) => r.hostId === hostId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function replyToReview(hostId: string, reviewId: string, reply: string): void {
  const data = loadHostData();
  if (!data.reviews) return;
  data.reviews = data.reviews.map((r) =>
    r.id === reviewId && r.hostId === hostId
      ? { ...r, hostReply: reply, hostReplyDate: new Date().toISOString() }
      : r
  );
  saveHostData(data);
}

export function editReviewReply(hostId: string, reviewId: string, reply: string): void {
  const data = loadHostData();
  if (!data.reviews) return;
  data.reviews = data.reviews.map((r) =>
    r.id === reviewId && r.hostId === hostId
      ? { ...r, hostReply: reply, hostReplyDate: new Date().toISOString() }
      : r
  );
  saveHostData(data);
}

export function deleteReviewReply(hostId: string, reviewId: string): void {
  const data = loadHostData();
  if (!data.reviews) return;
  data.reviews = data.reviews.map((r) =>
    r.id === reviewId && r.hostId === hostId
      ? { ...r, hostReply: undefined, hostReplyDate: undefined }
      : r
  );
  saveHostData(data);
}

export function getUnrepliedReviewCount(hostId: string): number {
  const data = loadHostData();
  if (!data.reviews) return 0;
  return data.reviews.filter((r) => r.hostId === hostId && !r.hostReply).length;
}

export function getHostPromotions(hostId: string): Promotion[] {
  const data = loadHostData();
  if (!data.promotions) return [];
  // auto-update statuses based on date
  const today = new Date().toISOString().split('T')[0];
  return data.promotions
    .filter((p) => p.hostId === hostId)
    .map((p) => {
      if (p.status === 'expired') return p;
      if (p.endDate < today) return { ...p, status: 'expired' as const };
      if (p.startDate > today && p.status !== 'paused') return { ...p, status: 'scheduled' as const };
      if (p.startDate <= today && p.status !== 'paused') return { ...p, status: 'active' as const };
      return p;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addPromotion(promo: Promotion): void {
  const data = loadHostData();
  if (!data.promotions) data.promotions = [];
  data.promotions.push(promo);
  saveHostData(data);
}

export function updatePromotion(promo: Promotion): void {
  const data = loadHostData();
  if (!data.promotions) return;
  const idx = data.promotions.findIndex((p) => p.id === promo.id);
  if (idx >= 0) data.promotions[idx] = promo;
  saveHostData(data);
}

export function deletePromotion(id: string): void {
  const data = loadHostData();
  if (!data.promotions) return;
  data.promotions = data.promotions.filter((p) => p.id !== id);
  saveHostData(data);
}

export function togglePromotionPause(hostId: string, id: string): void {
  const data = loadHostData();
  if (!data.promotions) return;
  const today = new Date().toISOString().split('T')[0];
  data.promotions = data.promotions.map((p) => {
    if (p.id !== id || p.hostId !== hostId) return p;
    if (p.status === 'paused') {
      const newStatus = p.startDate <= today && p.endDate >= today ? 'active' : p.startDate > today ? 'scheduled' : 'expired';
      return { ...p, status: newStatus as Promotion['status'] };
    }
    return { ...p, status: 'paused' as const };
  });
  saveHostData(data);
}

export function updateHostAccount(hostId: string, updates: Partial<Omit<HostAccount, 'id' | 'createdAt'>>): HostAccount | null {
  const data = loadHostData();
  const idx = data.accounts.findIndex((a) => a.id === hostId);
  if (idx < 0) return null;
  data.accounts[idx] = { ...data.accounts[idx], ...updates };
  saveHostData(data);
  return data.accounts[idx];
}

export function addHostNotification(notification: HostNotification): void {
  const data = loadHostData();
  data.notifications.push(notification);
  saveHostData(data);
}

export function addHostProperty(property: HostProperty): void {
  const data = loadHostData();
  data.properties.push(property);
  saveHostData(data);
}

export function updateHostProperty(property: HostProperty): void {
  const data = loadHostData();
  const idx = data.properties.findIndex((p) => p.id === property.id);
  if (idx >= 0) data.properties[idx] = property;
  saveHostData(data);
}

export function deleteHostProperty(propertyId: string): void {
  const data = loadHostData();
  data.properties = data.properties.filter((p) => p.id !== propertyId);
  saveHostData(data);
}

export function getBlockedDates(hostId: string, propertyId?: string): BlockedDate[] {
  const data = loadHostData();
  if (!data.blockedDates) return [];
  return data.blockedDates.filter(
    (d) => d.hostId === hostId && (propertyId ? d.propertyId === propertyId : true)
  );
}

export function blockDate(entry: BlockedDate): void {
  const data = loadHostData();
  if (!data.blockedDates) data.blockedDates = [];
  const exists = data.blockedDates.find(
    (d) => d.propertyId === entry.propertyId && d.date === entry.date
  );
  if (!exists) {
    data.blockedDates.push(entry);
    saveHostData(data);
  }
}

export function unblockDate(id: string): void {
  const data = loadHostData();
  if (!data.blockedDates) return;
  data.blockedDates = data.blockedDates.filter((d) => d.id !== id);
  saveHostData(data);
}

export function blockDateRange(hostId: string, propertyId: string, startDate: string, endDate: string, reason?: string): void {
  const data = loadHostData();
  if (!data.blockedDates) data.blockedDates = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const current = new Date(start);
  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0];
    const exists = data.blockedDates.find(
      (d) => d.propertyId === propertyId && d.date === dateStr
    );
    if (!exists) {
      data.blockedDates.push({
        id: `blk_${propertyId}_${dateStr}`,
        propertyId,
        hostId,
        date: dateStr,
        reason,
      });
    }
    current.setDate(current.getDate() + 1);
  }
  saveHostData(data);
}

export function unblockDateRange(hostId: string, propertyId: string, startDate: string, endDate: string): void {
  const data = loadHostData();
  if (!data.blockedDates) return;
  const start = new Date(startDate);
  const end = new Date(endDate);
  data.blockedDates = data.blockedDates.filter((d) => {
    if (d.propertyId !== propertyId || d.hostId !== hostId) return true;
    const dDate = new Date(d.date);
    return dDate < start || dDate > end;
  });
  saveHostData(data);
}
