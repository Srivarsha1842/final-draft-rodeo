export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  type?: 'text' | 'property' | 'itinerary' | 'price';
  data?: {
    properties?: Array<{
      id: string;
      name: string;
      location: string;
      price: number;
      rating: number;
      image: string;
      tags: string[];
    }>;
    itinerary?: Array<{
      day: number;
      title: string;
      activities: string[];
    }>;
    priceEstimate?: {
      min: number;
      max: number;
      currency: string;
    };
  };
  timestamp: Date;
}

export const initialGreeting = {
  id: 'welcome',
  role: 'ai' as const,
  text: "Hi there! I'm your Triprodeo AI Trip Planner. I can help you find the perfect getaway based on your budget, dates, and preferences. What kind of trip are you looking for?",
  type: 'text' as const,
  timestamp: new Date(),
};

export const suggestionPrompts = [
  { icon: 'ri-heart-line', text: 'Romantic weekend in Goa', color: 'bg-rose-50 text-rose-600' },
  { icon: 'ri-team-line', text: 'Family trip to Kerala', color: 'bg-blue-50 text-blue-600' },
  { icon: 'ri-landscape-line', text: 'Adventure in Manali', color: 'bg-emerald-50 text-emerald-600' },
  { icon: 'ri-building-2-line', text: 'Luxury stay in Jaipur', color: 'bg-amber-50 text-amber-600' },
  { icon: 'ri-sun-line', text: 'Beach vacation in Maldives', color: 'bg-cyan-50 text-cyan-600' },
  { icon: 'ri-leaf-line', text: 'Wellness retreat in Rishikesh', color: 'bg-lime-50 text-lime-600' },
];

