import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { 
  userProfile, 
  bookings, 
  savedTrips, 
  wallet, 
  walletTransactions,
  loyaltyPoints,
  loyaltyTiers,
  referralStats,
  dayOutingEnquiries,
  Booking,
  SavedTrip,
  DayOutingEnquiry,
} from '@/mocks/dashboard';

const tabs = [
  { id: 'overview', label: 'Overview', icon: 'ri-dashboard-line' },
  { id: 'bookings', label: 'My Bookings', icon: 'ri-calendar-check-line' },
  { id: 'day-outing', label: 'Day Outing', icon: 'ri-sun-line' },
  { id: 'saved', label: 'Saved Trips', icon: 'ri-heart-3-line' },
  { id: 'wallet', label: 'Wallet', icon: 'ri-wallet-3-line' },
  { id: 'loyalty', label: 'Loyalty', icon: 'ri-vip-crown-line' },
  { id: 'profile', label: 'Profile', icon: 'ri-user-settings-line' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [bookingFilter, setBookingFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());
  const [referralCopied, setReferralCopied] = useState(false);

  // Update tab from URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tabs.find((t) => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const filteredBookings = bookings.filter((b) => 
    bookingFilter === 'all' ? true : b.status === bookingFilter
  );

  const upcomingCount = bookings.filter((b) => b.status === 'upcoming').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'upcoming': return 'bg-emerald-100 text-emerald-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-stone-100 text-stone-700';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Header with User Info */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="relative">
                <img 
                  src={userProfile.avatar} 
                  alt={userProfile.firstName}
                  className="w-20 h-20 rounded-full object-cover border-4 border-amber-100"
                />
                {userProfile.isSuperGuest && (
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center">
                    <i className="ri-vip-crown-fill text-white text-xs" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-stone-900">
                    Welcome back, {userProfile.firstName}!
                  </h1>
                  {userProfile.isVerified && (
                    <i className="ri-verified-badge-fill text-emerald-500 text-xl" />
                  )}
                </div>
                <p className="text-stone-500 text-sm">
                  {userProfile.isSuperGuest ? 'Super Guest' : 'Member'} · {userProfile.totalTrips} trips · {userProfile.totalNights} nights · Joined {new Date(userProfile.joinedDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="flex gap-3">
                <div className="text-center px-4 py-2 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="text-2xl font-bold text-amber-700">{loyaltyPoints.current}</p>
                  <p className="text-xs text-amber-600">Points</p>
                </div>
                <div className="text-center px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-2xl font-bold text-emerald-700">₹{wallet.balance.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-emerald-600">Wallet</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden sticky top-28">
                <nav className="p-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'bg-stone-900 text-white'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <i className={tab.icon} />
                      {tab.label}
                      {tab.id === 'bookings' && upcomingCount > 0 && (
                        <span className="ml-auto px-2 py-0.5 bg-amber-400 text-stone-900 text-xs rounded-full">
                          {upcomingCount}
                        </span>
                      )}
                      {tab.id === 'day-outing' && dayOutingEnquiries.filter((d) => d.status === 'pending' || d.status === 'confirmed').length > 0 && (
                        <span className="ml-auto px-2 py-0.5 bg-amber-400 text-stone-900 text-xs rounded-full">
                          {dayOutingEnquiries.filter((d) => d.status === 'pending' || d.status === 'confirmed').length}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>

                {/* Quick Actions */}
                <div className="p-4 border-t border-stone-100">
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Quick Actions</p>
                  <div className="space-y-2">
                    <button 
                      onClick={() => navigate('/search')}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <i className="ri-search-line" />
                      Find Stays
                    </button>
                    <button 
                      onClick={() => navigate('/experiences')}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <i className="ri-compass-3-line" />
                      Explore Experiences
                    </button>
                    <button 
                      onClick={() => navigate('/ai-planner')}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <i className="ri-magic-line" />
                      AI Trip Planner
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Upcoming Trips */}
                  {upcomingCount > 0 && (
                    <div className="bg-white rounded-2xl border border-stone-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-stone-900">Upcoming Trips</h2>
                        <button 
                          onClick={() => setActiveTab('bookings')}
                          className="text-sm text-stone-600 hover:text-stone-900 cursor-pointer"
                        >
                          View all
                        </button>
                      </div>
                      <div className="space-y-4">
                        {bookings.filter((b) => b.status === 'upcoming').slice(0, 2).map((booking) => (
                          <BookingCard 
                            key={booking.id} 
                            booking={booking} 
                            compact 
                            onCancel={() => setShowCancelModal(booking.id)}
                            onReview={() => setShowReviewModal(booking)}
                            reviewed={reviewedIds.has(booking.id)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Saved Trips Preview */}
                  {savedTrips.length > 0 && (
                    <div className="bg-white rounded-2xl border border-stone-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-stone-900">Saved for Later</h2>
                        <button 
                          onClick={() => setActiveTab('saved')}
                          className="text-sm text-stone-600 hover:text-stone-900 cursor-pointer"
                        >
                          View all ({savedTrips.length})
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {savedTrips.slice(0, 2).map((trip) => (
                          <SavedTripCard key={trip.id} trip={trip} compact />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Loyalty & Wallet Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl border border-amber-200 p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <i className="ri-vip-crown-fill text-amber-600 text-xl" />
                        <h2 className="font-bold text-stone-900">{loyaltyPoints.tier} Member</h2>
                      </div>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-stone-600">Progress to {loyaltyPoints.nextTier}</span>
                          <span className="font-medium text-stone-900">{loyaltyPoints.tierProgress}%</span>
                        </div>
                        <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-500 rounded-full transition-all"
                            style={{ width: `${loyaltyPoints.tierProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-stone-500 mt-1">
                          {loyaltyPoints.pointsToNextTier} more points needed
                        </p>
                      </div>
                      <button 
                        onClick={() => setActiveTab('loyalty')}
                        className="text-sm font-medium text-amber-700 hover:text-amber-800 cursor-pointer"
                      >
                        View benefits →
                      </button>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200 p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <i className="ri-wallet-3-fill text-emerald-600 text-xl" />
                        <h2 className="font-bold text-stone-900">Wallet Balance</h2>
                      </div>
                      <p className="text-3xl font-bold text-emerald-700 mb-1">
                        ₹{wallet.balance.toLocaleString('en-IN')}
                      </p>
                      <p className="text-sm text-emerald-600 mb-4">
                        + ₹{wallet.pendingCashback.toLocaleString('en-IN')} pending cashback
                      </p>
                      <button 
                        onClick={() => setActiveTab('wallet')}
                        className="text-sm font-medium text-emerald-700 hover:text-emerald-800 cursor-pointer"
                      >
                        View transactions →
                      </button>
                    </div>
                  </div>

                  {/* Referral Card */}
                  <div className="bg-stone-900 rounded-2xl p-6 text-white">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-bold mb-1">Invite Friends, Earn Rewards</h2>
                        <p className="text-stone-400 text-sm">
                          Share your code <span className="text-amber-400 font-mono font-bold">{referralStats.code}</span> and earn ₹250 per successful referral
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const link = `https://triprodeo.com/signup?ref=${referralStats.code}`;
                            navigator.clipboard.writeText(link).then(() => {
                              setReferralCopied(true);
                              setTimeout(() => setReferralCopied(false), 2500);
                            });
                          }}
                          className="px-4 py-2 bg-white text-stone-900 rounded-lg text-sm font-medium hover:bg-stone-100 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <i className={`${referralCopied ? 'ri-check-line' : 'ri-file-copy-line'} mr-1`} />
                          {referralCopied ? 'Copied!' : 'Copy Link'}
                        </button>
                        <button
                          onClick={() => {
                            const link = `https://triprodeo.com/signup?ref=${referralStats.code}`;
                            const text = `Join Triprodeo and get ₹500 off your first booking! Use my code ${referralStats.code}: ${link}`;
                            if (navigator.share) {
                              navigator.share({ title: 'Join Triprodeo', text, url: link });
                            } else {
                              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                            }
                          }}
                          className="px-4 py-2 bg-amber-400 text-stone-900 rounded-lg text-sm font-medium hover:bg-amber-300 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <i className="ri-share-line mr-1" />
                          Share
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-8 mt-4 pt-4 border-t border-stone-700">
                      <div>
                        <p className="text-2xl font-bold">{referralStats.totalInvited}</p>
                        <p className="text-stone-400 text-xs">Friends Invited</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{referralStats.successfulReferrals}</p>
                        <p className="text-stone-400 text-xs">Successful</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-amber-400">₹{referralStats.totalEarned}</p>
                        <p className="text-stone-400 text-xs">Total Earned</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* BOOKINGS TAB */}
              {activeTab === 'bookings' && (
                <div className="space-y-6">
                  {/* Filter Tabs */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'all', label: 'All', count: bookings.length },
                      { id: 'upcoming', label: 'Upcoming', count: upcomingCount },
                      { id: 'completed', label: 'Completed', count: completedCount },
                      { id: 'cancelled', label: 'Cancelled', count: bookings.filter((b) => b.status === 'cancelled').length },
                    ].map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setBookingFilter(filter.id as any)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                          bookingFilter === filter.id
                            ? 'bg-stone-900 text-white'
                            : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'
                        }`}
                      >
                        {filter.label}
                        <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
                          bookingFilter === filter.id ? 'bg-white/20' : 'bg-stone-100'
                        }`}>
                          {filter.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Bookings List */}
                  <div className="space-y-4">
                    {filteredBookings.map((booking) => (
                      <BookingCard 
                        key={booking.id} 
                        booking={booking}
                        onCancel={() => setShowCancelModal(booking.id)}
                        onReview={() => setShowReviewModal(booking)}
                        reviewed={reviewedIds.has(booking.id)}
                      />
                    ))}
                  </div>

                  {filteredBookings.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
                      <div className="w-16 h-16 mx-auto mb-4 bg-stone-100 rounded-full flex items-center justify-center">
                        <i className="ri-calendar-line text-stone-400 text-2xl" />
                      </div>
                      <h3 className="font-semibold text-stone-900 mb-1">No bookings found</h3>
                      <p className="text-stone-500 text-sm mb-4">Start planning your next adventure</p>
                      <button 
                        onClick={() => navigate('/search')}
                        className="px-6 py-2 bg-stone-900 text-white rounded-full text-sm font-medium hover:bg-stone-800 transition-colors cursor-pointer"
                      >
                        Explore Stays
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* DAY OUTING TAB */}
              {activeTab === 'day-outing' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-stone-900">Day Outing Enquiries</h2>
                      <p className="text-stone-500 text-sm mt-0.5">Track all your day outing enquiries and bookings</p>
                    </div>
                    <button
                      onClick={() => navigate('/day-outing')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-full hover:bg-amber-400 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-sun-line" /> Browse Day Outings
                    </button>
                  </div>

                  {/* Summary chips */}
                  <div className="flex gap-3 flex-wrap">
                    {[
                      { label: 'All', count: dayOutingEnquiries.length, filter: 'all' },
                      { label: 'Pending', count: dayOutingEnquiries.filter((d) => d.status === 'pending').length, filter: 'pending' },
                      { label: 'Confirmed', count: dayOutingEnquiries.filter((d) => d.status === 'confirmed').length, filter: 'confirmed' },
                      { label: 'Completed', count: dayOutingEnquiries.filter((d) => d.status === 'completed').length, filter: 'completed' },
                    ].map((f) => (
                      <div key={f.filter} className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 text-stone-600 rounded-full text-xs font-medium">
                        <span>{f.label}</span>
                        <span className="w-4 h-4 flex items-center justify-center bg-stone-200 rounded-full text-xs font-bold">{f.count}</span>
                      </div>
                    ))}
                  </div>

                  {dayOutingEnquiries.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
                      <div className="w-16 h-16 mx-auto mb-4 bg-amber-50 rounded-full flex items-center justify-center">
                        <i className="ri-sun-line text-amber-400 text-2xl" />
                      </div>
                      <h3 className="font-semibold text-stone-900 mb-1">No day outing enquiries yet</h3>
                      <p className="text-stone-500 text-sm mb-4">Browse day outing properties and send an enquiry</p>
                      <button
                        onClick={() => navigate('/day-outing')}
                        className="px-6 py-2 bg-amber-500 text-white rounded-full text-sm font-semibold hover:bg-amber-400 transition-colors cursor-pointer"
                      >
                        Explore Day Outings
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {dayOutingEnquiries.map((enq) => (
                        <DayOutingEnquiryCard key={enq.id} enquiry={enq} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SAVED TAB */}
              {activeTab === 'saved' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-stone-900">Saved Trips ({savedTrips.length})</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedTrips.map((trip) => (
                      <SavedTripCard key={trip.id} trip={trip} />
                    ))}
                  </div>
                </div>
              )}

              {/* WALLET TAB */}
              {activeTab === 'wallet' && (
                <div className="space-y-6">
                  {/* Balance Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl border border-stone-200 p-6">
                      <p className="text-stone-500 text-sm mb-1">Available Balance</p>
                      <p className="text-3xl font-bold text-stone-900">
                        ₹{wallet.balance.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="bg-white rounded-2xl border border-stone-200 p-6">
                      <p className="text-stone-500 text-sm mb-1">Pending Cashback</p>
                      <p className="text-3xl font-bold text-amber-600">
                        ₹{wallet.pendingCashback.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="bg-white rounded-2xl border border-stone-200 p-6">
                      <p className="text-stone-500 text-sm mb-1">Total Earned</p>
                      <p className="text-3xl font-bold text-emerald-600">
                        ₹{wallet.totalEarned.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Transactions */}
                  <div className="bg-white rounded-2xl border border-stone-200 p-6">
                    <h2 className="text-lg font-bold text-stone-900 mb-4">Transaction History</h2>
                    <div className="space-y-3">
                      {walletTransactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              tx.type === 'cashback' ? 'bg-emerald-100' :
                              tx.type === 'refund' ? 'bg-blue-100' :
                              tx.type === 'bonus' ? 'bg-amber-100' :
                              'bg-red-100'
                            }`}>
                              <i className={
                                tx.type === 'cashback' ? 'ri-coins-line text-emerald-600' :
                                tx.type === 'refund' ? 'ri-refund-line text-blue-600' :
                                tx.type === 'bonus' ? 'ri-gift-line text-amber-600' :
                                'ri-arrow-right-down-line text-red-600'
                              } />
                            </div>
                            <div>
                              <p className="font-medium text-stone-900">{tx.description}</p>
                              <p className="text-xs text-stone-500">{tx.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${
                              tx.amount > 0 ? 'text-emerald-600' : 'text-stone-900'
                            }`}>
                              {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                            </p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              tx.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {tx.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* LOYALTY TAB */}
              {activeTab === 'loyalty' && (
                <div className="space-y-6">
                  {/* Current Tier Card */}
                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <i className="ri-vip-crown-fill text-3xl" />
                      <div>
                        <p className="text-amber-100 text-sm">Current Tier</p>
                        <h2 className="text-2xl font-bold">{loyaltyPoints.tier} Member</h2>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-amber-100">{loyaltyPoints.current} points</span>
                        <span>{loyaltyPoints.nextTier} at {loyaltyTiers.find((t) => t.name === loyaltyPoints.nextTier)?.minPoints} points</span>
                      </div>
                      <div className="h-3 bg-amber-700/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white rounded-full transition-all"
                          style={{ width: `${loyaltyPoints.tierProgress}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-amber-100 text-sm">
                      {loyaltyPoints.pointsToNextTier} more points to reach {loyaltyPoints.nextTier}
                    </p>
                  </div>

                  {/* Tier Benefits */}
                  <div className="bg-white rounded-2xl border border-stone-200 p-6">
                    <h2 className="text-lg font-bold text-stone-900 mb-4">Tier Benefits</h2>
                    <div className="space-y-4">
                      {loyaltyTiers.map((tier) => (
                        <div 
                          key={tier.name}
                          className={`p-4 rounded-xl border ${
                            tier.name === loyaltyPoints.tier 
                              ? 'border-amber-400 bg-amber-50' 
                              : 'border-stone-200'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-4 h-4 rounded-full ${tier.color}`} />
                            <h3 className="font-bold text-stone-900">{tier.name}</h3>
                            <span className="text-xs text-stone-500">({tier.minPoints}+ points)</span>
                            {tier.name === loyaltyPoints.tier && (
                              <span className="ml-auto px-2 py-1 bg-amber-400 text-stone-900 text-xs font-bold rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          <ul className="space-y-1.5">
                            {tier.benefits.map((benefit, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-stone-600">
                                <i className="ri-check-line text-emerald-500" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Points Expiry */}
                  <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <i className="ri-time-line text-amber-600 text-xl" />
                      <h3 className="font-bold text-amber-900">Points Expiring Soon</h3>
                    </div>
                    <p className="text-amber-800 text-sm mb-1">
                      <span className="font-bold">{loyaltyPoints.expiringSoon} points</span> will expire on {loyaltyPoints.expiryDate}
                    </p>
                    <p className="text-amber-600 text-xs">
                      Book a trip to keep your points active!
                    </p>
                  </div>
                </div>
              )}

              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-2xl border border-stone-200 p-6">
                  <h2 className="text-lg font-bold text-stone-900 mb-6">Profile Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                      <img 
                        src={userProfile.avatar} 
                        alt={userProfile.firstName}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div>
                        <button className="px-4 py-2 bg-stone-100 text-stone-900 rounded-lg text-sm font-medium hover:bg-stone-200 transition-colors cursor-pointer">
                          Change Photo
                        </button>
                        <p className="text-xs text-stone-500 mt-1">JPG, PNG. Max 2MB.</p>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">First Name</label>
                        <input
                          type="text"
                          defaultValue={userProfile.firstName}
                          className="w-full px-4 py-3 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-stone-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Last Name</label>
                        <input
                          type="text"
                          defaultValue={userProfile.lastName}
                          className="w-full px-4 py-3 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-stone-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
                      <input
                        type="email"
                        defaultValue={userProfile.email}
                        className="w-full px-4 py-3 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Phone</label>
                      <input
                        type="tel"
                        defaultValue={userProfile.phone}
                        className="w-full px-4 py-3 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-stone-900"
                      />
                    </div>

                    <div className="pt-4 border-t border-stone-100">
                      <button className="px-6 py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors cursor-pointer">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-stone-900 mb-2">Cancel Booking?</h3>
            <p className="text-stone-600 text-sm mb-4">
              Are you sure you want to cancel this booking? Refund will be processed according to the cancellation policy.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowCancelModal(null)} className="flex-1 py-3 border border-stone-300 text-stone-900 rounded-xl font-medium hover:bg-stone-50 transition-colors cursor-pointer">Keep Booking</button>
              <button onClick={() => setShowCancelModal(null)} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors cursor-pointer">Cancel Booking</button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-stone-900">Write a Review</h3>
              <button onClick={() => { setShowReviewModal(null); setReviewRating(5); setReviewText(''); }} className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-900 cursor-pointer">
                <i className="ri-close-line text-xl" />
              </button>
            </div>

            {/* Property info */}
            <div className="flex gap-3 p-3 bg-stone-50 rounded-xl mb-5">
              <img src={showReviewModal.image} alt={showReviewModal.title} className="w-14 h-14 rounded-lg object-cover shrink-0" />
              <div>
                <p className="font-semibold text-stone-900 text-sm">{showReviewModal.title}</p>
                <p className="text-stone-500 text-xs">{showReviewModal.location}</p>
              </div>
            </div>

            {/* Star rating */}
            <div className="mb-4">
              <p className="text-sm font-medium text-stone-700 mb-2">Overall Rating</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="cursor-pointer transition-transform hover:scale-110"
                  >
                    <i className={`text-2xl ${star <= reviewRating ? 'ri-star-fill text-amber-400' : 'ri-star-line text-stone-300'}`} />
                  </button>
                ))}
                <span className="ml-2 text-sm text-stone-500 self-center">
                  {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][reviewRating]}
                </span>
              </div>
            </div>

            {/* Review text */}
            <div className="mb-5">
              <p className="text-sm font-medium text-stone-700 mb-2">Your Review</p>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                maxLength={500}
                placeholder="Share your experience — what did you love? Any tips for future guests?"
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:border-stone-900 transition-colors resize-none"
              />
              <p className="text-xs text-stone-400 text-right mt-1">{reviewText.length}/500</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setShowReviewModal(null); setReviewRating(5); setReviewText(''); }} className="px-5 py-3 border border-stone-300 text-stone-700 rounded-xl text-sm font-medium hover:bg-stone-50 transition-colors cursor-pointer whitespace-nowrap">
                Cancel
              </button>
              <button
                disabled={!reviewText.trim() || reviewSubmitting}
                onClick={() => {
                  setReviewSubmitting(true);
                  setTimeout(() => {
                    setReviewedIds((prev) => new Set([...prev, showReviewModal.id]));
                    setReviewSubmitting(false);
                    setShowReviewModal(null);
                    setReviewRating(5);
                    setReviewText('');
                  }, 1000);
                }}
                className="flex-1 py-3 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {reviewSubmitting ? <><i className="ri-loader-4-line animate-spin" />Submitting...</> : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

// Booking Card Component
function BookingCard({ 
  booking, 
  compact = false,
  onCancel,
  onReview,
  reviewed,
}: { 
  booking: Booking; 
  compact?: boolean;
  onCancel?: () => void;
  onReview?: () => void;
  reviewed?: boolean;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'upcoming': return 'bg-emerald-100 text-emerald-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-stone-100 text-stone-700';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (compact) {
    return (
      <div className="flex gap-4 p-4 bg-stone-50 rounded-xl">
        <img 
          src={booking.image} 
          alt={booking.title}
          className="w-24 h-20 rounded-lg object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-stone-900 truncate">{booking.title}</h3>
              <p className="text-stone-500 text-sm">{booking.location}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full shrink-0 ${getStatusColor(booking.status)}`}>
              {booking.status}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-stone-600">
            {booking.checkIn && (
              <span>
                {formatDate(booking.checkIn)} - {formatDate(booking.checkOut || '')}
              </span>
            )}
            {booking.date && (
              <span>{formatDate(booking.date)} {booking.time && `· ${booking.time}`}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <img 
          src={booking.image} 
          alt={booking.title}
          className="w-full md:w-48 h-48 md:h-full object-cover"
        />
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 ${getStatusColor(booking.status)}`}>
                {booking.status}
              </span>
              <h3 className="font-bold text-stone-900">{booking.title}</h3>
              <p className="text-stone-500 text-sm">{booking.location}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-stone-900">₹{booking.totalAmount.toLocaleString('en-IN')}</p>
              {booking.isPartialPayment && booking.balanceDue && (
                <p className="text-xs text-amber-600">
                  ₹{booking.balanceDue.toLocaleString('en-IN')} due
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-stone-600 my-3">
            {booking.checkIn && (
              <span className="flex items-center gap-1">
                <i className="ri-calendar-line" />
                {formatDate(booking.checkIn)} - {formatDate(booking.checkOut || '')}
              </span>
            )}
            {booking.date && (
              <span className="flex items-center gap-1">
                <i className="ri-calendar-line" />
                {formatDate(booking.date)} {booking.time && `· ${booking.time}`}
              </span>
            )}
            <span className="flex items-center gap-1">
              <i className="ri-user-line" />
              {booking.guests} guests
            </span>
            <span className="flex items-center gap-1">
              <i className="ri-building-line" />
              {booking.type === 'stay' ? 'Accommodation' : booking.type === 'experience' ? 'Experience' : 'Bundle'}
            </span>
          </div>

          {/* Host Info */}
          <div className="flex items-center gap-2 py-3 border-t border-b border-stone-100 my-3">
            <img 
              src={booking.hostAvatar} 
              alt={booking.hostName}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm text-stone-600">Listed by {booking.hostName}</span>
            {booking.hostPhone && (
              <a 
                href={`tel:${booking.hostPhone}`}
                className="ml-auto text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <i className="ri-phone-line" />
                Call
              </a>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {booking.status === 'upcoming' && (
              <>
                <button
                  type="button"
                  onClick={() => setDetailsOpen((v) => !v)}
                  aria-expanded={detailsOpen}
                  className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  {detailsOpen ? 'Hide Details' : 'View Details'}
                </button>
                {booking.canCancel && (
                  <button 
                    onClick={onCancel}
                    className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </>
            )}
            {booking.status === 'completed' && !booking.reviewSubmitted && !reviewed && (
              <button onClick={onReview} className="px-4 py-2 bg-amber-400 text-stone-900 rounded-lg text-sm font-medium hover:bg-amber-300 transition-colors cursor-pointer">
                Write Review
              </button>
            )}
            {booking.status === 'completed' && (booking.reviewSubmitted || reviewed) && (
              <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium flex items-center gap-1.5">
                <i className="ri-check-line" /> Review Submitted
              </span>
            )}
            {booking.status === 'cancelled' && (
              <span className="px-4 py-2 bg-stone-100 text-stone-500 rounded-lg text-sm">
                Cancelled
              </span>
            )}
          </div>

          {detailsOpen && (
            <div className="mt-4 pt-4 border-t border-stone-100 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-stone-400 text-xs">Booking ID</p>
                  <p className="text-stone-800 font-medium">{booking.bookingId}</p>
                </div>
                <div>
                  <p className="text-stone-400 text-xs">Paid</p>
                  <p className="text-stone-800 font-medium">₹{booking.paidAmount.toLocaleString('en-IN')}</p>
                </div>
                {booking.cancellationDeadline && (
                  <div className="col-span-2">
                    <p className="text-stone-400 text-xs">Free cancellation until</p>
                    <p className="text-stone-800 font-medium">{formatDate(booking.cancellationDeadline)}</p>
                  </div>
                )}
              </div>
              {booking.amenities && booking.amenities.length > 0 && (
                <div>
                  <p className="text-stone-400 text-xs mb-1.5">Amenities</p>
                  <div className="flex flex-wrap gap-1.5">
                    {booking.amenities.map((a) => (
                      <span key={a} className="px-2 py-1 bg-stone-100 text-stone-700 text-xs rounded-full">{a}</span>
                    ))}
                  </div>
                </div>
              )}
              {booking.addOns && booking.addOns.length > 0 && (
                <div>
                  <p className="text-stone-400 text-xs mb-1.5">Add-ons</p>
                  <ul className="list-disc pl-5 text-stone-700">
                    {booking.addOns.map((a) => (<li key={a}>{a}</li>))}
                  </ul>
                </div>
              )}
              {booking.itinerary && booking.itinerary.length > 0 && (
                <div>
                  <p className="text-stone-400 text-xs mb-1.5">Itinerary</p>
                  <ol className="list-decimal pl-5 text-stone-700 space-y-1">
                    {booking.itinerary.map((step, i) => (<li key={i}>{step}</li>))}
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Day Outing Enquiry Card Component
function DayOutingEnquiryCard({ enquiry }: { enquiry: DayOutingEnquiry }) {
  const navigate = useNavigate();

  const statusConfig: Record<DayOutingEnquiry['status'], { color: string; icon: string; label: string }> = {
    pending: { color: 'bg-amber-100 text-amber-700', icon: 'ri-time-line', label: 'Pending Review' },
    confirmed: { color: 'bg-emerald-100 text-emerald-700', icon: 'ri-checkbox-circle-line', label: 'Confirmed' },
    completed: { color: 'bg-stone-100 text-stone-600', icon: 'ri-check-double-line', label: 'Completed' },
    cancelled: { color: 'bg-red-100 text-red-600', icon: 'ri-close-circle-line', label: 'Cancelled' },
  };

  const cfg = statusConfig[enquiry.status];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div
          className="w-full md:w-44 h-44 md:h-auto shrink-0 relative cursor-pointer"
          onClick={() => navigate(`/property/${enquiry.propertyId}?tab=daypackage`)}
        >
          <img src={enquiry.image} alt={enquiry.propertyName} className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span className="absolute bottom-2 left-2 flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            <i className="ri-sun-line text-xs" /> Day Outing
          </span>
        </div>
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full mb-2 ${cfg.color}`}>
                <i className={cfg.icon} />{cfg.label}
              </span>
              <h3
                className="font-bold text-stone-900 cursor-pointer hover:text-amber-700 transition-colors"
                onClick={() => navigate(`/property/${enquiry.propertyId}?tab=daypackage`)}
              >
                {enquiry.propertyName}
              </h3>
              <p className="text-stone-500 text-sm flex items-center gap-1 mt-0.5">
                <i className="ri-map-pin-line text-xs" />{enquiry.location}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-stone-400">Enquiry</p>
              <p className="text-xs font-mono text-stone-600 font-bold">{enquiry.enquiryId}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div className="bg-stone-50 rounded-xl p-2.5 text-center">
              <i className="ri-calendar-line text-stone-400 text-xs block mb-0.5" />
              <p className="text-xs text-stone-500">Date</p>
              <p className="text-xs font-semibold text-stone-900">
                {new Date(enquiry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="bg-stone-50 rounded-xl p-2.5 text-center">
              <i className="ri-time-line text-stone-400 text-xs block mb-0.5" />
              <p className="text-xs text-stone-500">Time Slot</p>
              <p className="text-xs font-semibold text-stone-900 truncate">{enquiry.timeSlot}</p>
            </div>
            <div className="bg-stone-50 rounded-xl p-2.5 text-center">
              <i className="ri-group-line text-stone-400 text-xs block mb-0.5" />
              <p className="text-xs text-stone-500">Guests</p>
              <p className="text-xs font-semibold text-stone-900">{enquiry.guests} people</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-2.5 text-center">
              <i className="ri-price-tag-3-line text-amber-500 text-xs block mb-0.5" />
              <p className="text-xs text-amber-600">Est. Total</p>
              <p className="text-xs font-bold text-amber-700">&#x20B9;{enquiry.totalEstimate.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {enquiry.occasion && (
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-100 flex items-center gap-1.5">
                <i className="ri-heart-3-line text-xs" />{enquiry.occasion}
              </span>
            </div>
          )}

          {enquiry.notes && (
            <p className="text-xs text-stone-500 italic mb-3 bg-stone-50 rounded-lg px-3 py-2">
              &ldquo;{enquiry.notes}&rdquo;
            </p>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-stone-100">
            <div className="flex items-center gap-2">
              {enquiry.hostName && (
                <span className="text-xs text-stone-500 flex items-center gap-1">
                  <i className="ri-user-star-line text-stone-400" />Owner: {enquiry.hostName}
                </span>
              )}
              {enquiry.hostPhone && (
                <a
                  href={`tel:${enquiry.hostPhone}`}
                  className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                >
                  <i className="ri-phone-line" /> Call
                </a>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/property/${enquiry.propertyId}?tab=daypackage`)}
                className="px-3 py-1.5 border border-stone-200 text-stone-600 text-xs font-medium rounded-full hover:bg-stone-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                View Property
              </button>
              {enquiry.status === 'pending' && (
                <span className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full flex items-center gap-1">
                  <i className="ri-loader-3-line animate-spin" /> Awaiting Response
                </span>
              )}
              {enquiry.status === 'confirmed' && (
                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full flex items-center gap-1">
                  <i className="ri-checkbox-circle-fill" /> All Set!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Saved Trip Card Component
function SavedTripCard({ 
  trip, 
  compact = false 
}: { 
  trip: SavedTrip; 
  compact?: boolean;
}) {
  const navigate = useNavigate();

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'property': return 'Stay';
      case 'experience': return 'Experience';
      case 'bundle': return 'Bundle';
      default: return type;
    }
  };

  if (compact) {
    return (
      <div className="flex gap-4 p-4 bg-stone-50 rounded-xl group cursor-pointer" onClick={() => navigate('/search')}>
        <img 
          src={trip.image} 
          alt={trip.title}
          className="w-20 h-20 rounded-lg object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-xs text-amber-600 font-medium">{getTypeLabel(trip.type)}</span>
              <h3 className="font-semibold text-stone-900 truncate">{trip.title}</h3>
              <p className="text-stone-500 text-sm">{trip.location}</p>
            </div>
            <button className="text-stone-400 hover:text-red-500 transition-colors">
              <i className="ri-heart-3-fill" />
            </button>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="font-bold text-stone-900">₹{trip.price.toLocaleString('en-IN')}</span>
            <span className="flex items-center gap-1 text-sm text-stone-500">
              <i className="ri-star-fill text-amber-400" />
              {trip.rating}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={trip.image} 
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
          <i className="ri-heart-3-fill" />
        </button>
        <span className="absolute top-3 left-3 px-2 py-1 bg-stone-900/80 text-white text-xs rounded-full">
          {getTypeLabel(trip.type)}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-stone-900 mb-1">{trip.title}</h3>
        <p className="text-stone-500 text-sm mb-3">{trip.location}</p>
        
        {trip.dates && (
          <p className="text-sm text-stone-600 mb-2 flex items-center gap-1">
            <i className="ri-calendar-line" />
            {trip.dates}
          </p>
        )}
        
        {trip.notes && (
          <p className="text-sm text-stone-500 mb-3 italic">"{trip.notes}"</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900">₹{trip.price.toLocaleString('en-IN')}</span>
            <span className="flex items-center gap-1 text-sm text-stone-500">
              <i className="ri-star-fill text-amber-400" />
              {trip.rating}
            </span>
          </div>
          <button 
            onClick={() => navigate('/search')}
            className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Check Availability
          </button>
        </div>
      </div>
    </div>
  );
}