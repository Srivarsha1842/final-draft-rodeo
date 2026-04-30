export interface DayOutingEnquiry {
  id: string;
  enquiryId: string;
  propertyId: string;
  propertyName: string;
  location: string;
  image: string;
  date: string;
  timeSlot: string;
  guests: number;
  pricePerPerson: number;
  totalEstimate: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  occasion?: string;
  submittedAt: string;
  hostName: string;
  hostPhone?: string;
  notes?: string;
}

export interface Booking {
  id: string;
  bookingId: string;
  type: 'stay' | 'experience' | 'bundle';
  status: 'confirmed' | 'completed' | 'cancelled' | 'upcoming';
  title: string;
  location: string;
  image: string;
  checkIn?: string;
  checkOut?: string;
  date?: string;
  time?: string;
  guests: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue?: number;
  isPartialPayment: boolean;
  hostName: string;
  hostAvatar: string;
  hostPhone?: string;
  canCancel: boolean;
  cancellationDeadline?: string;
  reviewSubmitted?: boolean;
  amenities?: string[];
  addOns?: string[];
  itinerary?: string[];
}

export interface SavedTrip {
  id: string;
  title: string;
  location: string;
  image: string;
  type: 'property' | 'experience' | 'bundle';
  price: number;
  rating: number;
  savedDate: string;
  dates?: string;
  guests?: number;
  notes?: string;
}

export interface WalletTransaction {
  id: string;
  type: 'cashback' | 'refund' | 'payment' | 'bonus';
  amount: number;
  description: string;
  date: string;
  bookingId?: string;
  status: 'completed' | 'pending';
}

export interface LoyaltyTier {
  name: string;
  color: string;
  minPoints: number;
  benefits: string[];
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  joinedDate: string;
  isVerified: boolean;
  isSuperGuest: boolean;
  totalTrips: number;
  totalNights: number;
  totalSpent: number;
}

export const userProfile: UserProfile = {
  id: 'u1',
  firstName: 'Rohan',
  lastName: 'Mehta',
  email: 'rohan.mehta@email.com',
  phone: '+91 98765 43210',
  avatar: 'https://readdy.ai/api/search-image?query=professional%20indian%20man%20portrait%20photo%20business%20casual%20confident%20smile&width=120&height=120&seq=user1&orientation=squarish',
  joinedDate: '2023-08-15',
  isVerified: true,
  isSuperGuest: true,
  totalTrips: 12,
  totalNights: 28,
  totalSpent: 245000,
};

export const loyaltyPoints = {
  current: 4850,
  lifetime: 12450,
  tier: 'Gold',
  nextTier: 'Platinum',
  pointsToNextTier: 2650,
  tierProgress: 65,
  expiringSoon: 1200,
  expiryDate: '2025-12-31',
};

export const loyaltyTiers: LoyaltyTier[] = [
  {
    name: 'Silver',
    color: 'bg-stone-400',
    minPoints: 0,
    benefits: ['5% cashback on bookings', 'Early access to sales', 'Member-only deals'],
  },
  {
    name: 'Gold',
    color: 'bg-amber-400',
    minPoints: 2500,
    benefits: ['10% cashback on bookings', 'Free cancellation up to 24h', 'Priority support', 'Room upgrades when available'],
  },
  {
    name: 'Platinum',
    color: 'bg-slate-400',
    minPoints: 7500,
    benefits: ['15% cashback on bookings', 'Free cancellation anytime', 'VIP concierge', 'Guaranteed room upgrades', 'Airport transfers'],
  },
  {
    name: 'Diamond',
    color: 'bg-purple-500',
    minPoints: 15000,
    benefits: ['20% cashback on bookings', 'Free cancellation anytime', 'Personal travel advisor', 'Guaranteed upgrades', 'Free experiences', 'Exclusive properties access'],
  },
];

export const wallet = {
  balance: 8750,
  pendingCashback: 1200,
  totalEarned: 24500,
  totalRefunded: 8500,
  currency: '₹',
};

export const walletTransactions: WalletTransaction[] = [
  {
    id: 't1',
    type: 'cashback',
    amount: 1850,
    description: 'Cashback from Goa Villa booking',
    date: '2025-04-08',
    bookingId: 'TRP7X9K2M',
    status: 'completed',
  },
  {
    id: 't2',
    type: 'refund',
    amount: 5000,
    description: 'Refund for cancelled Kerala trip',
    date: '2025-03-22',
    bookingId: 'TRP4P8N1Q',
    status: 'completed',
  },
  {
    id: 't3',
    type: 'bonus',
    amount: 500,
    description: 'Welcome bonus - Super Guest milestone',
    date: '2025-03-15',
    status: 'completed',
  },
  {
    id: 't4',
    type: 'cashback',
    amount: 1200,
    description: 'Cashback from Rajasthan Palace booking',
    date: '2025-02-28',
    bookingId: 'TRP2L5W8R',
    status: 'completed',
  },
  {
    id: 't5',
    type: 'payment',
    amount: -15000,
    description: 'Partial payment for Manali trip',
    date: '2025-02-20',
    bookingId: 'TRP9M3K7P',
    status: 'completed',
  },
  {
    id: 't6',
    type: 'cashback',
    amount: 2400,
    description: 'Cashback from Andaman package',
    date: '2025-01-15',
    status: 'completed',
  },
];

