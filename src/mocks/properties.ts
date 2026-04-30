export interface Property {
  id: string;
  name: string;
  location: string;
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
  type: 'villa' | 'resort' | 'boutique' | 'treehouse' | 'beachfront';
  verified: boolean;
  superhost: boolean;
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

export interface Review {
  id: string;
  propertyId: string;
  user: string;
  avatar: string;
  location: string;
  date: string;
  rating: number;
  text: string;
  photos?: string[];
}

export const properties: Property[] = [
  {
    id: 'p1',
    name: 'Azure Cliff Villa',
    location: 'Candolim Beach, Goa',
    city: 'Goa',
    state: 'Goa',
    distanceKm: 8,
    pricePerNight: 18999,
    originalPrice: 24000,
    rating: 4.9,
    reviewCount: 218,
    images: [
      'https://readdy.ai/api/search-image?query=luxury%20private%20villa%20with%20infinity%20pool%20overlooking%20ocean%20at%20sunset%2C%20white%20architecture%2C%20tropical%20palms%2C%20golden%20light%2C%20premium%20travel%20photography%2C%20cinematic&width=1200&height=800&seq=p1a&orientation=landscape',
      'https://readdy.ai/api/search-image?query=luxury%20villa%20bedroom%20with%20ocean%20view%2C%20white%20linen%2C%20minimalist%20interior%2C%20wooden%20accents%2C%20soft%20morning%20light%2C%20premium%20resort%20photography&width=800&height=600&seq=p1b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=villa%20open%20living%20space%20with%20pool%20view%2C%20modern%20furniture%2C%20indoor%20outdoor%20design%2C%20coastal%20style%2C%20natural%20light&width=800&height=600&seq=p1c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=private%20infinity%20pool%20villa%20at%20night%20with%20lights%20reflecting%20on%20water%2C%20tropical%20setting%2C%20luxury%20resort&width=800&height=600&seq=p1d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=luxury%20villa%20bathroom%20with%20freestanding%20bathtub%2C%20marble%20tiles%2C%20garden%20view%2C%20premium%20amenities%2C%20spa%20feel&width=800&height=600&seq=p1e&orientation=landscape',
    ],
    hasDayPackage: true,
    dayPackagePrice: 3500,
    tags: ['Beachfront', 'Infinity Pool', 'Ocean View'],
    amenities: ['Infinity Pool', 'Private Beach', 'WiFi', 'AC', 'Chef on Request', 'Parking', 'BBQ', 'Gym', 'Spa', 'Bar', 'Jacuzzi', 'Outdoor Shower'],
    type: 'villa',
    verified: true,
    superhost: true,
    scarcity: 'Only 2 left',
    description: 'Perched on a dramatic cliff edge above the Arabian Sea, Azure Cliff Villa is a masterpiece of coastal luxury. This 4-bedroom private villa features an infinity pool that merges seamlessly with the horizon, panoramic ocean views from every room, and direct access to a secluded beach cove. The interiors blend Portuguese-Goan heritage with contemporary minimalism — think whitewashed walls, reclaimed teak furniture, and curated artwork from local artists. Perfect for couples seeking a romantic escape or families wanting an exclusive seaside retreat.',
    bedrooms: 4,
    bathrooms: 4,
    maxGuests: 8,
    categoryRatings: { cleanliness: 4.9, communication: 4.9, checkIn: 5.0, accuracy: 4.8, location: 5.0, value: 4.7 },
    host: { name: 'Priya Mehta', avatar: 'https://readdy.ai/api/search-image?query=professional%20indian%20woman%20smiling%20portrait%20photo%20warm%20confident&width=80&height=80&seq=h1&orientation=squarish', joinedYear: 2019, superhost: true },
    addOns: [
      { id: 'a1', name: 'BBQ Evening Setup', price: 2500, image: 'https://readdy.ai/api/search-image?query=outdoor%20bbq%20setup%20on%20villa%20terrace%20at%20sunset%20with%20grill%20and%20table%20setting&width=400&height=300&seq=addon1&orientation=landscape', description: 'Full BBQ setup with charcoal grill, marinated meats & vegetables, side dishes, and a dedicated host.' },
      { id: 'a2', name: 'Private Chef for Dinner', price: 6000, image: 'https://readdy.ai/api/search-image?query=private%20chef%20preparing%20luxury%20meal%20in%20modern%20kitchen%20with%20gourmet%20plating&width=400&height=300&seq=addon2&orientation=landscape', description: 'A Michelin-trained chef prepares a 4-course gourmet dinner using local, seasonal ingredients.' },
      { id: 'a3', name: 'Couples Spa Package', price: 4500, image: 'https://readdy.ai/api/search-image?query=couples%20spa%20massage%20luxury%20treatment%20room%20with%20candles%20flowers%20relaxation&width=400&height=300&seq=addon3&orientation=landscape', description: '90-minute in-villa couples massage with aromatherapy oils, rose petal bath, and champagne.' },
    ],
  },
  {
    id: 'p2',
    name: 'The Himalayan Nest',
    location: 'Manali, Himachal Pradesh',
    city: 'Manali',
    state: 'Himachal Pradesh',
    distanceKm: 15,
    pricePerNight: 12500,
    rating: 4.8,
    reviewCount: 156,
    images: [
      'https://readdy.ai/api/search-image?query=luxury%20mountain%20chalet%20in%20himalayas%20with%20snow%20capped%20peaks%2C%20pine%20forest%2C%20cozy%20wood%20architecture%2C%20warm%20lights%2C%20winter%20wonderland&width=1200&height=800&seq=p2a&orientation=landscape',
      'https://readdy.ai/api/search-image?query=cozy%20mountain%20chalet%20interior%20fireplace%20wooden%20beams%20plush%20blankets%20warm%20amber%20light&width=800&height=600&seq=p2b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=mountain%20view%20from%20chalet%20deck%20with%20snow%20peaks%20pine%20trees%20clear%20sky&width=800&height=600&seq=p2c&orientation=landscape',
    ],
    tags: ['Mountain View', 'Fireplace', 'Snow Activity'],
    amenities: ['Fireplace', 'Mountain View', 'WiFi', 'Heating', 'Bonfire', 'Trekking Guide', 'Parking', 'Jacuzzi'],
    type: 'boutique',
    verified: true,
    superhost: false,
    description: 'Nestled amidst snow-dusted Himalayan peaks and fragrant pine forests, The Himalayan Nest is a stunning cedar-wood chalet that perfectly blends rustic warmth with modern luxury. Wake up to panoramic mountain vistas, sip freshly brewed Himalayan tea by the stone fireplace, and fall asleep to the sound of the Beas river.',
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    categoryRatings: { cleanliness: 4.8, communication: 4.9, checkIn: 4.8, accuracy: 4.7, location: 5.0, value: 4.8 },
    host: { name: 'Arjun Rawat', avatar: 'https://readdy.ai/api/search-image?query=young%20indian%20man%20portrait%20friendly%20smile%20outdoor%20setting&width=80&height=80&seq=h2&orientation=squarish', joinedYear: 2021, superhost: false },
    addOns: [
      { id: 'a4', name: 'Guided Trek', price: 1800, image: 'https://readdy.ai/api/search-image?query=mountain%20trekking%20guide%20himalayan%20trail%20adventure%20scenic%20landscape&width=400&height=300&seq=addon4&orientation=landscape', description: 'Full-day guided trek to Solang Valley with permits, equipment and packed lunch included.' },
      { id: 'a5', name: 'Bonfire & Stargazing Kit', price: 1200, image: 'https://readdy.ai/api/search-image?query=bonfire%20under%20starry%20night%20sky%20mountain%20setting%20camping%20cozy&width=400&height=300&seq=addon5&orientation=landscape', description: 'Evening bonfire setup with telescope, hot chocolate, marshmallows and a stargazing guide.' },
    ],
  },
  {
    id: 'p3',
    name: 'Ranthambore Jungle Lodge',
    location: 'Ranthambore National Park, Rajasthan',
    city: 'Sawai Madhopur',
    state: 'Rajasthan',
    distanceKm: 5,
    pricePerNight: 22000,
    originalPrice: 28000,
    rating: 4.7,
    reviewCount: 94,
    images: [
      'https://readdy.ai/api/search-image?query=luxury%20jungle%20safari%20lodge%20india%20with%20pool%20surrounded%20by%20lush%20forest%20premium%20tented%20resort%20architecture&width=1200&height=800&seq=p3a&orientation=landscape',
      'https://readdy.ai/api/search-image?query=luxury%20tent%20interior%20safari%20lodge%20four%20poster%20bed%20ethnic%20decor%20ambient%20lighting&width=800&height=600&seq=p3b&orientation=landscape',
    ],
    tags: ['Wildlife Safari', 'Jungle View', 'Exclusive'],
    amenities: ['Pool', 'Safari Tours', 'WiFi', 'AC', 'Restaurant', 'Spa', 'Yoga Deck', 'Bonfire'],
    type: 'resort',
    verified: true,
    superhost: true,
    scarcity: 'Only 3 left',
    description: 'Experience the wild heart of Rajasthan at this exclusive eco-luxury lodge bordering Ranthambore National Park. Wake before dawn for tiger safari drives, return to a private plunge pool surrounded by forest canopy, and dine under the stars with traditional Rajasthani cuisine.',
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    categoryRatings: { cleanliness: 4.8, communication: 4.7, checkIn: 4.9, accuracy: 4.6, location: 5.0, value: 4.5 },
    host: { name: 'Rajesh Singh', avatar: 'https://readdy.ai/api/search-image?query=middle%20aged%20indian%20man%20professional%20portrait%20confident%20smile&width=80&height=80&seq=h3&orientation=squarish', joinedYear: 2018, superhost: true },
    addOns: [
      { id: 'a6', name: 'Tiger Safari Drive', price: 3500, image: 'https://readdy.ai/api/search-image?query=jeep%20safari%20in%20jungle%20national%20park%20wildlife%20adventure%20early%20morning&width=400&height=300&seq=addon6&orientation=landscape', description: '3-hour jeep safari in Ranthambore with expert naturalist guide and park permits.' },
    ],
  },
  {
    id: 'p4',
    name: 'Alleppey Houseboat Retreat',
    location: 'Alleppey Backwaters, Kerala',
    city: 'Alleppey',
    state: 'Kerala',
    distanceKm: 12,
    pricePerNight: 15000,
    rating: 4.8,
    reviewCount: 183,
    images: [
      'https://readdy.ai/api/search-image?query=luxury%20houseboat%20kerala%20backwaters%20surrounded%20by%20coconut%20palms%20and%20green%20waterways%20sunset%20golden%20hour%20serene&width=1200&height=800&seq=p4a&orientation=landscape',
      'https://readdy.ai/api/search-image?query=houseboat%20interior%20kerala%20luxury%20bedroom%20wooden%20decor%20backwater%20view%20traditional%20design&width=800&height=600&seq=p4b&orientation=landscape',
    ],
    tags: ['Backwaters', 'Floating Stay', 'Sunset Views'],
    amenities: ['Private Deck', 'WiFi', 'AC', 'Chef On Board', 'Fishing Kit', 'Kayaks', 'Canoe Tour'],
    type: 'boutique',
    verified: true,
    superhost: false,
    description: 'Drift through Kerala\'s legendary backwater canals on this beautifully restored traditional kettuvallam (rice barge) converted into a floating luxury villa. With a private sun deck, on-board chef serving authentic Kerala cuisine, and the gentle lapping of emerald waters, this is an experience unlike any other.',
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    categoryRatings: { cleanliness: 4.9, communication: 4.8, checkIn: 4.7, accuracy: 4.8, location: 5.0, value: 4.7 },
    host: { name: 'Sunita Nair', avatar: 'https://readdy.ai/api/search-image?query=south%20indian%20woman%20warm%20smile%20portrait%20professional&width=80&height=80&seq=h4&orientation=squarish', joinedYear: 2020, superhost: false },
    addOns: [
      { id: 'a7', name: 'Sunset Canoe Tour', price: 1500, image: 'https://readdy.ai/api/search-image?query=canoe%20kayak%20on%20kerala%20backwaters%20at%20sunset%20tropical%20nature&width=400&height=300&seq=addon7&orientation=landscape', description: 'Guided 2-hour sunset canoe through narrow backwater channels with local village visit.' },
    ],
  },
  {
    id: 'p5',
    name: 'Coorg Forest Estate',
    location: 'Coorg, Karnataka',
    city: 'Coorg',
    state: 'Karnataka',
    distanceKm: 20,
    pricePerNight: 9999,
    rating: 4.6,
    reviewCount: 127,
    images: [
      'https://readdy.ai/api/search-image?query=luxury%20estate%20bungalow%20surrounded%20by%20coffee%20plantation%20and%20misty%20forest%20in%20coorg%20karnataka%20india%20morning%20fog&width=1200&height=800&seq=p5a&orientation=landscape',
    ],
    tags: ['Coffee Estate', 'Forest Walk', 'Peaceful'],
    amenities: ['Pool', 'WiFi', 'Organic Breakfast', 'Coffee Tour', 'Nature Trail', 'Birdwatching'],
    type: 'boutique',
    verified: true,
    superhost: false,
    scarcity: 'Only 1 left',
    description: 'A heritage planter\'s bungalow on a working 150-acre organic coffee and spice estate. Wake to the scent of fresh coffee blossoms, take guided walks through aromatic cardamom trails, and unwind with estate-fresh filter coffee on the wrap-around verandah.',
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    categoryRatings: { cleanliness: 4.7, communication: 4.6, checkIn: 4.7, accuracy: 4.5, location: 4.9, value: 4.8 },
    host: { name: 'Vinod Cariappa', avatar: 'https://readdy.ai/api/search-image?query=senior%20indian%20man%20estate%20owner%20portrait%20warm%20welcoming&width=80&height=80&seq=h5&orientation=squarish', joinedYear: 2017, superhost: false },
    addOns: [],
  },
  {
    id: 'p6',
    name: 'Udaipur Lake Palace Suite',
    location: 'Lake Pichola, Udaipur',
    city: 'Udaipur',
    state: 'Rajasthan',
    distanceKm: 3,
    pricePerNight: 32000,
    rating: 4.9,
    reviewCount: 312,
    images: [
      'https://readdy.ai/api/search-image?query=luxury%20palace%20hotel%20udaipur%20rajasthan%20lake%20view%20white%20marble%20architecture%20royal%20heritage%20India&width=1200&height=800&seq=p6a&orientation=landscape',
      'https://readdy.ai/api/search-image?query=royal%20palace%20suite%20interior%20udaipur%20rajasthani%20decor%20marble%20floors%20lake%20view%20luxury&width=800&height=600&seq=p6b&orientation=landscape',
    ],
    tags: ['Royal Heritage', 'Lake View', 'Most Loved'],
    amenities: ['Lake View', 'Pool', 'Fine Dining', 'Spa', 'Butler Service', 'WiFi', 'Rooftop', 'Concierge'],
    type: 'resort',
    verified: true,
    superhost: true,
    description: 'Experience living like Maharajas in this meticulously restored heritage palace suite overlooking the shimmering Lake Pichola. With hand-painted frescoes, Belgian crystal chandeliers, and unobstructed views of the City Palace, this is Rajasthan at its most regal.',
    bedrooms: 1,
    bathrooms: 2,
    maxGuests: 2,
    categoryRatings: { cleanliness: 5.0, communication: 4.9, checkIn: 5.0, accuracy: 4.9, location: 5.0, value: 4.8 },
    host: { name: 'Heritage Collection', avatar: 'https://readdy.ai/api/search-image?query=heritage%20hotel%20logo%20royal%20crest%20golden%20emblem&width=80&height=80&seq=h6&orientation=squarish', joinedYear: 2016, superhost: true },
    addOns: [],
  },
];

export const reviews: Review[] = [
  {
    id: 'r1',
    propertyId: 'p1',
    user: 'Ananya Sharma',
    avatar: 'https://readdy.ai/api/search-image?query=young%20indian%20woman%20smiling%20portrait%20casual%20outdoor&width=60&height=60&seq=rv1&orientation=squarish',
    location: 'Mumbai',
    date: 'March 2025',
    rating: 5,
    text: 'Absolutely breathtaking stay! The infinity pool at night with the ocean below is a moment I\'ll never forget. Priya was incredibly attentive — the villa was stocked with everything we could need. The cliff-top sunset dinner arranged by the private chef was beyond words. Already planning our anniversary trip back!',
    photos: ['https://readdy.ai/api/search-image?query=infinity%20pool%20at%20night%20lights%20reflecting%20luxury%20villa%20ocean%20view&width=200&height=150&seq=rp1&orientation=landscape'],
  },
  {
    id: 'r2',
    propertyId: 'p1',
    user: 'Rohan & Kavitha',
    avatar: 'https://readdy.ai/api/search-image?query=indian%20couple%20smiling%20selfie%20portrait%20happy%20travel&width=60&height=60&seq=rv2&orientation=squarish',
    location: 'Bengaluru',
    date: 'February 2025',
    rating: 5,
    text: 'We booked this for our honeymoon and it exceeded every expectation. The BBQ setup on the cliff edge overlooking the sea was pure magic. Every detail — from the flowers on arrival to the turndown service — was thoughtfully done. This is luxury without pretension.',
  },
  {
    id: 'r3',
    propertyId: 'p2',
    user: 'Vikram Malhotra',
    avatar: 'https://readdy.ai/api/search-image?query=young%20indian%20man%20trekking%20adventure%20portrait%20mountains&width=60&height=60&seq=rv3&orientation=squarish',
    location: 'Delhi',
    date: 'January 2025',
    rating: 5,
    text: 'The Himalayan Nest is exactly what a mountain escape should be — warm, genuine, and utterly beautiful. We woke up to 3 inches of fresh snow and sat by the fireplace with hot chai. The guided trek to Solang Valley was perfectly organised. Zero complaints — just pure happiness.',
  },
  {
    id: 'r4',
    propertyId: 'p3',
    user: 'Meera Iyer',
    avatar: 'https://readdy.ai/api/search-image?query=south%20indian%20woman%20professional%20portrait%20confident%20smile%20glasses&width=60&height=60&seq=rv4&orientation=squarish',
    location: 'Chennai',
    date: 'December 2024',
    rating: 5,
    text: 'We actually spotted a tigress with two cubs on our morning safari — something I\'ll tell my grandchildren about! The lodge itself is stunning, with impeccable service. Dining under the stars in the jungle clearing was surreal. Worth every rupee.',
    photos: ['https://readdy.ai/api/search-image?query=wildlife%20safari%20jungle%20jeep%20morning%20light%20adventure&width=200&height=150&seq=rp2&orientation=landscape'],
  },
  {
    id: 'r5',
    propertyId: 'p4',
    user: 'Siddharth Bose',
    avatar: 'https://readdy.ai/api/search-image?query=young%20bengali%20man%20portrait%20casual%20friendly%20smile&width=60&height=60&seq=rv5&orientation=squarish',
    location: 'Kolkata',
    date: 'November 2024',
    rating: 4,
    text: 'Drifting through the backwaters at sunrise with nothing but the sound of birds and water — that\'s something no city can give you. The on-board Kerala breakfast was fresh and delicious. The chef\'s Kerala fish curry for dinner was outstanding. Truly a one-of-a-kind experience.',
  },
  {
    id: 'r6',
    propertyId: 'p5',
    user: 'Preethi Krishnan',
    avatar: 'https://readdy.ai/api/search-image?query=young%20woman%20portrait%20smiling%20south%20india%20casual%20outdoor&width=60&height=60&seq=rv6&orientation=squarish',
    location: 'Pune',
    date: 'October 2024',
    rating: 5,
    text: 'If you want to disconnect from the world, Coorg Forest Estate is your place. We spent three days hiking forest trails, learning about coffee processing, and sleeping to the sound of cicadas. The organic breakfasts alone made it worth it. Perfectly peaceful.',
  },
];

export const collections = [
  {
    id: 'luxury',
    title: 'Luxury Retreats',
    count: 84,
    tag: 'Gold Tier',
    image: 'https://readdy.ai/api/search-image?query=ultra%20luxury%20resort%20pool%20villa%20with%20infinity%20pool%20and%20ocean%20view%20tropical%20paradise%20premium%20travel%20cinematic%20wide&width=600&height=400&seq=col1&orientation=landscape',
    accentColor: 'from-amber-500/70 to-amber-900/80',
  },
  {
    id: 'romantic',
    title: 'Romantic Getaways',
    count: 62,
    tag: 'Most Booked',
    image: 'https://readdy.ai/api/search-image?query=romantic%20couple%20retreat%20villa%20with%20rose%20petals%20candles%20pool%20at%20sunset%20intimate%20luxury%20travel&width=600&height=400&seq=col2&orientation=landscape',
    accentColor: 'from-rose-500/70 to-rose-900/80',
  },
  {
    id: 'family',
    title: 'Family Escapes',
    count: 51,
    tag: 'Kid-Friendly',
    image: 'https://readdy.ai/api/search-image?query=family%20resort%20with%20large%20pool%20garden%20play%20area%20tropical%20setting%20luxury%20villa%20wide%20lawn&width=600&height=400&seq=col3&orientation=landscape',
    accentColor: 'from-emerald-500/70 to-emerald-900/80',
  },
  {
    id: 'adventure',
    title: 'Adventure Stays',
    count: 43,
    tag: 'Thrill Seekers',
    image: 'https://readdy.ai/api/search-image?query=adventure%20mountain%20lodge%20with%20trekking%20trails%20dramatic%20peaks%20dramatic%20sky%20wilderness%20premium%20outdoor%20resort&width=600&height=400&seq=col4&orientation=landscape',
    accentColor: 'from-orange-500/70 to-orange-900/80',
  },
];

export const experiences = [
  {
    id: 'e1',
    title: 'Sunrise Hot Air Balloon',
    location: 'Jaisalmer, Rajasthan',
    price: 6500,
    duration: '2.5 hours',
    rating: 4.9,
    category: 'Adventure',
    image: 'https://readdy.ai/api/search-image?query=hot%20air%20balloon%20floating%20over%20golden%20desert%20dunes%20at%20sunrise%20rajasthan%20india%20magical%20sky&width=400&height=400&seq=exp1&orientation=squarish',
  },
  {
    id: 'e2',
    title: 'Private Ayurveda Retreat',
    location: 'Varkala, Kerala',
    price: 4800,
    duration: 'Full Day',
    rating: 4.8,
    category: 'Wellness',
    image: 'https://readdy.ai/api/search-image?query=ayurveda%20spa%20treatment%20luxury%20resort%20kerala%20tropical%20setting%20herbal%20oils%20relaxation%20wellness&width=400&height=400&seq=exp2&orientation=squarish',
  },
  {
    id: 'e3',
    title: 'Gourmet Cooking Masterclass',
    location: 'Old Delhi',
    price: 3200,
    duration: '4 hours',
    rating: 4.7,
    category: 'Culinary',
    image: 'https://readdy.ai/api/search-image?query=cooking%20class%20indian%20cuisine%20masterclass%20colorful%20spices%20chef%20teaching%20upscale%20kitchen%20food%20art&width=400&height=400&seq=exp3&orientation=squarish',
  },
  {
    id: 'e4',
    title: 'Sea-Kayaking Expedition',
    location: 'Andaman Islands',
    price: 5500,
    duration: '5 hours',
    rating: 4.9,
    category: 'Water Sports',
    image: 'https://readdy.ai/api/search-image?query=sea%20kayaking%20crystal%20clear%20turquoise%20water%20tropical%20island%20andaman%20adventure%20pristine%20coastline&width=400&height=400&seq=exp4&orientation=squarish',
  },
];
