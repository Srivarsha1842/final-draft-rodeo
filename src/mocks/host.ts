export interface HostBenefit {
  id: string;
  icon: string;
  title: string;
  description: string;
  stat?: string;
  statLabel?: string;
}

export interface HostTestimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  propertyType: string;
  quote: string;
  earnings: string;
  since: string;
}

export interface HostStep {
  number: number;
  title: string;
  description: string;
  icon: string;
}

export interface HostFAQ {
  id: string;
  question: string;
  answer: string;
}

export interface HostFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export const hostBenefits: HostBenefit[] = [
  {
    id: '1',
    title: 'Maximize Your Earnings',
    icon: 'ri-money-rupee-circle-line',
    description: 'Property owners on Triprodeo earn an average of ₹25,000 per booking. List your villa, apartment, or unique space and start earning passive income.',
    stat: '₹3,00,000+',
    statLabel: 'Average annual earnings',
  },
  {
    id: '2',
    title: 'Property Owner Protection Insurance',
    icon: 'ri-shield-check-line',
    description: 'Every booking includes ₹1 crore in property damage protection and ₹10 lakh in liability insurance. You\'re covered if anything goes wrong.',
    stat: '₹1 Crore',
    statLabel: 'Property protection',
  },
  {
    id: '3',
    title: 'Flexible Listing',
    icon: 'ri-calendar-check-line',
    description: 'You control your calendar. Block dates when you need the space, set minimum stays, and choose your own house rules.',
    stat: '100%',
    statLabel: 'Calendar control',
  },
  {
    id: '4',
    title: '24/7 Owner Support',
    icon: 'ri-customer-service-2-line',
    description: 'Our dedicated support team is available round the clock to help with any issues, from guest questions to emergency situations.',
    stat: '24/7',
    statLabel: 'Support availability',
  },
  {
    id: '5',
    title: 'Verified Guests Only',
    icon: 'ri-user-star-line',
    description: 'All guests are verified with government ID and phone number. You can also require positive reviews before accepting bookings.',
    stat: '100%',
    statLabel: 'Guest verification',
  },
  {
    id: '6',
    title: 'Global Reach',
    icon: 'ri-global-line',
    description: 'Access millions of travelers from India and around the world. Our AI-powered platform matches your property with the right guests.',
    stat: '10M+',
    statLabel: 'Active travelers',
  },
];

export const hostSteps: HostStep[] = [
  {
    number: 1,
    title: 'Create Your Listing',
    description: 'Upload photos, write a description, and set your house rules. Our smart tools help you create an attractive listing in minutes.',
    icon: 'ri-home-4-line',
  },
  {
    number: 2,
    title: 'Set Your Price',
    description: 'Use our pricing tools to set competitive rates. Our AI suggests optimal pricing based on demand, season, and local events.',
    icon: 'ri-price-tag-3-line',
  },
  {
    number: 3,
    title: 'Welcome Guests',
    description: 'Once booked, coordinate check-in with your guests. Our app handles payments, provides guest info, and offers hosting tips.',
    icon: 'ri-door-open-line',
  },
];

export const hostTestimonials: HostTestimonial[] = [
  {
    id: '1',
    name: 'Priya Mehta',
    location: 'Goa',
    avatar: 'https://readdy.ai/api/search-image?query=professional%20indian%20woman%20smiling%20portrait%20photo%20warm%20confident&width=80&height=80&seq=hostt1&orientation=squarish',
    propertyType: 'Beach Villa Owner',
    quote: 'Listing on Triprodeo transformed my life. My villa was sitting empty most of the year, and now it earns ₹40,000 per month. The platform is incredibly easy to use, and the guests are wonderful.',
    earnings: '₹4,80,000/year',
    since: 'Property owner since 2022',
  },
  {
    id: '2',
    name: 'Arjun Rawat',
    location: 'Manali',
    avatar: 'https://readdy.ai/api/search-image?query=young%20indian%20man%20portrait%20friendly%20smile%20outdoor%20setting&width=80&height=80&seq=hostt2&orientation=squarish',
    propertyType: 'Mountain Chalet Owner',
    quote: 'I was skeptical at first, but Triprodeo\'s protection and 24/7 support gave me confidence. Now I host guests from all over the world and earn enough to maintain my property year-round.',
    earnings: '₹2,40,000/year',
    since: 'Property owner since 2023',
  },
  {
    id: '3',
    name: 'Sunita Nair',
    location: 'Kerala',
    avatar: 'https://readdy.ai/api/search-image?query=south%20indian%20woman%20warm%20smile%20portrait%20professional&width=80&height=80&seq=hostt3&orientation=squarish',
    propertyType: 'Houseboat Operator',
    quote: 'The AI pricing tool is a game-changer. It automatically adjusts my rates during peak season and festivals. I\'ve seen a 40% increase in bookings since joining Triprodeo.',
    earnings: '₹3,60,000/year',
    since: 'Property owner since 2021',
  },
];

