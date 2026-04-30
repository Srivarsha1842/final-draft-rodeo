// Lightweight in-browser RAG engine for the AI Trip Planner.
// - Corpus: live CMS properties (loaded from loadCMSData()).
// - Retrieval: intent parsing + structured filters (city, budget, guests)
//   combined with lexical scoring over property text fields.
// - Generation: template responses that paraphrase the captured slots and
//   ground in the retrieved property data (truly RAG — no external API).

import { CMSProperty } from '@/pages/admin/types';
import { ChatMessage } from '@/mocks/aiPlanner';

// ── Intent / slot schema ────────────────────────────────────────────────────

export interface QueryState {
  city?: string;         // canonical city name (e.g. "Goa")
  state?: string;        // canonical state name
  budgetMax?: number;    // per-night INR ceiling
  vibes: string[];       // romantic, family, adventure, luxury, wellness...
  guests?: number;
  days?: number;         // trip length in days
  wantItinerary?: boolean;
  wantPrice?: boolean;
  isGreeting?: boolean;
  isThanks?: boolean;
}

const EMPTY_STATE: QueryState = { vibes: [] };

// Vibe → synonym keywords. Used for both intent extraction and scoring bonus.
const VIBE_KEYWORDS: Record<string, string[]> = {
  romantic: ['romantic', 'couple', 'couples', 'honeymoon', 'anniversary', 'intimate', 'getaway for two'],
  family: ['family', 'kids', 'children', 'parents', 'family-friendly', 'family friendly'],
  adventure: ['adventure', 'trek', 'trekking', 'hiking', 'rafting', 'thrill', 'paragliding', 'zip', 'adventurous', 'offbeat'],
  luxury: ['luxury', 'luxurious', 'premium', 'opulent', 'lavish', '5-star', 'five star', 'five-star', 'deluxe'],
  budget: ['cheap', 'affordable', 'budget', 'economical', 'inexpensive', 'under', 'low cost'],
  beach: ['beach', 'coast', 'sea', 'ocean', 'seaside', 'seashore', 'coastal', 'island'],
  mountain: ['mountain', 'mountains', 'hill', 'hills', 'himalaya', 'himalayan', 'snow', 'ski', 'valley'],
  wellness: ['wellness', 'spa', 'yoga', 'meditation', 'retreat', 'detox', 'ayurveda', 'mindful'],
  peaceful: ['peaceful', 'quiet', 'calm', 'serene', 'tranquil', 'relax', 'relaxing', 'unwind'],
  pool: ['pool', 'swimming', 'infinity pool', 'private pool'],
  heritage: ['heritage', 'palace', 'royal', 'cultural', 'history', 'historic', 'old-world'],
  nature: ['nature', 'forest', 'jungle', 'wildlife', 'green', 'eco', 'plantation'],
  party: ['party', 'nightlife', 'bar', 'club', 'fun'],
  work: ['workation', 'work from', 'remote', 'wifi', 'digital nomad'],
};

// ── Corpus helpers ──────────────────────────────────────────────────────────

// Build a list of known cities/states from the live corpus for matching.
function extractPlaces(corpus: CMSProperty[]): { cities: string[]; states: string[] } {
  const cities = new Set<string>();
  const states = new Set<string>();
  for (const p of corpus) {
    if (p.city) cities.add(p.city);
    if (p.state) states.add(p.state);
  }
  return { cities: Array.from(cities), states: Array.from(states) };
}

// Known destinations that may appear in queries even without CMS coverage —
// used only for friendly acknowledgement (retrieval then falls back to whole corpus).
const EXTRA_DESTINATIONS = [
  'Goa', 'Manali', 'Udaipur', 'Coorg', 'Andaman', 'Kerala',
  'Jaisalmer', 'Ooty', 'Shimla', 'Jaipur', 'Mumbai', 'Delhi',
  'Rishikesh', 'Darjeeling', 'Leh', 'Ladakh', 'Pondicherry',
  'Mysore', 'Munnar', 'Alleppey', 'Bangalore', 'Bengaluru',
  'Rajasthan', 'Himachal Pradesh', 'Kashmir', 'Maldives',
];

