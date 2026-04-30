import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const chatMessages = [
  { role: 'user', text: 'Plan a romantic weekend in Goa under ₹25,000' },
  { role: 'ai', text: 'I\'ve found 3 perfect stays for you! Azure Cliff Villa is a top pick — private infinity pool, cliff-top sunset dinners, and just 8 km from the beach. Starting ₹18,999/night.' },
  { role: 'user', text: 'What about activities nearby?' },
  { role: 'ai', text: 'I can include a couples spa package, private beachside dinner, and a sunset cruise. Want me to bundle these into an itinerary? 🌅' },
];

export default function AIPlannerTeaser() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(2);

  const handleShowMore = () => setVisible((v) => Math.min(v + 2, chatMessages.length));

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1a0e 50%, #1a1a1a 100%)' }}>
          {/* Left: content */}
          <div className="p-8 md:p-14 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 flex items-center justify-center bg-amber-400/20 rounded-full">
                <i className="ri-ai-generate text-amber-400 text-sm" />
              </div>
              <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">AI Trip Planner</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Plan Your Perfect Trip<br />
              <span className="text-amber-300">in Seconds</span>
            </h2>
            <p className="text-white/60 text-base mb-8 leading-relaxed">
              Just tell our AI your budget, dates, and dream destination — it instantly curates a personalised itinerary with stays, experiences, and pricing.
            </p>

            <ul className="space-y-3 mb-10">
              {[
                { icon: 'ri-money-dollar-circle-line', text: 'Set your budget — we handle the rest' },
                { icon: 'ri-calendar-check-line', text: 'Choose dates, get instant availability' },
                { icon: 'ri-map-pin-2-line', text: 'Pick a vibe, not just a place' },
                { icon: 'ri-suitcase-3-line', text: 'Full itinerary with activities & costs' },
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className="w-7 h-7 flex items-center justify-center bg-white/10 rounded-full shrink-0">
                    <i className={`${icon} text-amber-300 text-sm`} />
                  </div>
                  <span className="text-white/80 text-sm">{text}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/ai-planner"
              className="self-start flex items-center gap-2 px-8 py-3.5 bg-amber-400 text-stone-900 rounded-full font-semibold text-sm hover:bg-amber-300 transition-colors whitespace-nowrap"
            >
              <i className="ri-magic-line" />
              Start Planning Free
            </Link>
          </div>

          {/* Right: chat preview */}
          <div className="p-6 md:p-10 flex items-center justify-center">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Chat header */}
              <div className="bg-stone-900 px-4 py-3.5 flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-amber-400 rounded-full">
                  <i className="ri-ai-generate text-stone-900 text-sm" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Triprodeo AI</p>
                  <p className="text-stone-400 text-xs">Always online</p>
                </div>
                <div className="ml-auto w-2 h-2 bg-emerald-400 rounded-full" />
              </div>

              {/* Chat messages */}
              <div className="px-4 py-4 space-y-3 min-h-[220px]">
                {chatMessages.slice(0, visible).map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-stone-800 text-white rounded-br-sm'
                        : 'bg-amber-50 text-stone-800 rounded-bl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {visible < chatMessages.length && (
                  <button
                    onClick={handleShowMore}
                    className="w-full text-center text-xs text-stone-400 hover:text-stone-600 py-1"
                  >
                    Continue reading...
                  </button>
                )}
              </div>

              {/* Input bar */}
              <div className="px-4 pb-4">
                <div className="flex items-center gap-2 bg-stone-100 rounded-full px-4 py-2.5">
                  <Link
                    to="/ai-planner"
                    className="flex-1 bg-transparent text-xs text-stone-600 outline-none placeholder-stone-400 flex items-center"
                  >
                    Ask about your next trip...
                  </Link>
                  <Link
                    to="/ai-planner"
                    className="w-7 h-7 flex items-center justify-center bg-stone-900 rounded-full cursor-pointer"
                  >
                    <i className="ri-send-plane-fill text-white text-xs" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
