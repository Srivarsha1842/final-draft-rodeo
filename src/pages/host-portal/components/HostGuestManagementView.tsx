import { useState, useMemo } from 'react';
import { HostBooking, HostProperty, HostReview, HostMessage } from '@/pages/admin/types';

interface Props {
  hostId: string;
  bookings: HostBooking[];
  properties: HostProperty[];
  reviews: HostReview[];
  messages: HostMessage[];
  onNav: (section: string) => void;
}

interface GuestProfile {
  email: string;
  name: string;
  phone: string;
  bookings: HostBooking[];
  totalSpend: number;
  totalNights: number;
  lastStay: string;
  firstStay: string;
  avgRating: number | null;
  hasReview: boolean;
  hasMessage: boolean;
  favoriteProperty: string;
  tier: 'vip' | 'returning' | 'new';
}

type SortKey = 'name' | 'totalSpend' | 'totalNights' | 'lastStay' | 'bookingCount';
type SortDir = 'asc' | 'desc';

const statusColors: Record<string, string> = {
  confirmed: 'bg-emerald-100 text-emerald-700',
  pending:   'bg-amber-100 text-amber-700',
  cancelled: 'bg-red-100 text-red-600',
  completed: 'bg-stone-100 text-stone-600',
};

const tierConfig = {
  vip:       { label: 'VIP',       bg: 'bg-amber-100',   text: 'text-amber-700',   icon: 'ri-vip-crown-2-line',   desc: '3+ bookings or ₹1L+ spend' },
  returning: { label: 'Returning', bg: 'bg-sky-100',     text: 'text-sky-700',     icon: 'ri-refresh-line',        desc: '2 bookings' },
  new:       { label: 'New',       bg: 'bg-stone-100',   text: 'text-stone-600',   icon: 'ri-user-add-line',       desc: '1 booking' },
};

