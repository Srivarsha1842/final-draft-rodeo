import { useState, useMemo } from 'react';
import { loadHostData } from '@/pages/admin/hostStore';
import { HostBooking } from '@/pages/admin/types';

interface DayOutingEnquiry {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  propertyName: string;
  propertyLocation: string;
  date: string;
  timeSlot: string;
  guests: number;
  occasion: string;
  estimatedTotal: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  submittedAt: string;
  specialRequests?: string;
}

const MOCK_DAY_ENQUIRIES: DayOutingEnquiry[] = [
  { id: 'doy_001', guestName: 'Priya Mehta', guestEmail: 'priya.m@gmail.com', guestPhone: '+91 98765 43210', propertyName: 'Serenity Villa Lonavala', propertyLocation: 'Lonavala, Maharashtra', date: '2026-04-18', timeSlot: 'Full Day (9AM–6PM)', guests: 6, occasion: 'Birthday', estimatedTotal: 21000, status: 'confirmed', submittedAt: '2026-04-15T08:30:00', specialRequests: 'Surprise birthday cake setup, please' },
  { id: 'doy_002', guestName: 'Arjun Kapoor', guestEmail: 'arjun.k@company.in', guestPhone: '+91 91234 56789', propertyName: 'Hillside Retreat Mahabaleshwar', propertyLocation: 'Mahabaleshwar, Maharashtra', date: '2026-04-19', timeSlot: 'Morning (8AM–1PM)', guests: 12, occasion: 'Team Outing', estimatedTotal: 36000, status: 'pending', submittedAt: '2026-04-15T10:15:00', specialRequests: 'Need a vegetarian menu for 4 guests' },
  { id: 'doy_003', guestName: 'Sneha Sharma', guestEmail: 'sneha.s@email.com', guestPhone: '+91 99887 76655', propertyName: 'Lakeview Estate Pawna', propertyLocation: 'Pawna Lake, Maharashtra', date: '2026-04-16', timeSlot: 'Afternoon (12PM–5PM)', guests: 4, occasion: 'Anniversary', estimatedTotal: 12800, status: 'completed', submittedAt: '2026-04-10T14:00:00' },
  { id: 'doy_004', guestName: 'Rahul Nair', guestEmail: 'rahul.n@startup.io', guestPhone: '+91 88776 65544', propertyName: 'Coorg Coffee Estate', propertyLocation: 'Madikeri, Coorg', date: '2026-04-20', timeSlot: 'Full Day (9AM–6PM)', guests: 8, occasion: 'Family Gathering', estimatedTotal: 28000, status: 'pending', submittedAt: '2026-04-15T11:45:00' },
  { id: 'doy_005', guestName: 'Kavya Reddy', guestEmail: 'kavya.r@works.com', guestPhone: '+91 77665 54433', propertyName: 'Kodaikanal Forest Retreat', propertyLocation: 'Kodaikanal, Tamil Nadu', date: '2026-04-17', timeSlot: 'Evening (3PM–8PM)', guests: 5, occasion: 'Friends Trip', estimatedTotal: 15500, status: 'cancelled', submittedAt: '2026-04-12T09:20:00', specialRequests: 'Had to cancel due to travel plans' },
  { id: 'doy_006', guestName: 'Vikram Singh', guestEmail: 'vikram.s@corp.in', guestPhone: '+91 66554 43322', propertyName: 'Munnar Tea Garden Bungalow', propertyLocation: 'Munnar, Kerala', date: '2026-04-21', timeSlot: 'Morning (8AM–1PM)', guests: 20, occasion: 'Team Outing', estimatedTotal: 60000, status: 'confirmed', submittedAt: '2026-04-14T16:10:00' },
];

type MainTab = 'regular' | 'dayouting';
type BookingStatus = 'all' | 'confirmed' | 'pending' | 'completed' | 'cancelled';

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-stone-100 text-stone-600',
};

