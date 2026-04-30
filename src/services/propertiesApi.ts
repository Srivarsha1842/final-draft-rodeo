import { apiFetch } from '@/lib/apiClient';
import { Property, PropertyListResponse } from '@/types/property';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop';

interface ApiProperty {
  id: string;
  name: string;
  location: string;
  fullAddress?: string;
  city?: string;
  state?: string;
  pricePerNight: number;
  originalPrice?: number | null;
  rating?: number;
  reviewCount?: number;
  images?: string[];
  tags?: string[];
  amenities?: string[];
  type?: string;
  verified?: boolean;
  superhost?: boolean;
  isExclusive?: boolean;
  scarcity?: string | null;
  dayPackage?: {
    enabled?: boolean;
    pricePerPerson?: number;
    activities?: string[];
  } | null;
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  host?: {
    name?: string;
    avatar?: string | null;
    joinedAt?: string;
    superhost?: boolean;
  };
  addOns?: Array<{ id: string; name: string; price: number; image?: string | null; description?: string | null }>;
}

interface ApiListResponse {
  properties: ApiProperty[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PropertyQuery {
  location?: string;
  type?: string;
  rating?: number;
  minPrice?: number;
  maxPrice?: number;
  minGuests?: number;
  amenities?: string[];
  tag?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

function buildQuery(params: PropertyQuery = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === '' || value === null) return;
    search.set(key, Array.isArray(value) ? value.join(',') : String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export function normalizeProperty(p: ApiProperty): Property {
  const dayPackage = p.dayPackage && typeof p.dayPackage === 'object' ? p.dayPackage : undefined;
  return {
    id: p.id,
    name: p.name,
    location: p.location,
    fullAddress: p.fullAddress,
    city: p.city ?? p.location,
    state: p.state ?? '',
    distanceKm: 10,
    pricePerNight: p.pricePerNight,
    originalPrice: p.originalPrice ?? undefined,
    rating: p.rating ?? 0,
    reviewCount: p.reviewCount ?? 0,
    images: p.images?.length ? p.images : [FALLBACK_IMAGE],
    tags: p.tags ?? [],
    amenities: p.amenities ?? [],
    type: (p.type ?? 'villa').toLowerCase(),
    verified: p.verified ?? false,
    superhost: p.superhost ?? false,
    isExclusive: p.isExclusive ?? false,
    scarcity: p.scarcity ?? undefined,
    hasDayPackage: dayPackage?.enabled === true,
    dayPackagePrice: dayPackage?.pricePerPerson,
    description: p.description ?? '',
    bedrooms: p.bedrooms ?? 1,
    bathrooms: p.bathrooms ?? 1,
    maxGuests: p.maxGuests ?? 2,
    categoryRatings: {
      cleanliness: p.rating ?? 4.5,
      communication: p.rating ?? 4.5,
      checkIn: p.rating ?? 4.5,
      accuracy: p.rating ?? 4.5,
      location: p.rating ?? 4.5,
      value: p.rating ?? 4.5,
    },
    host: {
      name: p.host?.name ?? 'Triprodeo Host',
      avatar: p.host?.avatar ?? '',
      joinedYear: p.host?.joinedAt ? new Date(p.host.joinedAt).getFullYear() : 2024,
      superhost: p.superhost ?? false,
    },
    addOns: (p.addOns ?? []).map((addOn) => ({
      id: addOn.id,
      name: addOn.name,
      price: addOn.price,
      image: addOn.image ?? '',
      description: addOn.description ?? '',
    })),
  };
}

function normalizeList(data: ApiListResponse): PropertyListResponse {
  return {
    ...data,
    properties: data.properties.map(normalizeProperty),
  };
}

export async function fetchProperties(params: PropertyQuery = {}): Promise<PropertyListResponse> {
  const data = await apiFetch<ApiListResponse>(`/properties${buildQuery(params)}`);
  return normalizeList(data);
}

export async function fetchPropertyLocations(): Promise<string[]> {
  return apiFetch<string[]>('/properties/locations');
}

export async function fetchExclusiveProperties(limit = 8): Promise<Property[]> {
  const data = await apiFetch<ApiProperty[]>(`/properties/exclusive${buildQuery({ limit })}`);
  return data.map(normalizeProperty);
}

export async function fetchPropertiesByTag(tag: string, limit = 8): Promise<Property[]> {
  const data = await apiFetch<ApiProperty[]>(`/properties/tag/${encodeURIComponent(tag)}${buildQuery({ limit })}`);
  return data.map(normalizeProperty);
}

export async function fetchPropertyTags(): Promise<string[]> {
  return apiFetch<string[]>('/properties/tags');
}
