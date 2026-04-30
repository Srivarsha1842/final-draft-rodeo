import { useState } from 'react';

interface Props {
  checkIn: string;
  checkOut: string;
  onCheckInChange: (d: string) => void;
  onCheckOutChange: (d: string) => void;
}

const BLOCKED_OFFSETS = [3, 4, 9, 17, 18, 25, 26];

export default function PropertyAvailabilityCalendar({ checkIn, checkOut, onCheckInChange, onCheckOutChange }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selecting, setSelecting] = useState<'in' | 'out' | null>(null);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const isBlocked = (day: number) => BLOCKED_OFFSETS.includes(day);
  const isPast = (day: number) => new Date(viewYear, viewMonth, day) < today;

  const isoDate = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${viewYear}-${m}-${d}`;
  };

  const isCheckIn = (day: number) => isoDate(day) === checkIn;
  const isCheckOut = (day: number) => isoDate(day) === checkOut;
  const isInRange = (day: number) => {
    if (!checkIn || !checkOut) return false;
    const d = new Date(isoDate(day));
    return d > new Date(checkIn) && d < new Date(checkOut);
  };

  const handleDayClick = (day: number) => {
    if (isPast(day) || isBlocked(day)) return;
    const iso = isoDate(day);
    if (!checkIn || selecting === 'in') {
      onCheckInChange(iso);
      onCheckOutChange('');
      setSelecting('out');
    } else {
      if (iso <= checkIn) {
        onCheckInChange(iso);
        onCheckOutChange('');
        setSelecting('out');
      } else {
        onCheckOutChange(iso);
        setSelecting(null);
      }
    }
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const monthName = new Date(viewYear, viewMonth).toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div className="border-t border-stone-100 pt-8">
      <h2 className="text-xl font-bold text-stone-900 mb-2">Availability</h2>
      <p className="text-stone-500 text-sm mb-5">
        {checkIn && checkOut
          ? `Selected: ${new Date(checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} → ${new Date(checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
          : checkIn
          ? 'Now select check-out date'
          : 'Select check-in date'}
      </p>

      {/* Calendar */}
      <div className="bg-stone-50 rounded-2xl p-5 max-w-md">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center hover:bg-stone-200 rounded-full transition-colors cursor-pointer">
            <i className="ri-arrow-left-s-line text-stone-600" />
          </button>
          <span className="font-semibold text-stone-900 text-sm">{monthName}</span>
          <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center hover:bg-stone-200 rounded-full transition-colors cursor-pointer">
            <i className="ri-arrow-right-s-line text-stone-600" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-stone-400 py-1">{d}</div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const blocked = isBlocked(day);
            const past = isPast(day);
            const checkin = isCheckIn(day);
            const checkout = isCheckOut(day);
            const inRange = isInRange(day);
            const disabled = blocked || past;

            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                disabled={disabled}
                className={`
                  relative h-9 w-full text-xs font-medium transition-all rounded-lg
                  ${disabled ? 'text-stone-300 cursor-not-allowed line-through' : 'cursor-pointer hover:bg-stone-200'}
                  ${checkin || checkout ? 'bg-stone-900 text-white hover:bg-stone-800 rounded-lg' : ''}
                  ${inRange ? 'bg-stone-200 text-stone-800 rounded-none' : ''}
                  ${checkin ? 'rounded-r-none' : ''}
                  ${checkout ? 'rounded-l-none' : ''}
                `}
              >
                {day}
                {blocked && !past && (
                  <span className="absolute inset-0 flex items-center justify-center text-stone-200 text-lg">×</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-stone-200">
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <div className="w-3 h-3 bg-stone-900 rounded-full" /> Selected
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <div className="w-3 h-3 bg-stone-200 rounded-full" /> In Range
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <div className="w-3 h-3 bg-stone-100 rounded-full border border-stone-200" /> <span className="line-through">Unavailable</span>
          </div>
        </div>
      </div>

      {checkIn && checkOut && (
        <button
          onClick={() => { onCheckInChange(''); onCheckOutChange(''); setSelecting(null); }}
          className="mt-3 text-sm text-stone-500 hover:text-stone-900 transition-colors cursor-pointer underline"
        >
          Clear dates
        </button>
      )}
    </div>
  );
}
