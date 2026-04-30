import { useState } from 'react';
import { HostBooking } from '@/pages/admin/types';

interface Props {
  bookings: HostBooking[];
}

export default function HostBookingsView({ bookings }: Props) {
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'completed' | 'cancelled'>('all');
  const [selected, setSelected] = useState<HostBooking | null>(null);

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);
  const sorted = [...filtered].sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime());

  const totalEarnings = bookings.filter((b) => b.status !== 'cancelled').reduce((s, b) => s + b.hostEarnings, 0);
  const pendingEarnings = bookings.filter((b) => b.status === 'confirmed').reduce((s, b) => s + b.hostEarnings, 0);

  const statusColors: Record<string, string> = {
    confirmed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-stone-100 text-stone-600',
  };

  const tabs = ['all', 'confirmed', 'pending', 'completed', 'cancelled'] as const;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-stone-900">Bookings & Earnings</h2>
        <p className="text-stone-500 text-sm mt-1">Track all guest reservations and your income</p>
      </div>

      {/* Earnings summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-amber-50 rounded-xl p-4">
          <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-1">Total Earnings</p>
          <p className="text-2xl font-bold text-amber-700">₹{totalEarnings.toLocaleString('en-IN')}</p>
          <p className="text-xs text-amber-500 mt-0.5">After 10% platform fee</p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4">
          <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wide mb-1">Upcoming Payouts</p>
          <p className="text-2xl font-bold text-emerald-700">₹{pendingEarnings.toLocaleString('en-IN')}</p>
          <p className="text-xs text-emerald-500 mt-0.5">From confirmed bookings</p>
        </div>
        <div className="bg-stone-100 rounded-xl p-4">
          <p className="text-xs text-stone-500 font-semibold uppercase tracking-wide mb-1">Total Bookings</p>
          <p className="text-2xl font-bold text-stone-800">{bookings.length}</p>
          <p className="text-xs text-stone-400 mt-0.5">{bookings.filter((b) => b.status === 'confirmed').length} confirmed</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl mb-5 w-fit flex-wrap">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap capitalize ${filter === t ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            {t} {t !== 'all' && <span className="ml-1 opacity-60">({bookings.filter((b) => b.status === t).length})</span>}
          </button>
        ))}
      </div>

      {/* Bookings list */}
      {sorted.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200">
          <i className="ri-calendar-line text-4xl text-stone-300 mb-3 block" />
          <p className="text-stone-400">No bookings found</p>
        </div>
      )}

      <div className="space-y-3">
        {sorted.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-xl border border-stone-200 p-4 cursor-pointer hover:border-stone-300 transition-colors"
            onClick={() => setSelected(selected?.id === b.id ? null : b)}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-stone-100 rounded-xl shrink-0">
                <i className="ri-user-line text-stone-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-stone-900 text-sm">{b.guestName}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[b.status]}`}>{b.status}</span>
                </div>
                <p className="text-stone-500 text-xs mt-0.5">{b.propertyName}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-stone-400 flex-wrap">
                  <span><i className="ri-calendar-line mr-1" />{b.checkIn} → {b.checkOut}</span>
                  <span><i className="ri-moon-line mr-1" />{b.nights} nights</span>
                  <span><i className="ri-group-line mr-1" />{b.guestCount} guests</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-base font-bold text-amber-600">₹{b.hostEarnings.toLocaleString('en-IN')}</p>
                <p className="text-xs text-stone-400">your earnings</p>
                <p className="text-xs text-stone-300 mt-0.5">Total: ₹{b.totalAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Expanded details */}
            {selected?.id === b.id && (
              <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-xs text-stone-400 mb-0.5">Guest Email</p>
                  <p className="text-stone-700 font-medium truncate">{b.guestEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-400 mb-0.5">Phone</p>
                  <p className="text-stone-700 font-medium">{b.guestPhone}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-400 mb-0.5">Payment</p>
                  <p className="text-stone-700 font-medium">{b.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-400 mb-0.5">Booked On</p>
                  <p className="text-stone-700 font-medium">{new Date(b.bookedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-400 mb-0.5">Room Rate</p>
                  <p className="text-stone-700 font-medium">₹{b.pricePerNight.toLocaleString('en-IN')}/night</p>
                </div>
                <div>
                  <p className="text-xs text-stone-400 mb-0.5">Total Charged</p>
                  <p className="text-stone-700 font-medium">₹{b.totalAmount.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-400 mb-0.5">Platform Fee (10%)</p>
                  <p className="text-red-500 font-medium">-₹{b.platformFee.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-400 mb-0.5">Your Earnings</p>
                  <p className="text-emerald-600 font-bold">₹{b.hostEarnings.toLocaleString('en-IN')}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
