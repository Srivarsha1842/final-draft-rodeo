export interface CommissionTier {
  id: string;
  name: string;
  minBookings: number;
  commissionRate: string;
  bonusPerBooking: string;
  benefits: string[];
  color: string;
  icon: string;
}

export interface PartnerBenefit {
  id: string;
  icon: string;
  title: string;
  description: string;
  stat?: string;
  statLabel?: string;
}

export interface PartnerTestimonial {
  id: string;
  name: string;
  company: string;
  location: string;
  avatar: string;
  quote: string;
  monthlyEarnings: string;
  totalBookings: string;
  since: string;
}

export interface PartnerFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface PartnerFAQ {
  id: string;
  question: string;
  answer: string;
}

export const commissionTiers: CommissionTier[] = [
  {
    id: 'bronze',
    name: 'Bronze Partner',
    minBookings: 0,
    commissionRate: '5%',
    bonusPerBooking: '₹0',
    benefits: [
      '5% commission on all bookings',
      'Access to partner dashboard',
      'Monthly payout',
      'Basic support',
    ],
    color: 'bg-amber-700',
    icon: 'ri-medal-line',
  },
  {
    id: 'silver',
    name: 'Silver Partner',
    minBookings: 10,
    commissionRate: '7%',
    bonusPerBooking: '₹500',
    benefits: [
      '7% commission on all bookings',
      '₹500 bonus per booking',
      'Priority support',
      'Early access to new properties',
      'Marketing materials',
    ],
    color: 'bg-slate-400',
    icon: 'ri-vip-crown-line',
  },
  {
    id: 'gold',
    name: 'Gold Partner',
    minBookings: 25,
    commissionRate: '10%',
    bonusPerBooking: '₹1,000',
    benefits: [
      '10% commission on all bookings',
      '₹1,000 bonus per booking',
      'Dedicated account manager',
      'Exclusive property access',
      'Co-marketing opportunities',
      'Quarterly performance bonuses',
    ],
    color: 'bg-amber-400',
    icon: 'ri-vip-diamond-line',
  },
  {
    id: 'platinum',
    name: 'Platinum Partner',
    minBookings: 50,
    commissionRate: '15%',
    bonusPerBooking: '₹2,000',
    benefits: [
      '15% commission on all bookings',
      '₹2,000 bonus per booking',
      'VIP account manager',
      'First access to premium inventory',
      'White-label solutions',
      'Annual partner conference invite',
      'Custom API access',
    ],
    color: 'bg-purple-500',
    icon: 'ri-vip-crown-fill',
  },
];

export const partnerBenefits: PartnerBenefit[] = [
  {
    id: 'b1',
    icon: 'ri-money-rupee-circle-line',
    title: 'Competitive Commissions',
    description: 'Earn up to 15% commission on every booking plus flat bonuses per transaction. The more you book, the more you earn.',
    stat: '₹2L+',
    statLabel: 'Average monthly earnings',
  },
  {
    id: 'b2',
    icon: 'ri-building-line',
    title: '10,000+ Properties',
    description: 'Access our entire inventory of curated stays, experiences, and bundle packages across 25+ destinations in India.',
    stat: '10,000+',
    statLabel: 'Properties available',
  },
  {
    id: 'b3',
    icon: 'ri-dashboard-3-line',
    title: 'Partner Dashboard',
    description: 'Real-time tracking of bookings, commissions, and performance metrics. Manage your business with powerful analytics.',
    stat: 'Real-time',
    statLabel: 'Commission tracking',
  },
  {
    id: 'b4',
    icon: 'ri-customer-service-2-line',
    title: 'Dedicated Support',
    description: 'Gold and Platinum partners get dedicated account managers and priority support for all client bookings.',
    stat: '24/7',
    statLabel: 'Support availability',
  },
  {
    id: 'b5',
    icon: 'ri-megaphone-line',
    title: 'Marketing Support',
    description: 'Access professionally designed marketing materials, co-branded campaigns, and promotional content.',
    stat: 'Free',
    statLabel: 'Marketing assets',
  },
  {
    id: 'b6',
    icon: 'ri-secure-payment-line',
    title: 'Guaranteed Payments',
    description: 'Timely monthly payouts with transparent reporting. Never chase payments with our automated commission system.',
    stat: 'Monthly',
    statLabel: 'Payout schedule',
  },
];

export const partnerTestimonials: PartnerTestimonial[] = [
  {
    id: 't1',
    name: 'Rajesh Kumar',
    company: 'Wanderlust Travels',
    location: 'Delhi',
    avatar: 'https://readdy.ai/api/search-image?query=professional%20indian%20businessman%20portrait%20confident%20smile%20corporate%20attire&width=80&height=80&seq=pt1&orientation=squarish',
    quote: 'Partnering with Triprodeo transformed my travel agency. The commission structure is the best in the industry, and my clients love the curated properties. I have doubled my revenue in just 6 months.',
    monthlyEarnings: '₹3,50,000',
    totalBookings: '450+',
    since: 'Partner since 2023',
  },
  {
    id: 't2',
    name: 'Priya Sharma',
    company: 'Elite Escapes',
    location: 'Mumbai',
    avatar: 'https://readdy.ai/api/search-image?query=professional%20indian%20businesswoman%20portrait%20confident%20smile%20corporate%20attire&width=80&height=80&seq=pt2&orientation=squarish',
    quote: 'As a luxury travel consultant, I need premium inventory for my HNI clients. Triprodeo is exclusive properties and white-glove service make me look like a hero to my clients. The 15% commission is fantastic.',
    monthlyEarnings: '₹5,20,000',
    totalBookings: '280+',
    since: 'Partner since 2022',
  },
  {
    id: 't3',
    name: 'Arun Nair',
    company: 'Kerala Getaways',
    location: 'Kochi',
    avatar: 'https://readdy.ai/api/search-image?query=professional%20south%20indian%20businessman%20portrait%20warm%20smile%20hospitality%20industry&width=80&height=80&seq=pt3&orientation=squarish',
    quote: 'The partner dashboard is incredibly intuitive. I can track my commissions in real-time and the automated payout system means I never have to worry about payments. Triprodeo is the best B2B platform I have worked with.',
    monthlyEarnings: '₹1,80,000',
    totalBookings: '620+',
    since: 'Partner since 2023',
  },
];

