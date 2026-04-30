import { useNavigate } from 'react-router-dom';
import { properties } from '@/mocks/properties';
import PropertyCard from '@/components/base/PropertyCard';

export default function TrendingSection() {
  const navigate = useNavigate();
  const trending = properties.slice(0, 4);

  return (
    <section className="py-16 md:py-24" style={{ background: '#FAF8F5' }}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold mb-2">Popular Right Now</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Trending Near You
            </h2>
            <p className="text-stone-500 text-sm mt-1">Based on recent searches &amp; bookings</p>
          </div>
          <button
            onClick={() => navigate('/search')}
            className="hidden sm:flex items-center gap-1 text-stone-600 text-sm font-medium hover:text-stone-900 transition-colors"
          >
            See All <i className="ri-arrow-right-line" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {trending.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:hidden">
          <button
            onClick={() => navigate('/search')}
            className="flex items-center gap-2 px-6 py-2.5 border border-stone-300 rounded-full text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            See All Properties <i className="ri-arrow-right-line" />
          </button>
        </div>
      </div>
    </section>
  );
}
