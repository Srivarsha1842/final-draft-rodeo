import { CMSData, CMSProperty, CMSTrendingDestination } from './types';
import { apiFetch, authHeader } from '@/lib/apiClient';

const CMS_STORAGE_KEY = 'triprodeo_cms_data';
const CONTENT_SETTING_KEY = 'cms_content';

const defaultProperties: CMSProperty[] = [
  {
    id: 'p1',
    name: 'Azure Cliff Villa',
    location: 'Candolim Beach, Goa',
    city: 'Goa',
    state: 'Goa',
    pricePerNight: 18999,
    originalPrice: 24000,
    rating: 4.9,
    reviewCount: 218,
    scarcity: 'Only 2 left',
    images: [
      'https://readdy.ai/api/search-image?query=luxury%20private%20villa%20with%20infinity%20pool%20overlooking%20ocean%20at%20sunset%2C%20white%20architecture%2C%20tropical%20palms%2C%20golden%20light%2C%20premium%20travel%20photography%2C%20cinematic&width=1200&height=800&seq=p1a&orientation=landscape',
      'https://readdy.ai/api/search-image?query=luxury%20villa%20bedroom%20with%20ocean%20view%2C%20white%20linen%2C%20minimalist%20interior%2C%20wooden%20accents%2C%20soft%20morning%20light%2C%20premium%20resort%20photography&width=800&height=600&seq=p1b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=villa%20open%20living%20space%20with%20pool%20view%2C%20modern%20furniture%2C%20indoor%20outdoor%20design%2C%20coastal%20style%2C%20natural%20light&width=800&height=600&seq=p1c&orientation=landscape',
      'https://readdy.ai/api/search-image?query=private%20infinity%20pool%20villa%20at%20night%20with%20lights%20reflecting%20on%20water%2C%20tropical%20setting%2C%20luxury%20resort&width=800&height=600&seq=p1d&orientation=landscape',
      'https://readdy.ai/api/search-image?query=luxury%20villa%20bathroom%20with%20freestanding%20bathtub%2C%20marble%20tiles%2C%20garden%20view%2C%20premium%20amenities%2C%20spa%20feel&width=800&height=600&seq=p1e&orientation=landscape',
    ],
    tags: ['Beachfront', 'Infinity Pool', 'Ocean View'],
    type: 'villa',
    verified: true,
    superhost: true,
    bedrooms: 4,
    bathrooms: 4,
    maxGuests: 8,
    description: 'Perched on a dramatic cliff edge above the Arabian Sea, Azure Cliff Villa is a masterpiece of coastal luxury. This 4-bedroom private villa features an infinity pool that merges seamlessly with the horizon, panoramic ocean views from every room, and direct access to a secluded beach cove. The interiors blend Portuguese-Goan heritage with contemporary minimalism — think whitewashed walls, reclaimed teak furniture, and curated artwork from local artists. Perfect for couples seeking a romantic escape or families wanting an exclusive seaside retreat.',
    amenities: ['Infinity Pool', 'Private Beach', 'WiFi', 'AC', 'Chef on Request', 'Parking', 'BBQ', 'Gym', 'Spa', 'Bar', 'Jacuzzi', 'Concierge', 'Butler Service', 'Daily Housekeeping'],
    housePolicies: [
      'Check-in after 2:00 PM, Check-out before 11:00 AM',
      'No smoking inside the villa or on the terrace',
      'Pets are not allowed on the property',
      'Parties or events require prior written approval from the host',
      'All guests must carry a valid government-issued photo ID',
      'Quiet hours are strictly observed from 10:00 PM to 8:00 AM',
      'Commercial photography or filming requires a separate permit',
      'Additional guests beyond the declared count will incur extra charges',
      'The property security deposit of \u20b910,000 is collected at check-in and refunded on departure',
    ],
    addOns: [
      { id: 'a1', name: 'BBQ Evening Setup', price: 2500, image: 'https://readdy.ai/api/search-image?query=outdoor%20bbq%20setup%20on%20villa%20terrace%20at%20sunset%20with%20grill%20and%20table%20setting%20premium%20charcoal&width=400&height=300&seq=addon1&orientation=landscape', description: 'Full BBQ setup with charcoal grill, marinated meats & vegetables, side dishes, and a dedicated host.' },
      { id: 'a2', name: 'Private Chef for Dinner', price: 6000, image: 'https://readdy.ai/api/search-image?query=private%20chef%20preparing%20luxury%20gourmet%20meal%20in%20modern%20kitchen%20with%20elegant%20plating%20candles%20fine%20dining&width=400&height=300&seq=addon2&orientation=landscape', description: 'A Michelin-trained chef prepares a 4-course gourmet dinner using local, seasonal ingredients.' },
      { id: 'a3', name: 'Couples Spa Package', price: 4500, image: 'https://readdy.ai/api/search-image?query=couples%20spa%20massage%20luxury%20treatment%20room%20with%20candles%20rose%20petals%20aromatherapy%20oils%20relaxation&width=400&height=300&seq=addon3&orientation=landscape', description: '90-minute in-villa couples massage with aromatherapy oils, rose petal bath, and champagne.' },
    ],
    categoryRatings: { cleanliness: 4.9, communication: 4.9, checkIn: 5.0, accuracy: 4.8, location: 5.0, value: 4.7 },
    host: { name: 'Priya Mehta', avatar: 'https://readdy.ai/api/search-image?query=professional%20indian%20woman%20smiling%20portrait%20warm%20confident%20headshot%20business&width=80&height=80&seq=h1&orientation=squarish', joinedYear: 2019, superhost: true },
    dayPackage: {
      enabled: true,
      description: 'Spend a magical day at Azure Cliff Villa without an overnight stay. Enjoy the stunning infinity pool, cliff views, gourmet lunch and curated activities.',
      timing: '10:00 AM – 6:00 PM',
      pricePerPerson: 3500,
      meals: ['Welcome Drink & Refreshments', 'Gourmet Lunch Buffet', 'Evening Snacks & Tea'],
      activities: ['Infinity Pool Access', 'Beach Walk', 'Kayaking', 'Sunset Cliff Viewing'],
      facilities: ['Changing Room', 'Towels & Robes', 'Locker', 'Parking', 'WiFi'],
      image: 'https://readdy.ai/api/search-image?query=luxury%20villa%20day%20outing%20pool%20party%20aerial%20view%20blue%20ocean%20cliff%20goa%20sunshine%20guests%20enjoying&width=800&height=400&seq=dp1&orientation=landscape',
    },
    reviews: [
      { id: 'r1', user: 'Ananya Sharma', avatar: 'https://readdy.ai/api/search-image?query=young%20indian%20woman%20smiling%20portrait%20casual%20outdoor%20warm&width=60&height=60&seq=rv1&orientation=squarish', location: 'Mumbai', date: 'March 2025', rating: 5, text: 'Absolutely breathtaking stay! The infinity pool at night with the ocean below is a moment I\'ll never forget. Priya was incredibly attentive. The cliff-top sunset dinner arranged by the private chef was beyond words. Already planning our anniversary trip back!' },
      { id: 'r2', user: 'Rohan & Kavitha', avatar: 'https://readdy.ai/api/search-image?query=indian%20couple%20smiling%20selfie%20portrait%20happy%20travel%20vacation&width=60&height=60&seq=rv2&orientation=squarish', location: 'Bengaluru', date: 'February 2025', rating: 5, text: 'We booked this for our honeymoon and it exceeded every expectation. The BBQ setup on the cliff edge overlooking the sea was pure magic. This is luxury without pretension.' },
    ],
    roomTypes: [
      { id: 'rt_p1_1', name: 'Ocean View Master Suite', pricePerNight: 18999, capacity: 2, bedType: 'King Bed', size: '65 sqm', description: 'The crown jewel of the villa with floor-to-ceiling ocean views, private balcony, and en-suite marble bathroom with freestanding bathtub.', photos: ['https://readdy.ai/api/search-image?query=luxury%20villa%20master%20bedroom%20ocean%20view%20king%20bed%20white%20linen%20marble%20bathroom%20freestanding%20bathtub&width=800&height=600&seq=rt_p1_1a&orientation=landscape'], amenities: ['AC', 'Smart TV', 'Minibar', 'Jacuzzi', 'Ocean View', 'Private Balcony'] },
      { id: 'rt_p1_2', name: 'Garden Deluxe Room', pricePerNight: 14500, capacity: 2, bedType: 'Queen Bed', size: '45 sqm', description: 'A serene garden-facing room with lush tropical views, premium amenities, and direct pool access.', photos: ['https://readdy.ai/api/search-image?query=luxury%20villa%20bedroom%20garden%20view%20tropical%20plants%20queen%20bed%20elegant%20decor%20soft%20light&width=800&height=600&seq=rt_p1_2a&orientation=landscape'], amenities: ['AC', 'Smart TV', 'Pool Access', 'Garden View'] },
      { id: 'rt_p1_3', name: 'Family Bungalow Suite', pricePerNight: 28000, capacity: 6, bedType: 'Twin Beds', size: '110 sqm', description: 'A two-bedroom family suite with a shared lounge, ideal for groups or families traveling together.', photos: ['https://readdy.ai/api/search-image?query=luxury%20family%20villa%20suite%20two%20bedrooms%20living%20space%20open%20plan%20bright%20spacious%20tropical%20resort&width=800&height=600&seq=rt_p1_3a&orientation=landscape'], amenities: ['AC', 'Smart TV', 'Living Area', 'Pool Access', 'Baby Cot Available'] },
    ],
  },
  {
    id: 'p2',
    name: 'The Himalayan Nest',
    location: 'Manali, Himachal Pradesh',
    city: 'Manali',
    state: 'Himachal Pradesh',
    pricePerNight: 12500,
    rating: 4.8,
    reviewCount: 156,
    images: [
      'https://readdy.ai/api/search-image?query=luxury%20mountain%20chalet%20in%20himalayas%20with%20snow%20capped%20peaks%2C%20pine%20forest%2C%20cozy%20wood%20architecture%2C%20warm%20lights%2C%20winter%20wonderland&width=1200&height=800&seq=p2a&orientation=landscape',
      'https://readdy.ai/api/search-image?query=cozy%20mountain%20chalet%20interior%20fireplace%20wooden%20beams%20plush%20blankets%20warm%20amber%20light&width=800&height=600&seq=p2b&orientation=landscape',
      'https://readdy.ai/api/search-image?query=mountain%20view%20from%20chalet%20deck%20with%20snow%20peaks%20pine%20trees%20clear%20sky&width=800&height=600&seq=p2c&orientation=landscape',
    ],
    tags: ['Mountain View', 'Fireplace', 'Snow Activity'],
    type: 'boutique',
    verified: true,
    superhost: false,
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    description: 'Nestled amidst snow-dusted Himalayan peaks and fragrant pine forests, The Himalayan Nest is a stunning cedar-wood chalet that perfectly blends rustic warmth with modern luxury. Wake up to panoramic mountain vistas, sip freshly brewed Himalayan tea by the stone fireplace, and fall asleep to the sound of the Beas river.',
    amenities: ['Fireplace', 'Mountain View', 'WiFi', 'Heating', 'Bonfire', 'Trekking Guide', 'Parking', 'Jacuzzi', 'Sauna'],
    housePolicies: [
      'Check-in after 3:00 PM, Check-out before 10:00 AM',
      'No smoking anywhere inside the premises',
      'Pets are welcome with prior approval — please inform at booking',
      'Bonfire usage must be supervised by staff at all times',
      'Trekking and outdoor activities are at guests\' own risk',
      'Heating is included — do not tamper with fireplace settings',
      'Guests are responsible for their belongings in common areas',
    ],
    addOns: [
      { id: 'a4', name: 'Guided Trek', price: 1800, image: 'https://readdy.ai/api/search-image?query=mountain%20trekking%20guide%20himalayan%20trail%20adventure%20scenic%20landscape%20pine%20trees%20snow&width=400&height=300&seq=addon4&orientation=landscape', description: 'Full-day guided trek to Solang Valley with permits, equipment and packed lunch included.' },
      { id: 'a5', name: 'Bonfire & Stargazing Kit', price: 1200, image: 'https://readdy.ai/api/search-image?query=bonfire%20under%20starry%20night%20sky%20mountain%20setting%20camping%20cozy%20telescope%20marshmallows&width=400&height=300&seq=addon5&orientation=landscape', description: 'Evening bonfire setup with telescope, hot chocolate, marshmallows and a stargazing guide.' },
    ],
    categoryRatings: { cleanliness: 4.8, communication: 4.9, checkIn: 4.8, accuracy: 4.7, location: 5.0, value: 4.8 },
    host: { name: 'Arjun Rawat', avatar: 'https://readdy.ai/api/search-image?query=young%20indian%20man%20portrait%20friendly%20smile%20outdoor%20mountain%20setting%20headshot&width=80&height=80&seq=h2&orientation=squarish', joinedYear: 2021, superhost: false },
    reviews: [
      { id: 'r3', user: 'Vikram Malhotra', avatar: 'https://readdy.ai/api/search-image?query=young%20indian%20man%20trekking%20adventure%20portrait%20mountains%20headshot%20casual&width=60&height=60&seq=rv3&orientation=squarish', location: 'Delhi', date: 'January 2025', rating: 5, text: 'The Himalayan Nest is exactly what a mountain escape should be — warm, genuine, and utterly beautiful. We woke up to 3 inches of fresh snow and sat by the fireplace with hot chai. The guided trek to Solang Valley was perfectly organised.' },
    ],
    roomTypes: [
      { id: 'rt_p2_1', name: 'Peak View Deluxe Room', pricePerNight: 12500, capacity: 2, bedType: 'King Bed', size: '40 sqm', description: 'Wake up to snow-capped Himalayan peaks from your bed. Features a stone fireplace and cozy sitting nook.', photos: ['https://readdy.ai/api/search-image?query=cozy%20mountain%20chalet%20bedroom%20king%20bed%20fireplace%20himalayan%20view%20wood%20interior%20warm%20amber%20light&width=800&height=600&seq=rt_p2_1a&orientation=landscape'], amenities: ['Heating', 'Fireplace', 'Mountain View', 'Smart TV'] },
      { id: 'rt_p2_2', name: 'Forest Cabin Room', pricePerNight: 9500, capacity: 2, bedType: 'Double Bed', size: '30 sqm', description: 'Tucked into the cedar-wood wing with dense pine forest views. Perfect for a peaceful, off-grid retreat.', photos: ['https://readdy.ai/api/search-image?query=cozy%20mountain%20cabin%20room%20pine%20forest%20view%20small%20double%20bed%20rustic%20wood%20decor%20himalayan%20chalet&width=800&height=600&seq=rt_p2_2a&orientation=landscape'], amenities: ['Heating', 'Forest View', 'WiFi'] },
    ],
  },
  {
    id: 'p3',
    name: 'Ranthambore Jungle Lodge',
    location: 'Ranthambore National Park, Rajasthan',
    city: 'Sawai Madhopur',
    state: 'Rajasthan',
    pricePerNight: 22000,
    originalPrice: 28000,
    rating: 4.7,
    reviewCount: 94,
    scarcity: 'Only 3 left',
    images: [
      'https://readdy.ai/api/search-image?query=luxury%20jungle%20safari%20lodge%20india%20with%20pool%20surrounded%20by%20lush%20forest%20premium%20tented%20resort%20architecture&width=1200&height=800&seq=p3a&orientation=landscape',
      'https://readdy.ai/api/search-image?query=luxury%20tent%20interior%20safari%20lodge%20four%20poster%20bed%20ethnic%20decor%20ambient%20lighting&width=800&height=600&seq=p3b&orientation=landscape',
    ],
    tags: ['Wildlife Safari', 'Jungle View', 'Exclusive'],
    type: 'resort',
    verified: true,
    superhost: true,
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    description: 'Experience the wild heart of Rajasthan at this exclusive eco-luxury lodge bordering Ranthambore National Park. Wake before dawn for tiger safari drives, return to a private plunge pool surrounded by forest canopy, and dine under the stars with traditional Rajasthani cuisine.',
    amenities: ['Pool', 'Safari Tours', 'WiFi', 'AC', 'Restaurant', 'Spa', 'Yoga Deck', 'Bonfire', 'Concierge'],
    housePolicies: [
      'Safari drives depart at 6:00 AM sharp — punctuality is essential',
      'No plastic bottles or single-use plastics allowed on the property',
      'Wildlife interaction rules must be strictly followed at all times',
      'Check-in after 2:00 PM, Check-out before 11:00 AM',
      'Noise levels must be kept minimal to avoid disturbing wildlife',
      'Children under 12 require adult supervision on all safari tours',
    ],
    addOns: [
      { id: 'a6', name: 'Tiger Safari Drive', price: 3500, image: 'https://readdy.ai/api/search-image?query=jeep%20safari%20in%20jungle%20national%20park%20wildlife%20adventure%20early%20morning%20golden%20light%20tiger&width=400&height=300&seq=addon6&orientation=landscape', description: '3-hour jeep safari in Ranthambore with expert naturalist guide and park permits.' },
    ],
    categoryRatings: { cleanliness: 4.8, communication: 4.7, checkIn: 4.9, accuracy: 4.6, location: 5.0, value: 4.5 },
    host: { name: 'Rajesh Singh', avatar: 'https://readdy.ai/api/search-image?query=middle%20aged%20indian%20man%20professional%20portrait%20confident%20smile%20headshot&width=80&height=80&seq=h3&orientation=squarish', joinedYear: 2018, superhost: true },
    reviews: [
      { id: 'r4', user: 'Meera Iyer', avatar: 'https://readdy.ai/api/search-image?query=south%20indian%20woman%20professional%20portrait%20confident%20smile%20glasses%20headshot&width=60&height=60&seq=rv4&orientation=squarish', location: 'Chennai', date: 'December 2024', rating: 5, text: 'We actually spotted a tigress with two cubs on our morning safari — something I\'ll tell my grandchildren about! The lodge itself is stunning, with impeccable service. Dining under the stars in the jungle clearing was surreal. Worth every rupee.' },
    ],
    roomTypes: [
      { id: 'rt_p3_1', name: 'Luxury Jungle Tent', pricePerNight: 22000, capacity: 2, bedType: 'King Bed', size: '55 sqm', description: 'A beautifully furnished canvas tent with all modern amenities, private deck, and forest soundscape all around.', photos: ['https://readdy.ai/api/search-image?query=luxury%20safari%20tent%20interior%20king%20bed%20ethnic%20rajasthani%20decor%20ambient%20warm%20lighting%20jungle%20resort&width=800&height=600&seq=rt_p3_1a&orientation=landscape'], amenities: ['AC', 'Minibar', 'Private Deck', 'Jungle View', 'Butler Service'] },
    ],
  },
  {
    id: 'p4',
    name: 'Alleppey Houseboat Retreat',
    location: 'Alleppey Backwaters, Kerala',
    city: 'Alleppey',
    state: 'Kerala',
    pricePerNight: 15000,
    rating: 4.8,
    reviewCount: 183,
    images: [
      'https://readdy.ai/api/search-image?query=luxury%20houseboat%20kerala%20backwaters%20surrounded%20by%20coconut%20palms%20and%20green%20waterways%20sunset%20golden%20hour%20serene&width=1200&height=800&seq=p4a&orientation=landscape',
      'https://readdy.ai/api/search-image?query=houseboat%20interior%20kerala%20luxury%20bedroom%20wooden%20decor%20backwater%20view%20traditional%20design&width=800&height=600&seq=p4b&orientation=landscape',
    ],
    tags: ['Backwaters', 'Floating Stay', 'Sunset Views'],
    type: 'boutique',
    verified: true,
    superhost: false,
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    description: 'Drift through Kerala\'s legendary backwater canals on this beautifully restored traditional kettuvallam (rice barge) converted into a floating luxury villa. With a private sun deck, on-board chef serving authentic Kerala cuisine, and the gentle lapping of emerald waters, this is an experience unlike any other.',
    amenities: ['Private Deck', 'WiFi', 'AC', 'Chef On Board', 'Fishing Kit', 'Kayaks', 'Canoe Tour'],
    housePolicies: [
      'Life jackets must be worn at all times on the water deck',
      'No swimming in backwater channels — currents can be dangerous',
      'Check-in on board after 1:00 PM, Check-out before 10:00 AM',
      'Smoking is allowed only on the designated outdoor deck area',
      'The boat moors at night — disembarkation after 8:00 PM is not permitted',
      'Fresh meals are cooked on board — dietary requirements must be shared in advance',
    ],
    addOns: [
      { id: 'a7', name: 'Sunset Canoe Tour', price: 1500, image: 'https://readdy.ai/api/search-image?query=canoe%20kayak%20on%20kerala%20backwaters%20at%20sunset%20tropical%20nature%20serene%20waterways%20golden%20light&width=400&height=300&seq=addon7&orientation=landscape', description: 'Guided 2-hour sunset canoe through narrow backwater channels with local village visit.' },
    ],
    categoryRatings: { cleanliness: 4.9, communication: 4.8, checkIn: 4.7, accuracy: 4.8, location: 5.0, value: 4.7 },
    host: { name: 'Sunita Nair', avatar: 'https://readdy.ai/api/search-image?query=south%20indian%20woman%20warm%20smile%20portrait%20professional%20headshot%20kerala&width=80&height=80&seq=h4&orientation=squarish', joinedYear: 2020, superhost: false },
    reviews: [
      { id: 'r5', user: 'Siddharth Bose', avatar: 'https://readdy.ai/api/search-image?query=young%20bengali%20man%20portrait%20casual%20friendly%20smile%20headshot&width=60&height=60&seq=rv5&orientation=squarish', location: 'Kolkata', date: 'November 2024', rating: 4, text: 'Drifting through the backwaters at sunrise with nothing but the sound of birds and water — that\'s something no city can give you. The on-board Kerala breakfast was fresh and delicious. Truly a one-of-a-kind experience.' },
    ],
    roomTypes: [
      { id: 'rt_p4_1', name: 'Master Cabin', pricePerNight: 15000, capacity: 2, bedType: 'King Bed', size: '35 sqm', description: 'The premier cabin with panoramic backwater views, traditional Kerala wood-carved headboard, and en-suite bath.', photos: ['https://readdy.ai/api/search-image?query=luxury%20houseboat%20cabin%20interior%20kerala%20backwater%20view%20wooden%20decor%20king%20bed%20traditional%20design%20ambient&width=800&height=600&seq=rt_p4_1a&orientation=landscape'], amenities: ['AC', 'Backwater View', 'Private Bath', 'Smart TV'] },
    ],
  },
  {
    id: 'p5',
    name: 'Coorg Forest Estate',
    location: 'Coorg, Karnataka',
    city: 'Coorg',
    state: 'Karnataka',
    pricePerNight: 9999,
    rating: 4.6,
    reviewCount: 127,
    scarcity: 'Only 1 left',
    images: [
      'https://readdy.ai/api/search-image?query=luxury%20estate%20bungalow%20surrounded%20by%20coffee%20plantation%20and%20misty%20forest%20in%20coorg%20karnataka%20india%20morning%20fog&width=1200&height=800&seq=p5a&orientation=landscape',
    ],
    tags: ['Coffee Estate', 'Forest Walk', 'Peaceful'],
    type: 'boutique',
    verified: true,
    superhost: false,
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    description: 'A heritage planter\'s bungalow on a working 150-acre organic coffee and spice estate. Wake to the scent of fresh coffee blossoms, take guided walks through aromatic cardamom trails, and unwind with estate-fresh filter coffee on the wrap-around verandah.',
    amenities: ['Pool', 'WiFi', 'Organic Breakfast', 'Coffee Tour', 'Nature Trail', 'Birdwatching', 'Parking'],
    housePolicies: [
      'Check-in after 2:00 PM, Check-out before 11:00 AM',
      'Guests are requested not to pluck coffee or spice plants',
      'Estate walks must follow marked trails only',
      'No outside food or beverages into the estate dining area',
      'Pets are not permitted anywhere on the estate',
      'Bonfires and open flames are strictly prohibited due to the forest proximity',
    ],
    addOns: [],
    categoryRatings: { cleanliness: 4.7, communication: 4.6, checkIn: 4.7, accuracy: 4.5, location: 4.9, value: 4.8 },
    host: { name: 'Vinod Cariappa', avatar: 'https://readdy.ai/api/search-image?query=senior%20indian%20man%20estate%20owner%20portrait%20warm%20welcoming%20headshot&width=80&height=80&seq=h5&orientation=squarish', joinedYear: 2017, superhost: false },
    reviews: [
      { id: 'r6', user: 'Preethi Krishnan', avatar: 'https://readdy.ai/api/search-image?query=young%20woman%20portrait%20smiling%20south%20india%20casual%20outdoor%20headshot&width=60&height=60&seq=rv6&orientation=squarish', location: 'Pune', date: 'October 2024', rating: 5, text: 'If you want to disconnect from the world, Coorg Forest Estate is your place. We spent three days hiking forest trails, learning about coffee processing, and sleeping to the sound of cicadas. Perfectly peaceful.' },
    ],
    roomTypes: [],
  },
  {
    id: 'p6',
    name: 'Udaipur Lake Palace Suite',
    location: 'Lake Pichola, Udaipur',
    city: 'Udaipur',
    state: 'Rajasthan',
    pricePerNight: 32000,
    rating: 4.9,
    reviewCount: 312,
    images: [
      'https://readdy.ai/api/search-image?query=luxury%20palace%20hotel%20udaipur%20rajasthan%20lake%20view%20white%20marble%20architecture%20royal%20heritage%20India&width=1200&height=800&seq=p6a&orientation=landscape',
      'https://readdy.ai/api/search-image?query=royal%20palace%20suite%20interior%20udaipur%20rajasthani%20decor%20marble%20floors%20lake%20view%20luxury&width=800&height=600&seq=p6b&orientation=landscape',
    ],
    tags: ['Royal Heritage', 'Lake View', 'Most Loved'],
    type: 'resort',
    verified: true,
    superhost: true,
    bedrooms: 1,
    bathrooms: 2,
    maxGuests: 2,
    description: 'Experience living like Maharajas in this meticulously restored heritage palace suite overlooking the shimmering Lake Pichola. With hand-painted frescoes, Belgian crystal chandeliers, and unobstructed views of the City Palace, this is Rajasthan at its most regal.',
    amenities: ['Lake View', 'Pool', 'Fine Dining', 'Spa', 'Butler Service', 'WiFi', 'Rooftop', 'Concierge'],
    housePolicies: [
      'Formal attire required in the dining hall — casual wear not permitted',
      'Check-in after 3:00 PM, Check-out before 12:00 PM (noon)',
      'Photography inside the palace interiors requires prior permission',
      'No smoking anywhere within the heritage wing',
      'Pets are strictly not allowed on the premises',
      'All heritage artefacts and furnishings are protected — guests are liable for any damage',
      'Children under 5 are not permitted in the spa and fine dining areas during dinner service',
    ],
    addOns: [],
    categoryRatings: { cleanliness: 5.0, communication: 4.9, checkIn: 5.0, accuracy: 4.9, location: 5.0, value: 4.8 },
    host: { name: 'Heritage Collection', avatar: 'https://readdy.ai/api/search-image?query=heritage%20hotel%20royal%20crest%20emblem%20logo%20ornate%20gold%20india%20palace&width=80&height=80&seq=h6&orientation=squarish', joinedYear: 2016, superhost: true },
    reviews: [
      { id: 'r7', user: 'Kavya Reddy', avatar: 'https://readdy.ai/api/search-image?query=professional%20indian%20woman%20portrait%20confident%20smile%20headshot%20corporate&width=60&height=60&seq=rv7&orientation=squarish', location: 'Hyderabad', date: 'January 2025', rating: 5, text: 'Absolute royalty. The frescoes, the lake view, the butler — every detail screams luxury. This is the finest stay I have ever experienced in India. Worth every penny.' },
    ],
    roomTypes: [
      { id: 'rt_p6_1', name: 'Royal Lake Suite', pricePerNight: 32000, capacity: 2, bedType: 'King Bed', size: '80 sqm', description: 'An opulent suite with hand-painted frescoes, Belgian crystal chandelier, and direct view of Lake Pichola and the City Palace.', photos: ['https://readdy.ai/api/search-image?query=royal%20palace%20suite%20rajasthan%20udaipur%20luxury%20bedroom%20marble%20floors%20hand%20painted%20frescoes%20lake%20view%20heritage%20india&width=800&height=600&seq=rt_p6_1a&orientation=landscape'], amenities: ['AC', 'Minibar', 'Lake View', 'Butler Service', 'Jacuzzi', 'Smart TV'] },
    ],
  },
];

