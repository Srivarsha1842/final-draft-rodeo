import { env } from '../config/env';

// ─── Schema generators for SEO/AEO/GEO ───────────────────────────────────────

export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${env.SITE_URL}/#organization`,
  name: env.SITE_NAME,
  url: env.SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${env.SITE_URL}/logo.png`,
    width: 200,
    height: 60,
  },
  sameAs: [
    'https://www.instagram.com/triprodeo',
    'https://www.facebook.com/triprodeo',
    'https://twitter.com/triprodeo',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-XXXXXXXXXX',
    contactType: 'customer service',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi'],
  },
});

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${env.SITE_URL}/#website`,
  url: env.SITE_URL,
  name: env.SITE_NAME,
  description: env.SITE_DESCRIPTION,
  publisher: { '@id': `${env.SITE_URL}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${env.SITE_URL}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  inLanguage: 'en-IN',
});

export const lodgingBusinessSchema = (property: {
  id: string;
  name: string;
  description: string;
  city: string;
  state: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  type: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  '@id': `${env.SITE_URL}/property/${property.id}`,
  name: property.name,
  description: property.description,
  url: `${env.SITE_URL}/property/${property.id}`,
  image: property.images,
  address: {
    '@type': 'PostalAddress',
    addressLocality: property.city,
    addressRegion: property.state,
    addressCountry: property.country,
  },
  ...(property.latitude && property.longitude
    ? {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: property.latitude,
          longitude: property.longitude,
        },
      }
    : {}),
  aggregateRating:
    property.reviewCount > 0
      ? {
          '@type': 'AggregateRating',
          ratingValue: property.rating,
          reviewCount: property.reviewCount,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
  priceRange: `₹${property.pricePerNight.toLocaleString('en-IN')} per night`,
  amenityFeature: property.amenities.map((a) => ({
    '@type': 'LocationFeatureSpecification',
    name: a,
    value: true,
  })),
  starRating: {
    '@type': 'Rating',
    ratingValue: property.rating,
  },
});

export const faqSchema = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const howToSchema = (
  name: string,
  steps: { name: string; text: string; image?: string; url?: string }[]
) => ({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name,
  step: steps.map((s, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: s.name,
    text: s.text,
    ...(s.image ? { image: { '@type': 'ImageObject', url: s.image } } : {}),
    ...(s.url ? { url: s.url } : {}),
  })),
});

export const breadcrumbSchema = (crumbs: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: c.url,
  })),
});

export const speakableSchema = (selectors: string[]) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: selectors,
  },
});

export const reviewSchema = (
  propertyName: string,
  reviews: {
    guestName: string;
    rating: number;
    comment: string;
    date: Date;
  }[]
) =>
  reviews.map((r) => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'LodgingBusiness',
      name: propertyName,
    },
    author: { '@type': 'Person', name: r.guestName },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: r.rating,
      bestRating: 5,
    },
    reviewBody: r.comment,
    datePublished: r.date.toISOString().split('T')[0],
  }));