export const bookings: Booking[] = [
  {
    id: 'b1',
    bookingId: 'TRP7X9K2M',
    type: 'stay',
    status: 'upcoming',
    title: 'Azure Cliff Villa',
    location: 'Candolim Beach, Goa',
    image: 'https://readdy.ai/api/search-image?query=luxury%20private%20villa%20with%20infinity%20pool%20overlooking%20ocean%20at%20sunset%20white%20architecture%20tropical%20palms&width=400&height=300&seq=book1&orientation=landscape',
    checkIn: '2025-04-15',
    checkOut: '2025-04-18',
    guests: 4,
    totalAmount: 75996,
    paidAmount: 75996,
    isPartialPayment: false,
    hostName: 'Priya Mehta',
    hostAvatar: 'https://readdy.ai/api/search-image?query=professional%20indian%20woman%20smiling%20portrait%20photo%20warm%20confident&width=80&height=80&seq=host1&orientation=squarish',
    hostPhone: '+91 98765 12345',
    canCancel: true,
    cancellationDeadline: '2025-04-13',
    amenities: ['Infinity Pool', 'Private Beach', 'Chef on Request', 'Spa'],
    addOns: ['BBQ Evening Setup', 'Couples Spa Package'],
  },
  {
    id: 'b2',
    bookingId: 'TRP3N8L5Q',
    type: 'experience',
    status: 'upcoming',
    title: 'Sunrise Hot Air Balloon',
    location: 'Jaisalmer, Rajasthan',
    image: 'https://readdy.ai/api/search-image?query=hot%20air%20balloon%20floating%20over%20golden%20desert%20dunes%20at%20sunrise%20rajasthan%20india%20magical%20sky&width=400&height=300&seq=book2&orientation=landscape',
    date: '2025-04-20',
    time: '5:30 AM',
    guests: 2,
    totalAmount: 13000,
    paidAmount: 13000,
    isPartialPayment: false,
    hostName: 'Desert Sky Adventures',
    hostAvatar: 'https://readdy.ai/api/search-image?query=professional%20pilot%20portrait%20confident%20smile%20uniform%20aviation&width=80&height=80&seq=host1&orientation=squarish',
    canCancel: true,
    cancellationDeadline: '2025-04-19',
  },
  {
    id: 'b3',
    bookingId: 'TRP9M3K7P',
    type: 'stay',
    status: 'upcoming',
    title: 'The Himalayan Nest',
    location: 'Manali, Himachal Pradesh',
    image: 'https://readdy.ai/api/search-image?query=luxury%20mountain%20chalet%20in%20himalayas%20with%20snow%20capped%20peaks%20pine%20forest%20cozy%20wood%20architecture&width=400&height=300&seq=book3&orientation=landscape',
    checkIn: '2025-05-10',
    checkOut: '2025-05-14',
    guests: 6,
    totalAmount: 50000,
    paidAmount: 15000,
    balanceDue: 35000,
    isPartialPayment: true,
    hostName: 'Arjun Rawat',
    hostAvatar: 'https://readdy.ai/api/search-image?query=young%20indian%20man%20portrait%20friendly%20smile%20outdoor%20setting&width=80&height=80&seq=host2&orientation=squarish',
    hostPhone: '+91 98765 67890',
    canCancel: true,
    cancellationDeadline: '2025-05-08',
    amenities: ['Fireplace', 'Mountain View', 'Bonfire', 'Trekking Guide'],
  },
  {
    id: 'b4',
    bookingId: 'TRP2L5W8R',
    type: 'stay',
    status: 'completed',
    title: 'Udaipur Lake Palace Suite',
    location: 'Lake Pichola, Udaipur',
    image: 'https://readdy.ai/api/search-image?query=luxury%20palace%20hotel%20udaipur%20rajasthan%20lake%20view%20white%20marble%20architecture%20royal%20heritage&width=400&height=300&seq=book4&orientation=landscape',
    checkIn: '2025-02-14',
    checkOut: '2025-02-16',
    guests: 2,
    totalAmount: 64000,
    paidAmount: 64000,
    isPartialPayment: false,
    hostName: 'Heritage Collection',
    hostAvatar: 'https://readdy.ai/api/search-image?query=heritage%20hotel%20logo%20royal%20crest%20golden%20emblem&width=80&height=80&seq=host6&orientation=squarish',
    canCancel: false,
    reviewSubmitted: true,
    amenities: ['Lake View', 'Butler Service', 'Spa', 'Fine Dining'],
  },
  {
    id: 'b5',
    bookingId: 'TRP5K9M2N',
    type: 'bundle',
    status: 'completed',
    title: 'Royal Rajasthan Experience',
    location: 'Jaipur & Jaisalmer, Rajasthan',
    image: 'https://readdy.ai/api/search-image?query=rajasthan%20palace%20and%20desert%20collage%20luxury%20travel%20experience%20royal&width=400&height=300&seq=book5&orientation=landscape',
    checkIn: '2025-01-20',
    checkOut: '2025-01-23',
    guests: 2,
    totalAmount: 42000,
    paidAmount: 42000,
    isPartialPayment: false,
    hostName: 'Triprodeo Concierge',
    hostAvatar: 'https://readdy.ai/api/search-image?query=professional%20concierge%20portrait%20indian%20hospitality%20warm%20smile&width=80&height=80&seq=host7&orientation=squarish',
    canCancel: false,
    reviewSubmitted: false,
    itinerary: ['Palace Suite Check-in', 'Hot Air Balloon Ride', 'Taj Mahal Photography Tour'],
  },
  {
    id: 'b6',
    bookingId: 'TRP4P8N1Q',
    type: 'stay',
    status: 'cancelled',
    title: 'Alleppey Houseboat Retreat',
    location: 'Alleppey Backwaters, Kerala',
    image: 'https://readdy.ai/api/search-image?query=luxury%20houseboat%20kerala%20backwaters%20surrounded%20by%20coconut%20palms%20and%20green%20waterways%20sunset&width=400&height=300&seq=book6&orientation=landscape',
    checkIn: '2025-03-25',
    checkOut: '2025-03-28',
    guests: 4,
    totalAmount: 45000,
    paidAmount: 0,
    isPartialPayment: false,
    hostName: 'Sunita Nair',
    hostAvatar: 'https://readdy.ai/api/search-image?query=south%20indian%20woman%20warm%20smile%20portrait%20professional&width=80&height=80&seq=host4&orientation=squarish',
    canCancel: false,
  },
];

