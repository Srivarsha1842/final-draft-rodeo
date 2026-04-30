import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { loadCMSData } from '@/pages/admin/cmsStore';

const NEWSLETTER_URL = 'https://readdy.ai/api/form/d7c80h0fgr5j5eoavkn0';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // CMS-editable footer & navbar (for logo) content.
  const { footer, navbar } = useMemo(() => {
    const d = loadCMSData();
    return { footer: d.footer, navbar: d.navbar };
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      const body = new URLSearchParams({ email });
      await fetch(NEWSLETTER_URL, { method: 'POST', body, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-stone-900 text-white pt-16 pb-8 rounded-t-3xl md:rounded-t-[40px]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 pb-12 border-b border-stone-700">
          {/* Brand + Newsletter */}
          <div className="lg:col-span-2">
            <img
              src={navbar.logoUrl}
              alt="Triprodeo"
              className="h-8 w-auto object-contain mb-4"
            />
            <p className="text-stone-400 text-sm leading-relaxed mb-6 max-w-sm">
              {footer.tagline}
            </p>
            <p className="text-sm font-semibold text-white mb-3">Never miss a deal</p>
            {submitted ? (
              <p className="text-emerald-400 text-sm font-medium">You&apos;re subscribed! Thanks for joining.</p>
            ) : (
              <form
                data-readdy-form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-2 w-full sm:max-w-sm"
              >
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 bg-stone-800 border border-stone-700 rounded-full px-4 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-stone-500"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-white text-stone-900 rounded-full text-sm font-semibold hover:bg-stone-100 transition-colors whitespace-nowrap"
                >
                  {submitting ? 'Joining...' : 'Subscribe'}
                </button>
              </form>
            )}
            <div className="flex gap-4 mt-6">
              {footer.socialLinks.map((s) => (
                <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-800 hover:bg-stone-700 transition-colors cursor-pointer">
                  <i className={`${s.icon} text-stone-300 text-base`} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links — sourced from CMS Navigation Links (admin → Footer / Navigation) */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-widest">Explore</h4>
            <ul className="flex flex-col gap-3">
              {navbar.links.map((item) => (
                <li key={`${item.label}-${item.href}`}>
                  <Link to={item.href} className="text-stone-400 text-sm hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-widest">Company</h4>
            <ul className="flex flex-col gap-3">
              {[
                { name: 'About Triprodeo', href: '/about' },
                { name: 'Resort Owner', href: '/resort-owner' },
                { name: 'Partner / Agent', href: '/partner' },
                { name: 'Help Center', href: '/support' },
                { name: 'Contact Us', href: '/support' },
                { name: 'Privacy Policy', href: '/legal/privacy-policy' },
                { name: 'Terms & Conditions', href: '/legal/terms' },
                { name: 'Cancellation Policy', href: '/legal/cancellation-policy' },
                { name: 'Copyright Policy', href: '/legal/copyright-policy' },
                { name: 'Fraud Alert & Safety Advisory', href: '/legal/fraud-alert' },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-stone-400 text-sm hover:text-white transition-colors">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-stone-500 text-xs">{footer.copyrightText}</p>
          <div className="flex items-center gap-3">
            {['ri-visa-line', 'ri-mastercard-line', 'ri-paypal-line', 'ri-bank-card-line'].map((icon) => (
              <div key={icon} className="w-8 h-8 flex items-center justify-center">
                <i className={`${icon} text-stone-500 text-lg`} />
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <Link to="/legal/privacy-policy" className="text-stone-500 text-xs hover:text-stone-300 transition-colors">Privacy</Link>
            <Link to="/legal/terms" className="text-stone-500 text-xs hover:text-stone-300 transition-colors">Terms</Link>
            <a href="/sitemap.xml" className="text-stone-500 text-xs hover:text-stone-300 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
