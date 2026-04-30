import { useState } from 'react';
import { CMSHeroContent } from '../types';
import ImageUploader from '@/components/base/ImageUploader';

interface HeroEditorProps {
  data: CMSHeroContent;
  onSave: (data: CMSHeroContent) => void;
}

export default function HeroEditor({ data, onSave }: HeroEditorProps) {
  const [form, setForm] = useState<CMSHeroContent>(JSON.parse(JSON.stringify(data)));
  const [saved, setSaved] = useState(false);

  const updateStat = (index: number, field: 'value' | 'label', value: string) => {
    const stats = [...form.stats];
    stats[index] = { ...stats[index], [field]: value };
    setForm({ ...form, stats });
  };

  const addStat = () => {
    setForm({ ...form, stats: [...form.stats, { value: '', label: '' }] });
  };

  const removeStat = (index: number) => {
    setForm({ ...form, stats: form.stats.filter((_, i) => i !== index) });
  };

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>Home Hero Section</h2>
          <p className="text-stone-500 text-sm mt-0.5">Edit the main headline, subtext, and stats shown on the homepage.</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            saved ? 'bg-emerald-500 text-white' : 'bg-stone-900 text-white hover:bg-stone-800'
          }`}
        >
          <i className={saved ? 'ri-check-line' : 'ri-save-line'} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-stone-100 p-6">
          <h3 className="text-sm font-semibold text-stone-700 mb-4">Badge & Text</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Badge Text</label>
              <input
                type="text"
                value={form.badgeText}
                onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
                className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-800 outline-none focus:border-stone-400"
                placeholder="AI-Powered Travel Discovery"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Main Headline (use \n for line break)</label>
              <textarea
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-800 outline-none focus:border-stone-400 resize-none"
                rows={3}
                placeholder="Your Perfect Escape\nAwaits You"
                maxLength={500}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Subheadline</label>
              <textarea
                value={form.subheadline}
                onChange={(e) => setForm({ ...form, subheadline: e.target.value })}
                className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-800 outline-none focus:border-stone-400 resize-none"
                rows={2}
                placeholder="Discover handpicked resorts, villas & experiences..."
                maxLength={500}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-100 p-6">
          <h3 className="text-sm font-semibold text-stone-700 mb-4">Background Image</h3>
          <ImageUploader
            images={form.backgroundImage ? [form.backgroundImage] : []}
            onChange={(imgs) => setForm({ ...form, backgroundImage: imgs[0] ?? '' })}
            label="Hero Background"
            multiple={false}
            aspectHint="Landscape recommended (1920×1080px)"
          />
        </div>

        <div className="bg-white rounded-xl border border-stone-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-stone-700">Hero Stats</h3>
            <button
              onClick={addStat}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-xs font-semibold hover:bg-stone-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-add-line" />
              Add Stat
            </button>
          </div>
          <div className="space-y-3">
            {form.stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => updateStat(i, 'value', e.target.value)}
                    placeholder="Value (e.g. 2,400+)"
                    className="px-3 py-2 border border-stone-200 rounded-lg text-sm text-stone-800 outline-none focus:border-stone-400"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => updateStat(i, 'label', e.target.value)}
                    placeholder="Label (e.g. Properties)"
                    className="px-3 py-2 border border-stone-200 rounded-lg text-sm text-stone-800 outline-none focus:border-stone-400"
                  />
                </div>
                <button
                  onClick={() => removeStat(i)}
                  className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <i className="ri-delete-bin-line" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
