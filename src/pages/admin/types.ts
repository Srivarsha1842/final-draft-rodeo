export interface CMSHeroContent {
  headline: string;
  subheadline: string;
  badgeText: string;
  stats: { value: string; label: string }[];
  backgroundImage: string;
}

export interface CMSRoomType {
  id: string;
  name: string;          // e.g. "Deluxe Suite", "Standard Room"
  pricePerNight: number;
  capacity: number;      // max guests for this room
  bedType: string;       // e.g. "King Bed", "Twin Beds"
  size?: string;         // e.g. "45 sqm"
  description: string;
  photos: string[];      // room-specific photos
  amenities: string[];   // room-specific amenities
}

export interface CMSAddOn {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export interface CMSDayPackage {
  enabled: boolean;
  description: string;
  timing: string;           // e.g. "10:00 AM – 5:00 PM"
  pricePerPerson: number;
  maxGuests?: number;       // max number of guests allowed for day outing
  meals: string[];          // e.g. ["Welcome Drink", "Lunch Buffet", "Evening Snacks"]
  activities: string[];     // e.g. ["Pool Access", "Kayaking", "Nature Walk"]
  facilities: string[];     // e.g. ["Changing Room", "Towel", "Locker"]
  image: string;
}

export interface CMSPropertyReview {
  id: string;
  user: string;
  avatar: string;
  location: string;
  date: string;
  rating: number;
  text: string;
  photos?: string[];
}

export interface CMSProperty {
  id: string;
  name: string;
  location: string;
  city: string;
  state: string;
  pricePerNight: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];          // general property photos
  tags: string[];
  type: string;
  verified: boolean;
  superhost: boolean;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  scarcity?: string;         // e.g. "Only 2 left"
  description: string;
  amenities: string[];       // property-level amenities list
  roomTypes: CMSRoomType[];  // room types with per-room pricing & photos
  housePolicies: string[];   // custom house policies shown as bullet points
  addOns: CMSAddOn[];        // optional extras guests can add
  categoryRatings: {
    cleanliness: number;
    communication: number;
    checkIn: number;
    accuracy: number;
    location: number;
    value: number;
  };
  host: {
    name: string;
    avatar: string;
    joinedYear: number;
    superhost: boolean;
  };
  reviews: CMSPropertyReview[];
  dayPackage: CMSDayPackage;
}

export interface CMSExperience {
  id: string;
  title: string;
  location: string;
  price: number;
  duration: string;
  rating: number;
  category: string;
  image: string;
}

export interface CMSAboutContent {
  headline: string;
  subheadline: string;
  storyParagraph1: string;
  storyParagraph2: string;
  stats: { value: string; label: string }[];
  founders: { name: string; role: string; bio: string; image: string }[];
  values: { icon: string; title: string; description: string }[];
  officeLocations: { city: string; role: string; address: string }[];
}

export interface CMSPartnerContent {
  heroHeadline: string;
  heroSubheadline: string;
  stats: { value: string; label: string }[];
  commissionTiers: {
    id: string;
    name: string;
    commissionRate: string;
    bonusPerBooking: string;
    minBookings: number;
  }[];
  benefits: { id: string; title: string; description: string; stat: string; statLabel: string; icon: string }[];
}

export interface CMSSupportContent {
  heroHeadline: string;
  heroSubheadline: string;
  contactPhone: string;
  contactEmail: string;
  contactWhatsapp: string;
  faqs: { id: string; question: string; answer: string; category: string }[];
}

export interface CMSNavbarContent {
  logoUrl: string;
  links: { label: string; href: string }[];
}

export interface CMSFooterContent {
  tagline: string;
  aboutText: string;
  socialLinks: { platform: string; url: string; icon: string }[];
  copyrightText: string;
}

export interface CMSTrendingDestination {
  id: string;
  name: string;
  tagline: string;
  country: string;
  properties: number;
  startingPrice: number;
  badge: string;
  badgeColor: string;
  image: string;
  tags: string[];
}