export const hostFeatures: HostFeature[] = [
  {
    id: 'f1',
    icon: 'ri-camera-line',
    title: 'Professional Photography',
    description: 'Get free professional photoshoot for your property to attract more bookings and higher rates.',
  },
  {
    id: 'f2',
    icon: 'ri-ai-generate',
    title: 'AI-Powered Pricing',
    description: 'Smart pricing algorithm that adjusts your rates based on demand, seasonality, and local events.',
  },
  {
    id: 'f3',
    icon: 'ri-message-3-line',
    title: 'Auto-Responder',
    description: 'AI chatbot handles common guest questions instantly, saving you time and improving response rates.',
  },
  {
    id: 'f4',
    icon: 'ri-bar-chart-box-line',
    title: 'Earnings Dashboard',
    description: 'Detailed analytics on your performance, occupancy rates, and revenue trends over time.',
  },
  {
    id: 'f5',
    icon: 'ri-brush-2-line',
    title: 'Cleaning Services',
    description: 'Access vetted professional cleaning services at discounted rates for your turnovers.',
  },
  {
    id: 'f6',
    icon: 'ri-key-2-line',
    title: 'Smart Check-in',
    description: 'Offer keyless entry with smart locks, or coordinate seamless meet-and-greet check-ins.',
  },
];

export const hostFAQ: HostFAQ[] = [
  {
    id: 'q1',
    question: 'How much does it cost to list my property?',
    answer: 'Listing your property on Triprodeo is completely free. We only charge a small service fee (3-5%) when you receive a booking. There are no upfront costs or monthly fees.',
  },
  {
    id: 'q2',
    question: 'What type of properties can I list?',
    answer: 'You can list almost any type of accommodation: apartments, villas, houses, farmhouses, treehouses, houseboats, tents, and unique spaces. As long as it\'s safe and legal, you can host it on Triprodeo.',
  },
  {
    id: 'q3',
    question: 'How do I get paid?',
    answer: 'Payments are processed securely through our platform. Guest payments are held until 24 hours after check-in, then transferred directly to your bank account. You can choose weekly or monthly payouts.',
  },
  {
    id: 'q4',
    question: 'Can I choose who stays at my property?',
    answer: 'Absolutely! You set your house rules, minimum stay requirements, and can review guest profiles before accepting bookings. You have full control over who stays at your property.',
  },
  {
    id: 'q5',
    question: 'What if a guest damages my property?',
    answer: 'Every Triprodeo booking includes up to ₹1 crore in property damage protection. If damage occurs, our support team helps you file a claim and get reimbursed quickly.',
  },
  {
    id: 'q6',
    question: 'Do I need to be present during the stay?',
    answer: 'Not at all. Many hosts offer self check-in with smart locks or lockboxes. You can manage everything remotely through our host app, from messaging guests to coordinating cleaning.',
  },
  {
    id: 'q7',
    question: 'How does the AI pricing tool work?',
    answer: 'Our AI analyzes millions of data points including local events, seasonality, demand patterns, and competitor pricing to suggest optimal rates. You can accept suggestions or set your own prices.',
  },
  {
    id: 'q8',
    question: 'Can I block dates when I want to use my property?',
    answer: 'Yes! You have complete control over your calendar. Simply block any dates you want to keep for yourself, and guests won\'t be able to book those nights.',
  },
];

export const hostStats = {
  totalHosts: '50,000+',
  totalEarnings: '₹500 Crore+',
  averageRating: '4.8',
  countries: '25+',
};

export const listingTypes = [
  {
    id: 'villa',
    title: 'Villa',
    description: 'Luxury standalone homes with private amenities',
    icon: 'ri-home-4-line',
    image: 'https://readdy.ai/api/search-image?query=luxury%20villa%20exterior%20pool%20tropical%20garden%20modern%20architecture%20sunset&width=400&height=300&seq=lt1&orientation=landscape',
  },
  {
    id: 'apartment',
    title: 'Apartment',
    description: 'Urban flats and serviced apartments',
    icon: 'ri-building-2-line',
    image: 'https://readdy.ai/api/search-image?query=modern%20apartment%20interior%20living%20room%20city%20view%20contemporary%20design&width=400&height=300&seq=lt2&orientation=landscape',
  },
  {
    id: 'cottage',
    title: 'Cottage',
    description: 'Cozy homes in scenic locations',
    icon: 'ri-home-smile-line',
    image: 'https://readdy.ai/api/search-image?query=cozy%20cottage%20mountain%20setting%20wooden%20exterior%20garden%20flowers&width=400&height=300&seq=lt3&orientation=landscape',
  },
  {
    id: 'unique',
    title: 'Unique Stays',
    description: 'Treehouses, houseboats, tents & more',
    icon: 'ri-compass-3-line',
    image: 'https://readdy.ai/api/search-image?query=unique%20treehouse%20forest%20setting%20wooden%20cabin%20elevated%20nature&width=400&height=300&seq=lt4&orientation=landscape',
  },
];