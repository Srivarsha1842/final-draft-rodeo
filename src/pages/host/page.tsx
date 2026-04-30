import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { 
  hostBenefits, 
  hostSteps, 
  hostTestimonials, 
  hostFeatures,
  hostFAQ,
  hostStats,
  listingTypes,
} from '@/mocks/host';

const packages = [
  {
    id: 'basic',
    name: 'Basic',
    price: '₹4,999',
    period: '/month',
    tagline: 'Perfect for new resort owners just getting started',
    color: 'border-stone-300',
    badgeBg: 'bg-stone-100 text-stone-700',
    btnClass: 'bg-stone-900 text-white hover:bg-stone-700',
    popular: false,
    features: [
      { label: 'Property listings', value: 'Up to 1 property', included: true },
      { label: 'Booking management', value: 'Full access', included: true },
      { label: 'Calendar management', value: 'Full access', included: true },
      { label: 'Guest messaging', value: 'Full access', included: true },
      { label: 'Basic dashboard & stats', value: 'Included', included: true },
      { label: 'Payout tracking', value: '', included: false },
      { label: 'Reviews management', value: '', included: false },
      { label: 'Guest management', value: '', included: false },
      { label: 'Add-ons & day packages', value: '', included: false },
      { label: 'Analytics & reports', value: '', included: false },
      { label: 'Promotions & discounts', value: '', included: false },
      { label: 'Priority support', value: '', included: false },
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: '₹9,999',
    period: '/month',
    tagline: 'For growing resort owners with multiple properties',
    color: 'border-amber-400',
    badgeBg: 'bg-amber-100 text-amber-800',
    btnClass: 'bg-amber-500 text-stone-900 hover:bg-amber-400',
    popular: true,
    features: [
      { label: 'Property listings', value: 'Up to 3 properties', included: true },
      { label: 'Booking management', value: 'Full access', included: true },
      { label: 'Calendar management', value: 'Full access', included: true },
      { label: 'Guest messaging', value: 'Full access', included: true },
      { label: 'Basic dashboard & stats', value: 'Included', included: true },
      { label: 'Payout tracking', value: 'Full access', included: true },
      { label: 'Reviews management', value: 'Full access', included: true },
      { label: 'Guest management', value: 'Full access', included: true },
      { label: 'Add-ons & house policies', value: 'Full access', included: true },
      { label: 'Analytics & reports', value: '', included: false },
      { label: 'Promotions & discounts', value: '', included: false },
      { label: 'Priority support', value: '', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹19,999',
    period: '/month',
    tagline: 'Full-suite access for established resort operators',
    color: 'border-emerald-400',
    badgeBg: 'bg-emerald-100 text-emerald-800',
    btnClass: 'bg-emerald-600 text-white hover:bg-emerald-500',
    popular: false,
    features: [
      { label: 'Property listings', value: 'Unlimited', included: true },
      { label: 'Booking management', value: 'Full access', included: true },
      { label: 'Calendar management', value: 'Full access', included: true },
      { label: 'Guest messaging', value: 'Full access', included: true },
      { label: 'Basic dashboard & stats', value: 'Included', included: true },
      { label: 'Payout tracking', value: 'Full access', included: true },
      { label: 'Reviews management', value: 'Full access', included: true },
      { label: 'Guest management', value: 'Full access', included: true },
      { label: 'Add-ons & day packages', value: 'Full access', included: true },
      { label: 'Advanced analytics & reports', value: 'Full access', included: true },
      { label: 'Promotions & discounts', value: 'Full access', included: true },
      { label: 'Priority 24/7 support', value: 'Included', included: true },
    ],
  },
];

export default function HostPage() {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [formStep, setFormStep] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const openFormWithPackage = (pkg: string) => {
    setSelectedPackage(pkg);
    setFormStep(1);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-20">
        <div className="relative h-[500px] md:h-[600px] overflow-hidden">
          <img 
            src="https://readdy.ai/api/search-image?query=luxury%20indian%20resort%20swimming%20pool%20lush%20greenery%20elegant%20architecture%20warm%20golden%20hour%20hospitality&width=1400&height=700&seq=resortownerhero&orientation=landscape"
            alt="Become a Resort Owner"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/60 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 w-full">
              <div className="max-w-xl">
                <span className="inline-block px-3 py-1 bg-amber-400 text-stone-900 text-xs font-bold rounded-full mb-4">
                  Resort Owner Programme
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  List Your Resort,<br />
                  <span className="text-amber-400">Grow Your Business</span>
                </h1>
                <p className="text-white/80 text-lg mb-8 leading-relaxed">
                  Join 50,000+ resort owners earning an average of ₹3,00,000 per year by connecting their properties with premium travelers from around the world.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => { setSelectedPackage(null); setFormStep(1); setShowForm(true); }}
                    className="px-8 py-4 bg-amber-400 text-stone-900 rounded-full font-bold text-base hover:bg-amber-300 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Get Started Today
                  </button>
                  <a
                    href="#packages"
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-full font-semibold text-base hover:bg-white/20 transition-colors cursor-pointer whitespace-nowrap text-center"
                  >
                    <i className="ri-price-tag-3-line mr-2" />
                    View Packages
                  </a>
                </div>
                
                {/* Stats */}
                <div className="flex flex-wrap gap-6 mt-10 pt-6 border-t border-white/20">
                  {[
                    { value: hostStats.totalHosts, label: 'Resort Owners' },
                    { value: hostStats.totalEarnings, label: 'Owner Earnings' },
                    { value: hostStats.averageRating, label: 'Avg. Rating' },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                      <p className="text-white/60 text-sm">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PACKAGES SECTION ── */}
      <section id="packages" className="py-16 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold mb-2">Pricing Plans</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Choose Your Package
            </h2>
            <p className="text-stone-500 max-w-2xl mx-auto">
              Pick the plan that fits your resort business. Upgrade anytime as you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-2xl border-2 ${pkg.color} p-7 flex flex-col transition-all hover:-translate-y-1`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 bg-amber-400 text-stone-900 text-xs font-bold rounded-full whitespace-nowrap">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${pkg.badgeBg}`}>
                    {pkg.name}
                  </span>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-bold text-stone-900">{pkg.price}</span>
                    <span className="text-stone-400 text-sm">{pkg.period}</span>
                  </div>
                  <p className="text-stone-500 text-sm leading-relaxed">{pkg.tagline}</p>
                </div>

                <div className="flex-1 space-y-3 mb-8">
                  {pkg.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-5 h-5 flex items-center justify-center rounded-full shrink-0 mt-0.5 ${
                        feat.included ? 'bg-emerald-100' : 'bg-stone-100'
                      }`}>
                        <i className={`text-xs ${feat.included ? 'ri-check-line text-emerald-600' : 'ri-close-line text-stone-400'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm ${feat.included ? 'text-stone-800' : 'text-stone-400 line-through'}`}>
                          {feat.label}
                        </span>
                        {feat.included && feat.value && (
                          <span className="ml-1.5 text-xs text-stone-400">— {feat.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => openFormWithPackage(pkg.id)}
                  className={`w-full py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${pkg.btnClass}`}
                >
                  Get Started with {pkg.name}
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-stone-400 text-xs mt-6">
            All plans include a 14-day free trial · No credit card required · Cancel anytime
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-stone-50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold mb-2">Why List on Triprodeo</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Everything You Need to Succeed
            </h2>
            <p className="text-stone-500 max-w-2xl mx-auto">
              We provide the tools, protection, and support you need to list your resort with confidence and maximize your earnings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostBenefits.map((benefit) => (
              <div key={benefit.id} className="bg-white rounded-2xl border border-stone-200 p-6">
                <div className="w-12 h-12 flex items-center justify-center bg-stone-100 rounded-xl mb-4">
                  <i className={`${benefit.icon} text-stone-900 text-xl`} />
                </div>
                <h3 className="font-bold text-stone-900 text-lg mb-2">{benefit.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-4">{benefit.description}</p>
                {benefit.stat && (
                  <div className="pt-4 border-t border-stone-100">
                    <p className="text-2xl font-bold text-amber-600">{benefit.stat}</p>
                    <p className="text-stone-400 text-xs">{benefit.statLabel}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-stone-900 text-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold mb-2">Simple Process</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Start Listing in 3 Easy Steps
            </h2>
            <p className="text-stone-400 max-w-2xl mx-auto">
              From listing creation to welcoming your first guest, we make the entire process seamless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {hostSteps.map((step, index) => (
              <div key={step.number} className="relative">
                {index < hostSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-stone-700 -translate-x-1/2" />
                )}
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-amber-400 rounded-full flex items-center justify-center relative z-10">
                    <i className={`${step.icon} text-stone-900 text-2xl`} />
                  </div>
                  <div className="w-8 h-8 mx-auto mb-4 bg-stone-800 rounded-full flex items-center justify-center text-amber-400 font-bold text-sm">
                    {step.number}
                  </div>
                  <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                  <p className="text-stone-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={() => { setSelectedPackage(null); setFormStep(1); setShowForm(true); }}
              className="px-8 py-4 bg-amber-400 text-stone-900 rounded-full font-bold text-base hover:bg-amber-300 transition-colors cursor-pointer whitespace-nowrap"
            >
              Create Your Listing
            </button>
          </div>
        </div>
      </section>

      {/* Listing Types */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold mb-2">What You Can List</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              All Types of Resorts Welcome
            </h2>
            <p className="text-stone-500 max-w-2xl mx-auto">
              From cozy cottages to grand luxury resorts, travelers are looking for unique stays like yours.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {listingTypes.map((type) => (
              <div key={type.id} className="group cursor-pointer">
                <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                  <img 
                    src={type.image} 
                    alt={type.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full mb-2">
                      <i className={`${type.icon} text-white`} />
                    </div>
                    <h3 className="font-bold text-white text-lg">{type.title}</h3>
                  </div>
                </div>
                <p className="text-stone-600 text-sm">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-stone-100">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold mb-2">Powerful Tools</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Smart Tools for Resort Owners
            </h2>
            <p className="text-stone-500 max-w-2xl mx-auto">
              Our AI-powered platform gives you everything you need to manage your resort business efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostFeatures.map((feature) => (
              <div key={feature.id} className="bg-white rounded-2xl p-6 flex gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-amber-100 rounded-xl shrink-0">
                  <i className={`${feature.icon} text-amber-600 text-xl`} />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 mb-1">{feature.title}</h3>
                  <p className="text-stone-600 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold mb-2">Owner Stories</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Hear From Our Resort Owners
            </h2>
            <p className="text-stone-500 max-w-2xl mx-auto">
              Real stories from real resort owners who transformed their spaces into thriving businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hostTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-2xl border border-stone-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-stone-900">{testimonial.name}</h4>
                    <p className="text-stone-500 text-xs">{testimonial.propertyType} · {testimonial.location}</p>
                  </div>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed mb-4 italic">&quot;{testimonial.quote}&quot;</p>
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-amber-600">{testimonial.earnings}</p>
                    <p className="text-stone-400 text-xs">Annual Earnings</p>
                  </div>
                  <p className="text-stone-400 text-xs">{testimonial.since}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Protection Section */}
      <section className="py-16 md:py-24 bg-stone-900 text-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-amber-400 text-xs uppercase tracking-widest font-semibold mb-2">Peace of Mind</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                You&apos;re Protected, Every Step of the Way
              </h2>
              <p className="text-stone-400 mb-8 leading-relaxed">
                We understand that opening your resort to guests requires trust. That&apos;s why every booking on Triprodeo comes with comprehensive protection for resort owners.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: 'ri-shield-check-line', title: '₹1 Crore Property Damage Protection', desc: 'Covers damage to your property and belongings' },
                  { icon: 'ri-shield-user-line', title: '₹10 Lakh Liability Insurance', desc: 'Protection against claims from third parties' },
                  { icon: 'ri-refund-2-line', title: 'Income Protection', desc: 'Compensation if guests cancel last minute' },
                  { icon: 'ri-24-hours-line', title: '24/7 Emergency Support', desc: 'Round-the-clock assistance for urgent issues' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg shrink-0">
                      <i className={`${item.icon} text-amber-400`} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-stone-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://readdy.ai/api/search-image?query=secure%20home%20protection%20shield%20concept%20modern%20house%20safety%20technology%20abstract&width=600&height=500&seq=protection&orientation=landscape"
                alt="Resort Owner Protection"
                className="rounded-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-[900px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold mb-2">Got Questions?</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {hostFAQ.map((faq) => (
              <div key={faq.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                >
                  <span className="font-semibold text-stone-900 pr-4">{faq.question}</span>
                  <i className={`ri-arrow-down-s-line text-xl text-stone-400 transition-transform ${openFAQ === faq.id ? 'rotate-180' : ''}`} />
                </button>
                {openFAQ === faq.id && (
                  <div className="px-5 pb-5">
                    <p className="text-stone-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-amber-400">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ready to List Your Resort?
          </h2>
          <p className="text-stone-800 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of resort owners already earning on Triprodeo. Choose a package and get started today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => { setSelectedPackage(null); setFormStep(1); setShowForm(true); }}
              className="px-8 py-4 bg-stone-900 text-white rounded-full font-bold text-base hover:bg-stone-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              List Your Resort Free
            </button>
            <Link 
              to="/search"
              className="px-8 py-4 bg-white text-stone-900 rounded-full font-semibold text-base hover:bg-stone-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              Explore Similar Listings
            </Link>
          </div>
        </div>
      </section>

      {/* Registration Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-stone-900">Start Your Resort Owner Journey</h3>
              <button 
                onClick={() => setShowForm(false)}
                className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-900 cursor-pointer"
              >
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Progress */}
              <div className="flex items-center gap-2 mb-6">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex-1 flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      formStep >= step ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-400'
                    }`}>
                      {formStep > step ? <i className="ri-check-line" /> : step}
                    </div>
                    {step < 3 && (
                      <div className={`flex-1 h-0.5 mx-2 ${formStep > step ? 'bg-stone-900' : 'bg-stone-200'}`} />
                    )}
                  </div>
                ))}
              </div>

              {formStep === 1 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-stone-900 mb-4">Tell us about yourself</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">First Name</label>
                      <input type="text" className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900" placeholder="Priya" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Last Name</label>
                      <input type="text" className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900" placeholder="Mehta" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
                    <input type="email" className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900" placeholder="priya@resort.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Phone</label>
                    <input type="tel" className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900" placeholder="+91 98765 43210" />
                  </div>
                </div>
              )}

              {formStep === 2 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-stone-900 mb-4">About your resort</h4>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Resort Type</label>
                    <select className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 bg-white">
                      <option>Select type...</option>
                      <option>Luxury Resort</option>
                      <option>Boutique Villa</option>
                      <option>Eco Resort</option>
                      <option>Beach Resort</option>
                      <option>Mountain Retreat</option>
                      <option>Heritage Property</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Location</label>
                    <input type="text" className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900" placeholder="City, State" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">No. of Rooms</label>
                      <input type="number" className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900" placeholder="10" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Max Guests</label>
                      <input type="number" className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900" placeholder="40" />
                    </div>
                  </div>

                  {/* Package selection */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Select Your Package</label>
                    <div className="space-y-2">
                      {packages.map((pkg) => (
                        <label
                          key={pkg.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedPackage === pkg.id ? pkg.color : 'border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="package"
                            value={pkg.id}
                            checked={selectedPackage === pkg.id}
                            onChange={() => setSelectedPackage(pkg.id)}
                            className="accent-stone-900"
                          />
                          <div className="flex-1">
                            <span className="font-semibold text-stone-900 text-sm">{pkg.name}</span>
                            {pkg.popular && <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">Popular</span>}
                          </div>
                          <span className="text-sm font-bold text-stone-700">{pkg.price}<span className="text-xs font-normal text-stone-400">/mo</span></span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {formStep === 3 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-stone-900 mb-4">Almost there!</h4>
                  {selectedPackage && (
                    <div className={`rounded-xl p-4 border ${packages.find(p => p.id === selectedPackage)?.color || 'border-stone-200'}`}>
                      <p className="text-sm font-semibold text-stone-800 mb-1">
                        Selected: <span className="capitalize">{selectedPackage}</span> Package — {packages.find(p => p.id === selectedPackage)?.price}/mo
                      </p>
                      <p className="text-xs text-stone-500">Our team will review your application and set up your portal access accordingly.</p>
                    </div>
                  )}
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                    <div className="flex items-center gap-3 mb-2">
                      <i className="ri-lightbulb-line text-amber-600 text-xl" />
                      <h5 className="font-semibold text-amber-900">Pro Tip</h5>
                    </div>
                    <p className="text-amber-800 text-sm">
                      Resorts with professional photos earn 40% more bookings. We&apos;ll help you schedule a free photoshoot once your listing is live!
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded border-stone-300" />
                    <label htmlFor="terms" className="text-sm text-stone-600">
                      I agree to the <a href="#" className="underline">Resort Owner Terms</a> and confirm I have permission to list this property.
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-stone-100 flex gap-3">
              {formStep > 1 && (
                <button 
                  onClick={() => setFormStep(formStep - 1)}
                  className="px-6 py-3 border border-stone-300 text-stone-900 rounded-xl font-medium hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Back
                </button>
              )}
              <button 
                onClick={() => formStep < 3 ? setFormStep(formStep + 1) : setShowForm(false)}
                className="flex-1 py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors cursor-pointer"
              >
                {formStep === 3 ? 'Submit Application' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
