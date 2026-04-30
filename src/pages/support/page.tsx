import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { faqCategories, contactMethods as mockContactMethods, quickLinks, popularTopics, supportStats } from '@/mocks/support';
import { loadCMSData } from '@/pages/admin/cmsStore';

export default function SupportPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  // CMS-editable support content. Admins edit in /admin → Support.
  const support = useMemo(() => loadCMSData().support, []);
  const faqs = support.faqs;
  // Overlay CMS contact values (phone/email/whatsapp) onto mock contactMethods display.
  const contactMethods = mockContactMethods.map((m) => {
    if (m.icon.includes('phone') && support.contactPhone) {
      return { ...m, value: support.contactPhone, href: `tel:${support.contactPhone.replace(/\s/g, '')}` };
    }
    if (m.icon.includes('mail') && support.contactEmail) {
      return { ...m, value: support.contactEmail, href: `mailto:${support.contactEmail}` };
    }
    if (m.icon.includes('whatsapp') && support.contactWhatsapp) {
      const digits = support.contactWhatsapp.replace(/\D/g, '');
      return { ...m, value: support.contactWhatsapp, href: `https://wa.me/${digits}` };
    }
    return m;
  });

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-stone-900 py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-6">
              Help Center
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {support.heroHeadline}
            </h1>
            <p className="text-stone-400 text-lg mb-8">
              {support.heroSubheadline}
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <i className="ri-search-line text-stone-400 text-xl" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for answers... (e.g., cancellation, payment, check-in)"
                className="w-full bg-white rounded-full pl-12 pr-4 py-4 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-4 flex items-center"
                >
                  <i className="ri-close-line text-stone-400 hover:text-stone-600" />
                </button>
              )}
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
              <div className="flex items-center gap-2 text-stone-400">
                <i className="ri-time-line text-amber-400" />
                <span>Avg. response: {supportStats.avgResponseTime}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-400">
                <i className="ri-emotion-happy-line text-amber-400" />
                <span>{supportStats.satisfactionRate} satisfaction</span>
              </div>
              <div className="flex items-center gap-2 text-stone-400">
                <i className="ri-check-double-line text-amber-400" />
                <span>{supportStats.issuesResolved} issues resolved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 bg-stone-50 border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.title}
                to={link.href}
                className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow border border-stone-100"
              >
                <i className={`${link.icon} text-amber-600 text-xl`} />
                <span className="font-medium text-stone-900 text-sm">{link.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Category Sidebar */}
            <div className="lg:col-span-1">
              <h3 className="font-semibold text-stone-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {faqCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                      activeCategory === cat.id
                        ? 'bg-amber-50 text-amber-700 font-medium'
                        : 'hover:bg-stone-50 text-stone-600'
                    }`}
                  >
                    <i className={`${cat.icon} ${activeCategory === cat.id ? 'text-amber-600' : 'text-stone-400'}`} />
                    <span className="text-sm">{cat.name}</span>
                  </button>
                ))}
              </div>

              {/* Popular Topics */}
              <div className="mt-8">
                <h3 className="font-semibold text-stone-900 mb-4">Popular Topics</h3>
                <div className="space-y-3">
                  {popularTopics.map((topic) => (
                    <div key={topic.title} className="flex items-center justify-between text-sm">
                      <span className="text-stone-600 hover:text-amber-600 cursor-pointer">{topic.title}</span>
                      <span className="text-stone-400 text-xs">{topic.views}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FAQ List */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-stone-900">
                  {activeCategory === 'all' ? 'Frequently Asked Questions' : faqCategories.find(c => c.id === activeCategory)?.name}
                </h2>
                <span className="text-stone-500 text-sm">{filteredFaqs.length} questions</span>
              </div>

              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12 bg-stone-50 rounded-2xl">
                  <i className="ri-question-line text-4xl text-stone-300 mb-4" />
                  <p className="text-stone-600">No questions found matching your search</p>
                  <button
                    onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                    className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFaqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="border border-stone-200 rounded-xl overflow-hidden hover:border-amber-300 transition-colors"
                    >
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                        <span className="font-medium text-stone-900 pr-4">{faq.question}</span>
                        <i className={`ri-${expandedFaq === faq.id ? 'subtract' : 'add'}-line text-stone-400 flex-shrink-0`} />
                      </button>
                      {expandedFaq === faq.id && (
                        <div className="px-5 pb-5">
                          <p className="text-stone-600 leading-relaxed">{faq.answer}</p>
                          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-stone-100">
                            <span className="text-sm text-stone-500">Was this helpful?</span>
                            <button className="flex items-center gap-1 text-sm text-stone-600 hover:text-amber-600">
                              <i className="ri-thumb-up-line" /> Yes
                            </button>
                            <button className="flex items-center gap-1 text-sm text-stone-600 hover:text-red-600">
                              <i className="ri-thumb-down-line" /> No
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 md:py-24 bg-stone-50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="text-amber-600 text-sm font-semibold uppercase tracking-wider">Still Need Help?</span>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mt-3">Contact Our Support Team</h2>
            <p className="text-stone-600 mt-4 max-w-2xl mx-auto">
              Our travel experts are available 24/7 to assist you with any questions or concerns
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method) => (
              <div key={method.title} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow border border-stone-100">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4">
                  <i className={`${method.icon} text-amber-600 text-2xl`} />
                </div>
                <h3 className="font-bold text-stone-900 mb-1">{method.title}</h3>
                <p className="text-stone-500 text-sm mb-3">{method.description}</p>
                <p className="font-medium text-stone-900 mb-4">{method.value}</p>
                <a
                  href={method.href}
                  className="inline-flex items-center gap-2 text-amber-600 font-medium hover:text-amber-700"
                >
                  {method.action}
                  <i className="ri-arrow-right-line" />
                </a>
                <p className="text-stone-400 text-xs mt-3 pt-3 border-t border-stone-100">{method.available}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-amber-600 text-sm font-semibold uppercase tracking-wider">Send a Message</span>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mt-3 mb-6">Get in Touch</h2>
              <p className="text-stone-600 leading-relaxed mb-8">
                Have a specific question or need personalized assistance? Fill out the form and our team will get back to you within 4 hours. For urgent matters, please use our 24/7 phone or WhatsApp support.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="ri-time-line text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900">Fast Response</h4>
                    <p className="text-stone-600 text-sm">Average response time under 2 minutes for live chat</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="ri-translate-2 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900">Multilingual Support</h4>
                    <p className="text-stone-600 text-sm">Available in English, Hindi, Tamil, Telugu, and Kannada</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="ri-shield-check-line text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900">Secure & Private</h4>
                    <p className="text-stone-600 text-sm">Your information is protected with bank-grade encryption</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 rounded-2xl p-8">
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-500"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-500"
                      placeholder="Your last name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-500"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-500 bg-white">
                    <option>General Inquiry</option>
                    <option>Booking Issue</option>
                    <option>Payment Problem</option>
                    <option>Property Owner Support</option>
                    <option>Technical Issue</option>
                    <option>Feedback</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-500 resize-none"
                    placeholder="Describe your issue or question..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="py-8 bg-amber-500">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <i className="ri-alarm-warning-line text-white text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-white">Emergency Support</h3>
                <p className="text-white/80 text-sm">For urgent issues during your stay</p>
              </div>
            </div>
            <a
              href="tel:+9118001234567"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-amber-600 rounded-full font-semibold hover:bg-stone-100 transition-colors"
            >
              <i className="ri-phone-line" />
              <span>Call Emergency Line</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}