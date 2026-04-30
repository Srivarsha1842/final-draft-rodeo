export default function LoyaltySection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Loyalty */}
          <div className="rounded-3xl p-8 md:p-10 flex flex-col gap-5" style={{ background: 'linear-gradient(135deg, #1a1a1a, #2d1f0e)' }}>
            <div className="w-14 h-14 flex items-center justify-center bg-amber-400/20 rounded-2xl">
              <i className="ri-copper-coin-line text-amber-400 text-2xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Earn TripCoins</h3>
              <p className="text-white/60 text-sm leading-relaxed">Every booking earns TripCoins — redeem for upgrades, free nights, and exclusive experiences.</p>
            </div>
            <ul className="space-y-2">
              {['10 TripCoins per ₹1,000 spent', 'Double coins on first booking', 'Redeem for free upgrades & stays'].map(b => (
                <li key={b} className="flex items-center gap-2 text-white/80 text-sm">
                  <i className="ri-check-line text-amber-400 text-sm" />{b}
                </li>
              ))}
            </ul>
            <button className="self-start px-6 py-2.5 border border-white/30 text-white rounded-full text-sm font-medium hover:bg-white/10 transition-colors whitespace-nowrap">
              Join Loyalty Program
            </button>
          </div>

          {/* Referral */}
          <div className="rounded-3xl p-8 md:p-10 flex flex-col gap-5" style={{ background: 'linear-gradient(135deg, #7c2d12, #1c1917)' }}>
            <div className="w-14 h-14 flex items-center justify-center bg-rose-400/20 rounded-2xl">
              <i className="ri-gift-2-line text-rose-400 text-2xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Refer &amp; Earn ₹1,000</h3>
              <p className="text-white/60 text-sm leading-relaxed">Share your referral link with friends. When they book their first trip, you both get ₹1,000 cashback.</p>
            </div>
            <ul className="space-y-2">
              {['Share unique referral link', 'Friend completes first booking', 'Both get ₹1,000 cashback instantly'].map(b => (
                <li key={b} className="flex items-center gap-2 text-white/80 text-sm">
                  <i className="ri-check-line text-rose-400 text-sm" />{b}
                </li>
              ))}
            </ul>
            <button className="self-start px-6 py-2.5 border border-white/30 text-white rounded-full text-sm font-medium hover:bg-white/10 transition-colors whitespace-nowrap">
              Get Referral Link
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
