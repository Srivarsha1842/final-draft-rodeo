import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { properties } from '@/mocks/properties';
import PropertyCard from '@/components/base/PropertyCard';

const filters = ['All', 'Villas', 'Resorts', 'Boutique'];

export default function FeaturedProperties() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = properties.filter((p) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Villas') return p.type === 'villa';
    if (activeFilter === 'Resorts') return p.type === 'resort';
    if (activeFilter === 'Boutique') return p.type === 'boutique';
    return true;
  });

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold mb-2">Editor&apos;s Picks</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Featured Luxury Stays
            </h2>
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activeFilter === f
                    ? 'bg-stone-900 text-white'
                    : 'border border-stone-200 text-stone-600 hover:border-stone-400'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {filtered.map((property, idx) => (
            <div
              key={property.id}
              className={idx === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate('/search')}
            className="flex items-center gap-2 px-8 py-3 border border-stone-900 rounded-full text-sm font-semibold text-stone-900 hover:bg-stone-900 hover:text-white transition-colors whitespace-nowrap"
          >
            Explore All Properties <i className="ri-arrow-right-line" />
          </button>
        </div>
      </div>
    </section>
  );
}
