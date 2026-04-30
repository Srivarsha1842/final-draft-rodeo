import { useState, useMemo } from 'react';
import { HostBooking } from '@/pages/admin/types';

interface Props {
  bookings: HostBooking[];
  hostName: string;
}

interface MonthlyPayout {
  monthKey: string;
  monthLabel: string;
  year: number;
  month: number;
  earnings: number;
  bookingCount: number;
  status: 'paid' | 'processing' | 'upcoming';
  payoutDate: string;
  bookings: HostBooking[];
}

function buildMonthlyPayouts(bookings: HostBooking[]): MonthlyPayout[] {
  const map: Record<string, HostBooking[]> = {};
  bookings
    .filter((b) => b.status !== 'cancelled')
    .forEach((b) => {
      const d = new Date(b.bookedAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!map[key]) map[key] = [];
      map[key].push(b);
    });

  const now = new Date();
  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const lastKey = `${now.getFullYear()}-${String(now.getMonth()).padStart(2, '0')}`;

  return Object.entries(map)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, bks]) => {
      const [yr, mo] = key.split('-').map(Number);
      const date = new Date(yr, mo - 1, 1);
      const monthLabel = date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
      const earnings = bks.reduce((s, b) => s + b.hostEarnings, 0);
      const bookingCount = bks.length;

      let status: 'paid' | 'processing' | 'upcoming';
      let payoutDate: string;
      if (key < lastKey) {
        status = 'paid';
        payoutDate = new Date(yr, mo, 7).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      } else if (key === lastKey) {
        status = 'processing';
        payoutDate = new Date(yr, mo, 7).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      } else if (key === currentKey) {
        status = 'upcoming';
        payoutDate = new Date(yr, mo, 7).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      } else {
        status = 'upcoming';
        payoutDate = new Date(yr, mo, 7).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      }

      return { monthKey: key, monthLabel, year: yr, month: mo, earnings, bookingCount, status, payoutDate, bookings: bks };
    });
}

const statusConfig = {
  paid: { label: 'Paid', color: 'bg-emerald-100 text-emerald-700', icon: 'ri-check-line', dot: 'bg-emerald-500' },
  processing: { label: 'Processing', color: 'bg-amber-100 text-amber-700', icon: 'ri-loader-3-line', dot: 'bg-amber-500' },
  upcoming: { label: 'Upcoming', color: 'bg-stone-100 text-stone-500', icon: 'ri-time-line', dot: 'bg-stone-300' },
};

