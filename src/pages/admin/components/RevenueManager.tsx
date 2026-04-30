import { useMemo, useState } from 'react';
import { loadHostData } from '@/pages/admin/hostStore';

type PeriodKey = '3m' | '6m' | '12m';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Simulate richer monthly data for demo
function generateMonthlyData(months: number) {
  const result: { key: string; label: string; revenue: number; platform: number; bookings: number; dayOuting: number }[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = d.getMonth();
    const y = d.getFullYear();
    const base = 180000 + Math.sin(i * 0.9) * 60000 + Math.random() * 40000;
    const revenue = Math.round(base);
    const platform = Math.round(revenue * 0.1);
    const bookings = Math.round(revenue / 18000) + Math.floor(Math.random() * 3);
    const dayOuting = Math.round(revenue * 0.08);
    result.push({ key: `${y}-${String(m + 1).padStart(2, '0')}`, label: `${MONTH_NAMES[m]} '${String(y).slice(2)}`, revenue, platform, bookings, dayOuting });
  }
  return result;
}

export default function RevenueManager() {
  const data = useMemo(() => loadHostData(), []);
  const bookings = data.bookings;
  const [period, setPeriod] = useState<PeriodKey>('6m');
  const [chartView, setChartView] = useState<'revenue' | 'bookings'>('revenue');

  const activeBookings = bookings.filter((b) => b.status !== 'cancelled');
  const totalRevenue = activeBookings.reduce((s, b) => s + b.totalAmount, 0);
  const totalHostPayouts = activeBookings.reduce((s, b) => s + b.hostEarnings, 0);
  const platformEarnings = totalRevenue - totalHostPayouts;
  const avgBookingValue = activeBookings.length ? Math.round(totalRevenue / activeBookings.length) : 0;

  const periodMonths: Record<PeriodKey, number> = { '3m': 3, '6m': 6, '12m': 12 };
  const monthlyData = useMemo(() => generateMonthlyData(periodMonths[period]), [period]);

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue), 1);
  const maxBookings = Math.max(...monthlyData.map((d) => d.bookings), 1);

  // Per-host breakdown
  const hostBreakdown = useMemo(() => {
    const map: Record<string, { name: string; revenue: number; bookings: number; platform: number; avgValue: number }> = {};
    activeBookings.forEach((b) => {
      const acc = data.accounts.find((a) => a.id === b.hostId);
      if (!map[b.hostId]) map[b.hostId] = { name: acc?.name ?? 'Unknown Host', revenue: 0, bookings: 0, platform: 0, avgValue: 0 };
      map[b.hostId].revenue += b.totalAmount;
      map[b.hostId].bookings += 1;
      map[b.hostId].platform += b.platformFee;
    });
    return Object.values(map)
      .map((h) => ({ ...h, avgValue: h.bookings ? Math.round(h.revenue / h.bookings) : 0 }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [activeBookings, data.accounts]);

  // Status breakdown pie-like
  const statusBreakdown = useMemo(() => {
    const counts = { confirmed: 0, pending: 0, completed: 0, cancelled: 0 };
    bookings.forEach((b) => { if (b.status in counts) counts[b.status as keyof typeof counts]++; });
    return counts;
  }, [bookings]);

  const topProperties = useMemo(() => {
    const map: Record<string, { name: string; revenue: number; bookings: number }> = {};
    activeBookings.forEach((b) => {
      if (!map[b.propertyName]) map[b.propertyName] = { name: b.propertyName, revenue: 0, bookings: 0 };
      map[b.propertyName].revenue += b.totalAmount;
      map[b.propertyName].bookings += 1;
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [activeBookings]);

  const maxPropRevenue = Math.max(...topProperties.map((p) => p.revenue), 1);

  const totalMonthlyRevenue = monthlyData.reduce((s, d) => s + d.revenue, 0);
  const prevMonthRevenue = monthlyData.length >= 2 ? monthlyData[monthlyData.length - 2].revenue : 0;
  const currMonthRevenue = monthlyData.length >= 1 ? monthlyData[monthlyData.length - 1].revenue : 0;
  const monthGrowth = prevMonthRevenue ? (((currMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100).toFixed(1) : '—';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Revenue Reports</h1>
          <p className="text-stone-500 text-sm mt-1">Booking trends, earnings breakdown and performance analytics</p>
        </div>
        <div className="flex gap-1 bg-stone-100 p-1 rounded-xl">
          {(['3m', '6m', '12m'] as PeriodKey[]).map((p) => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${period === p ? 'bg-white text-stone-900' : 'text-stone-500'}`}>
              {p === '3m' ? '3 Months' : p === '6m' ? '6 Months' : '12 Months'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Gross Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: 'ri-money-rupee-circle-line', color: 'text-amber-700 bg-amber-50', sub: `${activeBookings.length} bookings` },
          { label: 'Platform Earnings', value: `₹${platformEarnings.toLocaleString('en-IN')}`, icon: 'ri-bank-line', color: 'text-emerald-700 bg-emerald-50', sub: '10% commission' },
          { label: 'Owner Payouts', value: `₹${totalHostPayouts.toLocaleString('en-IN')}`, icon: 'ri-send-plane-line', color: 'text-stone-700 bg-stone-100', sub: `${hostBreakdown.length} owners` },
          { label: 'Avg Booking Value', value: `₹${avgBookingValue.toLocaleString('en-IN')}`, icon: 'ri-bar-chart-line', color: 'text-orange-700 bg-orange-50', sub: 'per booking' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-stone-200 p-5">
            <div className={`w-9 h-9 flex items-center justify-center rounded-lg mb-3 ${s.color}`}>
              <i className={`${s.icon} text-base`} />
            </div>
            <p className="text-xl font-bold text-stone-900">{s.value}</p>
            <p className="text-stone-500 text-xs mt-0.5 font-medium">{s.label}</p>
            <p className="text-stone-300 text-xs mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Main chart */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h2 className="font-bold text-stone-900 text-base">
              {chartView === 'revenue' ? 'Revenue Trends' : 'Booking Volume'}
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              {chartView === 'revenue'
                ? `₹${totalMonthlyRevenue.toLocaleString('en-IN')} total · MoM growth: ${monthGrowth}%`
                : `${monthlyData.reduce((s, d) => s + d.bookings, 0)} bookings in period`}
            </p>
          </div>
          <div className="flex gap-1 bg-stone-100 p-1 rounded-xl">
            <button onClick={() => setChartView('revenue')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${chartView === 'revenue' ? 'bg-white text-stone-900' : 'text-stone-500'}`}>Revenue</button>
            <button onClick={() => setChartView('bookings')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${chartView === 'bookings' ? 'bg-white text-stone-900' : 'text-stone-500'}`}>Bookings</button>
          </div>
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-2" style={{ height: 160 }}>
          {monthlyData.map((d) => {
            const barH = chartView === 'revenue'
              ? Math.max((d.revenue / maxRevenue) * 140, 4)
              : Math.max((d.bookings / maxBookings) * 140, 4);
            const innerH = chartView === 'revenue'
              ? (d.platform / d.revenue) * barH
              : barH;
            return (
              <div key={d.key} className="flex-1 flex flex-col items-center gap-1 group">
                {/* Tooltip on hover */}
                <div className="relative flex-1 flex items-end w-full">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
                    <div className="bg-stone-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
                      {chartView === 'revenue' ? `₹${(d.revenue / 1000).toFixed(0)}k` : `${d.bookings} bookings`}
                    </div>
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-stone-900" />
                  </div>
                  <div className="w-full flex flex-col rounded-t-lg overflow-hidden" style={{ height: barH }}>
                    <div className="w-full bg-amber-400 rounded-t-lg" style={{ height: innerH }} />
                    {chartView === 'revenue' && <div className="w-full bg-stone-200 flex-1" />}
                  </div>
                </div>
                <span className="text-xs text-stone-400 whitespace-nowrap">{d.label}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-stone-100 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-stone-500"><div className="w-3 h-3 bg-amber-400 rounded-sm" /> {chartView === 'revenue' ? 'Platform Earnings' : 'Monthly Bookings'}</div>
          {chartView === 'revenue' && <div className="flex items-center gap-1.5 text-xs text-stone-500"><div className="w-3 h-3 bg-stone-200 rounded-sm" /> Owner Payouts</div>}
        </div>
      </div>

      {/* Bottom row: booking status + top properties */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Booking status distribution */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h2 className="font-bold text-stone-900 text-sm mb-4">Booking Status Distribution</h2>
          <div className="space-y-3">
            {([ 
              { key: 'confirmed', label: 'Confirmed', color: 'bg-emerald-400' },
              { key: 'completed', label: 'Completed', color: 'bg-stone-400' },
              { key: 'pending', label: 'Pending', color: 'bg-amber-400' },
              { key: 'cancelled', label: 'Cancelled', color: 'bg-red-400' },
            ] as const).map(({ key, label, color }) => {
              const count = statusBreakdown[key];
              const pct = bookings.length ? (count / bookings.length) * 100 : 0;
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-xs text-stone-500 w-20 shrink-0">{label}</span>
                  <div className="flex-1 h-2.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-stone-700 w-8 text-right">{count}</span>
                  <span className="text-xs text-stone-400 w-10 text-right">{pct.toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-400">Total Bookings</span>
            <span className="font-bold text-stone-900">{bookings.length}</span>
          </div>
        </div>

        {/* Top properties by revenue */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h2 className="font-bold text-stone-900 text-sm mb-4">Top Properties by Revenue</h2>
          {topProperties.length === 0 ? (
            <p className="text-stone-400 text-sm text-center py-6">No booking data available</p>
          ) : (
            <div className="space-y-3">
              {topProperties.map((p, idx) => (
                <div key={p.name} className="flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 text-xs font-bold shrink-0">{idx + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-stone-800 truncate">{p.name}</span>
                      <span className="text-xs font-bold text-stone-900 shrink-0">₹{(p.revenue / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(p.revenue / maxPropRevenue) * 100}%` }} />
                    </div>
                    <span className="text-xs text-stone-400 mt-0.5 block">{p.bookings} bookings</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Month-over-month trend table */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 mb-6">
        <h2 className="font-bold text-stone-900 text-sm mb-4">Monthly Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100">
                <th className="text-left py-2 px-3 text-xs text-stone-500 font-semibold uppercase tracking-wider">Month</th>
                <th className="text-right py-2 px-3 text-xs text-stone-500 font-semibold uppercase tracking-wider">Bookings</th>
                <th className="text-right py-2 px-3 text-xs text-stone-500 font-semibold uppercase tracking-wider">Gross Revenue</th>
                <th className="text-right py-2 px-3 text-xs text-stone-500 font-semibold uppercase tracking-wider">Platform</th>
                <th className="text-right py-2 px-3 text-xs text-stone-500 font-semibold uppercase tracking-wider">Day Outing</th>
                <th className="text-right py-2 px-3 text-xs text-stone-500 font-semibold uppercase tracking-wider">MoM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {monthlyData.map((d, i) => {
                const prev = i > 0 ? monthlyData[i - 1].revenue : null;
                const growth = prev ? ((d.revenue - prev) / prev) * 100 : null;
                return (
                  <tr key={d.key} className="hover:bg-stone-50 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-stone-800">{d.label}</td>
                    <td className="py-2.5 px-3 text-right text-stone-600">{d.bookings}</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-stone-900">₹{d.revenue.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-600 font-medium">₹{d.platform.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right text-amber-600">₹{d.dayOuting.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right">
                      {growth !== null ? (
                        <span className={`text-xs font-semibold ${growth >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-stone-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Per-host breakdown */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-bold text-stone-900 text-base">Property Owner Performance</h2>
          <span className="text-xs text-stone-400">{hostBreakdown.length} active hosts</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Host</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Bookings</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Gross Revenue</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Avg. Value</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Platform Earned</th>
                <th className="px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {hostBreakdown.map((h, idx) => {
                const share = totalRevenue ? (h.revenue / totalRevenue) * 100 : 0;
                return (
                  <tr key={idx} className="hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs shrink-0">{h.name.charAt(0)}</div>
                        <span className="font-medium text-stone-900">{h.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right text-stone-600">{h.bookings}</td>
                    <td className="px-5 py-3 text-right font-semibold text-stone-900">₹{h.revenue.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3 text-right text-stone-500">₹{h.avgValue.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3 text-right font-semibold text-emerald-600">₹{h.platform.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${share}%` }} />
                        </div>
                        <span className="text-xs text-stone-400 w-8 text-right">{share.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {hostBreakdown.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 text-stone-400">No booking data available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
