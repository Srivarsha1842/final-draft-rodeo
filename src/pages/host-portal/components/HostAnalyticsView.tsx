import { useState, useMemo } from 'react';
import { HostBooking, HostProperty, HostReview } from '@/pages/admin/types';

interface Props {
  hostId: string;
  bookings: HostBooking[];
  properties: HostProperty[];
  reviews: HostReview[];
}

type TimeRange = '7d' | '30d' | '90d' | '6m' | '1y' | 'all';

export default function HostAnalyticsView({ hostId, bookings, properties, reviews }: Props) {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [selectedProperty, setSelectedProperty] = useState<string>('all');

  // Filter bookings by time range and property
  const filteredBookings = useMemo(() => {
    const now = new Date();
    let cutoff = new Date();
    
    switch (timeRange) {
      case '7d': cutoff.setDate(now.getDate() - 7); break;
      case '30d': cutoff.setDate(now.getDate() - 30); break;
      case '90d': cutoff.setDate(now.getDate() - 90); break;
      case '6m': cutoff.setMonth(now.getMonth() - 6); break;
      case '1y': cutoff.setFullYear(now.getFullYear() - 1); break;
      case 'all': cutoff = new Date('2000-01-01'); break;
    }

    return bookings.filter(b => {
      const bookedDate = new Date(b.bookedAt);
      const matchesTime = bookedDate >= cutoff;
      const matchesProperty = selectedProperty === 'all' || b.propertyId === selectedProperty;
      return matchesTime && matchesProperty && b.status !== 'cancelled';
    });
  }, [bookings, timeRange, selectedProperty]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalRevenue = filteredBookings.reduce((sum, b) => sum + b.hostEarnings, 0);
    const totalBookings = filteredBookings.length;
    const totalNights = filteredBookings.reduce((sum, b) => sum + b.nights, 0);
    const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
    const avgNightsPerBooking = totalBookings > 0 ? totalNights / totalBookings : 0;

    // Occupancy calculation (simplified - based on confirmed bookings vs total possible nights)
    const confirmedBookings = filteredBookings.filter(b => b.status === 'confirmed' || b.status === 'completed');
    const occupiedNights = confirmedBookings.reduce((sum, b) => sum + b.nights, 0);
    
    // Estimate total available nights (rough approximation)
    const daysInRange = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : timeRange === '6m' ? 180 : 365;
    const totalProperties = selectedProperty === 'all' ? properties.length : 1;
    const totalAvailableNights = daysInRange * totalProperties;
    const occupancyRate = totalAvailableNights > 0 ? (occupiedNights / totalAvailableNights) * 100 : 0;

    return {
      totalRevenue,
      totalBookings,
      totalNights,
      avgBookingValue,
      avgNightsPerBooking,
      occupancyRate,
      confirmedBookings: confirmedBookings.length,
    };
  }, [filteredBookings, timeRange, selectedProperty, properties.length]);

  // Revenue by month chart data
  const revenueChartData = useMemo(() => {
    const monthly: Record<string, number> = {};
    
    filteredBookings.forEach(b => {
      const date = new Date(b.bookedAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthly[key] = (monthly[key] || 0) + b.hostEarnings;
    });

    // Sort and get last 6 months
    const sorted = Object.entries(monthly)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6);

    const max = Math.max(...sorted.map(d => d[1]), 1);
    
    return sorted.map(([month, revenue]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-IN', { month: 'short' }),
      revenue,
      height: (revenue / max) * 100,
    }));
  }, [filteredBookings]);

  // Bookings by status
  const bookingsByStatus = useMemo(() => {
    const counts = { confirmed: 0, pending: 0, completed: 0, cancelled: 0 };
    filteredBookings.forEach(b => {
      if (b.status in counts) counts[b.status as keyof typeof counts]++;
    });
    return counts;
  }, [filteredBookings]);

  // Property performance
  const propertyPerformance = useMemo(() => {
    const perf: Record<string, { name: string; revenue: number; bookings: number; nights: number }> = {};
    
    filteredBookings.forEach(b => {
      if (!perf[b.propertyId]) {
        perf[b.propertyId] = { 
          name: b.propertyName, 
          revenue: 0, 
          bookings: 0, 
          nights: 0 
        };
      }
      perf[b.propertyId].revenue += b.hostEarnings;
      perf[b.propertyId].bookings++;
      perf[b.propertyId].nights += b.nights;
    });

    return Object.entries(perf)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredBookings]);

  // Review stats
  const reviewStats = useMemo(() => {
    const propertyReviews = selectedProperty === 'all' 
      ? reviews 
      : reviews.filter(r => r.propertyId === selectedProperty);
    
    if (propertyReviews.length === 0) return null;
    
    const avgRating = propertyReviews.reduce((sum, r) => sum + r.rating, 0) / propertyReviews.length;
    const ratingDist = [5, 4, 3, 2, 1].map(star => ({
      star,
      count: propertyReviews.filter(r => Math.round(r.rating) === star).length,
    }));
    
    return { avgRating, total: propertyReviews.length, distribution: ratingDist };
  }, [reviews, selectedProperty]);

  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '6m', label: 'Last 6 Months' },
    { value: '1y', label: 'Last Year' },
    { value: 'all', label: 'All Time' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Analytics Dashboard</h2>
          <p className="text-stone-500 text-sm mt-1">Track your performance, revenue, and occupancy trends</p>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-3 py-2 border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:border-stone-400 bg-white cursor-pointer"
          >
            <option value="all">All Properties</option>
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          
          <div className="flex bg-stone-100 p-1 rounded-xl">
            {timeRangeOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setTimeRange(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  timeRange === opt.value 
                    ? 'bg-white text-stone-900 shadow-sm' 
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { 
            label: 'Total Revenue', 
            value: `₹${metrics.totalRevenue.toLocaleString('en-IN')}`, 
            subtext: `${metrics.totalBookings} bookings`,
            icon: 'ri-money-rupee-circle-line',
            color: 'bg-emerald-50 text-emerald-700',
            iconBg: 'bg-emerald-100'
          },
          { 
            label: 'Occupancy Rate', 
            value: `${metrics.occupancyRate.toFixed(1)}%`, 
            subtext: `${metrics.totalNights} nights booked`,
            icon: 'ri-calendar-check-line',
            color: 'bg-blue-50 text-blue-700',
            iconBg: 'bg-blue-100'
          },
          { 
            label: 'Avg. Booking Value', 
            value: `₹${Math.round(metrics.avgBookingValue).toLocaleString('en-IN')}`, 
            subtext: `${metrics.avgNightsPerBooking.toFixed(1)} nights avg`,
            icon: 'ri-shopping-bag-3-line',
            color: 'bg-amber-50 text-amber-700',
            iconBg: 'bg-amber-100'
          },
          { 
            label: 'Confirmed Bookings', 
            value: metrics.confirmedBookings.toString(), 
            subtext: `${bookingsByStatus.pending} pending`,
            icon: 'ri-check-double-line',
            color: 'bg-purple-50 text-purple-700',
            iconBg: 'bg-purple-100'
          },
        ].map((metric, i) => (
          <div key={i} className={`${metric.color} rounded-xl p-4`}>
            <div className={`w-10 h-10 ${metric.iconBg} rounded-lg flex items-center justify-center mb-3`}>
              <i className={`${metric.icon} text-lg`} />
            </div>
            <p className="text-2xl font-bold">{metric.value}</p>
            <p className="text-xs opacity-70 mt-0.5">{metric.label}</p>
            <p className="text-xs opacity-60 mt-1">{metric.subtext}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h3 className="font-bold text-stone-900 mb-4">Revenue Trend</h3>
          {revenueChartData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-stone-400 text-sm">
              No revenue data for selected period
            </div>
          ) : (
            <div className="h-48 flex items-end gap-3">
              {revenueChartData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-stone-100 rounded-t-lg relative" style={{ height: '120px' }}>
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-stone-900 rounded-t-lg transition-all duration-500"
                      style={{ height: `${d.height}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-stone-700">₹{(d.revenue / 1000).toFixed(0)}k</p>
                    <p className="text-xs text-stone-400">{d.month}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking Status Distribution */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h3 className="font-bold text-stone-900 mb-4">Booking Status</h3>
          <div className="space-y-4">
            {[
              { label: 'Confirmed', count: bookingsByStatus.confirmed, color: 'bg-emerald-500', textColor: 'text-emerald-700' },
              { label: 'Completed', count: bookingsByStatus.completed, color: 'bg-stone-700', textColor: 'text-stone-700' },
              { label: 'Pending', count: bookingsByStatus.pending, color: 'bg-amber-400', textColor: 'text-amber-700' },
              { label: 'Cancelled', count: bookingsByStatus.cancelled, color: 'bg-red-400', textColor: 'text-red-600' },
            ].map(status => {
              const total = Object.values(bookingsByStatus).reduce((a, b) => a + b, 0);
              const pct = total > 0 ? (status.count / total) * 100 : 0;
              return (
                <div key={status.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={`font-medium ${status.textColor}`}>{status.label}</span>
                    <span className="text-stone-500">{status.count} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className={`h-full ${status.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Property Performance & Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Performance */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h3 className="font-bold text-stone-900 mb-4">Property Performance</h3>
          {propertyPerformance.length === 0 ? (
            <div className="text-center py-8 text-stone-400 text-sm">
              No booking data available
            </div>
          ) : (
            <div className="space-y-4">
              {propertyPerformance.map((prop, i) => (
                <div key={prop.id} className="flex items-center gap-4 p-3 bg-stone-50 rounded-xl">
                  <div className="w-10 h-10 bg-stone-200 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-stone-600">#{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-900 text-sm truncate">{prop.name}</p>
                    <p className="text-xs text-stone-500">{prop.bookings} bookings · {prop.nights} nights</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-emerald-600 text-sm">₹{prop.revenue.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-stone-400">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Analytics */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h3 className="font-bold text-stone-900 mb-4">Review Analytics</h3>
          {!reviewStats ? (
            <div className="text-center py-8 text-stone-400 text-sm">
              No reviews yet for selected properties
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-stone-900">{reviewStats.avgRating.toFixed(1)}</p>
                  <div className="flex items-center gap-0.5 justify-center mt-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <i 
                        key={s} 
                        className={`${s <= Math.round(reviewStats.avgRating) ? 'ri-star-fill text-amber-400' : 'ri-star-line text-stone-300'} text-sm`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-stone-400 mt-1">{reviewStats.total} reviews</p>
                </div>
                <div className="flex-1 space-y-2">
                  {reviewStats.distribution.map(d => {
                    const pct = reviewStats.total > 0 ? (d.count / reviewStats.total) * 100 : 0;
                    return (
                      <div key={d.star} className="flex items-center gap-2">
                        <span className="text-xs text-stone-500 w-3">{d.star}</span>
                        <i className="ri-star-fill text-amber-400 text-xs" />
                        <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-stone-400 w-6 text-right">{d.count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Review insights */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: '5-Star Reviews', value: reviewStats.distribution[0].count, color: 'bg-emerald-50 text-emerald-700' },
                  { label: 'Response Rate', value: '100%', color: 'bg-blue-50 text-blue-700' },
                ].map((insight, i) => (
                  <div key={i} className={`${insight.color} rounded-lg p-3 text-center`}>
                    <p className="text-lg font-bold">{insight.value}</p>
                    <p className="text-xs opacity-70">{insight.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="mt-6 bg-stone-900 rounded-xl p-5 text-white">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <i className="ri-lightbulb-line text-amber-400" />
          Performance Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.occupancyRate > 70 ? (
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-emerald-400 font-semibold text-sm mb-1">🎉 High Occupancy!</p>
              <p className="text-stone-300 text-xs">Your occupancy rate of {metrics.occupancyRate.toFixed(0)}% is excellent. Consider raising prices during peak periods.</p>
            </div>
          ) : metrics.occupancyRate < 40 ? (
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-amber-400 font-semibold text-sm mb-1">📈 Boost Opportunity</p>
              <p className="text-stone-300 text-xs">Your occupancy is {metrics.occupancyRate.toFixed(0)}%. Try offering discounts or improving your listing photos.</p>
            </div>
          ) : (
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-blue-400 font-semibold text-sm mb-1">📊 Steady Performance</p>
              <p className="text-stone-300 text-xs">Your {metrics.occupancyRate.toFixed(0)}% occupancy is solid. Focus on guest reviews to increase bookings.</p>
            </div>
          )}
          
          {metrics.avgBookingValue > 20000 ? (
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-emerald-400 font-semibold text-sm mb-1">💰 Premium Pricing</p>
              <p className="text-stone-300 text-xs">Your avg booking value of ₹{Math.round(metrics.avgBookingValue).toLocaleString()} is strong. You're in the premium tier.</p>
            </div>
          ) : (
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-amber-400 font-semibold text-sm mb-1">💡 Revenue Tip</p>
              <p className="text-stone-300 text-xs">Consider upselling experiences or add-ons to increase your average booking value.</p>
            </div>
          )}
          
          {reviewStats && reviewStats.avgRating >= 4.5 ? (
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-emerald-400 font-semibold text-sm mb-1">⭐ Excellent Rating!</p>
              <p className="text-stone-300 text-xs">Your {reviewStats.avgRating.toFixed(1)} rating is outstanding. Highlight this in your listing title!</p>
            </div>
          ) : (
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-amber-400 font-semibold text-sm mb-1">📝 Review Focus</p>
              <p className="text-stone-300 text-xs">Respond to all reviews promptly and address any negative feedback to improve your rating.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}