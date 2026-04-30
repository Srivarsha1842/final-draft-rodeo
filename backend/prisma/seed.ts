import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Triprodeo database...');

  // ── Admin ──────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('triprodeo2025', 12);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@triprodeo.com' },
    update: {},
    create: { email: 'admin@triprodeo.com', password: adminPassword, name: 'Triprodeo Admin' },
  });
  console.log('✅ Admin created:', admin.email);

  // ── Hosts ──────────────────────────────────────────────────
  const host1Password = await bcrypt.hash('host1234', 12);
  const host2Password = await bcrypt.hash('host5678', 12);

  const host1 = await prisma.host.upsert({
    where: { email: 'ananya@triprodeo.com' },
    update: {},
    create: {
      email: 'ananya@triprodeo.com',
      password: host1Password,
      name: 'Ananya Krishnan',
      phone: '+91 98765 43210',
      package: 'PREMIUM',
      status: 'ACTIVE',
    },
  });

  const host2 = await prisma.host.upsert({
    where: { email: 'vikram@triprodeo.com' },
    update: {},
    create: {
      email: 'vikram@triprodeo.com',
      password: host2Password,
      name: 'Vikram Sinha',
      phone: '+91 98765 12345',
      package: 'STANDARD',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Hosts created:', host1.email, host2.email);

  // ── Properties ─────────────────────────────────────────────
  const prop1 = await prisma.property.upsert({
    where: { id: 'prop-azure-cliff-villa' },
    update: {},
    create: {
      id: 'prop-azure-cliff-villa',
      hostId: host1.id,
      name: 'Azure Cliff Villa',
      description: 'Perched on the cliffs of North Goa, this stunning villa offers panoramic sea views and luxury amenities. Perfect for couples and families seeking an unforgettable coastal retreat.',
      location: 'North Goa, Goa',
      city: 'Goa',
      state: 'Goa',
      country: 'India',
      latitude: 15.4989,
      longitude: 73.8278,
      pricePerNight: 18999,
      originalPrice: 24000,
      type: 'VILLA',
      status: 'ACTIVE',
      verified: true,
      superhost: true,
      bedrooms: 4,
      bathrooms: 3,
      maxGuests: 8,
      images: [
        'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=800',
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      ],
      tags: ['Sea View', 'Private Pool', 'Superhost', 'Verified'],
      amenities: ['WiFi', 'Pool', 'AC', 'Kitchen', 'Parking', 'Beach Access', 'BBQ', 'Garden'],
      rating: 4.9,
      reviewCount: 127,
      scarcity: 'Only 2 dates left this month',
      housePolicies: {
        checkIn: '2:00 PM', checkOut: '11:00 AM',
        cancellation: 'Free cancellation up to 48 hours before check-in',
        smoking: false, pets: false, parties: false,
        quietHours: '10 PM – 8 AM',
      },
    },
  });

  const prop2 = await prisma.property.upsert({
    where: { id: 'prop-himalayan-nest' },
    update: {},
    create: {
      id: 'prop-himalayan-nest',
      hostId: host1.id,
      name: 'The Himalayan Nest',
      description: 'Nestled in the heart of Manali, this cozy mountain cottage offers breathtaking views of snow-capped peaks. Ideal for adventure seekers and nature lovers.',
      location: 'Manali, Himachal Pradesh',
      city: 'Manali',
      state: 'Himachal Pradesh',
      country: 'India',
      latitude: 32.2396,
      longitude: 77.1887,
      pricePerNight: 12500,
      originalPrice: 16000,
      type: 'COTTAGE',
      status: 'ACTIVE',
      verified: true,
      superhost: false,
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
      tags: ['Mountain View', 'Fireplace', 'Adventure'],
      amenities: ['WiFi', 'Fireplace', 'Kitchen', 'Parking', 'Heater', 'Trekking Access'],
      rating: 4.7,
      reviewCount: 89,
      scarcity: null,
      housePolicies: { checkIn: '1:00 PM', checkOut: '11:00 AM', cancellation: 'Moderate' },
    },
  });

  const prop3 = await prisma.property.upsert({
    where: { id: 'prop-ranthambore-lodge' },
    update: {},
    create: {
      id: 'prop-ranthambore-lodge',
      hostId: host2.id,
      name: 'Ranthambore Jungle Lodge',
      description: 'An exclusive wildlife retreat at the gates of Ranthambore National Park. Experience luxury in the wild with expert-guided safari experiences.',
      location: 'Ranthambore, Rajasthan',
      city: 'Sawai Madhopur',
      state: 'Rajasthan',
      country: 'India',
      latitude: 26.0173,
      longitude: 76.5026,
      pricePerNight: 22000,
      originalPrice: 28000,
      type: 'RESORT',
      status: 'ACTIVE',
      verified: true,
      superhost: true,
      bedrooms: 6,
      bathrooms: 5,
      maxGuests: 12,
      images: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800'],
      tags: ['Wildlife', 'Safari', 'Luxury', 'Superhost'],
      amenities: ['WiFi', 'Pool', 'Restaurant', 'Spa', 'Safari', 'AC', 'Bar'],
      rating: 4.8,
      reviewCount: 203,
      scarcity: 'Booking fast for this season',
      housePolicies: { checkIn: '3:00 PM', checkOut: '12:00 PM', cancellation: 'Strict' },
    },
  });

  await prisma.property.upsert({
    where: { id: 'prop-alleppey-houseboat' },
    update: {},
    create: {
      id: 'prop-alleppey-houseboat',
      hostId: host2.id,
      name: 'Alleppey Houseboat Retreat',
      description: 'Drift through Kerala\'s enchanting backwaters on this luxury houseboat. Experience the serenity of lotus-covered lagoons and traditional village life.',
      location: 'Alleppey, Kerala',
      city: 'Alleppey',
      state: 'Kerala',
      country: 'India',
      latitude: 9.4981,
      longitude: 76.3388,
      pricePerNight: 15000,
      type: 'HOUSEBOAT',
      status: 'ACTIVE',
      verified: true,
      superhost: false,
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      images: ['https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800'],
      tags: ['Backwaters', 'Unique Stay', 'Romantic'],
      amenities: ['AC', 'Kitchen', 'Chef', 'Sunset Deck', 'Fishing'],
      rating: 4.6,
      reviewCount: 67,
      scarcity: null,
      housePolicies: { checkIn: '12:00 PM', checkOut: '10:00 AM', cancellation: 'Free up to 24hrs' },
    },
  });

  await prisma.property.upsert({
    where: { id: 'prop-coorg-estate' },
    update: {},
    create: {
      id: 'prop-coorg-estate',
      hostId: host1.id,
      name: 'Coorg Forest Estate',
      description: 'A working coffee and spice estate in the heart of Scotland of India. Wake up to misty mornings, plantation walks, and fresh-brewed estate coffee.',
      location: 'Madikeri, Coorg',
      city: 'Madikeri',
      state: 'Karnataka',
      country: 'India',
      latitude: 12.4244,
      longitude: 75.7382,
      pricePerNight: 9999,
      type: 'FARMSTAY',
      status: 'ACTIVE',
      verified: true,
      superhost: false,
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      images: ['https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800'],
      tags: ['Coffee Estate', 'Nature', 'Offbeat'],
      amenities: ['WiFi', 'Kitchen', 'Garden', 'Plantation Walk', 'Parking'],
      rating: 4.5,
      reviewCount: 45,
      scarcity: null,
      housePolicies: { checkIn: '2:00 PM', checkOut: '11:00 AM', cancellation: 'Flexible' },
    },
  });

  await prisma.property.upsert({
    where: { id: 'prop-udaipur-palace' },
    update: {},
    create: {
      id: 'prop-udaipur-palace',
      hostId: host2.id,
      name: 'Udaipur Lake Palace Suite',
      description: 'An opulent heritage suite overlooking the shimmering Lake Pichola. Experience true Rajputana grandeur with personalised butler service and royal dining.',
      location: 'Udaipur, Rajasthan',
      city: 'Udaipur',
      state: 'Rajasthan',
      country: 'India',
      latitude: 24.5854,
      longitude: 73.6836,
      pricePerNight: 32000,
      originalPrice: 42000,
      type: 'HERITAGE',
      status: 'ACTIVE',
      verified: true,
      superhost: true,
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      images: ['https://images.unsplash.com/photo-1599661046827-dacff0596b54?w=800'],
      tags: ['Heritage', 'Lake View', 'Royal', 'Butler Service'],
      amenities: ['WiFi', 'AC', 'Butler', 'Spa', 'Restaurant', 'Boat', 'Pool'],
      rating: 5.0,
      reviewCount: 156,
      scarcity: 'Last 1 room for this period',
      housePolicies: { checkIn: '3:00 PM', checkOut: '12:00 PM', cancellation: 'Strict 72hrs' },
    },
  });
  console.log('✅ Properties seeded: 6');

  // ── Reviews ────────────────────────────────────────────────
  const reviewsData = [
    { propertyId: prop1.id, hostId: host1.id, guestName: 'Priya Sharma', guestLocation: 'Mumbai', rating: 5, comment: 'Absolutely stunning villa! The sea views were breathtaking and the pool was perfect. Ananya was an incredible host.', cleanlinessRating: 5, communicationRating: 5, locationRating: 5, valueRating: 4.5 },
    { propertyId: prop1.id, hostId: host1.id, guestName: 'Rahul Mehta', guestLocation: 'Delhi', rating: 5, comment: 'One of the best stays of my life. The cliff view at sunset was magical. Highly recommend!', cleanlinessRating: 5, communicationRating: 5, locationRating: 5, valueRating: 5 },
    { propertyId: prop2.id, hostId: host1.id, guestName: 'Sneha Patel', guestLocation: 'Ahmedabad', rating: 4, comment: 'Beautiful location and cozy cottage. The mountains were spectacular!', cleanlinessRating: 4.5, communicationRating: 4, locationRating: 5, valueRating: 4 },
    { propertyId: prop3.id, hostId: host2.id, guestName: 'Arjun Kapoor', guestLocation: 'Bangalore', rating: 5, comment: 'The safari experience was unforgettable. We saw 3 tigers! The lodge itself is luxurious.', cleanlinessRating: 5, communicationRating: 5, locationRating: 5, valueRating: 4.5 },
  ];

  for (const r of reviewsData) {
    await prisma.review.create({ data: { ...r, date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) } });
  }
  console.log('✅ Reviews seeded');

  // ── Experiences ────────────────────────────────────────────
  const experiences = [
    { title: 'Sunset Sailing in Goa', location: 'Goa', price: 2500, duration: '3 hours', rating: 4.8, category: 'Water Sports', image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800', tags: ['Sailing', 'Sunset', 'Goa'] },
    { title: 'Himalayan Trek to Triund', location: 'Dharamshala', price: 1800, duration: '1 day', rating: 4.9, category: 'Trekking', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', tags: ['Trek', 'Mountains', 'Adventure'] },
    { title: 'Kerala Cooking Class', location: 'Kochi', price: 1200, duration: '4 hours', rating: 4.7, category: 'Culinary', image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800', tags: ['Cooking', 'Culture', 'Food'] },
    { title: 'Ranthambore Safari', location: 'Rajasthan', price: 3500, duration: '5 hours', rating: 4.9, category: 'Wildlife', image: 'https://images.unsplash.com/photo-1551009175-8a68da93d5f9?w=800', tags: ['Safari', 'Tiger', 'Wildlife'] },
  ];
  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }
  console.log('✅ Experiences seeded');

  // ── Trending Destinations ──────────────────────────────────
  const destinations = [
    { name: 'Goa', tagline: 'Sun, Sand & Serenity', country: 'India', properties: 245, startingPrice: 8999, badge: '🔥 Trending', tags: ['Beach', 'Nightlife', 'Villas'] },
    { name: 'Manali', tagline: 'Where the Mountains Meet the Sky', country: 'India', properties: 178, startingPrice: 5999, badge: '❄️ Adventure', tags: ['Snow', 'Trek', 'Nature'] },
    { name: 'Udaipur', tagline: 'The City of Lakes & Palaces', country: 'India', properties: 134, startingPrice: 12000, badge: '👑 Royal', tags: ['Heritage', 'Lake', 'Romance'] },
    { name: 'Coorg', tagline: 'Scotland of India', country: 'India', properties: 89, startingPrice: 6999, badge: '☕ Offbeat', tags: ['Coffee', 'Nature', 'Misty'] },
    { name: 'Kerala', tagline: 'God\'s Own Country', country: 'India', properties: 312, startingPrice: 7999, badge: '🌴 Nature', tags: ['Backwaters', 'Beaches', 'Culture'] },
    { name: 'Rajasthan', tagline: 'The Land of Maharajas', country: 'India', properties: 267, startingPrice: 9999, badge: '🏰 Heritage', tags: ['Forts', 'Desert', 'Royal'] },
  ];
  for (const dest of destinations) {
    await prisma.trendingDestination.create({ data: dest });
  }
  console.log('✅ Destinations seeded');

  // ── CMS Pages ──────────────────────────────────────────────
  const cmsPages = [
    {
      slug: 'home',
      name: 'Homepage',
      content: { hero: true, featured: true },
      status: 'PUBLISHED' as const,
      publishedAt: new Date(),
      seoTitle: 'Triprodeo — India\'s Best Luxury Villa & Resort Stays',
      seoDescription: 'Discover and book India\'s finest villas, boutique resorts, and heritage stays. Curated luxury properties across Goa, Rajasthan, Kerala, Himachal & more.',
      seoKeywords: ['luxury villas india', 'resort booking india', 'boutique hotels', 'holiday rentals', 'goa villa stay', 'rajasthan heritage hotel'],
      canonicalUrl: 'https://triprodeo.com/',
      robots: 'index, follow',
      ogTitle: 'Triprodeo — Luxury Villas & Resorts in India',
      ogDescription: 'Book India\'s most stunning villas, resorts & boutique stays. Verified properties, superhost experiences, instant booking.',
      ogImage: 'https://triprodeo.com/og-home.jpg',
      ogType: 'website',
      ogLocale: 'en_IN',
      twitterCard: 'summary_large_image',
      twitterSite: '@triprodeo',
      entityName: 'Triprodeo',
      entityType: 'Organization',
      entitySameAs: ['https://www.wikidata.org/wiki/Q123456', 'https://www.instagram.com/triprodeo'],
      geoCountry: 'IN',
      geoRegion: 'IN',
      topicClusters: ['luxury travel india', 'villa booking', 'resort holiday', 'boutique stays', 'heritage hotels india'],
      pillarContent: true,
      contentSummary: 'Triprodeo is India\'s premier luxury travel platform for booking villas, boutique resorts, and heritage stays. Properties span Goa, Rajasthan, Kerala, Himachal Pradesh, Karnataka and more. All properties are verified and rated.',
      keyFacts: [
        { label: 'Properties Listed', value: '500+' },
        { label: 'Destinations', value: '50+ across India' },
        { label: 'Reviews', value: '10,000+' },
        { label: 'Founded', value: '2023' },
      ],
      targetQuestions: ['Where to book luxury villas in India?', 'Best boutique resorts in Goa?', 'Top heritage hotels Rajasthan?', 'How to book a houseboat in Kerala?'],
      breadcrumbs: [{ name: 'Home', url: 'https://triprodeo.com/' }],
      cta: { text: 'Explore Properties', url: '/search', type: 'primary' },
      faqItems: [
        { question: 'What is Triprodeo?', answer: 'Triprodeo is India\'s premier luxury villa and resort booking platform, offering curated properties across 50+ destinations.' },
        { question: 'Are properties on Triprodeo verified?', answer: 'Yes, all properties undergo a thorough verification process including photo verification, amenity checks, and host background verification.' },
        { question: 'What is the cancellation policy?', answer: 'Cancellation policies vary by property. Most properties offer free cancellation up to 48-72 hours before check-in.' },
        { question: 'Is there a booking fee?', answer: 'Triprodeo charges a 10% platform fee on all bookings, which covers secure payments, customer support, and host verification.' },
      ],
      speakableSelectors: ['.hero-title', '.hero-subtitle', '#why-triprodeo'],
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      slug: 'about',
      name: 'About Us',
      content: {},
      status: 'PUBLISHED' as const,
      publishedAt: new Date(),
      seoTitle: 'About Triprodeo — India\'s Luxury Travel Platform',
      seoDescription: 'Learn about Triprodeo\'s mission to democratise luxury travel in India. Meet our founders, our story, and our commitment to verified, curated stays.',
      seoKeywords: ['about triprodeo', 'luxury travel company india', 'villa booking platform'],
      canonicalUrl: 'https://triprodeo.com/about',
      robots: 'index, follow',
      ogTitle: 'About Triprodeo',
      ogType: 'website',
      breadcrumbs: [{ name: 'Home', url: 'https://triprodeo.com/' }, { name: 'About', url: 'https://triprodeo.com/about' }],
      changefreq: 'monthly',
      priority: 0.6,
    },
    {
      slug: 'search',
      name: 'Search Properties',
      content: {},
      status: 'PUBLISHED' as const,
      publishedAt: new Date(),
      seoTitle: 'Search Luxury Villas & Resorts in India | Triprodeo',
      seoDescription: 'Search and filter 500+ luxury villas, boutique resorts and heritage stays across India. Filter by location, price, amenities and dates.',
      seoKeywords: ['search villas india', 'find resort india', 'luxury property search'],
      canonicalUrl: 'https://triprodeo.com/search',
      robots: 'index, follow',
      breadcrumbs: [{ name: 'Home', url: 'https://triprodeo.com/' }, { name: 'Search', url: 'https://triprodeo.com/search' }],
      changefreq: 'daily',
      priority: 0.9,
    },
  ];

  for (const page of cmsPages) {
    await prisma.cmsPage.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    });
  }
  console.log('✅ CMS Pages seeded');

  // ── Blog Posts (stored as CmsPage with slug prefix `blog/`) ────────────────
  const blogPosts = [
    {
      slug: 'blog/best-luxury-villas-goa-2026',
      name: 'The 10 Best Luxury Villas in Goa for 2026',
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2026-01-08'),
      content: {
        body: `<h2>Introduction</h2><p>Goa has quietly transformed into India's luxury villa capital. In 2026, travellers are skipping hotels entirely in favour of private villas with chefs, pools, and curated experiences. Here are our ten favourites.</p><h2>1. Azure Cliff Villa, North Goa</h2><p>Perched on a 30-metre cliff over Vagator, this four-bedroom villa offers 180° sea views, an infinity pool, and a private path to a secluded cove.</p><h2>2. The Palm Sanctuary, Assagao</h2><p>A restored Portuguese mansion surrounded by mango groves. Five suites, a pool bar, and the best sourdough breakfast in Goa.</p><h2>3. Morjim Moon House</h2><p>Bohemian-chic beach villa with a 15-metre pool and direct beach access — perfect for turtle-nesting season (Nov–Mar).</p><h2>4. Candolim Heritage Estate</h2><p>Seven-bedroom heritage bungalow inside walled gardens. Full kitchen staff included.</p><h2>5. Siolim River House</h2><p>Modernist river-front villa with a private jetty and kayaks.</p><h2>6. Arambol Forest Villa</h2><p>Tropical forest hideaway with outdoor showers and a treehouse dining deck.</p><h2>7. Anjuna Sunset Lodge</h2><p>Retro-70s villa restored with Italian marble and Scandinavian furniture.</p><h2>8. Cavelossim Beachfront Villa</h2><p>South Goa serenity — three bedrooms, private stretch of sand, no neighbours.</p><h2>9. Panjim Rossio House</h2><p>A boutique townhouse in Goa's old Latin quarter — walk everywhere.</p><h2>10. Chapora Fort View</h2><p>Hilltop villa with panoramic views of the Chapora river and old fort.</p><h2>How to book</h2><p>All ten villas are verified and available on Triprodeo with instant confirmation. Free cancellation up to 72 hours.</p>`,
        excerpt: 'From cliffside sea-view retreats in North Goa to jungle-hidden estates in the south — our editors pick the ten most stunning luxury villas you can book right now.',
        coverImage: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1600',
        coverImageAlt: 'Luxury clifftop villa at sunset with infinity pool overlooking the Arabian Sea in North Goa',
        author: 'Ananya Krishnan',
        authorBio: 'Travel editor and founder of Triprodeo. Has stayed in over 300 villas across India.',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        categories: ['Destinations', 'Luxury Stays'],
        tags: ['Goa', 'Villas', 'Luxury', 'Beach', '2026'],
        articleSection: 'Destinations',
        wordCount: 420,
      },
      seoTitle: 'Best Luxury Villas in Goa 2026 — 10 Editor Picks | Triprodeo',
      seoDescription: 'Our editors pick the 10 best luxury villas in Goa for 2026 — cliffside sea views, private pools, chefs & verified hosts. Book with free cancellation on Triprodeo.',
      seoKeywords: ['luxury villas goa', 'best villas goa 2026', 'goa villa booking', 'private villa goa', 'sea view villa goa', 'north goa luxury stay'],
      canonicalUrl: 'https://triprodeo.com/blog/best-luxury-villas-goa-2026',
      robots: 'index, follow',
      priority: 0.9,
      changefreq: 'monthly',
      ogTitle: 'The 10 Best Luxury Villas in Goa for 2026',
      ogDescription: 'From cliffside sea-view retreats to jungle estates — the ten most stunning villas you can book in Goa right now.',
      ogImage: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1600',
      ogImageAlt: 'Luxury clifftop villa at sunset with infinity pool overlooking the Arabian Sea in North Goa',
      ogType: 'article',
      ogLocale: 'en_IN',
      twitterCard: 'summary_large_image',
      twitterTitle: 'The 10 Best Luxury Villas in Goa for 2026',
      twitterDescription: 'Editor picks — cliffside sea-view retreats to jungle estates. Verified & instant-bookable on Triprodeo.',
      twitterImage: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1600',
      twitterSite: '@triprodeo',
      twitterCreator: '@ananya_triprodeo',
      readingTimeMin: 6,
      contentType: 'listicle',
      faqItems: [
        { question: 'What is the best time to book a villa in Goa?', answer: 'The peak season runs November through February. For the best rates and availability, book 3–4 months in advance. Shoulder months (September, March) offer excellent value.' },
        { question: 'Do Goa villas include a chef?', answer: 'Most premium villas on Triprodeo include a chef on request. Costs typically range from ₹1,500–₹3,500 per day depending on menu.' },
        { question: 'Are Goa villas safe for solo female travellers?', answer: 'Yes — all villas listed on Triprodeo are verified with host-ID checks. Many offer 24/7 concierge and on-site staff.' },
        { question: 'What is the cancellation policy for Goa villas?', answer: 'Most villas on our list offer free cancellation up to 72 hours before check-in, though policies vary by property.' },
      ],
      speakableSelectors: ['h2', '.post-intro', '.faq-item'],
      targetQuestions: ['What are the best luxury villas in Goa?', 'Best private villas in Goa for 2026?', 'Which villa in Goa has the best sea view?'],
      definedTerms: [
        { name: 'Superhost', description: 'A Triprodeo status awarded to hosts with 4.8+ ratings, 95%+ response rate, and zero cancellations in the past 12 months.' },
      ],
      geoLatitude: 15.5937,
      geoLongitude: 73.8142,
      geoRegion: 'IN-GA',
      geoCountry: 'IN',
      geoPlaceName: 'Goa, India',
      entityName: 'Triprodeo Editorial',
      entityType: 'NewsMediaOrganization',
      entitySameAs: ['https://www.instagram.com/triprodeo', 'https://twitter.com/triprodeo'],
      topicClusters: ['luxury villa goa', 'goa travel guide', 'sea view villa india'],
      pillarContent: true,
      contentSummary: 'Triprodeo editors pick the 10 best luxury villas in Goa for 2026, including Azure Cliff Villa (North Goa), The Palm Sanctuary (Assagao), Morjim Moon House, Candolim Heritage Estate, Siolim River House, Arambol Forest Villa, Anjuna Sunset Lodge, Cavelossim Beachfront Villa, Panjim Rossio House, and Chapora Fort View. All ten are verified, instant-bookable, with free cancellation up to 72 hours.',
      keyFacts: [
        { label: 'Villas featured', value: '10 editor-verified' },
        { label: 'Starting price', value: '₹8,999 / night' },
        { label: 'Destinations', value: 'North & South Goa' },
        { label: 'Free cancellation', value: 'Up to 72 hours' },
      ],
      breadcrumbs: [
        { name: 'Home', url: 'https://triprodeo.com/' },
        { name: 'Blog', url: 'https://triprodeo.com/blog' },
        { name: 'Best Luxury Villas in Goa 2026', url: 'https://triprodeo.com/blog/best-luxury-villas-goa-2026' },
      ],
      internalLinks: [
        { anchor: 'book Azure Cliff Villa', url: '/property/prop-azure-cliff-villa' },
        { anchor: 'see all Goa properties', url: '/search?location=Goa' },
      ],
      relatedPages: ['blog/goa-houseboat-weekend', 'blog/rajasthan-heritage-hotels-guide'],
      cta: { text: 'Browse Goa villas', url: '/search?location=Goa', type: 'primary' },
    },
    {
      slug: 'blog/rajasthan-heritage-hotels-guide',
      name: 'A First-Timer\'s Guide to Rajasthan Heritage Hotels',
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2025-12-14'),
      content: {
        body: `<h2>Why heritage hotels?</h2><p>Rajasthan's heritage hotels are the real thing — former royal residences converted (often by the original families) into guesthouses. Staying in one is half cultural immersion, half luxury retreat.</p><h2>Types of heritage properties</h2><ul><li><strong>Palaces</strong> — the grandest. Think Udaipur's Taj Lake Palace, Jaipur's Rambagh.</li><li><strong>Forts</strong> — hilltop, often remote. Neemrana, Deogarh Mahal.</li><li><strong>Havelis</strong> — merchant townhouses with painted walls and courtyards. Jaisalmer & Shekhawati.</li><li><strong>Zenanas</strong> — women's quarters converted to intimate boutique stays.</li></ul><h2>What to expect</h2><p>Air-conditioning, Wi-Fi and modern plumbing are now standard. But you'll also get antique furniture, hand-painted ceilings, peacocks in the courtyard, and staff who've worked there for three generations.</p><h2>Our five favourites</h2><p>1. Udaipur Lake Palace Suite · 2. Deogarh Mahal · 3. Rawla Narlai · 4. Ahilya Fort (Maheshwar) · 5. Samode Haveli, Jaipur.</p><h2>When to go</h2><p>October through March. Summer (April–June) is brutal — temperatures exceed 45°C.</p>`,
        excerpt: 'Forts, palaces and havelis — how to pick the right heritage hotel in Rajasthan, what to expect, and the five stays we return to year after year.',
        coverImage: 'https://images.unsplash.com/photo-1599661046827-dacff0596b54?w=1600',
        coverImageAlt: 'Heritage palace suite overlooking Lake Pichola in Udaipur with ornate Rajput interiors',
        author: 'Vikram Sinha',
        authorBio: 'Host of six heritage properties across Rajasthan. 20+ years in heritage hospitality.',
        categories: ['Destinations', 'Heritage'],
        tags: ['Rajasthan', 'Heritage', 'Palace', 'Udaipur', 'Jaipur'],
        articleSection: 'Heritage',
        wordCount: 280,
      },
      seoTitle: 'Rajasthan Heritage Hotels Guide — 5 Editor Picks | Triprodeo',
      seoDescription: 'A first-timer\'s guide to Rajasthan\'s heritage hotels: palaces, forts & havelis. Picks for Udaipur, Jaipur, Jaisalmer & beyond. Book verified stays on Triprodeo.',
      seoKeywords: ['rajasthan heritage hotels', 'udaipur palace stay', 'jaipur heritage hotel', 'rajasthan luxury travel', 'heritage haveli stay'],
      canonicalUrl: 'https://triprodeo.com/blog/rajasthan-heritage-hotels-guide',
      robots: 'index, follow',
      priority: 0.8,
      changefreq: 'monthly',
      ogTitle: 'A First-Timer\'s Guide to Rajasthan Heritage Hotels',
      ogDescription: 'Palaces, forts & havelis — how to pick the right heritage stay in Rajasthan.',
      ogImage: 'https://images.unsplash.com/photo-1599661046827-dacff0596b54?w=1600',
      ogImageAlt: 'Heritage palace suite overlooking Lake Pichola in Udaipur',
      ogType: 'article',
      ogLocale: 'en_IN',
      twitterCard: 'summary_large_image',
      twitterSite: '@triprodeo',
      readingTimeMin: 4,
      contentType: 'guide',
      faqItems: [
        { question: 'When is the best time to visit Rajasthan?', answer: 'October through March offers pleasant daytime temperatures (15–28°C). Avoid April–June when temperatures frequently exceed 45°C.' },
        { question: 'Are Rajasthan heritage hotels expensive?', answer: 'They range widely — from ₹6,000/night for boutique havelis to ₹80,000+ for iconic palace suites. Many mid-range options exist between ₹12,000–25,000.' },
      ],
      speakableSelectors: ['h2', '.post-intro'],
      targetQuestions: ['What are the best heritage hotels in Rajasthan?', 'Is it safe to stay in an old haveli?', 'When should I visit Rajasthan?'],
      geoLatitude: 26.9124,
      geoLongitude: 75.7873,
      geoRegion: 'IN-RJ',
      geoCountry: 'IN',
      geoPlaceName: 'Rajasthan, India',
      entityName: 'Triprodeo Editorial',
      entityType: 'NewsMediaOrganization',
      topicClusters: ['rajasthan heritage travel', 'palace hotels india', 'luxury india travel'],
      pillarContent: false,
      contentSummary: 'A guide to Rajasthan heritage hotels covering palaces, forts, havelis and zenanas. Includes five editor picks: Udaipur Lake Palace Suite, Deogarh Mahal, Rawla Narlai, Ahilya Fort (Maheshwar), and Samode Haveli (Jaipur). Best visited October to March.',
      keyFacts: [
        { label: 'Categories covered', value: 'Palaces, Forts, Havelis, Zenanas' },
        { label: 'Editor picks', value: '5 properties' },
        { label: 'Best season', value: 'October – March' },
      ],
      breadcrumbs: [
        { name: 'Home', url: 'https://triprodeo.com/' },
        { name: 'Blog', url: 'https://triprodeo.com/blog' },
        { name: 'Rajasthan Heritage Hotels Guide', url: 'https://triprodeo.com/blog/rajasthan-heritage-hotels-guide' },
      ],
      internalLinks: [
        { anchor: 'Udaipur Lake Palace Suite', url: '/property/prop-udaipur-palace' },
        { anchor: 'Ranthambore Jungle Lodge', url: '/property/prop-ranthambore-lodge' },
      ],
      relatedPages: ['blog/best-luxury-villas-goa-2026'],
      cta: { text: 'Explore Rajasthan stays', url: '/search?location=Rajasthan', type: 'primary' },
    },
    {
      slug: 'blog/goa-houseboat-weekend',
      name: 'How to Plan a Kerala Houseboat Weekend from Goa',
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2025-11-20'),
      content: {
        body: `<h2>The route</h2><p>Fly Goa (GOI) → Kochi (COK) in 1h 15m. Drive Kochi → Alleppey in 90 minutes. Board your houseboat by 12 noon on day one.</p><h2>Day 1</h2><p>Board at Punnamada jetty. Cruise through Vembanad Lake. Lunch of karimeen pollichathu on deck. Evening moor at a rice paddy.</p><h2>Day 2</h2><p>Village walk at sunrise. Canoe into narrow canals inaccessible by houseboat. Toddy tapping demo. Sunset at Pathiramanal Island.</p><h2>Day 3</h2><p>Final breakfast, disembark by 9am, drive to Kochi for an evening flight home.</p><h2>Budget</h2><p>Expect ₹18,000–32,000 per night for a premium two-bedroom houseboat with chef, inclusive of all meals.</p>`,
        excerpt: 'A practical three-day itinerary for escaping Goa to Alleppey\'s backwaters — flights, boats, what to pack, and how much it costs.',
        coverImage: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1600',
        coverImageAlt: 'Traditional Kerala houseboat drifting through palm-lined Alleppey backwaters at sunset',
        author: 'Triprodeo Editorial',
        categories: ['Itineraries', 'Kerala'],
        tags: ['Kerala', 'Houseboat', 'Alleppey', 'Weekend', 'Itinerary'],
        articleSection: 'Itineraries',
        wordCount: 190,
      },
      seoTitle: 'Kerala Houseboat Weekend from Goa — 3-Day Itinerary | Triprodeo',
      seoDescription: 'Plan a 3-day Kerala houseboat weekend from Goa — flights, routes, boat options, budget & itinerary. Book a verified Alleppey houseboat on Triprodeo.',
      seoKeywords: ['kerala houseboat weekend', 'alleppey houseboat itinerary', 'goa to kerala weekend', 'backwater cruise kerala'],
      canonicalUrl: 'https://triprodeo.com/blog/goa-houseboat-weekend',
      robots: 'index, follow',
      priority: 0.7,
      changefreq: 'monthly',
      ogTitle: 'How to Plan a Kerala Houseboat Weekend from Goa',
      ogDescription: 'A three-day itinerary for escaping Goa to Alleppey\'s backwaters.',
      ogImage: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1600',
      ogImageAlt: 'Traditional Kerala houseboat drifting through Alleppey backwaters at sunset',
      ogType: 'article',
      ogLocale: 'en_IN',
      twitterCard: 'summary_large_image',
      twitterSite: '@triprodeo',
      readingTimeMin: 3,
      contentType: 'guide',
      howToSteps: [
        { name: 'Book flights Goa → Kochi', text: 'Morning flights on IndiGo or Air India. 1h 15m.' },
        { name: 'Arrange Kochi → Alleppey transfer', text: '90-minute drive. Pre-book an AC car via your houseboat operator.' },
        { name: 'Board houseboat at noon', text: 'Check-in at Punnamada jetty in Alleppey. Lunch served onboard.' },
        { name: 'Cruise Vembanad & villages', text: 'Two full days of cruising, canoeing and village walks.' },
        { name: 'Disembark & fly home', text: 'Disembark by 9am on day three. Evening flight Kochi → Goa.' },
      ],
      faqItems: [
        { question: 'How much does a Kerala houseboat cost?', answer: 'Premium two-bedroom houseboats range ₹18,000–32,000 per night inclusive of all meals, chef and fuel.' },
        { question: 'Do houseboats have AC?', answer: 'Bedrooms are AC from 9pm–6am (when the generator runs). Living areas are open-air.' },
      ],
      speakableSelectors: ['h2', '.post-intro'],
      targetQuestions: ['How to plan a Kerala houseboat weekend?', 'Cost of a Kerala houseboat?', 'Goa to Alleppey distance?'],
      geoLatitude: 9.4981,
      geoLongitude: 76.3388,
      geoRegion: 'IN-KL',
      geoCountry: 'IN',
      geoPlaceName: 'Alleppey, Kerala',
      entityName: 'Triprodeo Editorial',
      entityType: 'NewsMediaOrganization',
      topicClusters: ['kerala backwaters', 'india weekend getaway', 'houseboat stay'],
      pillarContent: false,
      contentSummary: 'A three-day itinerary covering flights Goa to Kochi, Kochi to Alleppey transfer, boarding a premium two-bedroom houseboat with chef, cruising Vembanad Lake, village walks, canoeing, and return. Budget ₹18,000–32,000 per night inclusive.',
      keyFacts: [
        { label: 'Trip length', value: '3 days, 2 nights' },
        { label: 'Budget', value: '₹18,000–32,000 / night' },
        { label: 'Flight time GOI → COK', value: '1h 15m' },
      ],
      breadcrumbs: [
        { name: 'Home', url: 'https://triprodeo.com/' },
        { name: 'Blog', url: 'https://triprodeo.com/blog' },
        { name: 'Kerala Houseboat Weekend', url: 'https://triprodeo.com/blog/goa-houseboat-weekend' },
      ],
      internalLinks: [
        { anchor: 'Alleppey Houseboat Retreat', url: '/property/prop-alleppey-houseboat' },
      ],
      relatedPages: ['blog/best-luxury-villas-goa-2026'],
      cta: { text: 'Book an Alleppey houseboat', url: '/property/prop-alleppey-houseboat', type: 'primary' },
    },
  ];

  for (const post of blogPosts) {
    await prisma.cmsPage.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }
  console.log('✅ Blog Posts seeded (as CmsPage rows with slug prefix blog/)');

  // ── Notifications for Host ─────────────────────────────────
  await prisma.notification.createMany({
    data: [
      { hostId: host1.id, type: 'SYSTEM', title: 'Welcome to Triprodeo!', content: 'Your host account has been created. Start adding properties to receive bookings.', actionUrl: '/host-portal', actionLabel: 'Go to Dashboard' },
      { hostId: host1.id, type: 'BOOKING', title: 'New Booking Alert', content: 'Priya Sharma has booked Azure Cliff Villa for 3 nights. Check-in: Dec 25.', actionUrl: '/host-portal?section=bookings', actionLabel: 'View Booking' },
      { hostId: host2.id, type: 'SYSTEM', title: 'Welcome to Triprodeo!', content: 'Your host account has been created. Get started by adding your first property.', actionUrl: '/host-portal', actionLabel: 'Add Property' },
    ],
  });
  console.log('✅ Notifications seeded');

  console.log('\n🎉 Database seeded successfully!\n');
  console.log('📧 Admin login:    admin@triprodeo.com / triprodeo2025');
  console.log('📧 Host 1 login:   ananya@triprodeo.com / host1234');
  console.log('📧 Host 2 login:   vikram@triprodeo.com / host5678');
}

main()
  .catch((err) => { console.error('❌ Seed failed:', err); process.exit(1); })
  .finally(() => prisma.$disconnect());
