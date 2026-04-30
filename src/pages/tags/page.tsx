import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { fetchPropertyTags } from '@/services/propertiesApi';

const fallbackTags = ['Corporate Getaways', 'School Trips', 'Private Stays', 'Pet Friendly', 'Beach Front'];

export default function TagsPage() {
  const navigate = useNavigate();
  const [tags, setTags] = useState<string[]>(fallbackTags);

  useEffect(() => {
    fetchPropertyTags()
      .then((items) => setTags(items.length ? items : fallbackTags))
      .catch(() => setTags(fallbackTags));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-28 pb-16 max-w-[1200px] mx-auto px-4 md:px-8">
        <p className="text-stone-400 text-xs uppercase tracking-widest font-semibold mb-2">Browse</p>
        <h1 className="text-3xl md:text-5xl font-bold text-stone-900 mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
          View All Tags
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => navigate(`/search?tag=${encodeURIComponent(tag)}`)}
              className="flex items-center justify-between border border-stone-200 rounded-2xl px-5 py-4 text-left hover:border-stone-900 transition-colors"
            >
              <span className="font-semibold text-stone-800">{tag}</span>
              <i className="ri-arrow-right-line text-stone-400" />
            </button>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