// ── Intent extraction ───────────────────────────────────────────────────────

function extractBudget(text: string): number | undefined {
  const t = text.toLowerCase().replace(/,/g, '');
  // "under 20k", "below ₹15k", "under 15000", "around 10k", "upto 25000"
  const patterns = [
    /(?:under|below|upto|up to|within|less than|max)\s*₹?\s*(\d+(?:\.\d+)?)\s*(k|000|l|lakh)?/,
    /₹?\s*(\d+(?:\.\d+)?)\s*(k|000|l|lakh)\s*(?:budget|max)?/,
    /budget\s*(?:of|is|~)?\s*₹?\s*(\d+(?:\.\d+)?)\s*(k|000|l|lakh)?/,
  ];
  for (const re of patterns) {
    const m = t.match(re);
    if (m) {
      const n = parseFloat(m[1]);
      const unit = (m[2] ?? '').toLowerCase();
      let value = n;
      if (unit === 'k') value = n * 1000;
      else if (unit === 'l' || unit === 'lakh') value = n * 100000;
      else if (unit === '000') value = n * 1000;
      // sanity: anything < 500 was probably "k" shorthand (e.g., "20" meaning 20k)
      if (!unit && n < 500) value = n * 1000;
      if (value >= 500 && value <= 1_000_000) return Math.round(value);
    }
  }
  return undefined;
}

function extractDays(text: string): number | undefined {
  const t = text.toLowerCase();
  if (/\bweekend\b/.test(t)) return 2;
  if (/\b(week long|week-long|a week|one week|1 week)\b/.test(t)) return 7;
  const m = t.match(/(\d+)\s*(?:days?|nights?|d\/n|n\/d)/);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n >= 1 && n <= 30) return n;
  }
  return undefined;
}

function extractGuests(text: string): number | undefined {
  const t = text.toLowerCase();
  if (/\bsolo\b/.test(t)) return 1;
  if (/\b(couple|honeymoon|anniversary|for two|two of us)\b/.test(t)) return 2;
  const m = t.match(/(?:family of|group of|party of|with)?\s*(\d+)\s*(?:guests?|people|persons?|pax|adults?|friends?|of us)/);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n >= 1 && n <= 20) return n;
  }
  return undefined;
}

function extractPlace(
  text: string,
  places: { cities: string[]; states: string[] },
): { city?: string; state?: string } {
  const t = text.toLowerCase();
  for (const city of places.cities) {
    if (new RegExp(`\\b${escapeRegex(city.toLowerCase())}\\b`).test(t)) {
      return { city };
    }
  }
  for (const state of places.states) {
    if (new RegExp(`\\b${escapeRegex(state.toLowerCase())}\\b`).test(t)) {
      return { state };
    }
  }
  for (const dest of EXTRA_DESTINATIONS) {
    if (new RegExp(`\\b${escapeRegex(dest.toLowerCase())}\\b`).test(t)) {
      // Could be city or state — store as city, scorer falls back to fuzzy match.
      return { city: dest };
    }
  }
  return {};
}