export interface CMSData {
  hero: CMSHeroContent;
  properties: CMSProperty[];
  experiences: CMSExperience[];
  about: CMSAboutContent;
  partner: CMSPartnerContent;
  support: CMSSupportContent;
  navbar: CMSNavbarContent;
  footer: CMSFooterContent;
  trendingDestinations?: CMSTrendingDestination[];
  lastUpdated: string;
}

export type ResortOwnerPackage = 'basic' | 'standard' | 'premium';

export const PACKAGE_ACCESS: Record<ResortOwnerPackage, {
  label: string;
  price: string;
  color: string;
  bgColor: string;
  sections: string[];
  features: string[];
}> = {
  basic: {
    label: 'Basic',
    price: '₹4,999/mo',
    color: 'text-stone-700',
    bgColor: 'bg-stone-100',
    sections: ['dashboard', 'properties', 'property-management', 'bookings', 'calendar', 'messages', 'notifications', 'settings'],
    features: [
      'Property listing (up to 1)',
      'Booking management',
      'Calendar management',
      'Guest messaging',
      'Basic dashboard',
    ],
  },
  standard: {
    label: 'Standard',
    price: '₹9,999/mo',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    sections: ['dashboard', 'properties', 'property-management', 'bookings', 'payouts', 'calendar', 'reviews', 'guests', 'policies', 'addons', 'messages', 'notifications', 'settings'],
    features: [
      'Everything in Basic',
      'Up to 3 properties',
      'Payout tracking',
      'Reviews management',
      'Guest management',
      'Add-ons management',
      'House policies',
    ],
  },
  premium: {
    label: 'Premium',
    price: '₹19,999/mo',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    sections: ['dashboard', 'properties', 'property-management', 'bookings', 'payouts', 'calendar', 'reviews', 'analytics', 'guests', 'promotions', 'addons', 'policies', 'day-package', 'reports', 'messages', 'notifications', 'settings'],
    features: [
      'Everything in Standard',
      'Unlimited properties',
      'Advanced analytics',
      'Promotions & discounts',
      'Day outing packages',
      'Revenue reports',
      'Priority support',
    ],
  },
};

export interface HostAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  createdAt: string;
  status: 'active' | 'suspended';
  avatar?: string;
  package?: ResortOwnerPackage;
}

export interface HostProperty {
  id: string;
  hostId: string;
  name: string;
  location: string;
  city: string;
  state: string;
  pricePerNight: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  tags: string[];
  type: string;
  verified: boolean;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  description: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  housePolicies?: string[];
  dayPackage?: CMSDayPackage;
}

export interface HostBooking {
  id: string;
  propertyId: string;
  propertyName: string;
  hostId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCount: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  pricePerNight: number;
  totalAmount: number;
  platformFee: number;
  hostEarnings: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  bookedAt: string;
  paymentMethod: string;
}

export interface HostMessage {
  id: string;
  bookingId: string;
  hostId: string;
  guestName: string;
  guestEmail: string;
  propertyName: string;
  sender: 'host' | 'guest';
  content: string;
  timestamp: string;
  read: boolean;
}

export interface HostReview {
  id: string;
  hostId: string;
  propertyId: string;
  propertyName: string;
  bookingId: string;
  guestName: string;
  guestAvatar?: string;
  rating: number;
  cleanlinessRating: number;
  communicationRating: number;
  locationRating: number;
  valueRating: number;
  comment: string;
  date: string;
  hostReply?: string;
  hostReplyDate?: string;
}

export interface BlockedDate {
  id: string;
  propertyId: string;
  hostId: string;
  date: string; // YYYY-MM-DD
  reason?: string;
}