export const savedTrips: SavedTrip[] = [
  {
    id: 's1',
    title: 'Ranthambore Jungle Lodge',
    location: 'Ranthambore National Park, Rajasthan',
    image: 'https://readdy.ai/api/search-image?query=luxury%20jungle%20safari%20lodge%20india%20with%20pool%20surrounded%20by%20lush%20forest%20premium%20tented%20resort&width=400&height=300&seq=save1&orientation=landscape',
    type: 'property',
    price: 22000,
    rating: 4.7,
    savedDate: '2025-04-05',
    dates: 'Jun 15-18, 2025',
    guests: 4,
    notes: 'Perfect for wildlife photography trip with family',
  },
  {
    id: 's2',
    title: 'Private Ayurveda & Yoga Retreat',
    location: 'Varkala, Kerala',
    image: 'https://readdy.ai/api/search-image?query=ayurveda%20spa%20treatment%20luxury%20resort%20kerala%20tropical%20setting%20herbal%20oils%20massage%20relaxation&width=400&height=300&seq=save2&orientation=landscape',
    type: 'experience',
    price: 4800,
    rating: 4.8,
    savedDate: '2025-03-28',
    notes: 'Need to book for mom\'s birthday',
  },
  {
    id: 's3',
    title: 'Andaman Island Adventure',
    location: 'Havelock Island, Andaman',
    image: 'https://readdy.ai/api/search-image?query=andaman%20islands%20beach%20water%20sports%20collage%20scuba%20diving%20kayaking%20tropical%20paradise&width=400&height=300&seq=save3&orientation=landscape',
    type: 'bundle',
    price: 32000,
    rating: 4.9,
    savedDate: '2025-03-20',
    dates: 'Aug 10-14, 2025',
    guests: 2,
  },
  {
    id: 's4',
    title: 'Coorg Forest Estate',
    location: 'Coorg, Karnataka',
    image: 'https://readdy.ai/api/search-image?query=luxury%20estate%20bungalow%20surrounded%20by%20coffee%20plantation%20and%20misty%20forest%20in%20coorg%20karnataka&width=400&height=300&seq=save4&orientation=landscape',
    type: 'property',
    price: 9999,
    rating: 4.6,
    savedDate: '2025-03-15',
    notes: 'Weekend getaway option',
  },
  {
    id: 's5',
    title: 'Scuba Diving in the Andamans',
    location: 'Havelock Island, Andaman',
    image: 'https://readdy.ai/api/search-image?query=scuba%20diving%20andaman%20islands%20coral%20reef%20tropical%20fish%20underwater%20clear%20blue%20water&width=400&height=300&seq=save5&orientation=landscape',
    type: 'experience',
    price: 8500,
    rating: 4.9,
    savedDate: '2025-03-10',
  },
];

