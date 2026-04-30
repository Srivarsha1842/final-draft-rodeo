import { useState, useMemo } from 'react';
import { HostBooking, HostProperty, BlockedDate } from '@/pages/admin/types';
import { blockDateRange, unblockDateRange, getBlockedDates } from '@/pages/admin/hostStore';

interface Props {
  hostId: string;
  properties: HostProperty[];
  bookings: HostBooking[];
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

function eachDay(start: string, end: string): string[] {
  const result: string[] = [];
  const s = new Date(start);
  const e = new Date(end);
  const cur = new Date(s);
  while (cur <= e) {
    result.push(toDateStr(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return result;
}

type DayStatus = 'available' | 'booked-confirmed' | 'booked-pending' | 'blocked' | 'past';

interface BookingPopup {
  booking: HostBooking;
  x: number;
  y: number;
}

export default function HostCalendarView({ hostId, properties, bookings }: Props) {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?.id ?? 'all');
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>(() => getBlockedDates(hostId));
  const [popup, setPopup] = useState<BookingPopup | null>(null);
  const [blockMode, setBlockMode] = useState(false);
  const [blockStart, setBlockStart] = useState<string | null>(null);
  const [blockEnd, setBlockEnd] = useState<string | null>(null);
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [blockReason, setBlockReason] = useState('');
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [blockAction, setBlockAction] = useState<'block' | 'unblock'>('block');
  const [selectedLegendFilter, setSelectedLegendFilter] = useState<string | null>(null);

  const refreshBlocked = () => setBlockedDates(getBlockedDates(hostId));

  // Build set of dates per status for the selected property
  const bookedConfirmedDays = useMemo(() => {
    const set = new Set<string>();
    bookings
      .filter((b) => b.status === 'confirmed' && (selectedPropertyId === 'all' || b.propertyId === selectedPropertyId))
      .forEach((b) => eachDay(b.checkIn, b.checkOut).forEach((d) => set.add(d)));
    return set;
  }, [bookings, selectedPropertyId]);

  const bookedPendingDays = useMemo(() => {
    const set = new Set<string>();
    bookings
      .filter((b) => b.status === 'pending' && (selectedPropertyId === 'all' || b.propertyId === selectedPropertyId))
      .forEach((b) => eachDay(b.checkIn, b.checkOut).forEach((d) => set.add(d)));
    return set;
  }, [bookings, selectedPropertyId]);

  const blockedSet = useMemo(() => {
    const set = new Set<string>();
    blockedDates
      .filter((d) => selectedPropertyId === 'all' || d.propertyId === selectedPropertyId)
      .forEach((d) => set.add(d.date));
    return set;
  }, [blockedDates, selectedPropertyId]);

  const getDayStatus = (dateStr: string): DayStatus => {
    const d = new Date(dateStr);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (d < today) return 'past';
    if (bookedConfirmedDays.has(dateStr)) return 'booked-confirmed';
    if (bookedPendingDays.has(dateStr)) return 'booked-pending';
    if (blockedSet.has(dateStr)) return 'blocked';
    return 'available';
  };

  const getBookingForDate = (dateStr: string): HostBooking | undefined =>
    bookings.find((b) =>
      (selectedPropertyId === 'all' || b.propertyId === selectedPropertyId) &&
      (b.status === 'confirmed' || b.status === 'pending') &&
      eachDay(b.checkIn, b.checkOut).includes(dateStr)
    );

  // Calendar grid for current month
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startPad = firstDay.getDay();
    const days: (string | null)[] = [];
    for (let i = 0; i < startPad; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(toDateStr(new Date(currentYear, currentMonth, d)));
    }
    return days;
  }, [currentYear, currentMonth]);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  const goToToday = () => { setCurrentMonth(now.getMonth()); setCurrentYear(now.getFullYear()); };

  const handleDayClick = (dateStr: string, e: React.MouseEvent) => {
    const status = getDayStatus(dateStr);
    if (status === 'past') return;

    if (blockMode) {
      if (!blockStart) {
        setBlockStart(dateStr);
      } else if (!blockEnd) {
        const start = blockStart <= dateStr ? blockStart : dateStr;
        const end = blockStart <= dateStr ? dateStr : blockStart;
        setBlockEnd(end);
        setBlockStart(start);
        // Check what's in range — block or unblock
        const rangeDays = eachDay(start, end);
        const hasBlocked = rangeDays.some((d) => blockedSet.has(d));
        const hasBooking = rangeDays.some((d) => bookedConfirmedDays.has(d) || bookedPendingDays.has(d));
        if (hasBooking) {
          alert('Cannot block dates that already have bookings.');
          setBlockStart(null); setBlockEnd(null);
          return;
        }
        setBlockAction(hasBlocked ? 'unblock' : 'block');
        setShowBlockConfirm(true);
      } else {
        setBlockStart(dateStr);
        setBlockEnd(null);
        setShowBlockConfirm(false);
      }
      return;
    }

    // Show booking popup
    if (status === 'booked-confirmed' || status === 'booked-pending') {
      const booking = getBookingForDate(dateStr);
      if (booking) {
        setPopup({ booking, x: e.clientX, y: e.clientY });
      }
    } else {
      setPopup(null);
    }
  };

  const handleConfirmBlock = () => {
    if (!blockStart || !blockEnd) return;
    const propId = selectedPropertyId === 'all' ? properties[0]?.id : selectedPropertyId;
    if (!propId) return;
    if (blockAction === 'block') {
      blockDateRange(hostId, propId, blockStart, blockEnd, blockReason || undefined);
    } else {
      unblockDateRange(hostId, propId, blockStart, blockEnd);
    }
    refreshBlocked();
    setBlockStart(null); setBlockEnd(null); setShowBlockConfirm(false); setBlockReason('');
  };

  const handleCancelBlock = () => {
    setBlockStart(null); setBlockEnd(null); setShowBlockConfirm(false); setBlockReason('');
  };

  const isInSelectionRange = (dateStr: string): boolean => {
    if (!blockStart) return false;
    const end = blockEnd ?? hoverDate;
    if (!end) return dateStr === blockStart;
    const lo = blockStart <= end ? blockStart : end;
    const hi = blockStart <= end ? end : blockStart;
    return dateStr >= lo && dateStr <= hi;
  };

  const getDayStyle = (dateStr: string): string => {
    const status = getDayStatus(dateStr);
    const inRange = isInSelectionRange(dateStr);
    const isToday = dateStr === toDateStr(now);

    let base = 'relative flex flex-col items-center justify-start pt-1.5 rounded-xl transition-all text-xs font-medium ';

    if (inRange && blockMode) {
      return base + 'bg-stone-800 text-white cursor-pointer';
    }

    switch (status) {
      case 'past':
        return base + 'text-stone-300 cursor-default';
      case 'booked-confirmed':
        return base + 'bg-emerald-100 text-emerald-800 cursor-pointer hover:bg-emerald-200';
      case 'booked-pending':
        return base + 'bg-amber-100 text-amber-800 cursor-pointer hover:bg-amber-200';
      case 'blocked':
        return base + (blockMode
          ? 'bg-red-100 text-red-600 cursor-pointer hover:bg-red-200'
          : 'bg-red-50 text-red-400 cursor-default');
      case 'available':
        if (isToday) return base + 'ring-2 ring-stone-900 text-stone-900 cursor-pointer ' + (blockMode ? 'hover:bg-stone-100' : '');
        return base + 'text-stone-800 cursor-pointer hover:bg-stone-100';
      default:
        return base + 'text-stone-300';
    }
  };

  // Month stats
  const monthStats = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    let bookedCount = 0, blockedCount = 0, availableCount = 0;
    const today = toDateStr(new Date());
    for (let d = 1; d <= daysInMonth; d++) {
      const ds = toDateStr(new Date(currentYear, currentMonth, d));
      if (ds < today) continue;
      const st = getDayStatus(ds);
      if (st === 'booked-confirmed' || st === 'booked-pending') bookedCount++;
      else if (st === 'blocked') blockedCount++;
      else availableCount++;
    }
    const totalFuture = bookedCount + blockedCount + availableCount;
    const occupancy = totalFuture > 0 ? Math.round((bookedCount / totalFuture) * 100) : 0;
    return { bookedCount, blockedCount, availableCount, occupancy };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentYear, currentMonth, bookedConfirmedDays, bookedPendingDays, blockedSet]);

  // Upcoming bookings list for this month
  const thisMonthBookings = useMemo(() =>
    bookings
      .filter((b) => {
        if (selectedPropertyId !== 'all' && b.propertyId !== selectedPropertyId) return false;
        const bDate = new Date(b.checkIn);
        return bDate.getMonth() === currentMonth && bDate.getFullYear() === currentYear &&
          (b.status === 'confirmed' || b.status === 'pending');
      })
      .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime()),
    [bookings, selectedPropertyId, currentMonth, currentYear]
  );

  const selectedPropName = selectedPropertyId === 'all'
    ? 'All Properties'
    : properties.find((p) => p.id === selectedPropertyId)?.name ?? '';

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Calendar & Availability</h2>
          <p className="text-stone-500 text-sm mt-1">Manage your property availability and view bookings</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Property selector */}
          <select
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            className="px-3 py-2 border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:border-stone-400 bg-white cursor-pointer"
          >
            {properties.length > 1 && <option value="all">All Properties</option>}
            {properties.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Block mode toggle */}
          <button
            onClick={() => { setBlockMode(!blockMode); setBlockStart(null); setBlockEnd(null); setShowBlockConfirm(false); setPopup(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              blockMode
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-stone-900 text-white hover:bg-stone-800'
            }`}
          >
            <i className={blockMode ? 'ri-close-line' : 'ri-calendar-close-line'} />
            {blockMode ? 'Cancel Block Mode' : 'Block Dates'}
          </button>
        </div>
      </div>

      {/* Block mode instruction banner */}
      {blockMode && (
        <div className="bg-stone-900 text-white rounded-xl p-3 mb-4 flex items-center gap-3">
          <i className="ri-information-line text-amber-400 text-lg shrink-0" />
          <div className="text-sm">
            <strong>Block Mode Active</strong> — Click a start date, then an end date to select a range.
            {blockStart && !blockEnd && <span className="ml-2 text-amber-300">Start: {blockStart}. Now click the end date.</span>}
            {blockStart && blockEnd && !showBlockConfirm && <span className="ml-2 text-amber-300">Range: {blockStart} → {blockEnd}</span>}
          </div>
        </div>
      )}

      {/* Block confirm panel */}
      {showBlockConfirm && blockStart && blockEnd && (
        <div className={`rounded-xl p-4 mb-4 border ${blockAction === 'block' ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
          <div className="flex items-start gap-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm ${blockAction === 'block' ? 'text-red-800' : 'text-emerald-800'}`}>
                {blockAction === 'block' ? 'Block dates?' : 'Unblock dates?'}
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                {blockStart} → {blockEnd} · {eachDay(blockStart, blockEnd).length} day{eachDay(blockStart, blockEnd).length !== 1 ? 's' : ''} · {selectedPropName}
              </p>
              {blockAction === 'block' && (
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Reason (optional) e.g. Personal use, Maintenance"
                  className="mt-2 w-full max-w-sm px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400"
                />
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={handleCancelBlock} className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100 cursor-pointer whitespace-nowrap">
                Cancel
              </button>
              <button
                onClick={handleConfirmBlock}
                className={`px-4 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer whitespace-nowrap ${
                  blockAction === 'block' ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
              >
                {blockAction === 'block' ? 'Confirm Block' : 'Confirm Unblock'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 p-5">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="w-9 h-9 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer">
              <i className="ri-arrow-left-s-line text-xl" />
            </button>
            <div className="text-center">
              <h3 className="font-bold text-stone-900 text-lg">{MONTHS[currentMonth]} {currentYear}</h3>
              <button onClick={goToToday} className="text-xs text-stone-400 hover:text-stone-600 cursor-pointer underline mt-0.5">
                Today
              </button>
            </div>
            <button onClick={nextMonth} className="w-9 h-9 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer">
              <i className="ri-arrow-right-s-line text-xl" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-stone-400 py-1">{d}</div>
            ))}
          </div>

          {/* Day grid */}
          <div
            className="grid grid-cols-7 gap-1"
            onMouseLeave={() => setHoverDate(null)}
          >
            {calendarDays.map((dateStr, i) => {
              if (!dateStr) return <div key={`pad-${i}`} />;
              const dayNum = new Date(dateStr).getDate();
              const status = getDayStatus(dateStr);
              const isToday = dateStr === toDateStr(now);
              const booking = (status === 'booked-confirmed' || status === 'booked-pending') ? getBookingForDate(dateStr) : undefined;
              const blockedEntry = status === 'blocked'
                ? blockedDates.find((b) => b.date === dateStr && (selectedPropertyId === 'all' || b.propertyId === selectedPropertyId))
                : undefined;

              return (
                <div
                  key={dateStr}
                  className={getDayStyle(dateStr) + ' min-h-[52px] p-1'}
                  onClick={(e) => handleDayClick(dateStr, e)}
                  onMouseEnter={() => blockMode && blockStart && !blockEnd && setHoverDate(dateStr)}
                >
                  <span className={`text-xs font-bold ${isToday ? 'w-5 h-5 flex items-center justify-center bg-stone-900 text-white rounded-full' : ''}`}>
                    {dayNum}
                  </span>
                  {status === 'booked-confirmed' && booking && (
                    <div className="w-full mt-1 px-1 py-0.5 bg-emerald-200 rounded text-emerald-800 text-xs truncate leading-tight" title={booking.guestName}>
                      {booking.guestName.split(' ')[0]}
                    </div>
                  )}
                  {status === 'booked-pending' && booking && (
                    <div className="w-full mt-1 px-1 py-0.5 bg-amber-200 rounded text-amber-800 text-xs truncate leading-tight" title={booking.guestName}>
                      {booking.guestName.split(' ')[0]}
                    </div>
                  )}
                  {status === 'blocked' && (
                    <div className="w-full mt-1 flex justify-center" title={blockedEntry?.reason ?? 'Blocked'}>
                      <i className="ri-close-line text-red-400 text-xs" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-stone-100 flex-wrap">
            {[
              { color: 'bg-emerald-100 border border-emerald-300', label: 'Confirmed' },
              { color: 'bg-amber-100 border border-amber-300', label: 'Pending' },
              { color: 'bg-red-50 border border-red-200', label: 'Blocked' },
              { color: 'bg-white border border-stone-200', label: 'Available' },
            ].map((leg) => (
              <div key={leg.label} className="flex items-center gap-1.5">
                <div className={`w-4 h-4 rounded ${leg.color}`} />
                <span className="text-xs text-stone-500">{leg.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">
          {/* Month stats */}
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <h4 className="font-bold text-stone-900 text-sm mb-3">
              {MONTHS[currentMonth]} Overview
            </h4>
            <div className="space-y-3">
              {[
                { label: 'Booked', value: monthStats.bookedCount, color: 'bg-emerald-500', textColor: 'text-emerald-700' },
                { label: 'Blocked', value: monthStats.blockedCount, color: 'bg-red-400', textColor: 'text-red-600' },
                { label: 'Available', value: monthStats.availableCount, color: 'bg-stone-300', textColor: 'text-stone-500' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={`font-medium ${s.textColor}`}>{s.label}</span>
                    <span className="text-stone-500">{s.value} days</span>
                  </div>
                  <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${s.color}`}
                      style={{ width: `${Math.min(100, (s.value / (monthStats.bookedCount + monthStats.blockedCount + monthStats.availableCount || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500">Occupancy Rate</span>
                <span className="text-lg font-bold text-stone-900">{monthStats.occupancy}%</span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full rounded-full bg-stone-900 transition-all duration-500"
                  style={{ width: `${monthStats.occupancy}%` }}
                />
              </div>
            </div>
          </div>

          {/* This month's bookings */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 flex-1">
            <h4 className="font-bold text-stone-900 text-sm mb-3">
              Bookings This Month
              <span className="ml-2 text-stone-400 font-normal text-xs">({thisMonthBookings.length})</span>
            </h4>
            {thisMonthBookings.length === 0 && (
              <div className="text-center py-8 text-stone-400">
                <i className="ri-calendar-line text-2xl mb-2 block" />
                <p className="text-xs">No bookings this month</p>
              </div>
            )}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {thisMonthBookings.map((b) => (
                <div key={b.id} className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${b.status === 'confirmed' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-stone-800 truncate">{b.guestName}</p>
                    <p className="text-xs text-stone-500 truncate">{b.propertyName}</p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      <i className="ri-calendar-line mr-1" />
                      {b.checkIn} – {b.checkOut}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {b.status}
                    </span>
                    <p className="text-xs font-bold text-amber-600 mt-1">₹{b.hostEarnings.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick block tip */}
          {!blockMode && (
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-stone-200 rounded-lg shrink-0">
                  <i className="ri-calendar-close-line text-stone-600 text-sm" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-800">Block unavailable dates</p>
                  <p className="text-xs text-stone-500 mt-1">Use &quot;Block Dates&quot; to mark dates you&apos;re unavailable — personal travel, maintenance, or any other reason.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking popup */}
      {popup && (
        <div
          className="fixed z-50 bg-white rounded-xl border border-stone-200 p-4 w-72 shadow-xl"
          style={{
            top: Math.min(popup.y + 12, window.innerHeight - 200),
            left: Math.min(popup.x + 12, window.innerWidth - 300),
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              popup.booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {popup.booking.status}
            </span>
            <button onClick={() => setPopup(null)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
              <i className="ri-close-line" />
            </button>
          </div>
          <h4 className="font-bold text-stone-900 mb-1">{popup.booking.guestName}</h4>
          <p className="text-xs text-stone-500 mb-3">{popup.booking.propertyName}</p>
          <div className="space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span className="text-stone-400">Check-in</span>
              <span className="font-medium">{popup.booking.checkIn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Check-out</span>
              <span className="font-medium">{popup.booking.checkOut}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Nights</span>
              <span className="font-medium">{popup.booking.nights}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Guests</span>
              <span className="font-medium">{popup.booking.guestCount}</span>
            </div>
            <div className="flex justify-between border-t border-stone-100 pt-2">
              <span className="text-stone-400">Your Earnings</span>
              <span className="font-bold text-amber-600">₹{popup.booking.hostEarnings.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-stone-100">
            <p className="text-xs text-stone-400">
              <i className="ri-mail-line mr-1" />{popup.booking.guestEmail}
            </p>
            <p className="text-xs text-stone-400 mt-0.5">
              <i className="ri-phone-line mr-1" />{popup.booking.guestPhone}
            </p>
          </div>
        </div>
      )}

      {/* Click outside to close popup */}
      {popup && (
        <div className="fixed inset-0 z-40" onClick={() => setPopup(null)} />
      )}
    </div>
  );
}