export default function BookingsManager() {
  const allBookings: HostBooking[] = useMemo(() => loadHostData().bookings, []);

  const [mainTab, setMainTab] = useState<MainTab>('regular');

  // ── Regular bookings state ──
  const [filter, setFilter] = useState<BookingStatus>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<string>('');
  const [bulkToast, setBulkToast] = useState('');

  // ── Day outing state ──
  const [dayFilter, setDayFilter] = useState<BookingStatus>('all');
  const [daySearch, setDaySearch] = useState('');
  const [enquiries, setEnquiries] = useState<DayOutingEnquiry[]>(MOCK_DAY_ENQUIRIES);
  const [expandedDayId, setExpandedDayId] = useState<string | null>(null);
  const [selectedDayIds, setSelectedDayIds] = useState<Set<string>>(new Set());
  const [dayBulkAction, setDayBulkAction] = useState<string>('');

  // ── Filtered lists ──
  const filtered = useMemo(() => {
    let list = filter === 'all' ? allBookings : allBookings.filter((b) => b.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((b) =>
        b.guestName.toLowerCase().includes(q) ||
        b.guestEmail.toLowerCase().includes(q) ||
        b.propertyName.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime());
  }, [allBookings, filter, search]);

  const filteredDay = useMemo(() => {
    let list = dayFilter === 'all' ? enquiries : enquiries.filter((e) => e.status === dayFilter);
    if (daySearch.trim()) {
      const q = daySearch.toLowerCase();
      list = list.filter((e) =>
        e.guestName.toLowerCase().includes(q) ||
        e.guestEmail.toLowerCase().includes(q) ||
        e.propertyName.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }, [enquiries, dayFilter, daySearch]);

  // ── Stats ──
  const activeBookings = allBookings.filter((b) => b.status !== 'cancelled');
  const totalRevenue = activeBookings.reduce((s, b) => s + b.totalAmount, 0);
  const platformRevenue = totalRevenue - activeBookings.reduce((s, b) => s + b.hostEarnings, 0);
  const dayTotalRevenue = enquiries.filter((e) => e.status !== 'cancelled').reduce((s, e) => s + e.estimatedTotal, 0);
  const dayPendingCount = enquiries.filter((e) => e.status === 'pending').length;

  // ── Bulk helpers (regular) ──
  const allFilteredSelected = filtered.length > 0 && filtered.every((b) => selectedIds.has(b.id));
  const toggleAllFiltered = () => {
    if (allFilteredSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((b) => b.id)));
    }
  };
  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const applyBulkAction = () => {
    if (!bulkAction || selectedIds.size === 0) return;
    setBulkToast(`Updated ${selectedIds.size} booking${selectedIds.size > 1 ? 's' : ''} to "${bulkAction}"`);
    setSelectedIds(new Set());
    setBulkAction('');
    setTimeout(() => setBulkToast(''), 3000);
  };

  // ── Bulk helpers (day outing) ──
  const allDaySelected = filteredDay.length > 0 && filteredDay.every((e) => selectedDayIds.has(e.id));
  const toggleAllDay = () => {
    if (allDaySelected) {
      setSelectedDayIds(new Set());
    } else {
      setSelectedDayIds(new Set(filteredDay.map((e) => e.id)));
    }
  };
  const toggleOneDay = (id: string) => {
    setSelectedDayIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const applyDayBulk = () => {
    if (!dayBulkAction || selectedDayIds.size === 0) return;
    setEnquiries((prev) =>
      prev.map((e) => selectedDayIds.has(e.id) ? { ...e, status: dayBulkAction as DayOutingEnquiry['status'] } : e)
    );
    setSelectedDayIds(new Set());
    setDayBulkAction('');
  };

  const updateDayStatus = (id: string, status: DayOutingEnquiry['status']) => {
    setEnquiries((prev) => prev.map((e) => e.id === id ? { ...e, status } : e));
  };

  return (
    <div>
      {/* Toast */}
      {bulkToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl text-sm font-medium">
          <i className="ri-check-line" /> {bulkToast}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Bookings Management</h1>
        <p className="text-stone-500 text-sm mt-1">View, manage and bulk-update all bookings and day outing enquiries</p>
      </div>

      {/* Main tabs */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl mb-6 w-fit">
        <button
          onClick={() => { setMainTab('regular'); setSelectedIds(new Set()); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${mainTab === 'regular' ? 'bg-white text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
        >
          <i className="ri-calendar-check-line" /> Regular Bookings
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${mainTab === 'regular' ? 'bg-stone-100 text-stone-600' : 'bg-stone-200 text-stone-500'}`}>{allBookings.length}</span>
        </button>
        <button
          onClick={() => { setMainTab('dayouting'); setSelectedDayIds(new Set()); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${mainTab === 'dayouting' ? 'bg-white text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
        >
          <i className="ri-sun-line" /> Day Outing Enquiries
          {dayPendingCount > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded-full font-bold bg-amber-400 text-stone-900">{dayPendingCount}</span>
          )}
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════
          REGULAR BOOKINGS TAB
      ═══════════════════════════════════════════════════════ */}
      {mainTab === 'regular' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Bookings', value: allBookings.length.toString(), icon: 'ri-calendar-check-line', color: 'text-stone-700 bg-stone-100' },
              { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: 'ri-money-rupee-circle-line', color: 'text-amber-700 bg-amber-50' },
              { label: 'Platform Earnings', value: `₹${platformRevenue.toLocaleString('en-IN')}`, icon: 'ri-bank-line', color: 'text-emerald-700 bg-emerald-50' },
              { label: 'Pending Confirm', value: allBookings.filter((b) => b.status === 'pending').length.toString(), icon: 'ri-time-line', color: 'text-orange-700 bg-orange-50' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-stone-200 p-4">
                <div className={`w-9 h-9 flex items-center justify-center rounded-lg mb-3 ${s.color}`}><i className={`${s.icon} text-base`} /></div>
                <p className="text-xl font-bold text-stone-900">{s.value}</p>
                <p className="text-stone-400 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search guest, property, ID..." className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-xl text-sm outline-none focus:border-stone-400" />
            </div>
            <div className="flex gap-1 bg-stone-100 p-1 rounded-xl flex-wrap">
              {(['all', 'confirmed', 'pending', 'completed', 'cancelled'] as const).map((t) => (
                <button key={t} onClick={() => setFilter(t)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap capitalize ${filter === t ? 'bg-white text-stone-900' : 'text-stone-500'}`}>
                  {t} ({t === 'all' ? allBookings.length : allBookings.filter((b) => b.status === t).length})
                </button>
              ))}
            </div>
          </div>

          {/* Bulk action bar */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 bg-stone-900 rounded-xl mb-4 flex-wrap">
              <span className="text-white text-sm font-semibold whitespace-nowrap">
                <i className="ri-checkbox-multiple-line mr-1.5" />{selectedIds.size} selected
              </span>
              <div className="flex items-center gap-2 ml-auto flex-wrap">
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-3 py-1.5 bg-stone-800 text-white border border-stone-600 rounded-lg text-sm outline-none cursor-pointer"
                >
                  <option value="">Change status to…</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="pending">Pending</option>
                </select>
                <button
                  onClick={applyBulkAction}
                  disabled={!bulkAction}
                  className="px-4 py-1.5 bg-amber-400 text-stone-900 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Apply
                </button>
                <button onClick={() => setSelectedIds(new Set())} className="px-3 py-1.5 text-stone-400 hover:text-white rounded-lg text-sm cursor-pointer whitespace-nowrap transition-colors">
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={allFilteredSelected}
                        onChange={toggleAllFiltered}
                        className="w-4 h-4 rounded accent-stone-800 cursor-pointer"
                      />
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">Booking ID</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">Guest</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">Property</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">Dates</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">Amount</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-12 text-stone-400 text-sm">No bookings found</td></tr>
                  )}
                  {filtered.map((b) => (
                    <>
                      <tr
                        key={b.id}
                        className={`hover:bg-stone-50 cursor-pointer transition-colors ${selectedIds.has(b.id) ? 'bg-amber-50/50' : ''}`}
                      >
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedIds.has(b.id)}
                            onChange={() => toggleOne(b.id)}
                            className="w-4 h-4 rounded accent-stone-800 cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3" onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}>
                          <span className="font-mono text-xs text-stone-500">{b.id.slice(0, 10)}...</span>
                        </td>
                        <td className="px-4 py-3" onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}>
                          <div className="font-medium text-stone-900">{b.guestName}</div>
                          <div className="text-xs text-stone-400 truncate max-w-[140px]">{b.guestEmail}</div>
                        </td>
                        <td className="px-4 py-3" onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}>
                          <div className="text-stone-700 truncate max-w-[160px]">{b.propertyName}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-stone-500" onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}>
                          {b.checkIn} → {b.checkOut}
                          <div className="text-stone-400">{b.nights} nights &middot; {b.guestCount} guests</div>
                        </td>
                        <td className="px-4 py-3 text-right" onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}>
                          <div className="font-bold text-stone-900">₹{b.totalAmount.toLocaleString('en-IN')}</div>
                          <div className="text-xs text-emerald-600">₹{b.hostEarnings.toLocaleString('en-IN')} to owner</div>
                        </td>
                        <td className="px-4 py-3 text-center" onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                        </td>
                      </tr>
                      {expandedId === b.id && (
                        <tr key={`${b.id}-detail`} className="bg-stone-50">
                          <td colSpan={7} className="px-6 py-4">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                              <div><p className="text-xs text-stone-400 mb-0.5">Guest Phone</p><p className="font-medium text-stone-700">{b.guestPhone}</p></div>
                              <div><p className="text-xs text-stone-400 mb-0.5">Payment Method</p><p className="font-medium text-stone-700">{b.paymentMethod}</p></div>
                              <div><p className="text-xs text-stone-400 mb-0.5">Platform Fee</p><p className="font-medium text-red-500">-₹{b.platformFee.toLocaleString('en-IN')}</p></div>
                              <div><p className="text-xs text-stone-400 mb-0.5">Booked On</p><p className="font-medium text-stone-700">{new Date(b.bookedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p></div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════
          DAY OUTING ENQUIRIES TAB
      ═══════════════════════════════════════════════════════ */}
      {mainTab === 'dayouting' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Enquiries', value: enquiries.length.toString(), icon: 'ri-sun-line', color: 'text-amber-700 bg-amber-50' },
              { label: 'Est. Revenue', value: `₹${dayTotalRevenue.toLocaleString('en-IN')}`, icon: 'ri-money-rupee-circle-line', color: 'text-emerald-700 bg-emerald-50' },
              { label: 'Pending Action', value: dayPendingCount.toString(), icon: 'ri-time-line', color: 'text-orange-700 bg-orange-50' },
              { label: 'Confirmed', value: enquiries.filter((e) => e.status === 'confirmed').length.toString(), icon: 'ri-checkbox-circle-line', color: 'text-stone-700 bg-stone-100' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-stone-200 p-4">
                <div className={`w-9 h-9 flex items-center justify-center rounded-lg mb-3 ${s.color}`}><i className={`${s.icon} text-base`} /></div>
                <p className="text-xl font-bold text-stone-900">{s.value}</p>
                <p className="text-stone-400 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Search + filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
              <input value={daySearch} onChange={(e) => setDaySearch(e.target.value)} placeholder="Search guest, property, ID..." className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-xl text-sm outline-none focus:border-stone-400" />
            </div>
            <div className="flex gap-1 bg-stone-100 p-1 rounded-xl flex-wrap">
              {(['all', 'confirmed', 'pending', 'completed', 'cancelled'] as const).map((t) => (
                <button key={t} onClick={() => setDayFilter(t)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap capitalize ${dayFilter === t ? 'bg-white text-stone-900' : 'text-stone-500'}`}>
                  {t} ({t === 'all' ? enquiries.length : enquiries.filter((e) => e.status === t).length})
                </button>
              ))}
            </div>
          </div>

          {/* Bulk action bar for day outings */}
          {selectedDayIds.size > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 bg-stone-900 rounded-xl mb-4 flex-wrap">
              <span className="text-white text-sm font-semibold whitespace-nowrap">
                <i className="ri-checkbox-multiple-line mr-1.5" />{selectedDayIds.size} selected
              </span>
              <div className="flex items-center gap-2 ml-auto flex-wrap">
                <select
                  value={dayBulkAction}
                  onChange={(e) => setDayBulkAction(e.target.value)}
                  className="px-3 py-1.5 bg-stone-800 text-white border border-stone-600 rounded-lg text-sm outline-none cursor-pointer"
                >
                  <option value="">Change status to…</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="pending">Pending</option>
                </select>
                <button
                  onClick={applyDayBulk}
                  disabled={!dayBulkAction}
                  className="px-4 py-1.5 bg-amber-400 text-stone-900 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Apply
                </button>
                <button onClick={() => setSelectedDayIds(new Set())} className="px-3 py-1.5 text-stone-400 hover:text-white rounded-lg text-sm cursor-pointer whitespace-nowrap">
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Select-all row */}
          {filteredDay.length > 0 && (
            <div className="flex items-center gap-3 px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl mb-3">
              <input
                type="checkbox"
                checked={allDaySelected}
                onChange={toggleAllDay}
                className="w-4 h-4 rounded accent-stone-800 cursor-pointer"
              />
              <span className="text-xs text-stone-500 font-medium">
                {allDaySelected ? 'Deselect all' : `Select all ${filteredDay.length} enquiries`}
              </span>
              {selectedDayIds.size > 0 && (
                <span className="text-xs text-amber-600 font-semibold ml-auto">{selectedDayIds.size} selected</span>
              )}
            </div>
          )}

          {/* Enquiry cards */}
          <div className="space-y-3">
            {filteredDay.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-stone-200 text-stone-400">No day outing enquiries found</div>
            )}
            {filteredDay.map((enq) => (
              <div key={enq.id} className={`bg-white rounded-xl border overflow-hidden transition-all ${selectedDayIds.has(enq.id) ? 'border-amber-300 bg-amber-50/30' : 'border-stone-200'}`}>
                <div className="flex items-start gap-3 p-4">
                  {/* Checkbox */}
                  <div className="pt-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedDayIds.has(enq.id)}
                      onChange={() => toggleOneDay(enq.id)}
                      className="w-4 h-4 rounded accent-stone-800 cursor-pointer"
                    />
                  </div>
                  {/* Icon */}
                  <div className="w-10 h-10 flex items-center justify-center bg-amber-50 rounded-xl shrink-0">
                    <i className="ri-sun-line text-amber-500" />
                  </div>
                  {/* Info */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => setExpandedDayId(expandedDayId === enq.id ? null : enq.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-stone-900 text-sm">{enq.guestName}</p>
                        <p className="text-stone-400 text-xs mt-0.5">{enq.guestEmail} &middot; {enq.guestPhone}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[enq.status]}`}>{enq.status}</span>
                        <i className={`text-stone-400 text-sm ${expandedDayId === enq.id ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`} />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-stone-500">
                      <span className="flex items-center gap-1"><i className="ri-building-4-line" />{enq.propertyName}</span>
                      <span className="flex items-center gap-1"><i className="ri-calendar-line" />{enq.date}</span>
                      <span className="flex items-center gap-1"><i className="ri-time-line" />{enq.timeSlot}</span>
                      <span className="flex items-center gap-1"><i className="ri-group-line" />{enq.guests} guests</span>
                      <span className="flex items-center gap-1 font-semibold text-stone-700"><i className="ri-gift-line text-amber-500" />{enq.occasion}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-stone-400">Submitted {new Date(enq.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      <span className="font-bold text-stone-900 text-sm">₹{enq.estimatedTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Expanded detail */}
                {expandedDayId === enq.id && (
                  <div className="border-t border-stone-100 bg-stone-50 px-5 py-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                      <div><p className="text-xs text-stone-400 mb-0.5">Enquiry ID</p><p className="font-mono text-xs text-stone-600">{enq.id}</p></div>
                      <div><p className="text-xs text-stone-400 mb-0.5">Location</p><p className="font-medium text-stone-700 text-xs">{enq.propertyLocation}</p></div>
                      <div><p className="text-xs text-stone-400 mb-0.5">Est. Total</p><p className="font-bold text-stone-900">₹{enq.estimatedTotal.toLocaleString('en-IN')}</p></div>
                    </div>
                    {enq.specialRequests && (
                      <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                        <p className="text-xs font-semibold text-amber-700 mb-1 flex items-center gap-1"><i className="ri-chat-1-line" /> Special Requests</p>
                        <p className="text-xs text-stone-600">{enq.specialRequests}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-semibold text-stone-500 mr-1">Update Status:</p>
                      {(['confirmed', 'completed', 'cancelled'] as const).filter((s) => s !== enq.status).map((s) => (
                        <button key={s} onClick={() => updateDayStatus(enq.id, s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer whitespace-nowrap transition-colors ${s === 'confirmed' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : s === 'completed' ? 'bg-stone-100 text-stone-600 hover:bg-stone-200' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>
                          Mark {s}
                        </button>
                      ))}
                      <a href={`mailto:${enq.guestEmail}?subject=Your Day Outing at ${encodeURIComponent(enq.propertyName)}`} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap hover:bg-stone-800 transition-colors" onClick={(e) => e.stopPropagation()}>
                        <i className="ri-mail-send-line" /> Email Guest
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
