import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const body = new URLSearchParams({ email });
      const res = await fetch('https://readdy.ai/api/form/d7ce17pnoju8nk5a0pt0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      if (res.ok) { setStatus('success'); setEmail(''); }
      else setStatus('error');
    } catch { setStatus('error'); }
  };

  return (
    <section className="py-16 md:py-20 bg-stone-900">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-amber-400 text-xs uppercase tracking-widest font-semibold mb-3">Stay in the Loop</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Get Exclusive Deals &amp; Travel Inspiration
          </h2>
          <p className="text-stone-400 text-sm mb-8">
            Join 1,20,000+ travellers getting curated weekend escape ideas, early-bird deals, and members-only discounts — straight to your inbox.
          </p>

          {status === 'success' ? (
            <div className="flex items-center justify-center gap-3 px-6 py-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl">
              <div className="w-9 h-9 flex items-center justify-center bg-emerald-500 rounded-full shrink-0">
                <i className="ri-check-line text-white text-lg" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-sm">You&apos;re in!</p>
                <p className="text-emerald-300 text-xs">Check your inbox for a welcome gift — 10% off your next booking.</p>
              </div>
            </div>
          ) : (
            <form
              data-readdy-form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
                placeholder="Enter your email address"
                required
                className="flex-1 px-5 py-3.5 bg-white/10 border border-white/20 text-white placeholder-stone-400 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3.5 bg-amber-400 text-stone-900 rounded-xl font-bold text-sm hover:bg-amber-300 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60 flex items-center gap-2"
              >
                {status === 'loading' ? <><i className="ri-loader-4-line animate-spin" />Subscribing...</> : 'Subscribe Free'}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p className="mt-3 text-red-400 text-xs">Something went wrong. Please try again.</p>
          )}

          <p className="text-stone-500 text-xs mt-4">
            No spam, ever. Unsubscribe anytime. We respect your privacy.
          </p>

          <div className="flex items-center justify-center gap-8 mt-8 pt-8 border-t border-stone-800">
            {[
              { value: '1.2L+', label: 'Subscribers' },
              { value: '4.9★', label: 'Reader Rating' },
              { value: 'Weekly', label: 'Frequency' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-white font-bold text-lg">{value}</p>
                <p className="text-stone-500 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