export const defaultTrendingDestinations: CMSTrendingDestination[] = [
  {
    id: 'goa',
    name: 'Goa',
    tagline: 'Sun, Sand & Serenity',
    country: 'India',
    properties: 142,
    startingPrice: 8500,
    badge: 'Trending Now',
    badgeColor: 'bg-amber-400 text-stone-900',
    image: 'https://readdy.ai/api/search-image?query=goa%20beach%20aerial%20view%20turquoise%20water%20white%20sand%20palm%20trees%20tropical%20paradise%20india%20beautiful%20coastline%20vibrant%20warm%20colors%20golden%20hour%20photography&width=600&height=700&seq=loc_goa&orientation=portrait',
    tags: ['Beaches', 'Nightlife', 'Villas'],
  },
  {
    id: 'manali',
    name: 'Manali',
    tagline: 'Where Snow Meets Soul',
    country: 'India',
    properties: 89,
    startingPrice: 5200,
    badge: 'Peak Season',
    badgeColor: 'bg-sky-100 text-sky-700',
    image: 'https://readdy.ai/api/search-image?query=manali%20himachal%20pradesh%20snow%20capped%20mountains%20pine%20forest%20river%20valley%20himalayas%20winter%20landscape%20breathtaking%20scenic%20india%20mountain%20town&width=600&height=700&seq=loc_manali&orientation=portrait',
    tags: ['Mountains', 'Snow', 'Adventure'],
  },
  {
    id: 'udaipur',
    name: 'Udaipur',
    tagline: 'The City of Lakes',
    country: 'India',
    properties: 67,
    startingPrice: 7800,
    badge: 'Most Loved',
    badgeColor: 'bg-rose-100 text-rose-700',
    image: 'https://readdy.ai/api/search-image?query=udaipur%20rajasthan%20lake%20pichola%20palace%20at%20sunset%20golden%20light%20reflection%20water%20beautiful%20heritage%20city%20india%20romantic%20architecture&width=600&height=700&seq=loc_udaipur&orientation=portrait',
    tags: ['Heritage', 'Romantic', 'Palaces'],
  },
  {
    id: 'kerala',
    name: 'Kerala',
    tagline: "God's Own Country",
    country: 'India',
    properties: 118,
    startingPrice: 6500,
    badge: 'Staff Pick',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    image: 'https://readdy.ai/api/search-image?query=kerala%20backwaters%20alleppey%20houseboats%20coconut%20palms%20green%20waterways%20tropical%20lush%20sunset%20serene%20calm%20nature%20india%20backwater%20canals%20beautiful&width=600&height=700&seq=loc_kerala&orientation=portrait',
    tags: ['Backwaters', 'Wellness', 'Nature'],
  },
  {
    id: 'coorg',
    name: 'Coorg',
    tagline: 'Scotland of India',
    country: 'India',
    properties: 54,
    startingPrice: 4800,
    badge: 'Hidden Gem',
    badgeColor: 'bg-stone-100 text-stone-700',
    image: 'https://readdy.ai/api/search-image?query=coorg%20karnataka%20coffee%20plantation%20mist%20forest%20hills%20green%20landscape%20india%20misty%20morning%20tea%20estate%20peaceful%20nature&width=600&height=700&seq=loc_coorg&orientation=portrait',
    tags: ['Coffee', 'Forest', 'Peaceful'],
  },
  {
    id: 'andaman',
    name: 'Andaman',
    tagline: 'Untouched Island Paradise',
    country: 'India',
    properties: 38,
    startingPrice: 12000,
    badge: 'Exclusive',
    badgeColor: 'bg-amber-100 text-amber-700',
    image: 'https://readdy.ai/api/search-image?query=andaman%20islands%20crystal%20clear%20turquoise%20water%20pristine%20white%20sand%20beach%20tropical%20paradise%20india%20uninhabited%20island%20aerial%20view%20lush%20green&width=600&height=700&seq=loc_andaman&orientation=portrait',
    tags: ['Islands', 'Diving', 'Pristine'],
  },
];

