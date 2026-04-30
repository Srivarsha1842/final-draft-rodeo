import { useState } from 'react';

interface Props {
  propertyType?: string;
  housePolicies?: string[];
}

const cancellationTiers = [
  {
    label: 'Full Refund',
    icon: 'ri-refund-2-line',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    desc: 'Cancel up to 7 days before check-in for a 100% refund (excluding service fees)',
    period: '7+ days before',
  },
  {
    label: '50% Refund',
    icon: 'ri-percent-line',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    desc: 'Cancel 3–6 days before check-in for a 50% refund on accommodation cost',
    period: '3–6 days before',
  },
  {
    label: 'No Refund',
    icon: 'ri-close-circle-line',
    color: 'text-red-500',
    bg: 'bg-red-50',
    desc: 'Cancellations within 48 hours of check-in are non-refundable',
    period: 'Within 48 hours',
  },
];

const PREVIEW_COUNT = 5;

export default function PropertyPolicies({ housePolicies = [] }: Props) {
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? housePolicies : housePolicies.slice(0, PREVIEW_COUNT);
  const hasMore = housePolicies.length > PREVIEW_COUNT;

  return (
    <>
      {/* ── House Policies ─────────────────────────────────────────── */}
      <div className="border-t border-stone-100 pt-8">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 flex items-center justify-center bg-stone-100 rounded-lg">
            <i className="ri-file-list-3-line text-stone-600 text-sm" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">House Policies</h2>
            {housePolicies.length > 0 && (
              <p className="text-stone-400 text-xs mt-0.5">{housePolicies.length} rule{housePolicies.length !== 1 ? 's' : ''} for this property</p>
            )}
          </div>
        </div>

        {housePolicies.length === 0 ? (
          <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl text-stone-400 text-sm">
            <i className="ri-information-line text-stone-300 text-lg" />
            No specific house policies have been listed for this property. Please contact the host for details.
          </div>
        ) : (
          <>
            <ul className="space-y-2.5">
              {displayed.map((policy, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1.5 w-5 h-5 flex items-center justify-center">
                    <i className="ri-arrow-right-s-line text-amber-500 text-base" />
                  </div>
                  <span className="text-stone-700 text-sm leading-relaxed">{policy}</span>
                </li>
              ))}
            </ul>

            {hasMore && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="mt-4 flex items-center gap-1.5 px-5 py-2 border border-stone-300 rounded-full text-sm font-medium text-stone-700 hover:bg-stone-50 cursor-pointer transition-colors whitespace-nowrap"
              >
                {showAll ? (
                  <>
                    <i className="ri-arrow-up-s-line" />
                    Show less
                  </>
                ) : (
                  <>
                    <i className="ri-arrow-down-s-line" />
                    Show all {housePolicies.length} policies
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>

      {/* ── Cancellation Policy ────────────────────────────────────── */}
      <div className="border-t border-stone-100 pt-8">
        <h2 className="text-xl font-bold text-stone-900 mb-2">Cancellation Policy</h2>
        <p className="text-stone-500 text-sm mb-5">
          This property follows a <strong className="text-stone-900">Moderate</strong> cancellation policy.
        </p>
        <div className="space-y-3">
          {cancellationTiers.map((tier) => (
            <div key={tier.label} className={`flex items-start gap-4 p-4 ${tier.bg} rounded-2xl`}>
              <div className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shrink-0">
                <i className={`${tier.icon} ${tier.color} text-lg`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-stone-900 text-sm">{tier.label}</span>
                  <span className="text-xs text-stone-400">·</span>
                  <span className="text-xs text-stone-500">{tier.period}</span>
                </div>
                <p className="text-stone-600 text-xs leading-relaxed">{tier.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-stone-400 mt-4 flex items-start gap-1.5">
          <i className="ri-information-line text-sm shrink-0 mt-0.5" />
          Service fees are non-refundable. Full refund applies to bookings cancelled within 24 hours of confirmation (if check-in is more than 14 days away).
        </p>
      </div>
    </>
  );
}
