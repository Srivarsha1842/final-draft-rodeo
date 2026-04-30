import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const destinations = ['Goa', 'Manali', 'Udaipur', 'Kerala', 'Coorg', 'Andaman', 'Jaipur', 'Darjeeling'];
const vibes = [
  { id: 'romantic', label: 'Romantic', icon: 'ri-heart-line' },
  { id: 'adventure', label: 'Adventure', icon: 'ri-map-2-line' },
  { id: 'family', label: 'Family', icon: 'ri-group-line' },
  { id: 'wellness', label: 'Wellness', icon: 'ri-leaf-line' },
  { id: 'cultural', label: 'Cultural', icon: 'ri-ancient-gate-line' },
  { id: 'beach', label: 'Beach', icon: 'ri-sun-line' },
];
const budgets = [
  { label: 'Under ₹10k', value: 10000 },
  { label: '₹10k–₹20k', value: 20000 },
  { label: '₹20k–₹40k', value: 40000 },
  { label: '₹40k+', value: 100000 },
];

export default function AIPlannerWidget() {
  const navigate = useNavigate();
  const [dest, setDest] = useState('');
  const [vibe, setVibe] = useState('');
  const [budget, setBudget] = useState(0);
  const [guests, setGuests] = useState(2);
  const [generating, setGenerating] = useState(false);
  const [step, setStep] = useState(1);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      navigate('/ai-planner');
    }, 1200);
  };

  const canProceed1 = dest.trim().length > 0;
  const canProceed2 = vibe.length > 0;
  const canGenerate = budget > 0;

  return (
    <section className="py-16 md:py-20" style={{ background: '#FAF8F5' }}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Left: headline */}
          <div>
            <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold mb-3">AI-Powered</p>
            <h2
              className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Plan Your Dream Trip<br />
              <span className="text-amber-500">in Under 60 Seconds</span>
            </h2>
            <p className="text-stone-500 text-base leading-relaxed mb-6">
              Tell us your destination, vibe and budget. Our AI planner instantly crafts a personalised itinerary with curated stays, experiences, and the best deals available right now.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: 'ri-magic-line', label: 'AI Curated', desc: 'Personalised just for you' },
                { icon: 'ri-price-tag-3-line', label: 'Best Prices', desc: 'Live deals & offers' },
                { icon: 'ri-map-2-line', label: 'Full Itinerary', desc: 'Stays + experiences' },
              ].map((f) => (
                <div key={f.label} className="text-center p-3 bg-white rounded-xl border border-stone-100">
                  <div className="w-9 h-9 flex items-center justify-center bg-amber-50 rounded-full mx-auto mb-2">
                    <i className={`${f.icon} text-amber-600`} />
                  </div>
                  <p className="text-stone-800 text-xs font-semibold">{f.label}</p>
                  <p className="text-stone-400 text-xs mt-0.5">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: widget */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden">
            {/* Widget header */}
            <div className="px-6 py-4 bg-stone-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 flex items-center justify-center bg-amber-400 rounded-full">
                  <i className="ri-ai-generate text-stone-900 text-sm" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Triprodeo AI Planner</p>
                  <p className="text-stone-400 text-xs">Ready to plan your trip</p>
                </div>
              </div>
              {/* Step indicator */}
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`w-2 h-2 rounded-full transition-all ${
                      step === s ? 'bg-amber-400 w-4' : step > s ? 'bg-amber-400/50' : 'bg-stone-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="p-6">
              {/* Step 1: Destination + Guests */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      <i className="ri-map-pin-2-line mr-1.5 text-amber-500" />
                      Where do you want to go?
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={dest}
                        onChange={(e) => setDest(e.target.value)}
                        placeholder="e.g. Goa, Manali, Kerala..."
                        className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {destinations.map((d) => (
                        <button
                          key={d}
                          onClick={() => setDest(d)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                            dest === d
                              ? 'bg-stone-900 text-white border-stone-900'
                              : 'border-stone-200 text-stone-600 hover:border-stone-400'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      <i className="ri-group-line mr-1.5 text-amber-500" />
                      Number of guests
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-9 h-9 flex items-center justify-center border border-stone-200 rounded-full hover:bg-stone-50 cursor-pointer"
                      >
                        <i className="ri-subtract-line text-stone-600" />
                      </button>
                      <span className="text-xl font-bold text-stone-900 w-8 text-center">{guests}</span>
                      <button
                        onClick={() => setGuests(Math.min(20, guests + 1))}
                        className="w-9 h-9 flex items-center justify-center border border-stone-200 rounded-full hover:bg-stone-50 cursor-pointer"
                      >
                        <i className="ri-add-line text-stone-600" />
                      </button>
                      <span className="text-stone-400 text-sm">
                        {guests === 1 ? 'person' : 'people'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => canProceed1 && setStep(2)}
                    disabled={!canProceed1}
                    className={`w-full py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      canProceed1
                        ? 'bg-stone-900 text-white hover:bg-stone-800'
                        : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    Next: Choose Your Vibe <i className="ri-arrow-right-line ml-1" />
                  </button>
                </div>
              )}

              {/* Step 2: Vibe */}
              {step === 2 && (
                <div className="space-y-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1 text-stone-400 text-xs hover:text-stone-600 cursor-pointer"
                  >
                    <i className="ri-arrow-left-line" /> Back
                  </button>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-3">
                      <i className="ri-emotion-line mr-1.5 text-amber-500" />
                      What&apos;s your vibe?
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {vibes.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => setVibe(v.id)}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                            vibe === v.id
                              ? 'bg-stone-900 text-white border-stone-900'
                              : 'border-stone-200 text-stone-600 hover:border-stone-400 hover:bg-stone-50'
                          }`}
                        >
                          <i className={`${v.icon} text-lg`} />
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => canProceed2 && setStep(3)}
                    disabled={!canProceed2}
                    className={`w-full py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      canProceed2
                        ? 'bg-stone-900 text-white hover:bg-stone-800'
                        : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    Next: Set Your Budget <i className="ri-arrow-right-line ml-1" />
                  </button>
                </div>
              )}

              {/* Step 3: Budget */}
              {step === 3 && (
                <div className="space-y-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1 text-stone-400 text-xs hover:text-stone-600 cursor-pointer"
                  >
                    <i className="ri-arrow-left-line" /> Back
                  </button>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-3">
                      <i className="ri-money-rupee-circle-line mr-1.5 text-amber-500" />
                      Budget per night (per room)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {budgets.map((b) => (
                        <button
                          key={b.label}
                          onClick={() => setBudget(b.value)}
                          className={`py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                            budget === b.value
                              ? 'bg-stone-900 text-white border-stone-900'
                              : 'border-stone-200 text-stone-600 hover:border-stone-400'
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  {dest && vibe && budget > 0 && (
                    <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-100">
                      <p className="text-xs font-semibold text-stone-700 mb-1.5">Your Trip Summary</p>
                      <div className="flex items-center gap-2 flex-wrap text-xs text-stone-600">
                        <span className="flex items-center gap-1">
                          <i className="ri-map-pin-line text-amber-500" /> {dest}
                        </span>
                        <span className="text-stone-300">·</span>
                        <span className="flex items-center gap-1">
                          <i className="ri-group-line text-amber-500" /> {guests} guests
                        </span>
                        <span className="text-stone-300">·</span>
                        <span className="capitalize flex items-center gap-1">
                          <i className="ri-heart-line text-amber-500" /> {vibe}
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleGenerate}
                    disabled={!canGenerate || generating}
                    className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 ${
                      canGenerate
                        ? 'bg-amber-400 text-stone-900 hover:bg-amber-300'
                        : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    {generating ? (
                      <>
                        <i className="ri-loader-4-line animate-spin" />
                        Crafting your itinerary...
                      </>
                    ) : (
                      <>
                        <i className="ri-magic-line" />
                        Generate My Trip Plan
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
