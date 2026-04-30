import { useState } from 'react';
import { CMSTrendingDestination } from '../types';
import ImageUploader from '@/components/base/ImageUploader';

interface Props {
  data: CMSTrendingDestination[];
  onSave: (data: CMSTrendingDestination[]) => void;
}

const BADGE_PRESETS = [
  { label: 'Trending Now', value: 'Trending Now', color: 'bg-amber-400 text-stone-900' },
  { label: 'Peak Season', value: 'Peak Season', color: 'bg-sky-100 text-sky-700' },
  { label: 'Most Loved', value: 'Most Loved', color: 'bg-rose-100 text-rose-700' },
  { label: 'Staff Pick', value: 'Staff Pick', color: 'bg-emerald-100 text-emerald-700' },
  { label: 'Hidden Gem', value: 'Hidden Gem', color: 'bg-stone-100 text-stone-700' },
  { label: 'Exclusive', value: 'Exclusive', color: 'bg-amber-100 text-amber-700' },
  { label: 'New', value: 'New', color: 'bg-violet-100 text-violet-700' },
  { label: 'Weekend Escape', value: 'Weekend Escape', color: 'bg-orange-100 text-orange-700' },
];

const emptyDestination = (): CMSTrendingDestination => ({
  id: `dest_${Date.now()}`,
  name: '',
  tagline: '',
  country: 'India',
  properties: 0,
  startingPrice: 0,
  badge: 'Trending Now',
  badgeColor: 'bg-amber-400 text-stone-900',
  image: '',
  tags: [],
});