export default function HostPayoutsView({ bookings, hostName }: Props) {
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'processing' | 'upcoming'>('all');

  const monthlyPayouts = useMemo(() => buildMonthlyPayouts(bookings), [bookings]);
  const filtered = filterStatus === 'all' ? monthlyPayouts : monthlyPayouts.filter((m) => m.status === filterStatus);

  const totalPaid = monthlyPayouts.filter((m) => m.status === 'paid').reduce((s, m) => s + m.earnings, 0);
  const processing = monthlyPayouts.filter((m) => m.status === 'processing').reduce((s, m) => s + m.earnings, 0);
  const upcoming = monthlyPayouts.filter((m) => m.status === 'upcoming').reduce((s, m) => s + m.earnings, 0);
  const totalAll = monthlyPayouts.reduce((s, m) => s + m.earnings, 0);

  // Monthly trend for mini bar chart (last 6 months)
  const chartMonths = useMemo(() => {
    const result: { label: string; earnings: number; max: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const found = monthlyPayouts.find((m) => m.monthKey === key);
      result.push({
        label: d.toLocaleDateString('en-IN', { month: 'short' }),
        earnings: found?.earnings ?? 0,
        max: 0,
      });
    }
    const max = Math.max(...result.map((r) => r.earnings), 1);
    return result.map((r) => ({ ...r, max }));
  }, [monthlyPayouts]);

  const toggleExpand = (key: string) => setExpandedMonth(expandedMonth === key ? null : key);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-stone-900">Payouts</h2>
        <p className="text-stone-500 text-sm mt-1">Monthly payment history and upcoming payouts</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Earned', value: totalAll, color: 'text-stone-900', bg: 'bg-white', border: 'border border-stone-200', icon: 'ri-coins-line', iconColor: 'text-stone-600' },
          { label: 'Total Paid Out', value: totalPaid, color: 'text-emerald-700', bg: 'bg-emerald-50', border: '', icon: 'ri-check-line', iconColor: 'text-emerald-600' },
          { label: 'Processing', value: processing, color: 'text-amber-700', bg: 'bg-amber-50', border: '', icon: 'ri-loader-3-line', iconColor: 'text-amber-600' },
          { label: 'Upcoming', value: upcoming, color: 'text-stone-600', bg: 'bg-stone-100', border: '', icon: 'ri-time-line', iconColor: 'text-stone-500' },
        ].map((card) => (
          <div key={card.label} className={`${card.bg} ${card.border} rounded-xl p-4`}>
            <div className="w-9 h-9 flex items-center justify-center bg-white/70 rounded-lg mb-3">
              <i className={`${card.icon} ${card.iconColor} text-lg`} />
            </div>
            <p className={`text-xl font-bold ${card.color}`}>₹{card.value.toLocaleString('en-IN')}</p>
            <p className="text-stone-400 text-xs mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Earnings trend chart */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-stone-900">Earnings Trend</h3>
            <p className="text-stone-400 text-xs mt-0.5">Last 6 months</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-stone-400">Payout cycle</p>
            <p className="text-sm font-semibold text-stone-700">7th of every month</p>
          </div>
        </div>
        <div className="flex items-end gap-3 h-28">
          {chartMonths.map((m) => {
            const heightPct = m.max > 0 ? Math.max((m.earnings / m.max) * 100, m.earnings > 0 ? 8 : 0) : 0;
            return (
              <div key={m.label} className="flex-1 flex flex-col items-center gap-1.5">
                <p className="text-xs font-semibold text-stone-600 whitespace-nowrap">
                  {m.earnings > 0 ? `₹${Math.round(m.earnings / 1000)}k` : '–'}
                </p>
                <div className="w-full flex items-end" style={{ height: '72px' }}>
                  <div
                    className="w-full rounded-t-lg bg-stone-900 transition-all duration-500"
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <p className="text-xs text-stone-400">{m.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bank account info bar */}
      <div className="bg-stone-900 rounded-xl p-4 flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl">
            <i className="ri-bank-line text-amber-400 text-lg" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Payouts sent to your bank account</p>
            <p className="text-stone-400 text-xs">HDFC Bank ••••4521 · {hostName}</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer whitespace-nowrap">
          <i className="ri-edit-line text-sm" /> Update Bank Details
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <p className="text-sm font-semibold text-stone-700 mr-2">Filter:</p>
        {(['all', 'paid', 'processing', 'upcoming'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilterStatus(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap capitalize ${
              filterStatus === f ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-500 hover:text-stone-800'
            }`}
          >
            {f === 'all' ? 'All Months' : f}
          </button>
        ))}
      </div>

      {/* Monthly payout rows */}
      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200">
          <i className="ri-money-rupee-circle-line text-4xl text-stone-300 mb-3 block" />
          <p className="text-stone-400">No payout records found</p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((payout) => {
          const cfg = statusConfig[payout.status];
          const isExpanded = expandedMonth === payout.monthKey;

          return (
            <div key={payout.monthKey} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              {/* Row header */}
              <button
                onClick={() => toggleExpand(payout.monthKey)}
                className="w-full flex items-center gap-4 p-5 text-left cursor-pointer hover:bg-stone-50 transition-colors"
              >
                {/* Month icon */}
                <div className="w-11 h-11 flex items-center justify-center bg-stone-100 rounded-xl shrink-0">
                  <i className="ri-calendar-2-line text-stone-500 text-lg" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-stone-900">{payout.monthLabel}</h4>
                    <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} inline-block`} />
                      {cfg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-stone-400 flex-wrap">
                    <span><i className="ri-calendar-check-line mr-1" />{payout.bookingCount} booking{payout.bookingCount !== 1 ? 's' : ''}</span>
                    <span><i className="ri-calendar-line mr-1" />Payout: {payout.payoutDate}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xl font-bold text-stone-900">₹{payout.earnings.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-stone-400">net earnings</p>
                </div>

                <div className="w-6 h-6 flex items-center justify-center text-stone-400 shrink-0">
                  <i className={`ri-arrow-down-s-line text-lg transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Expanded booking breakdown */}
              {isExpanded && (
                <div className="border-t border-stone-100 px-5 pb-5">
                  {/* Summary row */}
                  <div className="grid grid-cols-3 gap-4 py-4 mb-3">
                    <div className="text-center">
                      <p className="text-lg font-bold text-stone-900">₹{payout.bookings.reduce((s, b) => s + b.totalAmount, 0).toLocaleString('en-IN')}</p>
                      <p className="text-xs text-stone-400">Gross Revenue</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-red-500">-₹{payout.bookings.reduce((s, b) => s + b.platformFee, 0).toLocaleString('en-IN')}</p>
                      <p className="text-xs text-stone-400">Platform Fee (10%)</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-emerald-600">₹{payout.earnings.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-stone-400">Your Net Earnings</p>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Booking Breakdown</p>
                  <div className="space-y-2">
                    {payout.bookings.map((b) => (
                      <div key={b.id} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                        <div className="w-8 h-8 flex items-center justify-center bg-stone-200 rounded-lg shrink-0">
                          <i className="ri-user-line text-stone-500 text-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-stone-800">{b.guestName}</p>
                          <p className="text-xs text-stone-400 truncate">{b.propertyName} · {b.checkIn} – {b.checkOut} · {b.nights} nights</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-emerald-600">₹{b.hostEarnings.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-stone-400">of ₹{b.totalAmount.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Download row */}
                  <div className="flex justify-end mt-4">
                    <button className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-50 cursor-pointer whitespace-nowrap transition-colors">
                      <i className="ri-download-line" /> Download Statement
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Help note */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
        <i className="ri-information-line text-amber-500 text-lg shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-800 text-sm font-semibold">Payout Schedule</p>
          <p className="text-amber-700 text-xs mt-0.5">All earnings from the previous month are paid out on the 7th of every month. Processing takes 2–3 business days to reflect in your bank account. Contact <strong>host-support@triprodeo.com</strong> for payout issues.</p>
        </div>
      </div>
    </div>
  );
}