export const defaultCMSData: CMSData = {
  hero: {
    headline: 'Your Perfect Escape\nAwaits You',
    subheadline: 'Discover handpicked resorts, villas & experiences — curated by AI, loved by travelers.',
    badgeText: 'AI-Powered Travel Discovery',
    stats: [
      { value: '2,400+', label: 'Curated Properties' },
      { value: '98%', label: 'Happy Travelers' },
      { value: '120+', label: 'Destinations' },
    ],
    backgroundImage: 'https://readdy.ai/api/search-image?query=dramatic%20luxury%20travel%20aerial%20view%20of%20pristine%20turquoise%20ocean%20with%20tropical%20island%20coastline%20and%20white%20sand%20beach%20at%20golden%20hour%2C%20cinematic%20wide%20angle%2C%20dreamy%20warm%20tones%2C%20ultra%20hd%20premium%20photography&width=1920&height=1080&seq=hero1&orientation=landscape',
  },
  properties: defaultProperties,
  experiences: [
    { id: 'e1', title: 'Sunrise Hot Air Balloon', location: 'Jaisalmer, Rajasthan', price: 6500, duration: '2.5 hours', rating: 4.9, category: 'Adventure', image: 'https://readdy.ai/api/search-image?query=hot%20air%20balloon%20floating%20over%20golden%20desert%20dunes%20at%20sunrise%20rajasthan%20india%20magical%20sky&width=400&height=400&seq=exp1&orientation=squarish' },
    { id: 'e2', title: 'Private Ayurveda Retreat', location: 'Varkala, Kerala', price: 4800, duration: 'Full Day', rating: 4.8, category: 'Wellness', image: 'https://readdy.ai/api/search-image?query=ayurveda%20spa%20treatment%20luxury%20resort%20kerala%20tropical%20setting%20herbal%20oils%20relaxation%20wellness&width=400&height=400&seq=exp2&orientation=squarish' },
    { id: 'e3', title: 'Gourmet Cooking Masterclass', location: 'Old Delhi', price: 3200, duration: '4 hours', rating: 4.7, category: 'Culinary', image: 'https://readdy.ai/api/search-image?query=cooking%20class%20indian%20cuisine%20masterclass%20colorful%20spices%20chef%20teaching%20upscale%20kitchen%20food%20art&width=400&height=400&seq=exp3&orientation=squarish' },
    { id: 'e4', title: 'Sea-Kayaking Expedition', location: 'Andaman Islands', price: 5500, duration: '5 hours', rating: 4.9, category: 'Water Sports', image: 'https://readdy.ai/api/search-image?query=sea%20kayaking%20crystal%20clear%20turquoise%20water%20tropical%20island%20andaman%20adventure%20pristine%20coastline&width=400&height=400&seq=exp4&orientation=squarish' },
  ],
  about: {
    headline: 'Making Travel Magical Again',
    subheadline: 'We started with a simple mission: help every Indian traveler find their perfect escape, without the stress.',
    storyParagraph1: 'It was 2019, and Rohan Mehta and Priya Sharma were trying to plan a weekend getaway. After hours of browsing generic booking sites, they realized that truly special stays — the kind that create memories — were nearly impossible to find. That frustration became the seed of Triprodeo.',
    storyParagraph2: 'Today, Triprodeo has grown from 12 curated villas in Goa to over 50,000 verified properties across India and beyond. Every listing is hand-checked, every host vetted, and every experience designed to be exceptional.',
    stats: [
      { value: '50,000+', label: 'Curated Properties' },
      { value: '2 Million+', label: 'Happy Guests' },
      { value: '15,000+', label: 'Trusted Hosts' },
      { value: '4.8', label: 'Average Rating' },
    ],
    founders: [
      { name: 'Rohan Mehta', role: 'Co-Founder & CEO', bio: 'Former McKinsey consultant with a passion for travel and technology.', image: 'https://readdy.ai/api/search-image?query=professional%20indian%20businessman%20portrait%20confident%20smile%20modern%20office%20setting%20corporate%20headshot&width=200&height=200&seq=founder1&orientation=squarish' },
      { name: 'Priya Sharma', role: 'Co-Founder & COO', bio: 'Hospitality veteran with 15 years at Oberoi Hotels.', image: 'https://readdy.ai/api/search-image?query=professional%20indian%20businesswoman%20portrait%20confident%20warm%20smile%20modern%20office%20corporate%20headshot&width=200&height=200&seq=founder2&orientation=squarish' },
    ],
    values: [
      { icon: 'ri-heart-3-line', title: 'Guest First', description: 'Every decision we make starts with one question: Will this delight our guests?' },
      { icon: 'ri-lightbulb-flash-line', title: 'Innovation', description: 'We constantly push boundaries with AI and technology to make travel effortless.' },
      { icon: 'ri-hand-heart-line', title: 'Trust & Transparency', description: 'No hidden fees, no fake reviews, no surprises. Just honest, upfront service.' },
      { icon: 'ri-earth-line', title: 'Sustainable Travel', description: 'Committed to eco-friendly properties and responsible tourism practices.' },
    ],
    officeLocations: [
      { city: 'Bengaluru', role: 'Headquarters', address: 'Indiranagar, Bengaluru, Karnataka' },
      { city: 'Mumbai', role: 'Sales Office', address: 'Bandra West, Mumbai, Maharashtra' },
      { city: 'Delhi', role: 'Operations Hub', address: 'Connaught Place, New Delhi' },
      { city: 'Goa', role: 'Property Onboarding', address: 'Panjim, Goa' },
    ],
  },
  partner: {
    heroHeadline: 'Grow Your Business, Earn More',
    heroSubheadline: 'Join 2,500+ travel professionals partnering with Triprodeo to deliver exceptional stays and maximize earnings.',
    stats: [
      { value: '2,500+', label: 'Active Partners' },
      { value: '\u20b950 Crore+', label: 'Total Payouts' },
      { value: '12%', label: 'Avg. Commission' },
      { value: '24/7', label: 'Support' },
    ],
    commissionTiers: [
      { id: 'bronze', name: 'Bronze Partner', commissionRate: '5%', bonusPerBooking: '\u20b90', minBookings: 0 },
      { id: 'silver', name: 'Silver Partner', commissionRate: '7%', bonusPerBooking: '\u20b9500', minBookings: 10 },
      { id: 'gold', name: 'Gold Partner', commissionRate: '10%', bonusPerBooking: '\u20b91,000', minBookings: 25 },
      { id: 'platinum', name: 'Platinum Partner', commissionRate: '15%', bonusPerBooking: '\u20b92,000', minBookings: 50 },
    ],
    benefits: [
      { id: 'b1', icon: 'ri-money-rupee-circle-line', title: 'Competitive Commissions', description: 'Earn up to 15% commission on every booking plus flat bonuses per transaction.', stat: '\u20b92L+', statLabel: 'Average monthly earnings' },
      { id: 'b2', icon: 'ri-building-line', title: '10,000+ Properties', description: 'Access our entire inventory of curated stays, experiences, and bundle packages.', stat: '10,000+', statLabel: 'Properties available' },
      { id: 'b3', icon: 'ri-dashboard-3-line', title: 'Partner Dashboard', description: 'Real-time tracking of bookings, commissions, and performance metrics.', stat: 'Real-time', statLabel: 'Commission tracking' },
      { id: 'b4', icon: 'ri-customer-service-2-line', title: 'Dedicated Support', description: 'Gold and Platinum partners get dedicated account managers and priority support.', stat: '24/7', statLabel: 'Support availability' },
      { id: 'b5', icon: 'ri-megaphone-line', title: 'Marketing Support', description: 'Access professionally designed marketing materials, co-branded campaigns, and promotional content.', stat: 'Free', statLabel: 'Marketing assets' },
      { id: 'b6', icon: 'ri-secure-payment-line', title: 'Guaranteed Payments', description: 'Timely monthly payouts with transparent reporting and automated commission system.', stat: 'Monthly', statLabel: 'Payout schedule' },
    ],
  },
  support: {
    heroHeadline: 'How Can We Help You?',
    heroSubheadline: 'Search our help center or reach out to our 24/7 support team. We\'re always here for you.',
    contactPhone: '+91 1800-123-4567',
    contactEmail: 'support@triprodeo.com',
    contactWhatsapp: '+91 98765 43210',
    faqs: [
      { id: 'f1', question: 'How do I make a booking?', answer: 'Browse properties, select your dates, choose add-ons, and complete payment. Confirmation is instant via email and SMS.', category: 'Bookings & Payments' },
      { id: 'f2', question: 'What payment methods are accepted?', answer: 'We accept all major credit/debit cards, UPI, net banking, and EMI options.', category: 'Bookings & Payments' },
      { id: 'f3', question: 'What is the cancellation policy?', answer: 'Most bookings offer free cancellation up to 48 hours before check-in. Specific policies are shown on each property page.', category: 'Cancellations & Refunds' },
      { id: 'f4', question: 'How long do refunds take?', answer: 'Refunds are processed within 3-5 business days to your original payment method.', category: 'Cancellations & Refunds' },
      { id: 'f5', question: 'What should I bring for check-in?', answer: 'A valid government-issued photo ID (Aadhaar, Passport, or Driving License) is required for all guests.', category: 'Check-in & Stay' },
      { id: 'f6', question: 'How do I earn loyalty points?', answer: 'You earn 1 point per \u20b9100 spent on bookings. Points can be redeemed for discounts on future stays.', category: 'Account & Loyalty' },
    ],
  },
  navbar: {
    logoUrl: 'https://static.readdy.ai/image/df75ddbe126af1b251cb2de8db121689/6808d36637866ce15d1ddd41b6de1515.png',
    links: [
      { label: 'Explore', href: '/search' },
      { label: 'Experiences', href: '/experiences' },
      { label: 'AI Planner', href: '/ai-planner' },
      { label: 'Become a Host', href: '/host' },
      { label: 'Partner', href: '/partner' },
    ],
  },
  footer: {
    tagline: 'Discover India\'s most beautiful stays, curated for the modern traveler.',
    aboutText: 'Triprodeo is India\'s leading curated travel platform, connecting guests with extraordinary properties and experiences across 25+ destinations.',
    socialLinks: [
      { platform: 'Instagram', url: '#', icon: 'ri-instagram-line' },
      { platform: 'Facebook', url: '#', icon: 'ri-facebook-line' },
      { platform: 'Twitter', url: '#', icon: 'ri-twitter-x-line' },
      { platform: 'YouTube', url: '#', icon: 'ri-youtube-line' },
    ],
    copyrightText: '\u00a9 2025 Triprodeo. All rights reserved.',
  },
  trendingDestinations: defaultTrendingDestinations,
  lastUpdated: new Date().toISOString(),
};

