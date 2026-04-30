import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadCMSData, defaultTrendingDestinations } from '@/pages/admin/cmsStore';

export default function TrendingLocations() {
  const navigate = useNavigate();

  const trendingLocations = useMemo(() => {
    const cms = loadCMSData();
    return (cms.trendingDestinations && cms.trendingDestinations.length > 0)
      ? cms.trendingDestinations
      : defaultTrendingDestinations;
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold mb-2">
              Discover India
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-stone-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Trending Destinations
            </h2>
            <p className="text-stone-500 text-sm mt-1.5">
              Handpicked locations loved by our community of travelers
            </p>
          </div>
          <button
            onClick={() => navigate('/destinations')}
            className="hidden sm:flex items-center gap-1.5 text-stone-600 text-sm font-medium hover:text-stone-900 transition-colors cursor-pointer whitespace-nowrap"
          >
            Explore All <i className="ri-arrow-right-line" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
          {trendingLocations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => navigate(`/search?destination=${encodeURIComponent(loc.name)}`)}
              className="group relative rounded-xl md:rounded-2xl overflow-hidden cursor-pointer text-left"
              style={{ height: 'clamp(180px, 28vw, 340px)' }}
            >
              {/* Image */}
              <img
                src={loc.image}
                alt={loc.name}
                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

              {/* Badge */}
              <div className="absolute top-2 left-2 md:top-3 md:left-3">
                <span className={`text-xs font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded-full ${loc.badgeColor} text-[10px] md:text-xs`}>
                  {loc.badge}
                </span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4">
                <h3 className="text-white font-bold text-sm md:text-lg leading-tight mb-0.5">
                  {loc.name}
                </h3>
                <p className="text-white/70 text-xs mb-1.5 hidden sm:block">{loc.tagline}</p>

                {/* Tags — hide on smallest screens */}
                <div className="hidden md:flex flex-wrap gap-1 mb-3">
                  {loc.tags.map((tag) => (
                    <span key={tag} className="text-xs text-white/80 bg-white/15 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-xs hidden sm:block">{loc.properties} stays</span>
                  <span className="text-amber-300 text-xs font-semibold whitespace-nowrap">
                    &#x20B9;{loc.startingPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Hover arrow */}
              <div className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <i className="ri-arrow-right-up-line text-white text-sm" />
              </div>
            </button>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 flex justify-center sm:hidden">
          <button
            onClick={() => navigate('/destinations')}
            className="flex items-center gap-2 px-6 py-2.5 border border-stone-300 rounded-full text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            Explore All Destinations <i className="ri-arrow-right-line" />
          </button>
        </div>
      </div>
    </section>
  );
}
