import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { properties as mockProperties } from '@/mocks/properties';
import PropertyCard from '@/components/base/PropertyCard';
import { loadCMSData } from '@/pages/admin/cmsStore';

const sortOptions = ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Top Rated', 'Distance'];
const amenityOptions = ['Pool', 'WiFi', 'Parking', 'AC', 'Spa', 'Beach Access', 'Chef on Request', 'Fireplace', 'Gym', 'Jacuzzi'];

const LUXURY_THRESHOLD = 15000;
const AFFORDABLE_MAX = 10000;

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Read URL params on mount
  const urlType = searchParams.get('type'); // 'luxury' | 'affordable'
  const urlDayOuting = searchParams.get('dayOuting') === 'true';
  const urlDestination = searchParams.get('destination') || '';
  const urlAI = searchParams.get('ai') === 'true';

  // Legacy deep-link: /search?ai=true should land on the real planner.
  useEffect(() => {
    if (urlAI) navigate('/ai-planner', { replace: true });
  }, [urlAI, navigate]);

  const [view, setView] = useState<'list' | 'map'>('list');
  const [sort, setSort] = useState('Recommended');
  const [filterOpen, setFilterOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [dayOutingOnly, setDayOutingOnly] = useState(urlDayOuting);
  const [stayType, setStayType] = useState<'all' | 'luxury' | 'affordable'>(
    urlType === 'luxury' ? 'luxury' : urlType === 'affordable' ? 'affordable' : 'all'
  );
  const [destination, setDestination] = useState(urlDestination);

  // Apply luxury/affordable price range on mount
  useEffect(() => {
    if (urlType === 'luxury') {
      setMinPrice(LUXURY_THRESHOLD);
      setMaxPrice(50000);
    } else if (urlType === 'affordable') {
      setMinPrice(0);
      setMaxPrice(AFFORDABLE_MAX);
    }
  }, [urlType]);

  const enrichedProperties = useMemo(() => {
    const cmsData = loadCMSData();
    return cmsData.properties.map((cp) => {
      const mock = mockProperties.find((m) => m.id === cp.id);
      return {
        id: cp.id,
        name: cp.name,
        location: cp.location,
        city: cp.city,
        state: cp.state ?? mock?.state ?? '',
        distanceKm: mock?.distanceKm ?? 10,
        pricePerNight: cp.pricePerNight,
        originalPrice: cp.originalPrice,
        rating: cp.rating,
        reviewCount: cp.reviewCount,
        images: cp.images,
        tags: cp.tags,
        amenities: cp.amenities,
        type: (cp.type ?? mock?.type ?? 'villa') as typeof mockProperties[0]['type'],
        verified: cp.verified ?? false,
        superhost: cp.superhost ?? false,
        scarcity: cp.scarcity,
        description: cp.description,
        bedrooms: cp.bedrooms,
        bathrooms: cp.bathrooms,
        maxGuests: cp.maxGuests,
        hasDayPackage: cp.dayPackage?.enabled === true,
        dayPackagePrice: cp.dayPackage?.pricePerPerson,
        categoryRatings: cp.categoryRatings ?? mock?.categoryRatings ?? { cleanliness: 4.5, communication: 4.5, checkIn: 4.5, accuracy: 4.5, location: 4.5, value: 4.5 },
        host: cp.host ?? mock?.host ?? { name: '', avatar: '', joinedYear: 2020, superhost: false },
        addOns: cp.addOns ?? [],
      };
    });
  }, []);

  const toggleAmenity = (a: string) =>
    setSelectedAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);

  const setTypeFilter = (type: 'all' | 'luxury' | 'affordable') => {
    setStayType(type);
    if (type === 'luxury') { setMinPrice(LUXURY_THRESHOLD); setMaxPrice(50000); }
    else if (type === 'affordable') { setMinPrice(0); setMaxPrice(AFFORDABLE_MAX); }
    else { setMinPrice(0); setMaxPrice(50000); }
  };

  const filtered = useMemo(() => {
    let list = [...enrichedProperties];

    if (destination) {
      const d = destination.toLowerCase();
      list = list.filter((p) =>
        p.city.toLowerCase().includes(d) ||
        p.state.toLowerCase().includes(d) ||
        p.location.toLowerCase().includes(d) ||
        p.name.toLowerCase().includes(d)
      );
    }

    if (stayType === 'luxury') list = list.filter((p) => p.pricePerNight >= LUXURY_THRESHOLD);
    else if (stayType === 'affordable') list = list.filter((p) => p.pricePerNight <= AFFORDABLE_MAX);
    else list = list.filter((p) => p.pricePerNight >= minPrice && p.pricePerNight <= maxPrice);

    if (selectedAmenities.length > 0)
      list = list.filter((p) => selectedAmenities.every((a) => p.amenities.includes(a)));
    if (minRating > 0) list = list.filter((p) => p.rating >= minRating);
    if (dayOutingOnly) list = list.filter((p) => p.hasDayPackage);

    if (sort === 'Price: Low to High') list.sort((a, b) => a.pricePerNight - b.pricePerNight);
    else if (sort === 'Price: High to Low') list.sort((a, b) => b.pricePerNight - a.pricePerNight);
    else if (sort === 'Top Rated') list.sort((a, b) => b.rating - a.rating);
    else if (sort === 'Distance') list.sort((a, b) => a.distanceKm - b.distanceKm);
    return list;
  }, [enrichedProperties, minPrice, maxPrice, selectedAmenities, stayType, sort, minRating, dayOutingOnly, destination]);

  const activeFilterCount =
    selectedAmenities.length +
    (minRating > 0 ? 1 : 0) +
    (dayOutingOnly ? 1 : 0) +
    (stayType !== 'all' ? 1 : 0);

  const clearAll = () => {
    setSelectedAmenities([]);
    setMinPrice(0);
    setMaxPrice(50000);
    setMinRating(0);
    setDayOutingOnly(false);
    setStayType('all');
    setDestination('');
  };

  const bannerInfo = dayOutingOnly
    ? { icon: 'ri-sun-line', color: 'from-amber-50 to-orange-50 border-amber-100', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', title: 'Showing Day Outing Packages', sub: `${filtered.length} propert${filtered.length !== 1 ? 'ies offer' : 'y offers'} day visits — no overnight stay required` }
    : stayType === 'luxury'
    ? { icon: 'ri-vip-crown-line', color: 'from-stone-50 to-stone-100 border-stone-200', iconBg: 'bg-stone-200', iconColor: 'text-stone-700', title: 'Luxury Stays', sub: `Properties from ₹${LUXURY_THRESHOLD.toLocaleString('en-IN')}/night` }
    : stayType === 'affordable'
    ? { icon: 'ri-price-tag-3-line', color: 'from-emerald-50 to-teal-50 border-emerald-100', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', title: 'Affordable Stays', sub: `Budget-friendly stays under ₹${AFFORDABLE_MAX.toLocaleString('en-IN')}/night` }
    : destination
    ? { icon: 'ri-map-pin-line', color: 'from-stone-50 to-stone-100 border-stone-200', iconBg: 'bg-stone-200', iconColor: 'text-stone-700', title: `Showing results for "${destination}"`, sub: `${filtered.length} propert${filtered.length !== 1 ? 'ies' : 'y'} found` }
    : null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Top bar */}
      <div className="pt-20 sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-14 gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/')} className="w-8 h-8 flex items-center justify-center hover:bg-stone-100 rounded-full cursor-pointer">
                <i className="ri-arrow-left-line text-stone-700" />
              </button>
              <span className="font-semibold text-stone-900 text-sm whitespace-nowrap">
                {filtered.length} stays found
              </span>
            </div>

            {/* Stay type pills */}
            <div className="hidden md:flex items-center gap-2 flex-wrap">
              {([
                { key: 'all', label: 'All Stays', icon: 'ri-home-line' },
                { key: 'luxury', label: 'Luxury Stays', icon: 'ri-vip-crown-line' },
                { key: 'affordable', label: 'Affordable Stays', icon: 'ri-price-tag-3-line' },
                { key: 'dayouting', label: 'Day Outing', icon: 'ri-sun-line' },
              ] as const).map((t) => {
                const isActive = t.key === 'dayouting' ? dayOutingOnly : stayType === t.key && !dayOutingOnly;
                return (
                  <button
                    key={t.key}
                    onClick={() => {
                      if (t.key === 'dayouting') {
                        setDayOutingOnly(!dayOutingOnly);
                        if (!dayOutingOnly) setStayType('all');
                      } else {
                        setDayOutingOnly(false);
                        setTypeFilter(t.key as 'all' | 'luxury' | 'affordable');
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      isActive
                        ? t.key === 'dayouting'
                          ? 'bg-amber-500 text-white'
                          : t.key === 'luxury'
                          ? 'bg-stone-900 text-white'
                          : t.key === 'affordable'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-900 text-white'
                        : 'border border-stone-200 text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    <i className={`${t.icon} text-xs`} />
                    {t.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="hidden sm:block text-xs font-medium border border-stone-200 rounded-full px-3 py-1.5 outline-none cursor-pointer bg-white"
              >
                {sortOptions.map((s) => <option key={s}>{s}</option>)}
              </select>

              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${filterOpen ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-200 text-stone-700 hover:border-stone-400'}`}
              >
                <i className="ri-equalizer-line" />
                Filters {activeFilterCount > 0 && <span className="bg-amber-400 text-stone-900 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">{activeFilterCount}</span>}
              </button>

              <div className="flex border border-stone-200 rounded-full overflow-hidden">
                <button onClick={() => setView('list')} className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${view === 'list' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-50'}`}>
                  <i className="ri-list-unordered mr-1" />List
                </button>
                <button onClick={() => setView('map')} className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${view === 'map' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-50'}`}>
                  <i className="ri-map-2-line mr-1" />Map
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter drawer */}
        {filterOpen && (
          <div className="bg-white border-t border-stone-100 py-5 px-4 md:px-8 max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-xs font-semibold text-stone-700 mb-3 uppercase tracking-wider">Budget / Night</p>
                <div className="flex items-center gap-3">
                  <input type="number" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} className="w-full border border-stone-200 rounded-lg px-3 py-1.5 text-sm outline-none" placeholder="Min ₹" />
                  <span className="text-stone-400">–</span>
                  <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full border border-stone-200 rounded-lg px-3 py-1.5 text-sm outline-none" placeholder="Max ₹" />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-stone-700 mb-3 uppercase tracking-wider">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {amenityOptions.map((a) => (
                    <button key={a} onClick={() => toggleAmenity(a)} className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${selectedAmenities.includes(a) ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-200 text-stone-600 hover:border-stone-400'}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-stone-700 mb-3 uppercase tracking-wider">Min Rating</p>
                <div className="flex gap-2 flex-wrap">
                  {[0, 4, 4.5, 4.8].map((r) => (
                    <button key={r} onClick={() => setMinRating(r)} className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer whitespace-nowrap transition-colors ${minRating === r ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-200 text-stone-600 hover:border-stone-400'}`}>
                      {r === 0 ? 'Any' : `${r}+`}
                    </button>
                  ))}
                </div>
                <button onClick={clearAll} className="mt-3 text-xs text-stone-500 hover:text-stone-800 cursor-pointer">
                  Clear all filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active filter banner */}
      {bannerInfo && (
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6">
          <div className={`flex items-center justify-between bg-gradient-to-r ${bannerInfo.color} border rounded-2xl px-5 py-4`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 flex items-center justify-center ${bannerInfo.iconBg} rounded-xl shrink-0`}>
                <i className={`${bannerInfo.icon} ${bannerInfo.iconColor} text-lg`} />
              </div>
              <div>
                <p className="font-semibold text-stone-900 text-sm">{bannerInfo.title}</p>
                <p className="text-stone-500 text-xs mt-0.5">{bannerInfo.sub}</p>
              </div>
            </div>
            <button onClick={clearAll} className="text-xs text-stone-500 hover:text-stone-800 cursor-pointer flex items-center gap-1 whitespace-nowrap">
              <i className="ri-close-line" /> Clear
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {view === 'list' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.length > 0 ? (
              filtered.map((p) => <PropertyCard key={p.id} property={p} variant="horizontal" />)
            ) : (
              <div className="col-span-2 text-center py-20">
                <i className="ri-search-line text-4xl text-stone-300 block mb-3" />
                <p className="text-stone-700 font-semibold text-sm mb-1">No properties match your filters</p>
                <p className="text-stone-400 text-xs mb-4">Try adjusting or clearing your filters</p>
                <button onClick={clearAll} className="mt-2 px-6 py-2 bg-stone-900 text-white rounded-full text-sm font-medium cursor-pointer whitespace-nowrap">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden h-[600px] relative bg-stone-100">
            <iframe
              title="Triprodeo Map"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15581895.40285226!2d80.09882!3d20.5937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
            />
            <div className="absolute top-4 left-4 right-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[180px] overflow-y-auto">
              {filtered.slice(0, 3).map((p) => (
                <div key={p.id} onClick={() => navigate(`/property/${p.id}`)} className="bg-white rounded-xl p-3 flex gap-3 cursor-pointer hover:shadow-md transition-shadow border border-stone-100">
                  <img src={p.images[0]} alt={p.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-stone-900 text-xs truncate">{p.name}</p>
                    <p className="text-stone-500 text-xs truncate">{p.city}</p>
                    <p className="text-stone-900 font-bold text-xs mt-1">&#x20B9;{p.pricePerNight.toLocaleString('en-IN')}<span className="text-stone-400 font-normal">/night</span></p>
                    {p.hasDayPackage && <span className="text-xs text-amber-600 font-medium flex items-center gap-0.5"><i className="ri-sun-line text-xs" /> Day Package</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