export function loadCMSData(): CMSData {
  try {
    const stored = localStorage.getItem(CMS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as CMSData;
      // Migration: ensure every property has all required fields
      parsed.properties = parsed.properties.map((p) => {
        const def = defaultProperties.find((d) => d.id === p.id);
        return {
          amenities: [],
          roomTypes: [],
          housePolicies: [],
          addOns: def?.addOns ?? [],
          categoryRatings: def?.categoryRatings ?? { cleanliness: 4.5, communication: 4.5, checkIn: 4.5, accuracy: 4.5, location: 4.5, value: 4.5 },
          host: def?.host ?? { name: 'Host', avatar: '', joinedYear: 2020, superhost: false },
          reviews: def?.reviews ?? [],
          dayPackage: def?.dayPackage ?? { enabled: false, description: '', timing: '', pricePerPerson: 0, meals: [], activities: [], facilities: [], image: '' },
          ...p,
        };
      });
      // Migration: ensure trendingDestinations exists
      if (!parsed.trendingDestinations) {
        parsed.trendingDestinations = defaultTrendingDestinations;
      }
      return parsed;
    }
  } catch {
    // fallback to default
  }
  return defaultCMSData;
}

export function saveCMSData(data: CMSData): void {
  const updated = { ...data, lastUpdated: new Date().toISOString() };
  // Write-through cache — immediate UI feedback + offline fallback.
  localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(updated));
  // Fire-and-forget backend sync. Persists across browsers/devices.
  apiFetch('/cms/settings', {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({ key: CONTENT_SETTING_KEY, value: updated }),
  }).catch((err) => {
    // Most common cause: admin not logged in, or backend down. Local cache remains.
    console.warn('[cmsStore] Backend save failed; changes kept in localStorage only.', err);
  });
}

