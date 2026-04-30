import { useState } from 'react';

const stats = [
  { value: '2,400+', label: 'Verified Properties', icon: 'ri-home-smile-line' },
  { value: '98%', label: 'Guest Satisfaction', icon: 'ri-thumb-up-line' },
  { value: '4.9★', label: 'Average Rating', icon: 'ri-star-line' },
  { value: '1.2L+', label: 'Happy Travelers', icon: 'ri-group-line' },
];

const pillars = [
  {
    id: 'verified',
    icon: 'ri-shield-check-line',
    title: 'Every Stay Verified',
    subtitle: 'No surprises. Ever.',
    description:
      'Our team personally inspects every property before it goes live. Photos match reality, amenities are confirmed, and quality is guaranteed — so you check in with complete confidence.',
    color: 'from-amber-400 to-orange-400',
    bgLight: 'bg-amber-50',
    textAccent: 'text-amber-600',
    borderAccent: 'border-amber-200',
    metric: '100% verified',
    metricLabel: 'before listing',
    image: 'https://readdy.ai/api/search-image?query=professional%20inspector%20verifying%20luxury%20villa%20property%20quality%20check%20inspection%20clipboard%20modern%20home%20beautiful%20interior%20natural%20light&width=500&height=380&seq=why1&orientation=landscape',
  },
  {
    id: 'curated',
    icon: 'ri-magic-line',
    title: 'AI-Curated Experiences',
    subtitle: 'Your perfect match, instantly.',
    description:
      'Our AI learns your preferences, travel style, and budget to serve up stays you\'ll love — not just what\'s popular. Every recommendation is personalised, not generic.',
    color: 'from-stone-700 to-stone-900',
    bgLight: 'bg-stone-50',
    textAccent: 'text-stone-700',
    borderAccent: 'border-stone-200',
    metric: '3x faster',
    metricLabel: 'trip planning',
    image: 'https://readdy.ai/api/search-image?query=AI%20digital%20interface%20travel%20planning%20personalised%20recommendations%20luxury%20stays%20technology%20modern%20app%20user%20experience%20design%20beautiful&width=500&height=380&seq=why2&orientation=landscape',
  },
  {
    id: 'pricing',
    icon: 'ri-price-tag-3-line',
    title: 'Transparent Pricing',
    subtitle: 'What you see is what you pay.',
    description:
      'No hidden fees, no last-minute surprises. Our pricing is fully transparent with all taxes and charges shown upfront. We\'re so confident, we guarantee the best rate.',
    color: 'from-emerald-500 to-teal-500',
    bgLight: 'bg-emerald-50',
    textAccent: 'text-emerald-700',
    borderAccent: 'border-emerald-200',
    metric: 'Best rate',
    metricLabel: 'guaranteed',
    image: 'https://readdy.ai/api/search-image?query=transparent%20pricing%20clear%20invoice%20receipt%20happy%20customer%20hotel%20booking%20no%20hidden%20fees%20clarity%20trust%20finance%20simple&width=500&height=380&seq=why3&orientation=landscape',
  },
  {
    id: 'support',
    icon: 'ri-customer-service-2-line',
    title: '24/7 Concierge Support',
    subtitle: 'We\'re always here for you.',
    description:
      'From pre-booking queries to in-stay emergencies, our dedicated concierge team is available round the clock via call, chat, or WhatsApp. You\'re never alone on a Triprodeo journey.',
    color: 'from-rose-400 to-pink-500',
    bgLight: 'bg-rose-50',
    textAccent: 'text-rose-600',
    borderAccent: 'border-rose-200',
    metric: '<2 min',
    metricLabel: 'avg response time',
    image: 'https://readdy.ai/api/search-image?query=friendly%20customer%20service%20team%20concierge%20hotel%20support%20staff%20smiling%20professional%20helping%20guest%20travel%20assistance%20warm%20welcoming&width=500&height=380&seq=why4&orientation=landscape',
  },
];

const awards = [
  { label: 'Best Travel Platform 2024', org: 'India Tourism Awards' },
  { label: 'Top Hospitality Startup', org: 'Startup India' },
  { label: 'Guest Choice Award', org: 'TravelTech Summit' },
  { label: 'Top Owner Excellence', org: 'Triprodeo Internal' },
];

export default function WhyTriprodeo() {
  const [activePillar, setActivePillar] = useState(0);

  const active = pillars[activePillar];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold mb-3">Our Promise</p>
          <h2
            className="text-3xl md:text-5xl font-bold text-stone-900 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Why Triprodeo?
          </h2>
          <p className="text-stone-500 text-base max-w-xl mx-auto leading-relaxed">
            We didn&apos;t just build a booking platform — we built the travel experience we always wished existed.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center text-center p-5 rounded-2xl border border-stone-100 bg-stone-50"
            >
              <div className="w-11 h-11 flex items-center justify-center bg-amber-50 rounded-full mb-3">
                <i className={`${s.icon} text-amber-600 text-xl`} />
              </div>
              <span className="text-2xl md:text-3xl font-bold text-stone-900">{s.value}</span>
              <span className="text-stone-500 text-xs mt-1">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Interactive Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
          {/* Left: pillar tabs */}
          <div className="md:col-span-2 space-y-3">
            {pillars.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setActivePillar(idx)}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  activePillar === idx
                    ? `${p.bgLight} ${p.borderAccent} border`
                    : 'bg-white border-stone-100 hover:border-stone-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-xl ${
                      activePillar === idx
                        ? `bg-gradient-to-br ${p.color} text-white`
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    <i className={`${p.icon} text-base`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold leading-tight ${activePillar === idx ? 'text-stone-900' : 'text-stone-700'}`}>
                      {p.title}
                    </p>
                    <p className={`text-xs mt-0.5 ${activePillar === idx ? p.textAccent : 'text-stone-400'}`}>
                      {p.subtitle}
                    </p>
                  </div>
                  {activePillar === idx && (
                    <i className="ri-arrow-right-s-line text-stone-400 flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Right: detail panel */}
          <div className="md:col-span-3">
            <div className={`rounded-3xl border ${active.borderAccent} ${active.bgLight} overflow-hidden`}>
              {/* Image */}
              <div className="relative w-full" style={{ height: '260px' }}>
                <img
                  src={active.image}
                  alt={active.title}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Metric badge */}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5">
                    <p className={`text-xl font-bold ${active.textAccent}`}>{active.metric}</p>
                    <p className="text-stone-500 text-xs">{active.metricLabel}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br ${active.color} text-white`}>
                    <i className={`${active.icon} text-sm`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-base">{active.title}</h3>
                    <p className={`text-xs font-medium ${active.textAccent}`}>{active.subtitle}</p>
                  </div>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed">{active.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Press & media strip */}
        <div className="mt-14 pt-8 border-t border-stone-100">
          <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold text-center mb-5">
            Trip Roadeo in News
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {awards.map((a) => (
              <div
                key={a.label}
                className="flex items-center gap-2.5 px-5 py-3 bg-stone-50 rounded-full border border-stone-200"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-award-line text-amber-500 text-base" />
                </div>
                <div>
                  <p className="text-stone-800 text-xs font-semibold">{a.label}</p>
                  <p className="text-stone-400 text-xs">{a.org}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
