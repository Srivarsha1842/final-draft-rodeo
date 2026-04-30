import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { loadCMSData } from '@/pages/admin/cmsStore';
import { properties as mockProperties } from '@/mocks/properties';
import DayPackageEnquiryModal from '@/pages/property/components/DayPackageEnquiryModal';
import { CompareModal, CompareFloatingBar } from '@/pages/day-outing/components/DayOutingComparePanel';
import type { CompareProperty } from '@/pages/day-outing/components/DayOutingComparePanel';

type SortOption = 'default' | 'price_asc' | 'price_desc' | 'rating_desc';

export default function DayOutingPage() {
  const navigate = useNavigate();

  // Enquiry modal
  const [enquiryPropertyId, setEnquiryPropertyId] = useState<string | null>(null);
  const [enquiryPropertyName, setEnquiryPropertyName] = useState('');
  const [enquiryPrice, setEnquiryPrice] = useState(0);

  // Compare state
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Filter/sort state
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(0);
  const [filterMinRating, setFilterMinRating] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  const allDayOutingProperties = useMemo((): CompareProperty[] => {
    const cmsData = loadCMSData();
    const cmsProps = cmsData.properties.filter((p) => p.dayPackage?.enabled);
    if (cmsProps.length > 0) {
      return cmsProps.map((p) => ({
        id: p.id,
        name: p.name,
        location: p.location,
        image: p.dayPackage!.image || p.images[0],
        price: p.dayPackage!.pricePerPerson,
        timing: p.dayPackage!.timing || 'Full Day',
        meals: p.dayPackage!.meals || [],
        activities: p.dayPackage!.activities || [],
        facilities: p.dayPackage!.facilities || [],
        description: p.dayPackage!.description || '',
        rating: p.rating,
        reviewCount: p.reviewCount,
      }));
    }
    return mockProperties.filter((p) => p.hasDayPackage).map((p) => ({
      id: p.id,
      name: p.name,
      location: p.location,
      image: p.images[0],
      price: p.dayPackagePrice || 0,
      timing: 'Full Day',
      meals: [] as string[],
      activities: [] as string[],
      facilities: [] as string[],
      description: p.description,
      rating: p.rating,
      reviewCount: p.reviewCount,
    }));
  }, []);

  const uniqueLocations = useMemo(() => {
    const locs = allDayOutingProperties.map((p) => {
      const parts = p.location.split(',');
      return parts[parts.length - 1].trim();
    });
    return Array.from(new Set(locs)).sort();
  }, [allDayOutingProperties]);

  const maxPriceInData = useMemo(() => {
    if (allDayOutingProperties.length === 0) return 10000;
    return Math.max(...allDayOutingProperties.map((p) => p.price));
  }, [allDayOutingProperties]);

  const dayOutingProperties = useMemo(() => {
    let result = [...allDayOutingProperties];
    if (filterLocation) {
      result = result.filter((p) => p.location.toLowerCase().includes(filterLocation.toLowerCase()));
    }
    if (filterMaxPrice > 0) {
      result = result.filter((p) => p.price <= filterMaxPrice);
    }
    if (filterMinRating > 0) {
      result = result.filter((p) => p.rating >= filterMinRating);
    }
    switch (sortBy) {
      case 'price_asc': result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating_desc': result.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }
    return result;
  }, [allDayOutingProperties, filterLocation, filterMaxPrice, filterMinRating, sortBy]);

  const activeFilterCount = [
    filterLocation ? 1 : 0,
    filterMaxPrice > 0 ? 1 : 0,
    filterMinRating > 0 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const clearFilters = () => {
    setFilterLocation('');
    setFilterMaxPrice(0);
    setFilterMinRating(0);
    setSortBy('default');
  };

  const openEnquiry = (id: string, name: string, price: number) => {
    setEnquiryPropertyId(id);
    setEnquiryPropertyName(name);
    setEnquiryPrice(price);
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const selectedCompareItems = allDayOutingProperties.filter((p) => compareIds.includes(p.id));

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[480px] md:h-[560px] flex items-center justify-center overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=luxury%20resort%20pool%20day%20outing%20aerial%20view%20guests%20relaxing%20by%20infinity%20pool%20with%20ocean%20view%20sunshine%20tropical%20paradise%20india%20vibrant%20colors%20happy%20people&width=1920&height=800&seq=dayouting_hero&orientation=landscape"
          alt="Day Outing"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        <div className="relative z-10 text-center px-4 w-full max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-400 text-stone-900 text-xs font-bold rounded-full mb-5 uppercase tracking-wider">
            <i className="ri-sun-line" /> Day Outing
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Just Come For<br />The Day
          </h1>
          <p className="text-white/80 text-base md:text-lg mb-8 max-w-xl mx-auto">
            Experience stunning luxury properties, pools, meals &amp; activities — no overnight stay needed.
          </p>
          <div className="flex items-center justify-center gap-6 text-white/70 text-sm">
            <span className="flex items-center gap-1.5"><i className="ri-restaurant-2-line text-amber-400" /> Meals Included</span>
            <span className="flex items-center gap-1.5"><i className="ri-drop-line text-amber-400" /> Pool Access</span>
            <span className="flex items-center gap-1.5"><i className="ri-time-line text-amber-400" /> Full Day Experience</span>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-stone-900 text-white py-5">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {[
            { icon: 'ri-building-line', value: `${dayOutingProperties.length}+`, label: 'Properties Available' },
            { icon: 'ri-group-line', value: '500+', label: 'Day Guests Monthly' },
            { icon: 'ri-star-fill', value: '4.8', label: 'Average Rating' },
            { icon: 'ri-time-line', value: '6–10 hrs', label: 'Typical Duration' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-amber-400/20 rounded-xl shrink-0">
                <i className={`${s.icon} text-amber-400 text-lg`} />
              </div>
              <div>
                <p className="font-bold text-white text-lg leading-none">{s.value}</p>
                <p className="text-stone-400 text-xs mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section className="py-14 bg-[#FDFAF6]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold mb-2">Simple Process</p>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              How Day Outing Works
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: 'ri-search-line', step: '01', title: 'Browse Properties', desc: 'Explore properties offering day packages with pool, meals & activities.' },
              { icon: 'ri-bar-chart-grouped-line', step: '02', title: 'Compare & Shortlist', desc: 'Use Compare to see properties side by side and pick your favourite.' },
              { icon: 'ri-calendar-check-line', step: '03', title: 'Pick Date & Time', desc: 'Choose your date, time slot, and group size, then send an enquiry.' },
              { icon: 'ri-sun-line', step: '04', title: 'Enjoy Your Day', desc: 'Arrive, relax, eat, swim, and make memories. No overnight needed.' },
            ].map((s) => (
              <div key={s.step} className="bg-white rounded-2xl p-6 border border-stone-100 text-center">
                <div className="w-12 h-12 flex items-center justify-center bg-amber-50 rounded-2xl mx-auto mb-4">
                  <i className={`${s.icon} text-amber-600 text-xl`} />
                </div>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">{s.step}</span>
                <h3 className="font-semibold text-stone-900 text-sm mt-1 mb-2">{s.title}</h3>
                <p className="text-stone-500 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Properties */}
      <section className="py-14 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          {/* Header + controls */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold mb-2">Available Now</p>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                Day Outing Properties
              </h2>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none pl-3 pr-8 py-2 border border-stone-200 rounded-full text-xs text-stone-700 font-medium bg-white cursor-pointer focus:outline-none focus:border-amber-400 transition-colors"
                >
                  <option value="default">Sort: Default</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating_desc">Top Rated</option>
                </select>
                <i className="ri-arrow-down-s-line absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs pointer-events-none" />
              </div>
              <button
                onClick={() => setShowFilters((v) => !v)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${showFilters || activeFilterCount > 0 ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400'}`}
              >
                <i className="ri-filter-3-line" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 flex items-center justify-center bg-white text-amber-600 text-xs font-bold rounded-full">{activeFilterCount}</span>
                )}
              </button>
              {compareIds.length > 0 && (
                <button
                  onClick={() => setShowCompareModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-full text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <i className="ri-bar-chart-grouped-line" />
                  Compare ({compareIds.length})
                </button>
              )}
              <span className="px-3 py-1.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                {dayOutingProperties.length} Results
              </span>
            </div>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="mb-8 p-5 bg-[#FDFAF6] border border-amber-100 rounded-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase tracking-widest mb-2">Location</label>
                  <div className="relative">
                    <select
                      value={filterLocation}
                      onChange={(e) => setFilterLocation(e.target.value)}
                      className="w-full appearance-none pl-3 pr-8 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-700 bg-white cursor-pointer focus:outline-none focus:border-amber-400 transition-colors"
                    >
                      <option value="">All Locations</option>
                      {uniqueLocations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                    <i className="ri-map-pin-line absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase tracking-widest mb-2">
                    Max Price / Person
                    {filterMaxPrice > 0 && (
                      <span className="ml-2 text-amber-600 normal-case font-bold">
                        &#x20B9;{filterMaxPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={maxPriceInData}
                    step={500}
                    value={filterMaxPrice === 0 ? maxPriceInData : filterMaxPrice}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFilterMaxPrice(val === maxPriceInData ? 0 : val);
                    }}
                    className="w-full h-1.5 bg-stone-200 rounded-full appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-xs text-stone-400 mt-1">
                    <span>&#x20B9;0</span>
                    <span>&#x20B9;{maxPriceInData.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase tracking-widest mb-2">Minimum Rating</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[0, 3.5, 4.0, 4.5, 4.8].map((r) => (
                      <button
                        key={r}
                        onClick={() => setFilterMinRating(r === filterMinRating ? 0 : r)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${filterMinRating === r && r > 0 ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-stone-600 border-stone-200 hover:border-amber-300'}`}
                      >
                        {r === 0 ? 'Any' : `${r}+`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {activeFilterCount > 0 && (
                <div className="mt-4 pt-4 border-t border-stone-200 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <i className="ri-close-circle-line" /> Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Active filter chips */}
          {activeFilterCount > 0 && !showFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs text-stone-400 font-medium">Active filters:</span>
              {filterLocation && (
                <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                  <i className="ri-map-pin-line text-xs" />{filterLocation}
                  <button onClick={() => setFilterLocation('')} className="ml-1 cursor-pointer hover:text-amber-900"><i className="ri-close-line text-xs" /></button>
                </span>
              )}
              {filterMaxPrice > 0 && (
                <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                  <i className="ri-price-tag-3-line text-xs" />Under &#x20B9;{filterMaxPrice.toLocaleString('en-IN')}
                  <button onClick={() => setFilterMaxPrice(0)} className="ml-1 cursor-pointer hover:text-amber-900"><i className="ri-close-line text-xs" /></button>
                </span>
              )}
              {filterMinRating > 0 && (
                <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                  <i className="ri-star-fill text-xs" />{filterMinRating}+ Stars
                  <button onClick={() => setFilterMinRating(0)} className="ml-1 cursor-pointer hover:text-amber-900"><i className="ri-close-line text-xs" /></button>
                </span>
              )}
              <button onClick={clearFilters} className="text-xs text-stone-400 hover:text-stone-600 underline cursor-pointer">Clear all</button>
            </div>
          )}

          {/* Compare hint */}
          {dayOutingProperties.length > 1 && compareIds.length === 0 && (
            <div className="flex items-center gap-2 mb-5 px-4 py-2.5 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700 w-fit">
              <i className="ri-bar-chart-grouped-line text-amber-500" />
              <span>Tip: Use the <strong>Compare</strong> button on each card to compare up to 3 properties side by side.</span>
            </div>
          )}

          {dayOutingProperties.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-stone-200 rounded-2xl">
              <i className="ri-sun-line text-stone-300 text-4xl block mb-3" />
              {activeFilterCount > 0 ? (
                <>
                  <p className="text-stone-600 font-semibold text-sm mb-1">No properties match your filters</p>
                  <p className="text-stone-400 text-xs mb-4">Try adjusting your location, price range, or rating filters.</p>
                  <button onClick={clearFilters} className="px-5 py-2 bg-amber-500 text-white text-xs font-bold rounded-full hover:bg-amber-400 transition-colors cursor-pointer whitespace-nowrap">
                    Clear Filters
                  </button>
                </>
              ) : (
                <>
                  <p className="text-stone-600 font-semibold text-sm mb-1">No day outing packages yet</p>
                  <p className="text-stone-400 text-xs">Check back soon — hosts are adding day packages.</p>
                </>
              )}
            </div>
          ) : (
            <div data-day-outing-grid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dayOutingProperties.map((prop) => {
                const isCompared = compareIds.includes(prop.id);
                const canAddCompare = compareIds.length < 3 || isCompared;

                return (
                  <div
                    key={prop.id}
                    className={`bg-white rounded-2xl border overflow-hidden group transition-all ${
                      isCompared
                        ? 'border-amber-400 ring-2 ring-amber-200'
                        : 'border-stone-100 hover:border-amber-200'
                    }`}
                  >
                    {/* Image */}
                    <div
                      className="relative h-56 overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/property/${prop.id}?tab=daypackage`)}
                    >
                      <img
                        src={prop.image}
                        alt={prop.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        <i className="ri-sun-line text-xs" /> Day Outing
                      </span>
                      <span className="absolute top-3 right-3 bg-white/90 text-stone-900 text-xs font-bold px-2.5 py-1 rounded-full">
                        &#x20B9;{prop.price.toLocaleString('en-IN')}/person
                      </span>
                      <span className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                        <i className="ri-time-line text-xs" /> {prop.timing}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <h3
                        className="font-bold text-stone-900 text-base mb-1 group-hover:text-amber-700 transition-colors cursor-pointer"
                        onClick={() => navigate(`/property/${prop.id}?tab=daypackage`)}
                      >
                        {prop.name}
                      </h3>
                      <p className="text-stone-400 text-xs flex items-center gap-1 mb-3">
                        <i className="ri-map-pin-line" /> {prop.location}
                      </p>

                      {prop.description && (
                        <p className="text-stone-500 text-xs leading-relaxed mb-3 line-clamp-2">{prop.description}</p>
                      )}

                      {prop.meals.length > 0 && (
                        <div className="flex items-center gap-1.5 mb-2">
                          <i className="ri-restaurant-2-line text-amber-500 text-xs shrink-0" />
                          <span className="text-stone-500 text-xs">
                            {prop.meals.slice(0, 2).join(', ')}{prop.meals.length > 2 ? ` +${prop.meals.length - 2}` : ''}
                          </span>
                        </div>
                      )}

                      {prop.activities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {prop.activities.slice(0, 4).map((a, i) => (
                            <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full">{a}</span>
                          ))}
                          {prop.activities.length > 4 && (
                            <span className="px-2 py-0.5 bg-stone-100 text-stone-500 text-xs rounded-full">+{prop.activities.length - 4}</span>
                          )}
                        </div>
                      )}

                      {/* Rating + CTA row */}
                      <div className="flex items-center justify-between pt-3 border-t border-stone-100 mb-3">
                        <div className="flex items-center gap-1">
                          <i className="ri-star-fill text-amber-400 text-xs" />
                          <span className="text-xs text-stone-700 font-semibold">{prop.rating}</span>
                          <span className="text-xs text-stone-400">({prop.reviewCount})</span>
                        </div>
                        <Link
                          to={`/property/${prop.id}?tab=daypackage`}
                          className="px-3 py-1.5 border border-stone-200 text-stone-600 text-xs font-medium rounded-full hover:bg-stone-50 transition-colors whitespace-nowrap"
                        >
                          View Details
                        </Link>
                      </div>

                      {/* Primary CTA */}
                      <button
                        onClick={() => openEnquiry(prop.id, prop.name, prop.price)}
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 mb-2"
                      >
                        <i className="ri-sun-line" /> Book Day Outing
                      </button>

                      {/* Compare toggle */}
                      <button
                        onClick={() => canAddCompare && toggleCompare(prop.id)}
                        className={`w-full py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 ${
                          isCompared
                            ? 'bg-stone-900 text-white border-stone-900'
                            : canAddCompare
                            ? 'bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:text-stone-800'
                            : 'bg-stone-50 text-stone-300 border-stone-100 cursor-not-allowed'
                        }`}
                      >
                        <i className={`ri-bar-chart-grouped-line ${isCompared ? 'text-amber-300' : ''}`} />
                        {isCompared ? 'Added to Compare' : compareIds.length >= 3 ? 'Compare limit reached' : 'Compare'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-stone-900">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <i className="ri-sun-line text-amber-400 text-4xl block mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Are You a Property Owner?
          </h2>
          <p className="text-stone-400 text-sm mb-6">
            Unlock extra revenue by offering day outing packages. Let guests visit for a day — pool, meals, activities included.
          </p>
          <Link
            to="/resort-owner-portal"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-stone-900 rounded-full text-sm font-bold hover:bg-amber-300 transition-colors"
          >
            <i className="ri-building-line" /> Add Day Package to Your Property
          </Link>
        </div>
      </section>

      <Footer />

      {/* Enquiry modal */}
      {enquiryPropertyId && (
        <DayPackageEnquiryModal
          propertyId={enquiryPropertyId}
          propertyName={enquiryPropertyName}
          pricePerPerson={enquiryPrice}
          timing="Full Day"
          onClose={() => setEnquiryPropertyId(null)}
        />
      )}

      {/* Compare floating bar */}
      <CompareFloatingBar
        selectedItems={selectedCompareItems}
        onRemove={(id) => toggleCompare(id)}
        onClearAll={() => setCompareIds([])}
        onOpenCompare={() => setShowCompareModal(true)}
      />

      {/* Compare modal */}
      {showCompareModal && selectedCompareItems.length >= 2 && (
        <CompareModal
          items={selectedCompareItems}
          onClose={() => setShowCompareModal(false)}
          onRemove={(id) => {
            toggleCompare(id);
            if (selectedCompareItems.length <= 2) setShowCompareModal(false);
          }}
          onBook={openEnquiry}
        />
      )}
    </div>
  );
}
