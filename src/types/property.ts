export interface Property {
  id: string;
  name: string;
  location: string;
  fullAddress?: string;
  city: string;
  state: string;
  distanceKm: number;
  pricePerNight: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  tags: string[];
  amenities: string[];
  type: 'villa' | 'resort' | 'boutique' | 'treehouse' | 'beachfront' | string;
  verified: boolean;
  superhost: boolean;
  isExclusive?: boolean;
  scarcity?: string;
  hasDayPackage?: boolean;
  dayPackagePrice?: number;
  description: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
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
  addOns: {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
  }[];
}

export interface PropertyListResponse {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