function extractVibes(text: string): string[] {
  const t = text.toLowerCase();
  const hits: string[] = [];
  for (const [vibe, syns] of Object.entries(VIBE_KEYWORDS)) {
    if (syns.some((s) => t.includes(s))) hits.push(vibe);
  }
  return hits;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function extractIntent(text: string, corpus: CMSProperty[]): QueryState {
  const t = text.toLowerCase().trim();
  const places = extractPlaces(corpus);
  const { city, state } = extractPlace(text, places);
  const vibes = extractVibes(text);
  return {
    city,
    state,
    budgetMax: extractBudget(text),
    vibes,
    guests: extractGuests(text),
    days: extractDays(text),
    wantItinerary: /\b(itinerary|plan|schedule|day[- ]?by[- ]?day|what to do|things to do)\b/.test(t),
    wantPrice: /\b(price|cost|how much|estimate|breakdown|expense|expenses)\b/.test(t)
      && !/\bunder\b|\bbudget\b/.test(t), // avoid double-firing with budget parse
    isGreeting: /^(hi|hello|hey|namaste|yo|good (morning|evening|afternoon))\b/.test(t),
    isThanks: /\b(thanks|thank you|thx|ty|appreciate|awesome|great)\b/.test(t) && t.length < 40,
  };
}

// Merge accumulated slots so follow-ups work ("under 15k" after "trip to Goa").
// Vibes union. New non-undefined values override; undefined preserves previous.
export function mergeState(prev: QueryState, next: QueryState): QueryState {
  return {
    city: next.city ?? prev.city,
    state: next.state ?? prev.state,
    budgetMax: next.budgetMax ?? prev.budgetMax,
    vibes: Array.from(new Set([...prev.vibes, ...next.vibes])),
    guests: next.guests ?? prev.guests,
    days: next.days ?? prev.days,
    // Itinerary/price/greeting flags reset per turn.
    wantItinerary: next.wantItinerary,
    wantPrice: next.wantPrice,
    isGreeting: next.isGreeting,
    isThanks: next.isThanks,
  };
}

// "cheaper" / "more luxury" / "different city" — lightweight refinement.
export function applyRefinements(state: QueryState, raw: string): QueryState {
  const t = raw.toLowerCase();
  const next = { ...state };
  if (/\b(cheaper|lower budget|less expensive|something cheaper)\b/.test(t)) {
    next.budgetMax = Math.round((state.budgetMax ?? 20000) * 0.6);
  }
  if (/\b(more luxurious|fancier|upgrade|premium option|nicer)\b/.test(t)) {
    next.budgetMax = Math.round((state.budgetMax ?? 15000) * 1.8);
    if (!next.vibes.includes('luxury')) next.vibes = [...next.vibes, 'luxury'];
  }
  if (/\b(different|another|elsewhere|somewhere else)\b.*\b(city|place|destination|area)\b/.test(t)) {
    next.city = undefined;
    next.state = undefined;
  }
  return next;
}

// ── Retrieval ───────────────────────────────────────────────────────────────

function propertyBlob(p: CMSProperty): string {
  return [
    p.name, p.city, p.state, p.location, p.type,
    ...(p.tags ?? []),
    ...(p.amenities ?? []),
    (p.description ?? '').slice(0, 400),
  ].join(' ').toLowerCase();
}

const STOPWORDS = new Set([
  'a', 'an', 'the', 'of', 'in', 'on', 'at', 'to', 'for', 'and', 'or', 'with',
  'i', 'me', 'my', 'we', 'our', 'you', 'your', 'is', 'are', 'was', 'were',
  'be', 'been', 'want', 'need', 'looking', 'look', 'please', 'show', 'find',
  'get', 'give', 'like', 'would', 'could', 'can', 'trip', 'stay', 'place',
  'vacation', 'holiday', 'tell', 'tellme', 'about', 'somewhere', 'something',
  'under', 'budget', 'rupees', 'inr', 'rs',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9₹\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t) && !/^\d+$/.test(t));
}

