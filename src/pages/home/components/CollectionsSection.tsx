import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPropertiesByTag } from '@/services/propertiesApi';
import { Property } from '@/types/property';

const curatedTags = [
  { id: 'corporate-getaways', title: 'Corporate Getaways', tag: 'Corporate Getaways', accentColor: 'from-slate-700/75 to-slate-950/80' },
  { id: 'school-trips', title: 'School Trips', tag: 'School Trips', accentColor: 'from-sky-600/75 to-sky-950/80' },
  { id: 'private-stays', title: 'Private Stays', tag: 'Private Stays', accentColor: 'from-emerald-600/75 to-emerald-950/80' },
  { id: 'pet-friendly', title: 'Pet Friendly', tag: 'Pet Friendly', accentColor: 'from-amber-600/75 to-stone-950/80' },
  { id: 'beach-front', title: 'Beach Front', tag: 'Beach Front', accentColor: 'from-cyan-600/75 to-cyan-950/80' },
];

export default function CollectionsSection() {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Array<(typeof curatedTags)[number] & { count: number; image: string }>>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      curatedTags.map(async (tag) => {
        const properties = await fetchPropertiesByTag(tag.tag, 6).catch((): Property[] => []);
        return {
          ...tag,
          count: properties.length,
          image: properties[0]?.images[0] ?? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=1000&fit=crop',
        };
      })
    ).then((items) => {
      if (!cancelled) setCollections(items);
    });
    const id = window.setInterval(() => {
      setCollections((items) => (items.length > 1 ? [...items.slice(1), items[0]] : items));
    }, 3000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

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
            onClick={() => navigate('/tags')}
            className="hidden sm:flex items-center gap-1 text-stone-600 text-sm font-medium hover:text-stone-900 transition-colors"
          >
            View All Tags <i className="ri-arrow-right-line" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {collections.map((col) => (
            <div
              key={col.id}
              onClick={() => navigate(`/search?tag=${encodeURIComponent(col.tag)}`)}
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
