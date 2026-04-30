import { useNavigate } from 'react-router-dom';
import { collections } from '@/mocks/properties';

export default function CollectionsSection() {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold mb-2">Handpicked for you</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Curated Collections
            </h2>
          </div>
          <button
            onClick={() => navigate('/search')}
            className="hidden sm:flex items-center gap-1 text-stone-600 text-sm font-medium hover:text-stone-900 transition-colors"
          >
            View All <i className="ri-arrow-right-line" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {collections.map((col) => (
            <div
              key={col.id}
              onClick={() => navigate(`/search?collection=${col.id}`)}
              className="relative rounded-2xl overflow-hidden cursor-pointer group"
              style={{ aspectRatio: '4/5' }}
            >
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${col.accentColor} to-transparent`} />
              <div className="absolute inset-0 p-3 sm:p-6 flex flex-col justify-end">
                <span className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1 hidden sm:block">{col.tag}</span>
                <h3 className="text-white text-base sm:text-xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{col.title}</h3>
                <p className="text-white/70 text-xs sm:text-sm">{col.count} properties</p>
              </div>
              <div className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="ri-arrow-right-line text-white text-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