export function retrieveProperties(
  state: QueryState,
  raw: string,
  corpus: CMSProperty[],
): CMSProperty[] {
  if (corpus.length === 0) return [];
  const tokens = tokenize(raw);
  const placeQuery = (state.city ?? state.state ?? '').toLowerCase();

  // Structured pre-filter by place.
  let candidates = corpus;
  if (placeQuery) {
    const matched = corpus.filter(
      (p) =>
        p.city.toLowerCase() === placeQuery ||
        p.state.toLowerCase() === placeQuery ||
        p.location.toLowerCase().includes(placeQuery) ||
        p.city.toLowerCase().includes(placeQuery),
    );
    if (matched.length > 0) candidates = matched;
    // else: fall through to full corpus and rely on scoring (graceful).
  }

  // Score each candidate.
  const scored = candidates.map((p) => {
    const blob = propertyBlob(p);
    let score = (p.rating ?? 4) * 1.5; // base: let good properties surface

    // Exact token hits.
    for (const tok of tokens) {
      if (blob.includes(tok)) score += 2;
    }

    // Vibe synonym hits (heavier weight — user preferences matter most).
    for (const vibe of state.vibes) {
      const syns = VIBE_KEYWORDS[vibe] ?? [vibe];
      if (syns.some((s) => blob.includes(s))) score += 4;
    }

    // Budget shaping: within budget adds a large bonus; over budget penalizes
    // proportionally so slightly-over options can still surface if nothing fits.
    if (state.budgetMax) {
      if (p.pricePerNight <= state.budgetMax) {
        score += 6;
        // Closer to the top of budget = better (travelers often prefer fuller use).
        const ratio = p.pricePerNight / state.budgetMax;
        score += ratio * 2;
      } else {
        score -= Math.min(8, (p.pricePerNight - state.budgetMax) / 2000);
      }
    }

    // Guest capacity fit.
    if (state.guests && p.maxGuests && p.maxGuests >= state.guests) score += 1.5;

    // Superhost / verified nudge.
    if (p.superhost) score += 0.5;
    if (p.verified) score += 0.3;

    return { p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map((x) => x.p);
}

// ── Generation ──────────────────────────────────────────────────────────────

function formatK(n: number): string {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${Math.round(n / 1000)}k`;
  return String(n);
}

function titleCase(s: string): string {
  return s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
}

function describeIntent(state: QueryState): string {
  const parts: string[] = [];
  if (state.vibes.length) {
    const v = state.vibes.slice(0, 2).map(titleCase).join(' & ');
    parts.push(`a ${v.toLowerCase()} trip`);
  } else {
    parts.push('a trip');
  }
  if (state.city) parts.push(`to ${titleCase(state.city)}`);
  if (state.guests) parts.push(`for ${state.guests} guest${state.guests > 1 ? 's' : ''}`);
  if (state.days) parts.push(`over ${state.days} day${state.days > 1 ? 's' : ''}`);
  if (state.budgetMax) parts.push(`under ₹${formatK(state.budgetMax)}/night`);
  return parts.join(' ');
}

function pickOpener(state: QueryState): string {
  const intent = describeIntent(state);
  const openers = [
    `Great — here are my top picks for ${intent}:`,
    `Got it! These stood out for ${intent}:`,
    `I pulled together a few lovely options for ${intent}:`,
    `Based on your preferences — ${intent} — here's what I'd recommend:`,
  ];
  return openers[Math.floor(Math.random() * openers.length)];
}

function toCardProperty(p: CMSProperty) {
  return {
    id: p.id,
    name: p.name,
    location: p.location,
    price: p.pricePerNight,
    rating: p.rating,
    image: (p.images && p.images[0]) || '',
    tags: (p.tags ?? []).slice(0, 3),
  };
}

// Build a day-by-day itinerary grounded in the top retrieved property.
function buildItinerary(state: QueryState, top: CMSProperty): ChatMessage {
  const days = Math.min(Math.max(state.days ?? 3, 2), 7);
  const activities = top.dayPackage?.activities?.length ? top.dayPackage.activities : [];
  const amenities = top.amenities ?? [];
  const tags = top.tags ?? [];
  const nearby = [
    `Explore ${top.location}`,
    `Local ${tags[0] ?? 'sightseeing'}`,
    `Evening walk & local cuisine`,
    activities[0] ?? `Enjoy ${amenities[0] ?? 'the property amenities'}`,
    activities[1] ?? `Visit a nearby landmark`,
    `Sunset at ${top.city}`,
    `Try ${tags[1] ?? 'regional food'}`,
    `Spa & unwind`,
    `Shopping & souvenirs`,
  ];
  const itinerary = Array.from({ length: days }).map((_, i) => {
    const dayNum = i + 1;
    const pick = (offset: number) => nearby[(i * 3 + offset) % nearby.length];
    let title = '';
    if (i === 0) title = `Arrival & Check-in at ${top.name}`;
    else if (i === days - 1) title = `Farewell Day`;
    else title = `Day ${dayNum} — Exploring ${top.city}`;
    return {
      day: dayNum,
      title,
      activities: [pick(0), pick(1), pick(2)],
    };
  });

  const nights = Math.max(1, days - 1);
  const stayCost = top.pricePerNight * nights;
  const priceEstimate = {
    min: Math.round(stayCost * 1.15),
    max: Math.round(stayCost * 1.55),
    currency: '₹',
  };

  return {
    id: '',
    role: 'ai',
    text: `Here's a ${days}-day plan built around ${top.name} in ${top.location}:`,
    type: 'itinerary',
    data: { itinerary, priceEstimate },
    timestamp: new Date(),
  };
}

function buildPriceBreakdown(state: QueryState, top: CMSProperty): ChatMessage {
  const nights = Math.max(1, (state.days ?? 3) - 1);
  const stayMin = Math.round(top.pricePerNight * nights * 0.95);
  const stayMax = Math.round(top.pricePerNight * nights * 1.2);
  const priceEstimate = {
    min: stayMin + 8000 + 5000,
    max: stayMax + 12000 + 8000,
    currency: '₹',
  };
  return {
    id: '',
    role: 'ai',
    text: `Here's a rough budget for ${top.name} (${nights} nights):`,
    type: 'price',
    data: { priceEstimate },
    timestamp: new Date(),
  };
}

function buildClarifier(state: QueryState): ChatMessage {
  const missing: string[] = [];
  if (!state.city) missing.push('which destination or region');
  if (!state.budgetMax) missing.push('a rough per-night budget');
  if (!state.vibes.length) missing.push('the vibe (romantic, family, adventure, luxury, wellness…)');
  const q =
    missing.length > 0
      ? `Could you tell me ${missing.slice(0, 2).join(' and ')}? That'll let me pull the best matches.`
      : `Could you give me a bit more detail about what you're looking for?`;
  return {
    id: '',
    role: 'ai',
    text: q,
    type: 'text',
    timestamp: new Date(),
  };
}

// ── Public entry point ──────────────────────────────────────────────────────

export interface PlannerResult {
  reply: ChatMessage;
  state: QueryState;
}

export function runPlannerTurn(
  rawInput: string,
  prevState: QueryState | undefined,
  corpus: CMSProperty[],
): PlannerResult {
  const fresh = extractIntent(rawInput, corpus);
  let state = mergeState(prevState ?? EMPTY_STATE, fresh);
  state = applyRefinements(state, rawInput);

  // Greeting with no other slots → warm intro.
  if (state.isGreeting && !state.city && !state.budgetMax && state.vibes.length === 0) {
    return {
      reply: {
        id: '',
        role: 'ai',
        text: "Hi! I'd love to help you plan a trip. Tell me a destination, your budget, or the kind of experience you're after (romantic, adventure, family, wellness…) and I'll find the right stays for you.",
        type: 'text',
        timestamp: new Date(),
      },
      state,
    };
  }

  if (state.isThanks && !state.city && !state.budgetMax && state.vibes.length === 0) {
    return {
      reply: {
        id: '',
        role: 'ai',
        text: "Happy to help! Want me to plan a full itinerary, check prices, or look at a different destination?",
        type: 'text',
        timestamp: new Date(),
      },
      state,
    };
  }

  const retrieved = retrieveProperties(state, rawInput, corpus);

  // Itinerary path.
  if (state.wantItinerary && retrieved.length > 0) {
    return { reply: buildItinerary(state, retrieved[0]), state };
  }

  // Price path.
  if (state.wantPrice && retrieved.length > 0) {
    return { reply: buildPriceBreakdown(state, retrieved[0]), state };
  }

  // Not enough signal + nothing retrieved → ask a clarifying question.
  const haveSignal = !!(state.city || state.budgetMax || state.vibes.length || state.guests);
  if (!haveSignal || retrieved.length === 0) {
    return { reply: buildClarifier(state), state };
  }

  return {
    reply: {
      id: '',
      role: 'ai',
      text: pickOpener(state),
      type: 'property',
      data: { properties: retrieved.map(toCardProperty) },
      timestamp: new Date(),
    },
    state,
  };
}
