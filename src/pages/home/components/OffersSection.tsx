import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHostPromotions, loadHostData } from '@/pages/admin/hostStore';
import { Promotion, HostProperty } from '@/pages/admin/types';

interface EnrichedOffer extends Promotion {
  propertyName: string;
  propertyImage: string;
  propertyLocation: string;
  hostName: string;
}

const typeEmojis: Record<string, string> = {
  percentage: 'ri-percent-line',
  flat: 'ri-money-rupee-circle-line',
  early_bird: 'ri-time-line',
  last_minute: 'ri-flashlight-line',
  long_stay: 'ri-moon-line',
};

const typeLabels: Record<string, string> = {
  percentage: 'Discount',
  flat: 'Flat Off',
  early_bird: 'Early Bird',
  last_minute: 'Last Minute',
  long_stay: 'Long Stay',
};

const badgeColors: Record<string, string> = {
  percentage: 'bg-amber-100 text-amber-700',
  flat: 'bg-emerald-100 text-emerald-700',
  early_bird: 'bg-sky-100 text-sky-700',
  last_minute: 'bg-orange-100 text-orange-700',
  long_stay: 'bg-violet-100 text-violet-700',
};

function discountBadge(p: Promotion) {
  return p.type === 'percentage'
    ? `${p.discountValue}% OFF`
    : `₹${p.discountValue.toLocaleString('en-IN')} OFF`;
}

function daysLeft(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

export default function OffersSection() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<EnrichedOffer[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const data = loadHostData();
    const allProperties: HostProperty[] = data.properties || [];

    // Gather all active promos from all hosts
    const allHostIds = [...new Set(data.accounts.map((a) => a.id))];
    const activePromos: Promotion[] = [];
    allHostIds.forEach((hid) => {
      getHostPromotions(hid).forEach((p) => {
        if (p.status === 'active') activePromos.push(p);
      });
    });

    // Enrich promos with property info
    const enriched: EnrichedOffer[] = activePromos.map((promo) => {
      const relatedPropIds = promo.propertyIds.length > 0 ? promo.propertyIds : allProperties.filter((p) => p.hostId === promo.hostId).map((p) => p.id);
      const mainProp = allProperties.find((p) => relatedPropIds.includes(p.id));
      const hostAccount = data.accounts.find((a) => a.id === promo.hostId);

      return {
        ...promo,
        propertyName: mainProp?.name ?? 'All Properties',
        propertyImage: mainProp?.images?.[0] ?? 'https://readdy.ai/api/search-image?query=luxury%20villa%20property%20india%20beautiful%20architecture%20premium%20stay&width=400&height=280&seq=offer_default&orientation=landscape',
        propertyLocation: mainProp ? `${mainProp.city}, ${mainProp.state}` : 'Multiple Locations',
        hostName: hostAccount?.name ?? 'Triprodeo Host',
      };
    });

    setOffers(enriched);
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  if (offers.length === 0) return null;

  return (
    <section className="py-10 md:py-14" style={{ background: 'linear-gradient(135deg, #1c1a16 0%, #2d1a0e 60%, #1c1a16 100%)' }}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 flex items-center justify-center bg-amber-400/20 rounded-full">
                <i className="ri-flashlight-line text-amber-400 text-xs" />
              </div>
              <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">
                Live Deals
              </span>
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Exclusive Offers &amp; Promotions
            </h2>
            <p className="text-white/50 text-sm mt-1">
              Directly from our hosts — real discounts, limited time
            </p>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 text-amber-300 text-sm">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            {offers.length} active now
          </span>
        </div>

        {/* Offer cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((offer) => {
            const days = daysLeft(offer.endDate);
            const isUrgent = days <= 3;

            return (
              <div
                key={offer.id}
                className="bg-white rounded-2xl overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative" style={{ height: '160px' }}>
                  <img
                    src={offer.propertyImage}
                    alt={offer.propertyName}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Discount badge */}
                  <div className="absolute top-3 left-3">
                    <div className="bg-amber-400 text-stone-900 font-bold text-sm px-3 py-1 rounded-full">
                      {discountBadge(offer)}
                    </div>
                  </div>

                  {/* Urgency badge */}
                  {isUrgent && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <i className="ri-alarm-line" />
                        {days === 0 ? 'Ends Today' : `${days}d left`}
                      </div>
                    </div>
                  )}

                  {/* Property info */}
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white font-semibold text-sm">{offer.propertyName}</p>
                    <p className="text-white/70 text-xs">{offer.propertyLocation}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm leading-tight">{offer.title}</h3>
                      <p className="text-stone-500 text-xs mt-0.5 line-clamp-2">{offer.description}</p>
                    </div>
                    <span className={`flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColors[offer.type] || 'bg-stone-100 text-stone-600'}`}>
                      <i className={typeEmojis[offer.type]} />
                      {typeLabels[offer.type]}
                    </span>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 flex-wrap text-xs text-stone-400 mb-3">
                    {offer.minNights && (
                      <span className="flex items-center gap-1">
                        <i className="ri-moon-line" /> Min {offer.minNights} nights
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <i className="ri-calendar-line" />
                      Valid till {new Date(offer.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>

                  {/* CTA */}
                  <div className="mt-auto flex items-center gap-2">
                    {offer.promoCode ? (
                      <button
                        onClick={() => handleCopy(offer.promoCode!)}
                        className="flex items-center gap-2 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono font-bold text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <i className={copied === offer.promoCode ? 'ri-check-line text-emerald-500' : 'ri-file-copy-line text-stone-400'} />
                        {copied === offer.promoCode ? 'Copied!' : offer.promoCode}
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                        <i className="ri-checkbox-circle-line" /> Auto-applied at checkout
                      </span>
                    )}

                    <button
                      onClick={() => navigate('/search')}
                      className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Book Now <i className="ri-arrow-right-line" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <p className="text-white/30 text-xs text-center mt-6">
          Offers are set by individual hosts and subject to availability. Terms & conditions apply.
        </p>
      </div>
    </section>
  );
}
