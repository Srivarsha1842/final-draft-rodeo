import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { 
  experiences, 
  bundlePackages, 
  experienceCategories,
  experienceFilters,
  Experience 
} from '@/mocks/experiences';

export default function ExperiencesPage() {
  const navigate = useNavigate();
  
  // Filter states
  const [activeCategory, setActiveCategory] = useState('all');
  const [activePriceRange, setActivePriceRange] = useState<string | null>(null);
  const [activeDuration, setActiveDuration] = useState<string | null>(null);
  const [activeRating, setActiveRating] = useState<number | null>(null);
  const [showBundles, setShowBundles] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'rating'>('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter experiences
  const filteredExperiences = useMemo(() => {
    let result = [...experiences];
    
    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter((e) => e.category === activeCategory);
    }
    
    // Price range filter
    if (activePriceRange) {
      const range = experienceFilters.priceRanges.find((r) => r.id === activePriceRange);
      if (range) {
        result = result.filter((e) => e.price >= range.min && e.price <= range.max);
      }
    }
    
    // Duration filter
    if (activeDuration) {
      result = result.filter((e) => {
        const hours = parseFloat(e.duration);
        if (activeDuration === 'short') return hours < 3;
        if (activeDuration === 'half-day') return hours >= 3 && hours <= 6;
        if (activeDuration === 'full-day') return e.duration.toLowerCase().includes('day') && !e.duration.includes('2');
        if (activeDuration === 'multi-day') return e.duration.toLowerCase().includes('day') && (e.duration.includes('2') || hours > 12);
        return true;
      });
    }
    
    // Rating filter
    if (activeRating) {
      result = result.filter((e) => e.rating >= activeRating);
    }
    
    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }
    
    return result;
  }, [activeCategory, activePriceRange, activeDuration, activeRating, sortBy]);

  const clearFilters = () => {
    setActiveCategory('all');
    setActivePriceRange(null);
    setActiveDuration(null);
    setActiveRating(null);
  };

  const hasActiveFilters = activeCategory !== 'all' || activePriceRange || activeDuration || activeRating;

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-20">
        <div className="relative h-[300px] md:h-[400px] overflow-hidden">
          <img 
            src="https://readdy.ai/api/search-image?query=adventure%20experiences%20collage%20hot%20air%20balloon%20scuba%20diving%20cooking%20class%20trekking%20travel%20activities%20vibrant&width=1400&height=500&seq=exphero&orientation=landscape"
            alt="Experiences"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/40 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                Unforgettable Experiences
              </h1>
              <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto">
                Curated activities, tours, and adventures to make your trip extraordinary
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {/* Toggle: Experiences vs Bundles */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-full p-1 border border-stone-200 shadow-sm">
            <button
              onClick={() => setShowBundles(false)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                !showBundles 
                  ? 'bg-stone-900 text-white' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Individual Experiences
            </button>
            <button
              onClick={() => setShowBundles(true)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                showBundles 
                  ? 'bg-stone-900 text-white' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Bundle Packages
              <span className="px-1.5 py-0.5 bg-amber-400 text-stone-900 text-xs rounded-full">Save</span>
            </button>
          </div>
        </div>

        {!showBundles ? (
          <>
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 pb-4 mb-6">
              {experienceCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-stone-900 text-white'
                      : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'
                  }`}
                >
                  <i className={cat.icon} />
                  {cat.name}
                  <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                    activeCategory === cat.id ? 'bg-white/20' : 'bg-stone-100'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Filters & Sort Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                {/* Price Filter */}
                <select
                  value={activePriceRange || ''}
                  onChange={(e) => setActivePriceRange(e.target.value || null)}
                  className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-700 focus:outline-none focus:border-stone-900 cursor-pointer"
                >
                  <option value="">Price Range</option>
                  {experienceFilters.priceRanges.map((range) => (
                    <option key={range.id} value={range.id}>{range.label}</option>
                  ))}
                </select>

                {/* Duration Filter */}
                <select
                  value={activeDuration || ''}
                  onChange={(e) => setActiveDuration(e.target.value || null)}
                  className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-700 focus:outline-none focus:border-stone-900 cursor-pointer"
                >
                  <option value="">Duration</option>
                  {experienceFilters.durations.map((dur) => (
                    <option key={dur.id} value={dur.id}>{dur.label}</option>
                  ))}
                </select>

                {/* Rating Filter */}
                <select
                  value={activeRating || ''}
                  onChange={(e) => setActiveRating(e.target.value ? parseFloat(e.target.value) : null)}
                  className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-700 focus:outline-none focus:border-stone-900 cursor-pointer"
                >
                  <option value="">Rating</option>
                  {experienceFilters.ratings.map((rat) => (
                    <option key={rat.id} value={rat.value}>{rat.label}</option>
                  ))}
                </select>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-3 py-2 text-stone-500 hover:text-stone-900 text-sm font-medium transition-colors cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-700 focus:outline-none focus:border-stone-900 cursor-pointer"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>

                {/* View Toggle */}
                <div className="flex bg-white border border-stone-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 cursor-pointer ${viewMode === 'grid' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900'}`}
                  >
                    <i className="ri-grid-fill" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 cursor-pointer ${viewMode === 'list' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900'}`}
                  >
                    <i className="ri-list-unordered" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <p className="text-stone-500 text-sm mb-6">
              Showing {filteredExperiences.length} {filteredExperiences.length === 1 ? 'experience' : 'experiences'}
              {activeCategory !== 'all' && ` in ${experienceCategories.find(c => c.id === activeCategory)?.name}`}
            </p>

            {/* Experiences Grid/List */}
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
              : 'space-y-4'
            }>
              {filteredExperiences.map((exp) => (
                <ExperienceCard 
                  key={exp.id} 
                  experience={exp} 
                  viewMode={viewMode}
                  onClick={() => navigate(`/experience/${exp.id}`)}
                />
              ))}
            </div>

            {filteredExperiences.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-stone-100 rounded-full flex items-center justify-center">
                  <i className="ri-search-line text-stone-400 text-2xl" />
                </div>
                <h3 className="font-semibold text-stone-900 mb-1">No experiences found</h3>
                <p className="text-stone-500 text-sm">Try adjusting your filters</p>
              </div>
            )}
          </>
        ) : (
          /* Bundle Packages */
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-stone-900 mb-2">Bundle & Save</h2>
              <p className="text-stone-500">Combine stays with experiences for the ultimate getaway</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bundlePackages.map((bundle) => (
                <BundleCard 
                  key={bundle.id} 
                  bundle={bundle}
                  onClick={() => navigate(`/bundle/${bundle.id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

// Experience Card Component
function ExperienceCard({ 
  experience, 
  viewMode,
  onClick 
}: { 
  experience: Experience; 
  viewMode: 'grid' | 'list';
  onClick: () => void;
}) {
  if (viewMode === 'list') {
    return (
      <div 
        onClick={onClick}
        className="bg-white rounded-2xl border border-stone-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow flex"
      >
        <div className="w-48 h-40 shrink-0 relative">
          <img 
            src={experience.image} 
            alt={experience.title}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm text-stone-900 text-xs font-medium rounded-full">
            {experience.category}
          </span>
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-stone-900 line-clamp-1">{experience.title}</h3>
              <div className="flex items-center gap-1 shrink-0">
                <i className="ri-star-fill text-amber-400 text-sm" />
                <span className="text-sm font-medium text-stone-900">{experience.rating}</span>
                <span className="text-stone-400 text-xs">({experience.reviewCount})</span>
              </div>
            </div>
            <p className="text-stone-500 text-sm mt-1 flex items-center gap-1">
              <i className="ri-map-pin-line" />
              {experience.location}
            </p>
            <p className="text-stone-600 text-sm mt-2 line-clamp-2">{experience.description}</p>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3 text-sm text-stone-500">
              <span className="flex items-center gap-1">
                <i className="ri-time-line" />
                {experience.duration}
              </span>
              <span className="flex items-center gap-1">
                <i className="ri-group-line" />
                {experience.groupSize}
              </span>
            </div>
            <div className="text-right">
              {experience.originalPrice && (
                <span className="text-stone-400 text-sm line-through mr-2">
                  ₹{experience.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="font-bold text-stone-900">
                ₹{experience.price.toLocaleString('en-IN')}
              </span>
              <span className="text-stone-400 text-xs">/person</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl border border-stone-200 overflow-hidden cursor-pointer group hover:shadow-lg transition-all"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={experience.image} 
          alt={experience.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-stone-900 text-xs font-medium rounded-full">
          {experience.category}
        </span>
        
        {/* Price Badge */}
        <div className="absolute bottom-3 right-3 text-right">
          {experience.originalPrice && (
            <span className="block text-white/70 text-xs line-through">
              ₹{experience.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
          <span className="text-white font-bold text-lg">
            ₹{experience.price.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <button className="px-5 py-2.5 bg-white text-stone-900 rounded-full text-sm font-semibold hover:bg-stone-100 transition-colors">
            View Details
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-stone-900 line-clamp-2 text-sm leading-snug">
            {experience.title}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <i className="ri-star-fill text-amber-400 text-xs" />
            <span className="text-xs font-medium text-stone-900">{experience.rating}</span>
          </div>
        </div>

        <p className="text-stone-500 text-xs mb-3 flex items-center gap-1">
          <i className="ri-map-pin-line" />
          {experience.location}
        </p>

        <div className="flex items-center justify-between text-xs text-stone-500">
          <span className="flex items-center gap-1">
            <i className="ri-time-line" />
            {experience.duration}
          </span>
          <span className="flex items-center gap-1">
            <i className="ri-group-line" />
            {experience.groupSize.split(' ')[0]}
          </span>
        </div>

        {/* Host */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stone-100">
          <img 
            src={experience.host.avatar} 
            alt={experience.host.name}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-xs text-stone-600 truncate">{experience.host.name}</span>
          {experience.host.verified && (
            <i className="ri-verified-badge-fill text-emerald-500 text-xs ml-auto" />
          )}
        </div>
      </div>
    </div>
  );
}

// Bundle Card Component
function BundleCard({ 
  bundle, 
  onClick 
}: { 
  bundle: typeof bundlePackages[0];
  onClick: () => void;
}) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl border border-stone-200 overflow-hidden cursor-pointer group hover:shadow-lg transition-all"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={bundle.image} 
          alt={bundle.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Savings Badge */}
        <div className="absolute top-3 left-3 px-3 py-1.5 bg-amber-400 text-stone-900 text-xs font-bold rounded-full">
          Save ₹{bundle.savings.toLocaleString('en-IN')}
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-bold text-lg">{bundle.name}</h3>
          <p className="text-white/80 text-sm">{bundle.tagline}</p>
        </div>
      </div>

      <div className="p-4">
        <p className="text-stone-600 text-sm line-clamp-2 mb-3">{bundle.description}</p>

        {/* Inclusions Preview */}
        <div className="space-y-1.5 mb-4">
          {bundle.inclusions.slice(0, 3).map((inc, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-stone-500">
              <i className="ri-check-line text-emerald-500" />
              <span className="truncate">{inc}</span>
            </div>
          ))}
          {bundle.inclusions.length > 3 && (
            <p className="text-xs text-stone-400 pl-5">+{bundle.inclusions.length - 3} more</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <div>
            <span className="text-stone-400 text-sm line-through mr-2">
              ₹{bundle.originalPrice.toLocaleString('en-IN')}
            </span>
            <span className="font-bold text-stone-900 text-lg">
              ₹{bundle.totalPrice.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-stone-500">
            <i className="ri-star-fill text-amber-400" />
            <span className="font-medium text-stone-900">{bundle.rating}</span>
          </div>
        </div>

        <button className="w-full mt-4 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors cursor-pointer">
          View Bundle
        </button>
      </div>
    </div>
  );
}