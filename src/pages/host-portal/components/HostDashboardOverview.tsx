import { HostAccount, HostBooking, HostProperty } from '@/pages/admin/types';

interface Props {
  host: HostAccount;
  bookings: HostBooking[];
  properties: HostProperty[];
  onNav: (section: string) => void;
}

export default function HostDashboardOverview({ host, bookings, properties, onNav }: Props) {
  const totalEarnings = bookings.filter((b) => b.status !== 'cancelled').reduce((s, b) => s + b.hostEarnings, 0);
  const thisMonthEarnings = bookings
    .filter((b) => {
      const d = new Date(b.bookedAt);
      const now = new Date();
      return b.status !== 'cancelled' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, b) => s + b.hostEarnings, 0);
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const activeProperties = properties.filter((p) => p.status === 'active');

  const recentBookings = [...bookings].sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime()).slice(0, 5);

  const statusColors: Record<string, string> = {
    confirmed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-stone-100 text-stone-600',
  };

  return (
    <div>
      {/* Welcome */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-stone-900">Welcome back, {host.name.split(' ')[0]}!</h2>
        <p className="text-stone-500 text-sm mt-1">Here&apos;s a snapshot of your property business</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Earnings', value: `₹${totalEarnings.toLocaleString('en-IN')}`, icon: 'ri-money-rupee-circle-line', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'This Month', value: `₹${thisMonthEarnings.toLocaleString('en-IN')}`, icon: 'ri-calendar-line', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Confirmed Bookings', value: confirmedBookings.length, icon: 'ri-calendar-check-line', color: 'text-stone-700', bg: 'bg-stone-100' },
          { label: 'Active Properties', value: activeProperties.length, icon: 'ri-building-line', color: 'text-stone-700', bg: 'bg-stone-100' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
            <div className={`w-9 h-9 flex items-center justify-center bg-white/70 rounded-lg mb-3`}>
              <i className={`${s.icon} ${s.color} text-lg`} />
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-stone-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Pending alert */}
      {pendingBookings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 mb-6">
          <div className="w-9 h-9 flex items-center justify-center bg-amber-200 rounded-lg shrink-0">
            <i className="ri-notification-3-line text-amber-700" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-amber-900 text-sm">{pendingBookings.length} booking{pendingBookings.length > 1 ? 's' : ''} awaiting confirmation</p>
            <p className="text-amber-700 text-xs">Review and confirm to secure your earnings</p>
          </div>
          <button onClick={() => onNav('bookings')} className="px-3 py-1.5 bg-amber-400 text-stone-900 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap hover:bg-amber-300 transition-colors">
            View Bookings
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-stone-900">Recent Bookings</h3>
            <button onClick={() => onNav('bookings')} className="text-xs text-stone-500 hover:text-stone-900 cursor-pointer">View all</button>
          </div>
          <div className="space-y-3">
            {recentBookings.length === 0 && <p className="text-stone-400 text-sm text-center py-6">No bookings yet</p>}
            {recentBookings.map((b) => (
              <div key={b.id} className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center bg-stone-100 rounded-lg shrink-0">
                  <i className="ri-user-line text-stone-500 text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-900 truncate">{b.guestName}</p>
                  <p className="text-xs text-stone-400 truncate">{b.propertyName} · {b.checkIn}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-amber-600">₹{b.hostEarnings.toLocaleString('en-IN')}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[b.status]}`}>{b.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Properties */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-stone-900">Your Properties</h3>
            <button onClick={() => onNav('properties')} className="text-xs text-stone-500 hover:text-stone-900 cursor-pointer">Manage</button>
          </div>
          <div className="space-y-3">
            {properties.length === 0 && <p className="text-stone-400 text-sm text-center py-4">No properties added yet</p>}
            {properties.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-12 h-10 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                  {p.images[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-900 truncate">{p.name}</p>
                  <p className="text-xs text-stone-400 truncate">{p.location}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-stone-900">₹{p.pricePerNight.toLocaleString('en-IN')}<span className="text-xs font-normal text-stone-400">/night</span></p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'active' ? 'bg-emerald-100 text-emerald-700' : p.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-500'}`}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => onNav('add-property')}
            className="w-full mt-4 py-2.5 border-2 border-dashed border-stone-200 rounded-xl text-sm text-stone-400 hover:text-stone-700 hover:border-stone-400 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <i className="ri-add-line" /> Add New Property
          </button>
        </div>
      </div>
    </div>
  );
}
