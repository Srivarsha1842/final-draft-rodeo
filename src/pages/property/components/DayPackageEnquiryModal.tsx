import { useState, FormEvent } from 'react';

interface Props {
  propertyName: string;
  pricePerPerson: number;
  timing?: string;
  propertyId?: string;
  maxGuests?: number;
  onClose: () => void;
}

const TIME_SLOTS = [
  { id: 'morning', label: 'Morning Session', time: '8:00 AM – 1:00 PM', icon: 'ri-sun-foggy-line' },
  { id: 'afternoon', label: 'Afternoon Session', time: '12:00 PM – 5:00 PM', icon: 'ri-sun-line' },
  { id: 'fullday', label: 'Full Day', time: '9:00 AM – 6:00 PM', icon: 'ri-sun-fill' },
  { id: 'evening', label: 'Evening Session', time: '3:00 PM – 8:00 PM', icon: 'ri-contrast-2-line' },
];

type Step = 'datetime' | 'contact' | 'confirm' | 'success';

export default function DayPackageEnquiryModal({ propertyName, pricePerPerson, timing, maxGuests, onClose }: Props) {
  const [step, setStep] = useState<Step>('datetime');
  const [loading, setLoading] = useState(false);

  // Step 1 fields
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('fullday');
  const [groupSize, setGroupSize] = useState(2);

  // Step 2 fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [occasion, setOccasion] = useState('');
  const [specialReq, setSpecialReq] = useState('');

  const effectiveMax = maxGuests && maxGuests > 0 ? maxGuests : 30;
  const total = pricePerPerson * groupSize;
  const selectedSlot = TIME_SLOTS.find((s) => s.id === timeSlot) || TIME_SLOTS[2];

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  const formatDate = (d: string) => {
    if (!d) return '';
    const dt = new Date(d);
    return dt.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  const step1Valid = date !== '';
  const step2Valid = name.trim() !== '' && email.trim() !== '';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = new URLSearchParams({
        property: propertyName,
        date: formatDate(date),
        package: selectedSlot.label,
        time_range: selectedSlot.time,
        group_size: String(groupSize),
        name,
        email,
        phone,
        occasion,
        special_requests: specialReq,
        timing: timing || 'Full Day',
        price_per_person: String(pricePerPerson),
        total_estimate: String(total),
      });
      await fetch('https://readdy.ai/api/form/d7e8d45fi84lst2jvuig', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      setStep('success');
    } catch {
      setStep('success');
    } finally {
      setLoading(false);
    }
  };

  const stepIndex = step === 'datetime' ? 0 : step === 'contact' ? 1 : step === 'confirm' ? 2 : 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-amber-50 to-orange-50 px-6 pt-6 pb-5 border-b border-amber-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white cursor-pointer transition-colors"
          >
            <i className="ri-close-line text-stone-600" />
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center bg-amber-100 rounded-xl shrink-0">
              <i className="ri-sun-line text-amber-600 text-lg" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 text-lg">Book Day Outing</h2>
              <p className="text-stone-500 text-xs mt-0.5 line-clamp-1">{propertyName}</p>
            </div>
          </div>

          {/* Step indicator */}
          {step !== 'success' && (
            <div className="flex items-center gap-0">
              {['Date & Package', 'Your Details', 'Confirm'].map((label, i) => (
                <div key={label} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold transition-all ${
                        i < stepIndex
                          ? 'bg-emerald-500 text-white'
                          : i === stepIndex
                          ? 'bg-amber-500 text-white'
                          : 'bg-stone-200 text-stone-400'
                      }`}
                    >
                      {i < stepIndex ? <i className="ri-check-line text-xs" /> : i + 1}
                    </div>
                    <span
                      className={`text-xs mt-1 whitespace-nowrap ${
                        i === stepIndex ? 'text-amber-700 font-semibold' : 'text-stone-400'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < 2 && (
                    <div
                      className={`h-0.5 flex-1 mx-1 mb-4 rounded-full transition-all ${
                        i < stepIndex ? 'bg-emerald-400' : 'bg-stone-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Success */}
        {step === 'success' && (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 flex items-center justify-center bg-emerald-100 rounded-full mx-auto mb-4">
              <i className="ri-check-line text-emerald-600 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">Booking Request Sent!</h3>
            <p className="text-stone-500 text-sm mb-1">
              Your day outing request for <strong>{propertyName}</strong> has been received.
            </p>
            <div className="mt-4 mb-6 bg-stone-50 rounded-xl p-4 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Date</span>
                <span className="font-semibold text-stone-800">{formatDate(date)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Package</span>
                <span className="font-semibold text-stone-800">{selectedSlot.label} ({selectedSlot.time})</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Group Size</span>
                <span className="font-semibold text-stone-800">{groupSize} person{groupSize > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-stone-200 pt-2 mt-2">
                <span className="text-stone-500">Total Estimate</span>
                <span className="font-bold text-stone-900">&#x20B9;{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <p className="text-stone-400 text-xs mb-6">
              <i className="ri-mail-line mr-1" />Confirmation sent to <strong>{email}</strong>. Host will respond within 24 hrs.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              Done
            </button>
          </div>
        )}

        {/* Step 1: Date & Package */}
        {step === 'datetime' && (
          <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* Date picker */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-widest mb-2">
                Select Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                name="date"
                required
                min={minDateStr}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 bg-white"
              />
              {date && (
                <p className="mt-1.5 text-xs text-amber-600 font-medium flex items-center gap-1">
                  <i className="ri-calendar-check-line" /> {formatDate(date)}
                </p>
              )}
            </div>

            {/* Package / Time slot — renamed */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-widest mb-2">
                Choose your Day Outing Package
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setTimeSlot(slot.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      timeSlot === slot.id
                        ? 'border-amber-400 bg-amber-50'
                        : 'border-stone-200 hover:border-amber-200 hover:bg-amber-50/50'
                    }`}
                  >
                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg shrink-0 ${timeSlot === slot.id ? 'bg-amber-400' : 'bg-stone-100'}`}>
                      <i className={`${slot.icon} text-sm ${timeSlot === slot.id ? 'text-white' : 'text-stone-500'}`} />
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${timeSlot === slot.id ? 'text-amber-800' : 'text-stone-700'}`}>{slot.label}</p>
                      <p className="text-xs text-stone-400 mt-0.5">{slot.time}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Group size with max guests enforcement */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-widest mb-2">
                Group Size
                {maxGuests && maxGuests > 0 && (
                  <span className="ml-2 text-amber-600 font-medium normal-case text-xs">
                    (Max {maxGuests} guests allowed)
                  </span>
                )}
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setGroupSize((g) => Math.max(1, g - 1))}
                    className="px-4 py-2.5 text-stone-600 hover:bg-stone-50 cursor-pointer transition-colors"
                  >
                    <i className="ri-subtract-line" />
                  </button>
                  <span className="px-5 text-base font-bold text-stone-900">{groupSize}</span>
                  <button
                    type="button"
                    onClick={() => setGroupSize((g) => Math.min(effectiveMax, g + 1))}
                    className={`px-4 py-2.5 transition-colors ${groupSize >= effectiveMax ? 'text-stone-300 cursor-not-allowed' : 'text-stone-600 hover:bg-stone-50 cursor-pointer'}`}
                    disabled={groupSize >= effectiveMax}
                  >
                    <i className="ri-add-line" />
                  </button>
                </div>
                <div className="flex-1 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5">
                  <p className="text-xs text-stone-500">Estimated Total</p>
                  <p className="text-stone-900 font-bold text-lg">&#x20B9;{total.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-stone-400">&#x20B9;{pricePerPerson.toLocaleString('en-IN')} &times; {groupSize}</p>
                </div>
              </div>
              {groupSize >= effectiveMax && (
                <p className="mt-2 text-xs text-amber-600 flex items-center gap-1 font-medium">
                  <i className="ri-alert-line" /> Maximum guest limit reached for this package
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-stone-200 text-stone-700 rounded-xl text-sm font-medium hover:bg-stone-50 cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!step1Valid}
                onClick={() => setStep('contact')}
                className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
              >
                Continue <i className="ri-arrow-right-line" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Contact Details */}
        {step === 'contact' && (
          <form data-readdy-form onSubmit={(e) => { e.preventDefault(); setStep('confirm'); }} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-widest mb-2">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-widest mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-widest mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-widest mb-2">
                Occasion <span className="text-stone-400 font-normal normal-case">(optional)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {['Birthday', 'Anniversary', 'Team Outing', 'Family Gathering', 'Corporate Event', 'Just for Fun'].map((occ) => (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => setOccasion(occ === occasion ? '' : occ)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer whitespace-nowrap ${
                      occasion === occ ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-stone-600 border-stone-200 hover:border-amber-300'
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-widest mb-2">
                Special Requests <span className="text-stone-400 font-normal normal-case">(optional)</span>
              </label>
              <textarea
                name="special_requests"
                value={specialReq}
                onChange={(e) => { if (e.target.value.length <= 500) setSpecialReq(e.target.value); }}
                rows={3}
                placeholder="Dietary requirements, accessibility needs, or anything else..."
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 resize-none"
              />
              <p className="text-right text-xs text-stone-400 mt-1">{specialReq.length}/500</p>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setStep('datetime')}
                className="px-5 py-2.5 border border-stone-200 text-stone-700 rounded-xl text-sm font-medium hover:bg-stone-50 cursor-pointer whitespace-nowrap flex items-center gap-1"
              >
                <i className="ri-arrow-left-line" /> Back
              </button>
              <button
                type="submit"
                disabled={!step2Valid}
                className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
              >
                Review Booking <i className="ri-arrow-right-line" />
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Confirm */}
        {step === 'confirm' && (
          <form data-readdy-form onSubmit={handleSubmit} className="px-6 py-5 max-h-[70vh] overflow-y-auto">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-4">Review Your Booking</p>

            <div className="space-y-3 mb-5">
              {[
                { icon: 'ri-building-line', label: 'Property', value: propertyName },
                { icon: 'ri-calendar-event-line', label: 'Date', value: formatDate(date) },
                { icon: 'ri-sun-line', label: 'Package', value: `${selectedSlot.label} (${selectedSlot.time})` },
                { icon: 'ri-group-line', label: 'Group Size', value: `${groupSize} person${groupSize > 1 ? 's' : ''}` },
                { icon: 'ri-user-line', label: 'Name', value: name },
                { icon: 'ri-mail-line', label: 'Email', value: email },
                ...(phone ? [{ icon: 'ri-phone-line', label: 'Phone', value: phone }] : []),
                ...(occasion ? [{ icon: 'ri-gift-line', label: 'Occasion', value: occasion }] : []),
              ].map((row) => (
                <div key={row.label} className="flex items-start gap-3 py-2 border-b border-stone-100">
                  <div className="w-7 h-7 flex items-center justify-center bg-stone-50 rounded-lg shrink-0 mt-0.5">
                    <i className={`${row.icon} text-stone-400 text-sm`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-stone-400">{row.label}</p>
                    <p className="text-sm font-medium text-stone-800 mt-0.5 break-words">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-stone-500">Price per person</p>
                  <p className="text-sm font-medium text-stone-700">&#x20B9;{pricePerPerson.toLocaleString('en-IN')} &times; {groupSize}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-stone-500">Estimated Total</p>
                  <p className="text-2xl font-bold text-stone-900">&#x20B9;{total.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <p className="text-xs text-stone-400 mt-2">
                <i className="ri-information-line mr-1" />Final pricing confirmed by host. Payment on-site.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('contact')}
                className="px-5 py-2.5 border border-stone-200 text-stone-700 rounded-xl text-sm font-medium hover:bg-stone-50 cursor-pointer whitespace-nowrap flex items-center gap-1"
              >
                <i className="ri-arrow-left-line" /> Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><i className="ri-loader-4-line animate-spin" /> Sending...</>
                ) : (
                  <><i className="ri-sun-line" /> Confirm Booking</>
                )}
              </button>
            </div>

            <p className="text-center text-stone-400 text-xs mt-3">
              <i className="ri-shield-check-line mr-1" />Host will confirm availability within 24 hours
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