export const dayOutingEnquiries: DayOutingEnquiry[] = [
  {
    id: 'do1',
    enquiryId: 'DOE8X2K4M',
    propertyId: 'p1',
    propertyName: 'Azure Cliff Villa',
    location: 'Candolim Beach, Goa',
    image: 'https://readdy.ai/api/search-image?query=luxury%20villa%20pool%20day%20outing%20goa%20aerial%20view%20guests%20relaxing%20tropical%20paradise&width=400&height=280&seq=dayenq1&orientation=landscape',
    date: '2025-04-25',
    timeSlot: 'Full Day (9AM–6PM)',
    guests: 6,
    pricePerPerson: 2500,
    totalEstimate: 15000,
    status: 'confirmed',
    occasion: 'Birthday Party',
    submittedAt: '2025-04-10',
    hostName: 'Priya Mehta',
    hostPhone: '+91 98765 12345',
    notes: 'Please arrange a special cake',
  },
  {
    id: 'do2',
    enquiryId: 'DOE3N7L9Q',
    propertyId: 'p3',
    propertyName: 'The Himalayan Nest',
    location: 'Manali, Himachal Pradesh',
    image: 'https://readdy.ai/api/search-image?query=himalayan%20mountain%20resort%20day%20outing%20adventure%20activities%20pine%20forest%20scenic%20view&width=400&height=280&seq=dayenq2&orientation=landscape',
    date: '2025-05-18',
    timeSlot: 'Morning (8AM–1PM)',
    guests: 4,
    pricePerPerson: 1800,
    totalEstimate: 7200,
    status: 'pending',
    occasion: 'Team Outing',
    submittedAt: '2025-04-09',
  },
  {
    id: 'do3',
    enquiryId: 'DOE1K5P2N',
    propertyId: 'p2',
    propertyName: 'Udaipur Lake Palace Suite',
    location: 'Lake Pichola, Udaipur',
    image: 'https://readdy.ai/api/search-image?query=udaipur%20palace%20day%20outing%20heritage%20hotel%20swimming%20pool%20luxury%20experience%20guests&width=400&height=280&seq=dayenq3&orientation=landscape',
    date: '2025-02-20',
    timeSlot: 'Full Day (9AM–6PM)',
    guests: 2,
    pricePerPerson: 4500,
    totalEstimate: 9000,
    status: 'completed',
    occasion: 'Anniversary',
    submittedAt: '2025-02-08',
    hostName: 'Heritage Collection',
  },
];

export const referralStats = {
  code: 'ROHAN250',
  totalInvited: 8,
  successfulReferrals: 3,
  totalEarned: 2250,
  pendingAmount: 750,
  referralLink: 'https://triprodeo.com/r/rohan250',
  tier: 'Gold Referrer',
  benefits: ['₹250 per successful referral', 'Bonus ₹1000 at 5 referrals', 'Exclusive early access to new properties'],
};

export const notifications = [
  {
    id: 'n1',
    type: 'booking',
    title: 'Booking Confirmed',
    message: 'Your Azure Cliff Villa booking is confirmed for Apr 15-18',
    date: '2025-04-08',
    read: false,
    action: '/dashboard?tab=bookings',
  },
  {
    id: 'n2',
    type: 'cashback',
    title: 'Cashback Credited',
    message: '₹1,850 cashback from your Goa booking has been added to your wallet',
    date: '2025-04-08',
    read: false,
    action: '/dashboard?tab=wallet',
  },
  {
    id: 'n3',
    type: 'reminder',
    title: 'Trip Reminder',
    message: 'Your Goa trip is in 7 days! Don\'t forget to check the weather',
    date: '2025-04-07',
    read: true,
    action: '/dashboard?tab=bookings',
  },
  {
    id: 'n4',
    type: 'review',
    title: 'Review Your Stay',
    message: 'How was your Udaipur Palace experience? Share your feedback',
    date: '2025-02-20',
    read: true,
    action: '/dashboard?tab=bookings',
  },
  {
    id: 'n5',
    type: 'promo',
    title: 'Exclusive Offer',
    message: 'Get 20% off on your next booking with code SUPERGUEST20',
    date: '2025-04-01',
    read: true,
    action: '/search',
  },
];