export function resetCMSData(): CMSData {
  localStorage.removeItem(CMS_STORAGE_KEY);
  return defaultCMSData;
}

/**
 * Fetch the authoritative CMS blob from the backend and prime the localStorage
 * cache so that synchronous `loadCMSData()` reads fresh data at first render.
 * Called once at app boot from `main.tsx`.
 */
export async function initCMSData(): Promise<void> {
  try {
    const remote = await apiFetch<CMSData | null>('/cms/public-content');
    if (remote && typeof remote === 'object' && 'properties' in remote) {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(remote));
    }
  } catch {
    // Backend unreachable — fall back to whatever's in localStorage (or defaults).
  }
}

/**
 * Sync specific fields from a host property into the matching CMS property.
 * Called whenever a host saves add-ons, day package, or other listing details.
 */
export function syncHostPropertyToCMS(patch: {
  id: string;
  addOns?: import('./types').CMSAddOn[];
  dayPackage?: import('./types').CMSDayPackage;
  housePolicies?: string[];
}): void {
  const data = loadCMSData();
  const idx = data.properties.findIndex((p) => p.id === patch.id);
  if (idx < 0) return; // host-only property not in CMS yet — skip
  if (patch.addOns !== undefined) data.properties[idx].addOns = patch.addOns;
  if (patch.dayPackage !== undefined) data.properties[idx].dayPackage = patch.dayPackage;
  if (patch.housePolicies !== undefined) data.properties[idx].housePolicies = patch.housePolicies;
  saveCMSData(data);
}
