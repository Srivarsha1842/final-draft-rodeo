import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import {
  commissionTiers as mockCommissionTiers,
  partnerTestimonials,
  partnerFeatures,
  partnerFAQ,
  partnerTypes,
} from '@/mocks/partner';
import { loadCMSData } from '@/pages/admin/cmsStore';

export default function PartnerPage() {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [formStep, setFormStep] = useState(1);
  const [showForm, setShowForm] = useState(false);
  // CMS-editable partner content. Admins edit in /admin → Partner.
  const partner = useMemo(() => loadCMSData().partner, []);
  const heroLines = partner.heroHeadline.split('\n');
  // Merge CMS commissionTiers with mock defaults (color/icon/benefits are not CMS-editable).
  const commissionTiers = partner.commissionTiers.map((tier) => {
    const fallback = mockCommissionTiers.find((m) => m.id === tier.id) ?? mockCommissionTiers[0];
    return {
      ...fallback,
      ...tier,
      benefits: fallback.benefits,
      color: fallback.color,
      icon: fallback.icon,
    };
  });
  const partnerBenefits = partner.benefits;

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-20">
        <div className="relative h-[500px] md:h-[600px] overflow-hidden">
          <img 
            src="https://readdy.ai/api/search-image?query=business%20professionals%20shaking%20hands%20luxury%20hotel%20lobby%20partnership%20deal%20corporate%20travel&width=1400&height=700&seq=partnerhero&orientation=landscape"
            alt="Partner with Triprodeo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/60 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 w-full">
              <div className="max-w-xl">
                <span className="inline-block px-3 py-1 bg-amber-400 text-stone-900 text-xs font-bold rounded-full mb-4">
                  B2B Partnership
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {heroLines[0]}
                  {heroLines[1] && (
                    <>
                      <br />
                      <span className="text-amber-400">{heroLines.slice(1).join(' ')}</span>
                    </>
                  )}
                </h1>
                <p className="text-white/80 text-lg mb-8 leading-relaxed">
                  {partner.heroSubheadline}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => setShowForm(true)}
                    className="px-8 py-4 bg-amber-400 text-stone-900 rounded-full font-bold text-base hover:bg-amber-300 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Become a Partner
                  </button>
                  <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-full font-semibold text-base hover:bg-white/20 transition-colors cursor-pointer whitespace-nowrap">
                    <i className="ri-play-circle-line mr-2" />
                    Watch Demo
                  </button>
                </div>
                
                {/* Stats */}
                <div className="flex flex-wrap gap-6 mt-10 pt-6 border-t border-white/20">
                  {partner.stats.map((stat) => (
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

      {/* Commission Tiers Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold mb-2">Commission Structure</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Earn More as You Grow
            </h2>
            <p className="text-stone-500 max-w-2xl mx-auto">
              Our tiered commission structure rewards your success. The more you book, the higher your earnings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {commissionTiers.map((tier) => (
              <div key={tier.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`${tier.color} p-6 text-white`}>
                  <div className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-xl mb-4">
                    <i className={`${tier.icon} text-2xl`} />
                  </div>
                  <h3 className="font-bold text-xl mb-1">{tier.name}</h3>
                  <p className="text-white/80 text-sm">{tier.minBookings}+ bookings/month</p>
                </div>
                <div className="p-6">
                  <div className="text-center mb-6">
                    <p className="text-4xl font-bold text-stone-900">{tier.commissionRate}</p>
                    <p className="text-stone-500 text-sm">Commission per booking</p>
                  </div>
                  <div className="text-center mb-6 pb-6 border-b border-stone-100">
                    <p className="text-2xl font-bold text-amber-600">{tier.bonusPerBooking}</p>
                    <p className="text-stone-500 text-sm">Bonus per booking</p>
                  </div>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                        <i className="ri-check-line text-emerald-500 mt-0.5" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-stone-100">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold mb-2">Why Partner with Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Everything You Need to Succeed
            </h2>
            <p className="text-stone-500 max-w-2xl mx-auto">
              We provide the tools, inventory, and support to help you grow your travel business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerBenefits.map((benefit) => (
              <div key={benefit.id} className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-lg transition-shadow">
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

      {/* Who Can Partner */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold mb-2">Who Can Join</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Perfect For Your Business
            </h2>
            <p className="text-stone-500 max-w-2xl mx-auto">
              Whether you are a large agency or independent consultant, our program is designed for you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerTypes.map((type) => (
              <div key={type.id} className="bg-white rounded-2xl border border-stone-200 p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 mx-auto flex items-center justify-center bg-amber-100 rounded-2xl mb-4">
                  <i className={`${type.icon} text-amber-600 text-2xl`} />
                </div>
                <h3 className="font-bold text-stone-900 text-lg mb-2">{type.title}</h3>
                <p className="text-stone-600 text-sm">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-stone-900 text-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold mb-2">Powerful Tools</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Built for Professionals
            </h2>
            <p className="text-stone-400 max-w-2xl mx-auto">
              Advanced features to streamline your workflow and impress your clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerFeatures.map((feature) => (
              <div key={feature.id} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="w-12 h-12 flex items-center justify-center bg-amber-400/20 rounded-xl mb-4">
                  <i className={`${feature.icon} text-amber-400 text-xl`} />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-stone-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold mb-2">Partner Stories</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Success Stories from Our Partners
            </h2>
            <p className="text-stone-500 max-w-2xl mx-auto">
              Real partners sharing how Triprodeo helped grow their business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partnerTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-2xl border border-stone-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-stone-900">{testimonial.name}</h4>
                    <p className="text-stone-500 text-xs">{testimonial.company} · {testimonial.location}</p>
                  </div>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed mb-4 italic">&quot;{testimonial.quote}&quot;</p>
                <div className="pt-4 border-t border-stone-100 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-lg font-bold text-amber-600">{testimonial.monthlyEarnings}</p>
                    <p className="text-stone-400 text-xs">Monthly Earnings</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-stone-900">{testimonial.totalBookings}</p>
                    <p className="text-stone-400 text-xs">Total Bookings</p>
                  </div>
                </div>
                <p className="text-stone-400 text-xs mt-3">{testimonial.since}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 md:py-24 bg-stone-100">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold mb-2">Partner Dashboard</p>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Your Business at a Glance
              </h2>
              <p className="text-stone-600 mb-8 leading-relaxed">
                Our intuitive partner dashboard gives you complete visibility into your bookings, commissions, and performance. Track everything in real-time and make data-driven decisions.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: 'ri-bar-chart-box-line', title: 'Real-time Analytics', desc: 'Track bookings, revenue, and commission trends' },
                  { icon: 'ri-wallet-3-line', title: 'Commission Tracking', desc: 'See pending and paid commissions at a glance' },
                  { icon: 'ri-file-list-3-line', title: 'Booking Management', desc: 'View all your client bookings in one place' },
                  { icon: 'ri-download-line', title: 'Reports & Exports', desc: 'Download detailed reports for your records' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-amber-100 rounded-lg shrink-0">
                      <i className={`${item.icon} text-amber-600`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-900 mb-1">{item.title}</h4>
                      <p className="text-stone-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://readdy.ai/api/search-image?query=dashboard%20analytics%20interface%20dark%20mode%20charts%20graphs%20business%20metrics%20modern%20UI%20design&width=600&height=500&seq=dashboard&orientation=landscape"
                alt="Partner Dashboard"
                className="rounded-2xl shadow-2xl w-full"
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
            {partnerFAQ.map((faq) => (
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
            Ready to Grow Your Business?
          </h2>
          <p className="text-stone-800 text-lg mb-8 max-w-2xl mx-auto">
            Join 2,500+ partners already earning with Triprodeo. Signup is free and takes just minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => setShowForm(true)}
              className="px-8 py-4 bg-stone-900 text-white rounded-full font-bold text-base hover:bg-stone-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              Apply Now — It&apos;s Free
            </button>
            <Link 
              to="/resort-owner"
              className="px-8 py-4 bg-white text-stone-900 rounded-full font-semibold text-base hover:bg-stone-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              Become a Host Instead
            </Link>
          </div>
        </div>
      </section>

      {/* Partner Registration Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-stone-900">Partner Application</h3>
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
                  <h4 className="font-semibold text-stone-900 mb-4">Business Information</h4>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Company/Agency Name</label>
                    <input type="text" className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900" placeholder="Your Travel Agency" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">First Name</label>
                      <input type="text" className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900" placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Last Name</label>
                      <input type="text" className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900" placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Business Email</label>
                    <input type="email" className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900" placeholder="john@agency.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Phone</label>
                    <input type="tel" className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900" placeholder="+91 98765 43210" />
                  </div>
                </div>
              )}

              {formStep === 2 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-stone-900 mb-4">Business Details</h4>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Business Type</label>
                    <select className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 bg-white">
                      <option>Select type...</option>
                      <option>Travel Agency</option>
                      <option>Tour Operator</option>
                      <option>Corporate Travel</option>
                      <option>Event Planner</option>
                      <option>Independent Consultant</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Location/City</label>
                    <input type="text" className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900" placeholder="Mumbai, Maharashtra" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Monthly Booking Volume (Estimated)</label>
                    <select className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 bg-white">
                      <option>Select range...</option>
                      <option>1-10 bookings</option>
                      <option>11-25 bookings</option>
                      <option>26-50 bookings</option>
                      <option>50+ bookings</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Website (Optional)</label>
                    <input type="url" className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900" placeholder="https://youragency.com" />
                  </div>
                </div>
              )}

              {formStep === 3 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-stone-900 mb-4">Complete Application</h4>
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                    <div className="flex items-center gap-3 mb-2">
                      <i className="ri-information-line text-amber-600 text-xl" />
                      <h5 className="font-semibold text-amber-900">What happens next?</h5>
                    </div>
                    <ul className="text-amber-800 text-sm space-y-1">
                      <li>• Our team will review your application within 24 hours</li>
                      <li>• You will receive partner dashboard access upon approval</li>
                      <li>• Start booking immediately and earn commissions</li>
                    </ul>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded border-stone-300" />
                    <label htmlFor="terms" className="text-sm text-stone-600">
                      I agree to the <a href="#" className="underline">Partner Terms</a> and confirm I have authority to represent this business.
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