export const partnerFeatures: PartnerFeature[] = [
  {
    id: 'f1',
    icon: 'ri-code-box-line',
    title: 'API Integration',
    description: 'Seamlessly integrate our inventory into your website or app with our robust API. Real-time availability and instant bookings.',
  },
  {
    id: 'f2',
    icon: 'ri-file-list-3-line',
    title: 'Instant Quotes',
    description: 'Generate professional quotes for your clients in seconds with our quote builder tool. Custom branding included.',
  },
  {
    id: 'f3',
    icon: 'ri-group-line',
    title: 'Group Bookings',
    description: 'Easily manage large group bookings with special rates and dedicated support for corporate events and weddings.',
  },
  {
    id: 'f4',
    icon: 'ri-bar-chart-2-line',
    title: 'Performance Analytics',
    description: 'Detailed reports on your booking trends, top destinations, and client preferences to optimize your offerings.',
  },
  {
    id: 'f5',
    icon: 'ri-gift-line',
    title: 'Client Incentives',
    description: 'Access exclusive discounts and perks for your clients, helping you close more deals and build loyalty.',
  },
  {
    id: 'f6',
    icon: 'ri-graduation-cap-line',
    title: 'Partner Training',
    description: 'Free training sessions on product knowledge, sales techniques, and platform features to maximize your success.',
  },
];

export const partnerFAQ: PartnerFAQ[] = [
  {
    id: 'q1',
    question: 'Who can become a Triprodeo partner?',
    answer: 'Travel agencies, tour operators, corporate travel managers, wedding planners, event organizers, and independent travel consultants can all become Triprodeo partners. Whether you are a large agency or a solo consultant, we have a partnership tier for you.',
  },
  {
    id: 'q2',
    question: 'How does the commission structure work?',
    answer: 'You earn a percentage commission on every booking made through your partner account, plus flat bonuses per booking. Commission rates range from 5% to 15% depending on your tier. Bonuses range from ₹0 to ₹2,000 per booking. All commissions are calculated automatically and paid monthly.',
  },
  {
    id: 'q3',
    question: 'When and how do I get paid?',
    answer: 'Commissions are calculated monthly and paid within 10 business days of the month end. Payments are made via bank transfer directly to your registered account. You can track all pending and paid commissions in real-time through your partner dashboard.',
  },
  {
    id: 'q4',
    question: 'Is there any cost to become a partner?',
    answer: 'No, joining the Triprodeo Partner Program is completely free. There are no signup fees, monthly charges, or hidden costs. You only earn money, never pay it.',
  },
  {
    id: 'q5',
    question: 'Can I offer Triprodeo properties on my website?',
    answer: 'Yes! Platinum partners get API access to integrate our full inventory directly into their platforms. Silver and Gold partners can use our booking widgets and white-label solutions. We provide all the technical support you need.',
  },
  {
    id: 'q6',
    question: 'What kind of support do partners receive?',
    answer: 'All partners get access to our partner support team. Silver partners receive priority email support. Gold partners get a dedicated account manager. Platinum partners enjoy VIP support with direct phone access and quarterly business reviews.',
  },
  {
    id: 'q7',
    question: 'How do I track my bookings and commissions?',
    answer: 'Our partner dashboard gives you real-time visibility into all your bookings, commissions earned, payment status, and performance metrics. You can filter by date range, destination, property type, and more.',
  },
  {
    id: 'q8',
    question: 'Can I upgrade my partner tier?',
    answer: 'Absolutely! As your booking volume increases, you automatically qualify for higher tiers with better commission rates. You can also contact your account manager to discuss fast-track upgrades based on your business potential.',
  },
];

export const partnerStats = {
  totalPartners: '2,500+',
  totalBookings: '1,50,000+',
  totalPayouts: '₹50 Crore+',
  avgCommission: '12%',
};

export const partnerTypes = [
  {
    id: 'agency',
    title: 'Travel Agencies',
    description: 'Traditional and online travel agencies looking for premium inventory',
    icon: 'ri-building-2-line',
  },
  {
    id: 'corporate',
    title: 'Corporate Travel',
    description: 'Companies managing business travel and offsite bookings',
    icon: 'ri-briefcase-line',
  },
  {
    id: 'planner',
    title: 'Event Planners',
    description: 'Wedding and event planners seeking unique venues',
    icon: 'ri-calendar-event-line',
  },
  {
    id: 'consultant',
    title: 'Travel Consultants',
    description: 'Independent advisors and luxury travel specialists',
    icon: 'ri-user-star-line',
  },
];