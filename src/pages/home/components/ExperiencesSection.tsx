import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { loadCMSData } from '@/pages/admin/cmsStore';
import { properties as mockProperties } from '@/mocks/properties';

export default function ExperiencesSection() {
  const dayOutingProperties = useMemo(() => {
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
        description: p.dayPackage!.description || '',
        rating: p.rating,
      }));
    }

    // Fallback to mock
    return mockProperties
      .filter((p) => p.hasDayPackage)
      .map((p) => ({
        id: p.id,
        name: p.name,
        location: p.location,
        image: p.images[0],
        price: p.dayPackagePrice || 0,
        timing: 'Full Day',
        meals: [],
        activities: [],
        description: '',
        rating: p.rating,
      }));
  }, []);

  if (dayOutingProperties.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-[#FDFAF6]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-amber-600 text-xs uppercase tracking-widest font-semibold mb-2 flex items-center gap-2">
              <i className="ri-sun-line" /> Just For The Day
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-stone-900 mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Day Outing
            </h2>
            <p className="text-stone-500 text-sm max-w-md">
              No overnight stay needed — visit stunning properties for a day of leisure, meals, and activities.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full whitespace-nowrap">
              {dayOutingProperties.length} {dayOutingProperties.length === 1 ? 'Property' : 'Properties'} Available
            </span>
            <Link
              to="/search?dayOuting=true"
              className="flex items-center gap-1.5 px-5 py-2 bg-stone-900 text-white rounded-full text-sm font-semibold hover:bg-stone-800 transition-colors whitespace-nowrap"
            >
              View All <i className="ri-arrow-right-line" />
            </Link>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {dayOutingProperties.map((prop) => (
            <Link
              key={prop.id}
              to={`/property/${prop.id}`}
              className="group bg-white rounded-2xl overflow-hidden border border-stone-100 hover:border-amber-200 transition-all block"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={prop.image}
                  alt={prop.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Day Outing badge */}
                <span className="absolute top-3 left-3 flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                  <i className="ri-sun-line text-xs" /> Day Outing
                </span>

                {/* Price */}
                <span className="absolute top-3 right-3 bg-white/90 text-stone-900 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                  &#x20B9;{prop.price.toLocaleString('en-IN')}/person
                </span>

                {/* Timing pill */}
                <span className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full whitespace-nowrap flex items-center gap-1">
                  <i className="ri-time-line text-xs" /> {prop.timing}
                </span>

                {/* Hover CTA */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-5 py-2 bg-white rounded-full text-stone-900 text-xs font-semibold">
                    View Package
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-stone-900 text-sm leading-snug mb-1 group-hover:text-amber-700 transition-colors">
                  {prop.name}
                </h3>
                <p className="text-stone-500 text-xs flex items-center gap-1 mb-2">
                  <i className="ri-map-pin-line" /> {prop.location}
                </p>

                {/* Meals */}
                {prop.meals.length > 0 && (
                  <div className="flex items-center gap-1 mb-2 flex-wrap">
                    <i className="ri-restaurant-2-line text-stone-400 text-xs" />
                    <span className="text-stone-400 text-xs">
                      {prop.meals.slice(0, 2).join(', ')}
                      {prop.meals.length > 2 ? ` +${prop.meals.length - 2} more` : ''}
                    </span>
                  </div>
                )}

                {/* Activities */}
                {prop.activities.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {prop.activities.slice(0, 3).map((act, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full whitespace-nowrap"
                      >
                        {act}
                      </span>
                    ))}
                    {prop.activities.length > 3 && (
                      <span className="px-2 py-0.5 bg-stone-100 text-stone-500 text-xs rounded-full whitespace-nowrap">
                        +{prop.activities.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Rating */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                  <div className="flex items-center gap-1">
                    <i className="ri-star-fill text-amber-400 text-xs" />
                    <span className="text-xs text-stone-600 font-medium">{prop.rating}</span>
                  </div>
                  <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                    Book Day Outing <i className="ri-arrow-right-line" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
