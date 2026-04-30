import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { fetchProperties } from '@/services/propertiesApi';

export default function DestinationsPage() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Array<{ name: string; count: number; price: number; image: string }>>([]);

  useEffect(() => {
    fetchProperties({ limit: 100 })
      .then(({ properties }) => {
        const grouped = properties.reduce<Record<string, typeof properties>>((acc, property) => {
          const key = property.city || property.state || property.location;
          acc[key] = [...(acc[key] ?? []), property];
          return acc;
        }, {});
        setDestinations(Object.entries(grouped).map(([name, items]) => ({
          name,
          count: items.length,
          price: Math.min(...items.map((p) => p.pricePerNight)),
          image: items[0]?.images[0] ?? 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800',
        })));
      })
      .catch(() => setDestinations([]));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-28 pb-16 max-w-[1200px] mx-auto px-4 md:px-8">
        <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold mb-2">Explore</p>
        <h1 className="text-3xl md:text-5xl font-bold text-stone-900 mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
          View All Destinations
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {destinations.map((dest) => (
            <button key={dest.name} onClick={() => navigate(`/search?destination=${encodeURIComponent(dest.name)}`)} className="relative overflow-hidden rounded-2xl text-left aspect-[4/3] group">
              <img src={dest.image} alt={dest.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h2 className="text-white text-2xl font-bold">{dest.name}</h2>
                <p className="text-white/70 text-sm mt-1">{dest.count} stays from &#x20B9;{dest.price.toLocaleString('en-IN')}</p>
              </div>
            </button>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
