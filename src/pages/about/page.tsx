import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { brandStory, trustBadges, teamMembers, pressFeatures, certifications } from '@/mocks/about';
import { loadCMSData } from '@/pages/admin/cmsStore';

export default function AboutPage() {
  const [activeMilestone, setActiveMilestone] = useState(brandStory.milestones.length - 1);
  // CMS-editable About content. Admins edit in /admin → About.
  const about = useMemo(() => loadCMSData().about, []);
  const headlineLines = about.headline.split('\n');
  const founders = about.founders.length ? about.founders : brandStory.founders;
  const values = about.values;
  const officeLocations = about.officeLocations;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://readdy.ai/api/search-image?query=diverse%20group%20of%20happy%20travelers%20friends%20exploring%20beautiful%20indian%20destination%20sunset%20golden%20hour%20joyful%20adventure%20travel%20lifestyle%20photography%20cinematic%20wide&width=1600&height=800&seq=about-hero&orientation=landscape"
            alt="Triprodeo travelers"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/50 to-transparent" />
        </div>
        <div className="relative h-full max-w-[1400px] mx-auto px-4 md:px-8 flex items-center">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
              Our Story
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {headlineLines[0]}
              {headlineLines[1] && (
                <>
                  <br />
                  <span className="text-amber-400">{headlineLines.slice(1).join(' ')}</span>
                </>
              )}
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-lg leading-relaxed">
              {about.subheadline}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-stone-900 py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {about.stats.map((stat, i) => (
              <div key={stat.label} className="text-center">
                <p className={`text-3xl md:text-4xl font-bold mb-2 ${i === about.stats.length - 1 ? 'text-amber-400' : 'text-white'}`}>
                  {stat.value}
                </p>
                <p className="text-stone-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="text-amber-600 text-sm font-semibold uppercase tracking-wider">Our Journey</span>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mt-3 mb-6">From a Simple Idea to India&apos;s Most Loved Travel Platform</h2>
              <p className="text-stone-600 leading-relaxed mb-6">
                {about.storyParagraph1}
              </p>
              <p className="text-stone-600 leading-relaxed">
                {about.storyParagraph2}
              </p>
            </div>
            <div className="relative">
              <img
                src="https://readdy.ai/api/search-image?query=modern%20travel%20startup%20office%20interior%20diverse%20team%20collaboration%20creative%20workspace%20warm%20lighting%20professional%20photography&width=800&height=600&seq=about-office&orientation=landscape"
                alt="Triprodeo office"
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 max-w-xs">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <i className="ri-award-line text-amber-600 text-xl" />
                  </div>
                  <span className="font-semibold text-stone-900">Startup India</span>
                </div>
                <p className="text-sm text-stone-600">DPIIT recognized and backed by leading investors</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-16 md:py-24 bg-stone-50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="text-amber-600 text-sm font-semibold uppercase tracking-wider">Leadership</span>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mt-3">Meet Our Founders</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {founders.map((founder) => (
              <div key={founder.name} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-6">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-stone-900">{founder.name}</h3>
                    <p className="text-amber-600 text-sm font-medium mb-3">{founder.role}</p>
                    <p className="text-stone-600 text-sm leading-relaxed">{founder.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="text-amber-600 text-sm font-semibold uppercase tracking-wider">Timeline</span>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mt-3">Our Milestones</h2>
          </div>
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-stone-200 -translate-y-1/2" />
            <div className="grid grid-cols-2 md:grid-cols-7 gap-4 md:gap-0">
              {brandStory.milestones.map((milestone, index) => (
                <button
                  key={milestone.year}
                  onClick={() => setActiveMilestone(index)}
                  className={`relative text-left md:text-center p-4 rounded-xl transition-all ${
                    activeMilestone === index ? 'bg-amber-50 md:bg-transparent' : 'hover:bg-stone-50 md:hover:bg-transparent'
                  }`}
                >
                  <div className={`hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 transition-colors ${
                    activeMilestone === index ? 'bg-amber-500 border-amber-200' : 'bg-white border-stone-300'
                  }`} />
                  <p className={`text-lg font-bold ${activeMilestone === index ? 'text-amber-600' : 'text-stone-400'}`}>
                    {milestone.year}
                  </p>
                </button>
              ))}
            </div>
            {/* Active Milestone Detail */}
            <div className="mt-8 md:mt-12 bg-stone-50 rounded-2xl p-8 md:p-12">
              <div className="max-w-3xl mx-auto text-center">
                <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-4">
                  {brandStory.milestones[activeMilestone].year}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-stone-900 mb-4">
                  {brandStory.milestones[activeMilestone].title}
                </h3>
                <p className="text-lg text-stone-600">
                  {brandStory.milestones[activeMilestone].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-stone-900">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-wider">What We Stand For</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-stone-800/50 rounded-2xl p-6 hover:bg-stone-800 transition-colors">
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4">
                  <i className={`${value.icon} text-amber-400 text-2xl`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="text-amber-600 text-sm font-semibold uppercase tracking-wider">Why Trust Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mt-3">Your Trust, Our Priority</h2>
            <p className="text-stone-600 mt-4 max-w-2xl mx-auto">
              We have built Triprodeo on a foundation of transparency, security, and unwavering commitment to our guests.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trustBadges.map((badge) => (
              <div key={badge.title} className="flex gap-4 p-6 rounded-2xl border border-stone-100 hover:border-amber-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className={`${badge.icon} text-amber-600 text-xl`} />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 mb-1">{badge.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-12 bg-stone-50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {certifications.map((cert) => (
              <div key={cert.name} className="text-center">
                <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mb-2 mx-auto">
                  <i className="ri-shield-check-line text-amber-500 text-2xl" />
                </div>
                <p className="font-semibold text-stone-900 text-sm">{cert.name}</p>
                <p className="text-stone-500 text-xs">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Features */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="text-amber-600 text-sm font-semibold uppercase tracking-wider">In The News</span>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mt-3">Featured In</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pressFeatures.map((press) => (
              <div key={press.logo} className="bg-stone-50 rounded-2xl p-6 hover:bg-amber-50 transition-colors">
                <p className="font-bold text-stone-900 mb-3">{press.logo}</p>
                <p className="text-stone-600 text-sm italic mb-4">&ldquo;{press.quote}&rdquo;</p>
                <p className="text-stone-400 text-xs">{press.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-stone-50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="text-amber-600 text-sm font-semibold uppercase tracking-wider">The Team</span>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mt-3">Meet The People Behind Triprodeo</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                />
                <h3 className="font-bold text-stone-900">{member.name}</h3>
                <p className="text-amber-600 text-sm font-medium mb-2">{member.role}</p>
                <p className="text-stone-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="text-amber-600 text-sm font-semibold uppercase tracking-wider">Our Presence</span>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mt-3">Office Locations</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {officeLocations.map((office) => (
              <div key={office.city} className="border border-stone-200 rounded-2xl p-6 hover:border-amber-300 transition-colors">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4">
                  <i className="ri-map-pin-2-line text-amber-600 text-xl" />
                </div>
                <h3 className="font-bold text-stone-900 text-lg">{office.city}</h3>
                <p className="text-amber-600 text-sm font-medium mb-2">{office.role}</p>
                <p className="text-stone-600 text-sm">{office.address}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-stone-900">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-stone-400 text-lg mb-8 max-w-2xl mx-auto">
            Join millions of travelers who trust Triprodeo for their perfect getaways. Your next adventure awaits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/search"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 text-white rounded-full font-semibold hover:bg-amber-600 transition-colors"
            >
              <span>Explore Stays</span>
              <i className="ri-arrow-right-line" />
            </Link>
            <Link
              to="/experiences"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-colors"
            >
              <span>Discover Experiences</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}