export const mockAIResponses: Record<string, ChatMessage> = {
  'romantic-goa': {
    id: 'romantic-goa-response',
    role: 'ai',
    text: "Perfect! I've found some amazing romantic getaways in Goa for you. Here are my top picks:",
    type: 'property',
    data: {
      properties: [
        {
          id: 'p1',
          name: 'Azure Cliff Villa',
          location: 'Vagator, Goa',
          price: 18999,
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1582719508461-9058e2b5e100?w=400&h=300&fit=crop',
          tags: ['Private Pool', 'Cliff-top', 'Couples Spa'],
        },
        {
          id: 'p5',
          name: 'Sunset Beach House',
          location: 'Morjim, Goa',
          price: 15999,
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&h=300&fit=crop',
          tags: ['Beachfront', 'Private Chef', 'Sunset Views'],
        },
        {
          id: 'p8',
          name: 'Romantic Treehouse',
          location: 'Assagao, Goa',
          price: 12999,
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
          tags: ['Treehouse', 'Nature', 'Private Deck'],
        },
      ],
    },
    timestamp: new Date(),
  },
  'family-kerala': {
    id: 'family-kerala-response',
    role: 'ai',
    text: "Great choice for a family trip! Kerala has amazing family-friendly resorts. Here are my recommendations:",
    type: 'property',
    data: {
      properties: [
        {
          id: 'p2',
          name: 'Kerala Backwater Retreat',
          location: 'Alleppey, Kerala',
          price: 12499,
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
          tags: ['Houseboat', 'Family Suite', 'Kids Pool'],
        },
        {
          id: 'p9',
          name: 'Munnar Tea Estate Villa',
          location: 'Munnar, Kerala',
          price: 14999,
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop',
          tags: ['Tea Gardens', 'Nature Walks', 'Family Activities'],
        },
        {
          id: 'p10',
          name: 'Kovalam Beach Resort',
          location: 'Kovalam, Kerala',
          price: 9999,
          rating: 4.6,
          image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
          tags: ['Beach Access', 'Kids Club', 'Water Sports'],
        },
      ],
    },
    timestamp: new Date(),
  },
  'adventure-manali': {
    id: 'adventure-manali-response',
    role: 'ai',
    text: "Adventure awaits in Manali! I've found some exciting stays perfect for thrill-seekers:",
    type: 'property',
    data: {
      properties: [
        {
          id: 'p3',
          name: 'Himalayan Adventure Camp',
          location: 'Solang Valley, Manali',
          price: 8999,
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop',
          tags: ['Camping', 'Trekking', 'River Rafting'],
        },
        {
          id: 'p11',
          name: 'Snow Peak Lodge',
          location: 'Old Manali',
          price: 11999,
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=300&fit=crop',
          tags: ['Mountain Views', 'Skiing', 'Hot Tub'],
        },
        {
          id: 'p12',
          name: 'Forest Cabin Retreat',
          location: 'Naggar, Manali',
          price: 7499,
          rating: 4.5,
          image: 'https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?w=400&h=300&fit=crop',
          tags: ['Forest', 'Hiking', 'Bonfire'],
        },
      ],
    },
    timestamp: new Date(),
  },
  'luxury-jaipur': {
    id: 'luxury-jaipur-response',
    role: 'ai',
    text: "Experience royal luxury in the Pink City! Here are the most exquisite palace stays:",
    type: 'property',
    data: {
      properties: [
        {
          id: 'p4',
          name: 'Royal Palace Suite',
          location: 'Jaipur, Rajasthan',
          price: 24999,
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop',
          tags: ['Heritage', 'Royal Experience', 'Butler Service'],
        },
        {
          id: 'p13',
          name: 'Rambagh Palace',
          location: 'Jaipur, Rajasthan',
          price: 35000,
          rating: 5.0,
          image: 'https://images.unsplash.com/photo-1584132967334-e7d43d83d3ac?w=400&h=300&fit=crop',
          tags: ['5-Star', 'Historic', 'Fine Dining'],
        },
        {
          id: 'p14',
          name: 'Samode Haveli',
          location: 'Jaipur, Rajasthan',
          price: 18999,
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop',
          tags: ['Boutique', 'Courtyard', 'Art Gallery'],
        },
      ],
    },
    timestamp: new Date(),
  },
  'itinerary': {
    id: 'itinerary-response',
    role: 'ai',
    text: "Here's a complete 3-day itinerary I've crafted for your trip:",
    type: 'itinerary',
    data: {
      itinerary: [
        {
          day: 1,
          title: 'Arrival & Relaxation',
          activities: [
            'Check-in at your selected property',
            'Welcome drink and property tour',
            'Sunset viewing from private deck/pool',
            'Romantic candlelight dinner setup',
          ],
        },
        {
          day: 2,
          title: 'Exploration & Adventure',
          activities: [
            'Morning yoga/meditation session',
            'Local sightseeing or beach activities',
            'Couples spa treatment (60 min)',
            'Private beachside dinner or BBQ',
          ],
        },
        {
          day: 3,
          title: 'Departure',
          activities: [
            'Leisurely breakfast with local cuisine',
            'Last-minute souvenir shopping',
            'Check-out with sweet memories',
          ],
        },
      ],
      priceEstimate: {
        min: 45000,
        max: 65000,
        currency: '₹',
      },
    },
    timestamp: new Date(),
  },
  'price': {
    id: 'price-response',
    role: 'ai',
    text: "Based on your preferences, here's the estimated cost breakdown for your trip:",
    type: 'price',
    data: {
      priceEstimate: {
        min: 35000,
        max: 55000,
        currency: '₹',
      },
    },
    timestamp: new Date(),
  },
  'default': {
    id: 'default-response',
    role: 'ai',
    text: "I'd love to help you plan the perfect trip! Could you share a bit more about what you're looking for? For example:\n\n• What's your budget range?\n• How many nights are you planning?\n• Any specific destination in mind?\n• Traveling solo, couple, or family?\n\nThe more details you share, the better I can tailor my recommendations!",
    type: 'text',
    timestamp: new Date(),
  },
};

export const quickReplies = [
  { text: 'Show me properties', icon: 'ri-home-4-line' },
  { text: 'Create itinerary', icon: 'ri-calendar-todo-line' },
  { text: 'Price estimate', icon: 'ri-money-rupee-circle-line' },
  { text: 'Book now', icon: 'ri-check-double-line' },
];