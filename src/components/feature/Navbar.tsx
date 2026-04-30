import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { loadCMSData } from '@/pages/admin/cmsStore';

const navLinks = [
  {
    label: 'Resort Stays',
    href: '/search?type=resort',
    icon: 'ri-hotel-line',
    accent: 'text-sky-600',
    pillBg: 'bg-sky-50 border-sky-200 text-sky-700',
    pillBgActive: 'bg-sky-600 text-white border-sky-600',
    dot: 'bg-sky-500',
  },
  {
    label: 'Day Outing',
    href: '/day-outing',
    icon: 'ri-sun-line',
    accent: 'text-orange-500',
    pillBg: 'bg-orange-50 border-orange-200 text-orange-700',
    pillBgActive: 'bg-orange-500 text-white border-orange-500',
    dot: 'bg-orange-500',
  },
  {
    label: 'Corporate Outing',
    href: '/search?tag=Corporate%20Getaways',
    icon: 'ri-briefcase-line',
    accent: 'text-emerald-600',
    pillBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    pillBgActive: 'bg-emerald-600 text-white border-emerald-600',
    dot: 'bg-emerald-500',
  },
  {
    label: 'Private Villas',
    href: '/search?tag=Private%20Stays',
    icon: 'ri-home-heart-line',
    accent: 'text-rose-600',
    pillBg: 'bg-rose-50 border-rose-200 text-rose-700',
    pillBgActive: 'bg-rose-600 text-white border-rose-600',
    dot: 'bg-rose-500',
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  // Logo is CMS-editable; pill nav links keep their bespoke styling.
  const logoUrl = useMemo(() => loadCMSData().navbar.logoUrl, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = isHome && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent'
          : 'bg-white/97 backdrop-blur-md border-b border-stone-100'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-[72px] gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src={logoUrl}
              alt="Triprodeo"
              className="h-8 md:h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav — colored pill links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const [linkPath, linkQuery] = link.href.split('?');
              const isActive = linkQuery
                ? location.pathname === linkPath && location.search.includes(linkQuery)
                : location.pathname === linkPath && !location.search;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all whitespace-nowrap ${
                    isTransparent
                      ? 'bg-white/15 backdrop-blur-sm border-white/25 text-white hover:bg-white/25'
                      : isActive
                      ? link.pillBgActive
                      : `${link.pillBg} hover:opacity-90`
                  }`}
                >
                  <i className={`${link.icon} text-sm`} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/dashboard"
              className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
                isTransparent
                  ? 'text-white/90 hover:text-white hover:bg-white/10 border border-white/20'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <i className="ri-user-line" />
              My Account
            </Link>
            <a
              href="https://wa.me/917353735364"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors whitespace-nowrap"
            >
              <i className="ri-whatsapp-line text-base" />
              +91 73537 35364
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center cursor-pointer rounded-full"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <i className={`text-xl ${isTransparent ? 'text-white' : 'text-stone-800'} ${menuOpen ? 'ri-close-line' : 'ri-menu-line'}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 px-4 py-5 flex flex-col gap-3">
          {/* Nav links as colored blocks */}
          <div className="grid grid-cols-2 gap-2 mb-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border text-center ${link.pillBg}`}
              >
                <i className={`${link.icon} text-xl`} />
                <span className="text-xs font-semibold leading-tight">{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="border-t border-stone-100 pt-3 flex flex-col gap-2">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-stone-200 text-stone-700 text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              <i className="ri-user-line text-stone-500" />
              My Account
            </Link>
            <a
              href="https://wa.me/917353735364"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm font-semibold px-4 py-3 bg-emerald-500 text-white rounded-xl whitespace-nowrap"
              onClick={() => setMenuOpen(false)}
            >
              <i className="ri-whatsapp-line text-base" />
              WhatsApp Us — +91 73537 35364
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