export interface HostNotification {
  id: string;
  hostId: string;
  type: 'booking' | 'message' | 'payout' | 'system' | 'review';
  title: string;
  content: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export type PromotionType = 'percentage' | 'flat' | 'early_bird' | 'last_minute' | 'long_stay';
export type PromotionStatus = 'active' | 'scheduled' | 'expired' | 'paused';

export interface Promotion {
  id: string;
  hostId: string;
  title: string;
  description: string;
  type: PromotionType;
  discountValue: number; // percent (0-100) or flat INR
  promoCode?: string;
  propertyIds: string[]; // empty = all properties
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  minNights?: number;
  maxUsage?: number;
  usageCount: number;
  status: PromotionStatus;
  createdAt: string;
}

// ── Property Management Types ──────────────────────────────────────────────

export interface PropertyRoomType {
  id: string;
  propertyId: string;
  name: string;               // e.g. "Deluxe Suite", "Standard Room", "Penthouse"
  totalRooms: number;         // total rooms of this type
  pricePerNight: number;
  capacity: number;           // max guests per room
  bedType: string;            // "King Bed", "Twin Beds", "Double Bed"
  size: string;               // e.g. "45 sqm"
  amenities: string[];
  images: string[];
  description: string;
  status: 'available' | 'occupied' | 'maintenance';
  availableRooms: number;     // currently available count
}

export type StaffRole = 'reception' | 'housekeeping' | 'service' | 'kitchen' | 'security' | 'maintenance' | 'management' | 'driver';

// All configurable portal features a staff member can access
export type StaffFeature =
  | 'view_bookings'        // See current bookings / check-ins
  | 'manage_checkin'       // Check-in / check-out guests
  | 'view_guests'          // See guest info & profiles
  | 'view_rooms'           // See room status & availability
  | 'manage_rooms'         // Update room status (clean/occupied/maintenance)
  | 'view_restaurant'      // See restaurant menu
  | 'take_orders'          // Create in-room dining orders
  | 'manage_orders'        // Update order status (preparing/served/billed)
  | 'view_inventory'       // View stock levels
  | 'manage_inventory'     // Add/restock inventory items
  | 'view_staff'           // See other staff members
  | 'view_messages'        // See guest messages
  | 'send_messages'        // Reply to guest messages
  | 'view_reports'         // View basic reports
  | 'manage_housekeeping'  // Assign/complete housekeeping tasks
  | 'view_payments'        // See payment/payout info
  | 'manage_maintenance';  // Log & resolve maintenance issues

export interface StaffPermissions {
  [feature: string]: boolean;
}

// Default permissions per role (fully configurable)
export const DEFAULT_ROLE_PERMISSIONS: Record<StaffRole, StaffFeature[]> = {
  reception: [
    'view_bookings', 'manage_checkin', 'view_guests',
    'view_rooms', 'view_restaurant', 'take_orders',
    'view_messages', 'send_messages',
  ],
  housekeeping: [
    'view_rooms', 'manage_rooms', 'manage_housekeeping',
    'view_inventory',
  ],
  service: [
    'view_bookings', 'view_guests', 'view_restaurant',
    'take_orders', 'manage_orders',
  ],
  kitchen: [
    'view_restaurant', 'manage_orders',
    'view_inventory',
  ],
  security: [
    'view_bookings', 'view_guests', 'view_rooms',
  ],
  maintenance: [
    'view_rooms', 'manage_rooms', 'manage_maintenance',
    'view_inventory', 'manage_inventory',
  ],
  management: [
    'view_bookings', 'manage_checkin', 'view_guests',
    'view_rooms', 'manage_rooms', 'view_restaurant',
    'take_orders', 'manage_orders', 'view_inventory',
    'manage_inventory', 'view_staff', 'view_messages',
    'send_messages', 'view_reports', 'manage_housekeeping',
    'view_payments', 'manage_maintenance',
  ],
  driver: [
    'view_bookings', 'view_guests',
  ],
};

// All available features with labels & grouping
export const ALL_STAFF_FEATURES: { id: StaffFeature; label: string; group: string; icon: string }[] = [
  // Bookings & Guests
  { id: 'view_bookings',       label: 'View Bookings',          group: 'Bookings & Guests', icon: 'ri-calendar-check-line' },
  { id: 'manage_checkin',      label: 'Check-in / Check-out',   group: 'Bookings & Guests', icon: 'ri-login-box-line' },
  { id: 'view_guests',         label: 'View Guest Info',         group: 'Bookings & Guests', icon: 'ri-group-line' },
  // Rooms
  { id: 'view_rooms',          label: 'View Room Status',        group: 'Rooms',             icon: 'ri-hotel-bed-line' },
  { id: 'manage_rooms',        label: 'Update Room Status',      group: 'Rooms',             icon: 'ri-edit-box-line' },
  { id: 'manage_housekeeping', label: 'Housekeeping Tasks',      group: 'Rooms',             icon: 'ri-brush-4-line' },
  { id: 'manage_maintenance',  label: 'Maintenance Issues',      group: 'Rooms',             icon: 'ri-tools-line' },
  // Restaurant
  { id: 'view_restaurant',     label: 'View Menu',               group: 'Restaurant',        icon: 'ri-menu-2-line' },
  { id: 'take_orders',         label: 'Take Orders',             group: 'Restaurant',        icon: 'ri-add-circle-line' },
  { id: 'manage_orders',       label: 'Manage Order Status',     group: 'Restaurant',        icon: 'ri-list-check-3' },
  // Inventory
  { id: 'view_inventory',      label: 'View Inventory',          group: 'Inventory',         icon: 'ri-archive-drawer-line' },
  { id: 'manage_inventory',    label: 'Restock Inventory',       group: 'Inventory',         icon: 'ri-add-box-line' },
  // Communication
  { id: 'view_messages',       label: 'View Messages',           group: 'Communication',     icon: 'ri-chat-3-line' },
  { id: 'send_messages',       label: 'Reply to Guests',         group: 'Communication',     icon: 'ri-send-plane-line' },
  // Management
  { id: 'view_staff',          label: 'View Staff List',         group: 'Management',        icon: 'ri-team-line' },
  { id: 'view_reports',        label: 'View Reports',            group: 'Management',        icon: 'ri-file-chart-line' },
  { id: 'view_payments',       label: 'View Payments',           group: 'Management',        icon: 'ri-money-rupee-circle-line' },
];

export interface StaffMember {
  id: string;
  propertyId: string;
  name: string;
  role: StaffRole;
  phone: string;
  email: string;
  shift: 'morning' | 'afternoon' | 'night' | 'full-day';
  joinedDate: string;
  status: 'active' | 'on-leave' | 'inactive';
  salary?: number;
  notes?: string;
  // Portal login credentials
  loginEmail?: string;
  loginPassword?: string;
  hasPortalAccess?: boolean;
  // Configurable feature permissions (overrides role defaults)
  permissions?: StaffFeature[];
}

export type MenuCategory = 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'beverages' | 'desserts' | 'specials';

export interface RestaurantMenuItem {
  id: string;
  propertyId: string;
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
  image?: string;
  isVeg: boolean;
  isAvailable: boolean;
  preparationTime?: number; // minutes
}

export interface RestaurantOrderItem {
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type RestaurantOrderStatus = 'pending' | 'preparing' | 'served' | 'billed' | 'cancelled';

export interface RestaurantOrder {
  id: string;
  propertyId: string;
  bookingId?: string;         // linked booking if guest order
  guestName: string;
  roomNumber?: string;
  items: RestaurantOrderItem[];
  totalAmount: number;
  status: RestaurantOrderStatus;
  addedToInvoice: boolean;
  notes?: string;
  orderedAt: string;
  servedAt?: string;
}

export type InventoryCategory = 'linen' | 'toiletries' | 'minibar' | 'cleaning' | 'kitchen' | 'maintenance' | 'stationery' | 'other';

export interface InventoryItem {
  id: string;
  propertyId: string;
  name: string;
  category: InventoryCategory;
  unit: string;               // "pieces", "kg", "liters", "packs"
  currentStock: number;
  minStockLevel: number;      // alert threshold
  costPerUnit: number;
  supplier?: string;
  lastRestocked?: string;
  notes?: string;
}

// ── Main HostData ──────────────────────────────────────────────────────────

export interface HostData {
  accounts: HostAccount[];
  properties: HostProperty[];
  bookings: HostBooking[];
  messages: HostMessage[];
  notifications: HostNotification[];
  blockedDates: BlockedDate[];
  reviews: HostReview[];
  promotions: Promotion[];
  roomTypes?: PropertyRoomType[];
  staff?: StaffMember[];
  restaurantMenuItems?: RestaurantMenuItem[];
  restaurantOrders?: RestaurantOrder[];
  inventoryItems?: InventoryItem[];
}