export default function TrendingDestinationsEditor({ data, onSave }: Props) {
  const [destinations, setDestinations] = useState<CMSTrendingDestination[]>(
    JSON.parse(JSON.stringify(data))
  );
  const [editing, setEditing] = useState<CMSTrendingDestination | null>(null);
  const [saved, setSaved] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  const handleSave = (list: CMSTrendingDestination[]) => {
    setDestinations(list);
    onSave(list);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleEdit = (dest: CMSTrendingDestination) => {
    setEditing(JSON.parse(JSON.stringify(dest)));
    setTagsInput(dest.tags.join(', '));
  };

  const handleAdd = () => {
    const d = emptyDestination();
    setEditing(d);
    setTagsInput('');
  };

  const handleSaveEdit = () => {
    if (!editing) return;
    const updated = { ...editing, tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean) };
    const exists = destinations.find((d) => d.id === updated.id);
    const newList = exists
      ? destinations.map((d) => (d.id === updated.id ? updated : d))
      : [...destinations, updated];
    handleSave(newList);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    handleSave(destinations.filter((d) => d.id !== id));
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const list = [...destinations];
    [list[idx - 1], list[idx]] = [list[idx], list[idx - 1]];
    handleSave(list);
  };

  const moveDown = (idx: number) => {
    if (idx === destinations.length - 1) return;
    const list = [...destinations];
    [list[idx], list[idx + 1]] = [list[idx + 1], list[idx]];
    handleSave(list);
  };

  // ── EDIT FORM ──────────────────────────────────────────────────────────
  if (editing) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setEditing(null)}
            className="w-9 h-9 flex items-center justify-center bg-stone-100 rounded-lg text-stone-600 hover:bg-stone-200 cursor-pointer"
          >
            <i className="ri-arrow-left-line" />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              {editing.name ? `Edit: ${editing.name}` : 'Add Destination'}
            </h2>
          </div>
          <button
            onClick={handleSaveEdit}
            className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-save-line" /> Save Destination
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-stone-100 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-stone-700">Destination Details</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-500 mb-1.5">Destination Name <span className="text-red-400">*</span></label>
                  <input
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                    placeholder="e.g. Goa"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1.5">Country</label>
                  <input
                    value={editing.country}
                    onChange={(e) => setEditing({ ...editing, country: e.target.value })}
                    className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                    placeholder="India"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-500 mb-1.5">Tagline</label>
                <input
                  value={editing.tagline}
                  onChange={(e) => setEditing({ ...editing, tagline: e.target.value })}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                  placeholder="e.g. Sun, Sand & Serenity"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-500 mb-1.5">Number of Properties</label>
                  <input
                    type="number"
                    min={0}
                    value={editing.properties || ''}
                    onChange={(e) => setEditing({ ...editing, properties: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                    placeholder="142"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1.5">Starting Price / Night (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={editing.startingPrice || ''}
                    onChange={(e) => setEditing({ ...editing, startingPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                    placeholder="8500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-500 mb-1.5">Tags (comma-separated)</label>
                <input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                  placeholder="Beaches, Nightlife, Villas"
                />
                <p className="text-xs text-stone-400 mt-1">Shown as small chips on the destination card</p>
              </div>
            </div>

            {/* Badge */}
            <div className="bg-white rounded-2xl border border-stone-100 p-5 space-y-3">
              <h3 className="text-sm font-semibold text-stone-700">Badge</h3>
              <p className="text-xs text-stone-400">Choose a badge to highlight this destination on the home page</p>
              <div className="grid grid-cols-2 gap-2">
                {BADGE_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setEditing({ ...editing, badge: preset.value, badgeColor: preset.color })}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-sm transition-all cursor-pointer text-left ${
                      editing.badge === preset.value
                        ? 'border-stone-900 bg-stone-50'
                        : 'border-stone-100 hover:border-stone-300'
                    }`}
                  >
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${preset.color}`}>
                      {preset.label}
                    </span>
                    {editing.badge === preset.value && (
                      <i className="ri-check-line text-stone-700 text-xs ml-auto" />
                    )}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-xs text-stone-500 mb-1.5">Custom Badge Text</label>
                <input
                  value={editing.badge}
                  onChange={(e) => setEditing({ ...editing, badge: e.target.value })}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                  placeholder="e.g. Top Pick"
                />
              </div>
            </div>
          </div>

          {/* Right — Image */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-stone-100 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-stone-700">Destination Photo</h3>
              <p className="text-xs text-stone-400">Portrait orientation recommended (approx 600×700px). This is the card background on the home page.</p>
              <ImageUploader
                images={editing.image ? [editing.image] : []}
                onChange={(imgs) => setEditing({ ...editing, image: imgs[0] ?? '' })}
                label="Destination Photo"
                multiple={false}
                aspectHint="Portrait recommended (600×700px)"
              />
              {!editing.image && (
                <div className="rounded-2xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center py-6">
                  <i className="ri-image-2-line text-stone-300 text-3xl mb-2" />
                  <p className="text-stone-400 text-xs">Upload an image above to preview</p>
                </div>
              )}
            </div>

            {/* Preview Card */}
            {editing.name && (
              <div className="bg-white rounded-2xl border border-stone-100 p-5">
                <h3 className="text-sm font-semibold text-stone-700 mb-3">Card Preview</h3>
                <div className="relative rounded-2xl overflow-hidden" style={{ height: 200 }}>
                  {editing.image && (
                    <img src={editing.image} alt={editing.name} className="absolute inset-0 w-full h-full object-cover object-top" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
                  {editing.badge && (
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${editing.badgeColor}`}>
                        {editing.badge}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-bold text-base">{editing.name}</p>
                    <p className="text-white/70 text-xs">{editing.tagline}</p>
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {(tagsInput.split(',').map((t) => t.trim()).filter(Boolean)).map((tag) => (
                        <span key={tag} className="text-xs text-white/80 bg-white/15 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-white/60 text-xs">{editing.properties} stays</span>
                      {editing.startingPrice > 0 && (
                        <span className="text-amber-300 text-xs font-semibold">
                          from ₹{editing.startingPrice.toLocaleString('en-IN')}/night
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── LIST VIEW ─────────────────────────────────────────────────────────
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Trending Destinations
          </h2>
          <p className="text-stone-500 text-sm mt-0.5">
            {destinations.length} destination{destinations.length !== 1 ? 's' : ''} shown on home page — drag to reorder
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-emerald-600 text-sm flex items-center gap-1">
              <i className="ri-check-line" /> Saved!
            </span>
          )}
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line" /> Add Destination
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6">
        <i className="ri-map-pin-2-line text-amber-600 text-lg mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-stone-800 mb-0.5">Trending Destinations appear on the home page</p>
          <p className="text-xs text-stone-500">
            The cards are shown in the &quot;Trending Destinations&quot; section. Each card links to a search filtered by that destination name. You can reorder them using the arrows, add new destinations, or edit existing ones.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {destinations.map((dest, idx) => (
          <div key={dest.id} className="bg-white rounded-xl border border-stone-100 p-4 flex items-center gap-4">
            {/* Image */}
            <div className="w-16 h-14 rounded-lg overflow-hidden shrink-0 bg-stone-100">
              {dest.image && (
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover object-top" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="text-sm font-semibold text-stone-900 truncate">{dest.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${dest.badgeColor}`}>
                  {dest.badge}
                </span>
              </div>
              <p className="text-xs text-stone-400 truncate">{dest.tagline}</p>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-xs text-stone-500">{dest.properties} stays</span>
                <span className="text-xs text-stone-500">from ₹{dest.startingPrice.toLocaleString('en-IN')}/night</span>
                {dest.tags.length > 0 && (
                  <span className="text-xs text-stone-400">{dest.tags.join(' · ')}</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Reorder */}
              <div className="flex flex-col gap-0.5 mr-1">
                <button
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0}
                  className="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded cursor-pointer disabled:opacity-30 disabled:cursor-default"
                >
                  <i className="ri-arrow-up-s-line text-sm" />
                </button>
                <button
                  onClick={() => moveDown(idx)}
                  disabled={idx === destinations.length - 1}
                  className="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded cursor-pointer disabled:opacity-30 disabled:cursor-default"
                >
                  <i className="ri-arrow-down-s-line text-sm" />
                </button>
              </div>

              <button
                onClick={() => handleEdit(dest)}
                className="w-9 h-9 flex items-center justify-center bg-stone-100 rounded-lg text-stone-600 hover:bg-stone-200 cursor-pointer"
              >
                <i className="ri-edit-line text-sm" />
              </button>
              <button
                onClick={() => handleDelete(dest.id)}
                className="w-9 h-9 flex items-center justify-center bg-red-50 rounded-lg text-red-500 hover:bg-red-100 cursor-pointer"
              >
                <i className="ri-delete-bin-line text-sm" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {destinations.length === 0 && (
        <div className="py-16 text-center border-2 border-dashed border-stone-200 rounded-2xl">
          <i className="ri-map-2-line text-stone-300 text-4xl block mb-3" />
          <p className="text-stone-700 font-semibold text-sm mb-1">No destinations added</p>
          <p className="text-stone-400 text-xs mb-4">Add destinations to show them on the home page trending section</p>
          <button
            onClick={handleAdd}
            className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 cursor-pointer whitespace-nowrap"
          >
            Add First Destination
          </button>
        </div>
      )}
    </div>
  );
}