function buildGuestProfiles(
  bookings: HostBooking[],
  reviews: HostReview[],
  messages: HostMessage[],
): GuestProfile[] {
  const map = new Map<string, HostBooking[]>();
  bookings.forEach((b) => {
    const list = map.get(b.guestEmail) ?? [];
    list.push(b);
    map.set(b.guestEmail, list);
  });

  return Array.from(map.entries()).map(([email, gbs]) => {
    const sorted = [...gbs].sort((a, b) => a.checkIn.localeCompare(b.checkIn));
    const nonCancelled = gbs.filter((b) => b.status !== 'cancelled');
    const totalSpend = nonCancelled.reduce((s, b) => s + b.totalAmount, 0);
    const totalNights = nonCancelled.reduce((s, b) => s + b.nights, 0);
    const lastStay = sorted[sorted.length - 1]?.checkIn ?? '';
    const firstStay = sorted[0]?.checkIn ?? '';

    // favorite property by count
    const propCount: Record<string, number> = {};
    gbs.forEach((b) => { propCount[b.propertyName] = (propCount[b.propertyName] ?? 0) + 1; });
    const favoriteProperty = Object.entries(propCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';

    // avg rating from reviews
    const guestReviews = reviews.filter((r) => r.guestName === gbs[0].guestName);
    const avgRating = guestReviews.length > 0
      ? guestReviews.reduce((s, r) => s + r.rating, 0) / guestReviews.length
      : null;

    const hasMessage = messages.some((m) => m.guestEmail === email);
    const tier: GuestProfile['tier'] =
      nonCancelled.length >= 3 || totalSpend >= 100000 ? 'vip' :
      nonCancelled.length >= 2 ? 'returning' : 'new';

    return {
      email,
      name: gbs[0].guestName,
      phone: gbs[0].guestPhone,
      bookings: gbs,
      totalSpend,
      totalNights,
      lastStay,
      firstStay,
      avgRating,
      hasReview: guestReviews.length > 0,
      hasMessage,
      favoriteProperty,
      tier,
    };
  });
}

export default function HostGuestManagementView({ bookings, properties, reviews, messages, onNav }: Props) {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'vip' | 'returning' | 'new'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('lastStay');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedGuest, setSelectedGuest] = useState<GuestProfile | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'bookings' | 'overview'>('overview');

  const guests = useMemo(() => buildGuestProfiles(bookings, reviews, messages), [bookings, reviews, messages]);

  const filtered = useMemo(() => {
    let list = guests;
    if (tierFilter !== 'all') list = list.filter((g) => g.tier === tierFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (g) => g.name.toLowerCase().includes(q) || g.email.toLowerCase().includes(q) || g.phone.includes(q)
      );
    }
    return [...list].sort((a, b) => {
      let va: number | string = 0;
      let vb: number | string = 0;
      if (sortKey === 'name')          { va = a.name;          vb = b.name; }
      if (sortKey === 'totalSpend')    { va = a.totalSpend;    vb = b.totalSpend; }
      if (sortKey === 'totalNights')   { va = a.totalNights;   vb = b.totalNights; }
      if (sortKey === 'lastStay')      { va = a.lastStay;      vb = b.lastStay; }
      if (sortKey === 'bookingCount')  { va = a.bookings.length; vb = b.bookings.length; }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [guests, tierFilter, search, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  };

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return 'ri-expand-up-down-line text-stone-300';
    return sortDir === 'asc' ? 'ri-sort-asc text-stone-700' : 'ri-sort-desc text-stone-700';
  };

  // Summary stats
  const totalGuests = guests.length;
  const vipCount = guests.filter((g) => g.tier === 'vip').length;
  const returningCount = guests.filter((g) => g.tier === 'returning').length;
  const totalRevenue = guests.reduce((s, g) => s + g.totalSpend, 0);

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const initials = (name: string) => name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const avatarColors = [
    'bg-amber-100 text-amber-700', 'bg-emerald-100 text-emerald-700',
    'bg-sky-100 text-sky-700', 'bg-rose-100 text-rose-700',
    'bg-violet-100 text-violet-700', 'bg-orange-100 text-orange-700',
  ];
  const avatarColor = (email: string) => avatarColors[email.charCodeAt(0) % avatarColors.length];

  // ── GUEST DETAIL PANEL ───────────────────────────────────────────────────
  if (selectedGuest) {
    const g = selectedGuest;
    const tc = tierConfig[g.tier];
    const guestBookingsSorted = [...g.bookings].sort(
      (a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime()
    );
    const nonCancelledBookings = g.bookings.filter((b) => b.status !== 'cancelled');
    const propVisits: Record<string, number> = {};
    g.bookings.forEach((b) => { propVisits[b.propertyName] = (propVisits[b.propertyName] ?? 0) + 1; });

    return (
      <div>
        {/* Back + header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setSelectedGuest(null)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
            <i className="ri-arrow-left-line text-xl" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-stone-900">Guest Profile</h2>
            <p className="text-stone-400 text-sm">Full history and details</p>
          </div>
        </div>

        {/* Profile hero card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-5">
          <div className="flex items-start gap-5 flex-wrap">
            {/* Avatar */}
            <div className={`w-16 h-16 flex items-center justify-center rounded-2xl flex-shrink-0 text-xl font-bold ${avatarColor(g.email)}`}>
              {initials(g.name)}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="text-xl font-bold text-stone-900">{g.name}</h3>
                <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${tc.bg} ${tc.text}`}>
                  <i className={tc.icon} /> {tc.label}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-500">
                <span className="flex items-center gap-1.5"><i className="ri-mail-line text-stone-400" />{g.email}</span>
                <span className="flex items-center gap-1.5"><i className="ri-phone-line text-stone-400" />{g.phone}</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-400 mt-1.5">
                <span className="flex items-center gap-1"><i className="ri-calendar-event-line" />First stay: {formatDate(g.firstStay)}</span>
                <span className="flex items-center gap-1"><i className="ri-history-line" />Last stay: {formatDate(g.lastStay)}</span>
              </div>
            </div>
            {/* Actions */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => onNav('messages')}
                className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white rounded-xl text-sm font-medium cursor-pointer whitespace-nowrap hover:bg-stone-700 transition-colors"
              >
                <i className="ri-chat-3-line" /> Message
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-stone-100">
            {[
              { label: 'Total Bookings', value: g.bookings.length, icon: 'ri-calendar-check-line', color: 'text-stone-800' },
              { label: 'Total Spend', value: `₹${g.totalSpend.toLocaleString('en-IN')}`, icon: 'ri-money-rupee-circle-line', color: 'text-amber-600' },
              { label: 'Total Nights', value: g.totalNights, icon: 'ri-moon-line', color: 'text-stone-800' },
              { label: 'Avg. Rating', value: g.avgRating != null ? `${g.avgRating.toFixed(1)} ★` : 'No review', icon: 'ri-star-line', color: 'text-amber-500' },
            ].map((s) => (
              <div key={s.label} className="bg-stone-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <i className={`${s.icon} text-stone-400 text-xs`} />
                  <p className="text-xs text-stone-400">{s.label}</p>
                </div>
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Detail tabs */}
        <div className="flex gap-1 bg-stone-100 p-1 rounded-xl w-fit mb-5">
          {([{ id: 'overview', label: 'Overview', icon: 'ri-layout-line' }, { id: 'bookings', label: 'All Bookings', icon: 'ri-calendar-2-line' }] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDetailTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeDetailTab === tab.id ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <i className={tab.icon} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {activeDetailTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Properties stayed */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5">
              <h4 className="font-semibold text-stone-900 mb-4 flex items-center gap-2">
                <i className="ri-building-line text-stone-400" /> Properties Visited
              </h4>
              <div className="space-y-3">
                {Object.entries(propVisits).map(([name, count]) => {
                  const prop = properties.find((p) => p.name === name);
                  return (
                    <div key={name} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                        {prop?.images[0] ? (
                          <img src={prop.images[0]} alt={name} className="w-full h-full object-cover object-top" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <i className="ri-building-line text-stone-400 text-sm" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-800 truncate">{name}</p>
                        <p className="text-xs text-stone-400">{prop?.location ?? ''}</p>
                      </div>
                      <span className="flex-shrink-0 text-xs font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full">
                        {count}×
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Booking breakdown */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5">
              <h4 className="font-semibold text-stone-900 mb-4 flex items-center gap-2">
                <i className="ri-pie-chart-line text-stone-400" /> Booking Breakdown
              </h4>
              <div className="space-y-3">
                {(['confirmed', 'completed', 'pending', 'cancelled'] as const).map((status) => {
                  const cnt = g.bookings.filter((b) => b.status === status).length;
                  const pct = g.bookings.length > 0 ? Math.round((cnt / g.bookings.length) * 100) : 0;
                  if (cnt === 0) return null;
                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="capitalize font-medium text-stone-600">{status}</span>
                        <span className="text-stone-400">{cnt} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            status === 'confirmed' ? 'bg-emerald-400' :
                            status === 'completed' ? 'bg-stone-400' :
                            status === 'pending' ? 'bg-amber-400' : 'bg-red-300'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 pt-4 border-t border-stone-100 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Avg. stay length</span>
                  <span className="font-semibold text-stone-800">
                    {nonCancelledBookings.length > 0
                      ? `${(g.totalNights / nonCancelledBookings.length).toFixed(1)} nights`
                      : '—'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Avg. booking value</span>
                  <span className="font-semibold text-stone-800">
                    {nonCancelledBookings.length > 0
                      ? `₹${Math.round(g.totalSpend / nonCancelledBookings.length).toLocaleString('en-IN')}`
                      : '—'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Preferred property</span>
                  <span className="font-semibold text-stone-800 truncate max-w-[180px] text-right">{g.favoriteProperty || '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Preferred payment</span>
                  <span className="font-semibold text-stone-800">
                    {(() => {
                      const pm: Record<string, number> = {};
                      g.bookings.forEach((b) => { pm[b.paymentMethod] = (pm[b.paymentMethod] ?? 0) + 1; });
                      return Object.entries(pm).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bookings tab */}
        {activeDetailTab === 'bookings' && (
          <div className="space-y-3">
            {guestBookingsSorted.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl border border-stone-200 p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-stone-900">{b.propertyName}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[b.status]}`}>
                        {b.status}
                      </span>
                    </div>
                    <p className="text-stone-400 text-xs mt-0.5">Booking ID: {b.id}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-amber-600">₹{b.totalAmount.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-stone-400">total charged</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-stone-400 mb-0.5">Check-in</p>
                    <p className="font-medium text-stone-800">{formatDate(b.checkIn)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 mb-0.5">Check-out</p>
                    <p className="font-medium text-stone-800">{formatDate(b.checkOut)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 mb-0.5">Nights / Guests</p>
                    <p className="font-medium text-stone-800">{b.nights} nights · {b.guestCount} guests</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 mb-0.5">Payment Method</p>
                    <p className="font-medium text-stone-800">{b.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 mb-0.5">Rate</p>
                    <p className="font-medium text-stone-800">₹{b.pricePerNight.toLocaleString('en-IN')}/night</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 mb-0.5">Platform Fee</p>
                    <p className="font-medium text-red-500">-₹{b.platformFee.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 mb-0.5">Your Earnings</p>
                    <p className="font-bold text-emerald-600">₹{b.hostEarnings.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 mb-0.5">Booked On</p>
                    <p className="font-medium text-stone-800">{formatDate(b.bookedAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── GUEST LIST VIEW ──────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Guest Management</h1>
          <p className="text-stone-500 text-sm mt-1">View guest profiles, booking history, and spending patterns</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Guests', value: totalGuests, icon: 'ri-group-line', color: 'text-stone-800', bg: 'bg-stone-100' },
          { label: 'VIP Guests', value: vipCount, icon: 'ri-vip-crown-2-line', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Returning', value: returningCount, icon: 'ri-refresh-line', color: 'text-sky-600', bg: 'bg-sky-50' },
          { label: 'Guest Revenue', value: `₹${(totalRevenue / 100000).toFixed(1)}L`, icon: 'ri-money-rupee-circle-line', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
            <div className="flex items-center gap-2 mb-1">
              <i className={`${s.icon} ${s.color} text-base`} />
              <span className="text-stone-400 text-xs">{s.label}</span>
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-xs">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 bg-white"
            placeholder="Search by name, email or phone..."
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer">
              <i className="ri-close-line text-sm" />
            </button>
          )}
        </div>

        {/* Tier filter */}
        <div className="flex gap-1 bg-stone-100 p-1 rounded-xl flex-shrink-0">
          {(['all', 'vip', 'returning', 'new'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap capitalize ${
                tierFilter === t ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              {t === 'all' ? 'All Guests' : tierConfig[t].label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty */}
      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <div className="w-16 h-16 flex items-center justify-center bg-stone-100 rounded-2xl mx-auto mb-4">
            <i className="ri-group-line text-stone-400 text-3xl" />
          </div>
          <p className="font-semibold text-stone-700 mb-1">
            {search ? 'No guests match your search' : 'No guests yet'}
          </p>
          <p className="text-stone-400 text-sm">
            {search ? 'Try a different name or email' : 'Guest profiles are created automatically from bookings'}
          </p>
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          {/* Table header */}
          <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-stone-100 bg-stone-50 text-xs font-semibold text-stone-400 uppercase tracking-wide">
            <button className="flex items-center gap-1 text-left cursor-pointer hover:text-stone-700 whitespace-nowrap" onClick={() => handleSort('name')}>
              Guest <i className={sortIcon('name')} />
            </button>
            <button className="flex items-center gap-1 cursor-pointer hover:text-stone-700 whitespace-nowrap" onClick={() => handleSort('bookingCount')}>
              Bookings <i className={sortIcon('bookingCount')} />
            </button>
            <button className="flex items-center gap-1 cursor-pointer hover:text-stone-700 whitespace-nowrap" onClick={() => handleSort('totalNights')}>
              Nights <i className={sortIcon('totalNights')} />
            </button>
            <button className="flex items-center gap-1 cursor-pointer hover:text-stone-700 whitespace-nowrap" onClick={() => handleSort('totalSpend')}>
              Total Spend <i className={sortIcon('totalSpend')} />
            </button>
            <button className="flex items-center gap-1 cursor-pointer hover:text-stone-700 whitespace-nowrap" onClick={() => handleSort('lastStay')}>
              Last Stay <i className={sortIcon('lastStay')} />
            </button>
            <span>Tier</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-stone-100">
            {filtered.map((g) => {
              const tc = tierConfig[g.tier];
              return (
                <div
                  key={g.email}
                  onClick={() => { setSelectedGuest(g); setActiveDetailTab('overview'); }}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto_auto_auto] gap-3 sm:gap-4 px-5 py-4 cursor-pointer hover:bg-stone-50 transition-colors items-center"
                >
                  {/* Guest identity */}
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold flex-shrink-0 ${avatarColor(g.email)}`}>
                      {initials(g.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-stone-900 truncate">{g.name}</p>
                      <p className="text-xs text-stone-400 truncate">{g.email}</p>
                    </div>
                    <div className="sm:hidden ml-auto flex items-center gap-1.5">
                      {g.hasMessage && <i className="ri-chat-3-line text-stone-400 text-xs" />}
                      {g.hasReview && <i className="ri-star-line text-amber-400 text-xs" />}
                    </div>
                  </div>

                  {/* Bookings count */}
                  <div className="flex sm:justify-center items-center gap-2 sm:gap-0">
                    <span className="sm:hidden text-xs text-stone-400 w-24">Bookings</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-stone-900">{g.bookings.length}</span>
                      <div className="flex gap-0.5 hidden sm:flex">
                        {g.hasMessage && <i className="ri-chat-3-line text-stone-300 text-xs" />}
                        {g.hasReview && <i className="ri-star-line text-amber-300 text-xs" />}
                      </div>
                    </div>
                  </div>

                  {/* Nights */}
                  <div className="flex sm:justify-center items-center gap-2 sm:gap-0">
                    <span className="sm:hidden text-xs text-stone-400 w-24">Nights</span>
                    <span className="text-sm font-medium text-stone-700">{g.totalNights}</span>
                  </div>

                  {/* Spend */}
                  <div className="flex sm:justify-end items-center gap-2 sm:gap-0">
                    <span className="sm:hidden text-xs text-stone-400 w-24">Total Spend</span>
                    <span className="text-sm font-bold text-amber-600">₹{g.totalSpend.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Last stay */}
                  <div className="flex sm:justify-center items-center gap-2 sm:gap-0">
                    <span className="sm:hidden text-xs text-stone-400 w-24">Last Stay</span>
                    <span className="text-xs text-stone-500 whitespace-nowrap">{formatDate(g.lastStay)}</span>
                  </div>

                  {/* Tier badge */}
                  <div className="flex sm:justify-end items-center gap-2 sm:gap-0">
                    <span className="sm:hidden text-xs text-stone-400 w-24">Tier</span>
                    <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${tc.bg} ${tc.text} whitespace-nowrap`}>
                      <i className={`${tc.icon} text-xs`} />
                      {tc.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-stone-100 bg-stone-50 text-xs text-stone-400">
            Showing {filtered.length} of {totalGuests} guests · Click any row to view full profile
          </div>
        </div>
      )}
    </div>
  );
}
