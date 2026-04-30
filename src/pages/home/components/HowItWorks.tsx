export default function HowItWorks() {
  const steps = [
    { num: '01', icon: 'ri-search-2-line', title: 'Search & Discover', desc: 'Use our smart search or AI planner to find the perfect stay. Filter by budget, vibe, location, and more.', color: 'bg-amber-50', iconColor: 'text-amber-600' },
    { num: '02', icon: 'ri-checkbox-circle-line', title: 'Choose & Customise', desc: 'Pick your property, add experiences, meals, and activities. Transparent pricing — no hidden charges.', color: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { num: '03', icon: 'ri-calendar-check-line', title: 'Book & Enjoy', desc: 'Instant confirmation, secure payment, and a detailed itinerary sent straight to your inbox. Just pack and go!', color: 'bg-rose-50', iconColor: 'text-rose-600' },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold mb-2">Simple as 1-2-3</p>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Book in 3 Simple Steps
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
          <div className="hidden md:block absolute top-10 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px border-t-2 border-dashed border-stone-200" />
          {steps.map((step) => (
            <div key={step.num} className="flex flex-col items-center text-center px-4">
              <span className="text-xs font-bold text-stone-400 mb-3 tracking-widest">{step.num}</span>
              <div className={`w-20 h-20 flex items-center justify-center ${step.color} rounded-2xl mb-5 relative z-10`}>
                <i className={`${step.icon} ${step.iconColor} text-3xl`} />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">{step.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
