import { useState } from 'react';
import { CMSExperience } from '../types';
import ImageUploader from '@/components/base/ImageUploader';

interface ExperiencesEditorProps {
  data: CMSExperience[];
  onSave: (data: CMSExperience[]) => void;
}

const emptyExp: CMSExperience = {
  id: '',
  title: '',
  location: '',
  price: 0,
  duration: '',
  rating: 4.5,
  category: 'Adventure',
  image: '',
};

const categories = ['Adventure', 'Wellness', 'Culinary', 'Water Sports', 'Cultural', 'Nature', 'Heritage'];

export default function ExperiencesEditor({ data, onSave }: ExperiencesEditorProps) {
  const [experiences, setExperiences] = useState<CMSExperience[]>(JSON.parse(JSON.stringify(data)));
  const [editing, setEditing] = useState<CMSExperience | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleEdit = (exp: CMSExperience) => {
    setEditing(JSON.parse(JSON.stringify(exp)));
    setIsNew(false);
  };

  const handleAdd = () => {
    setEditing({ ...emptyExp, id: `e${Date.now()}` });
    setIsNew(true);
  };

  const handleDelete = (id: string) => {
    const updated = experiences.filter((e) => e.id !== id);
    setExperiences(updated);
    onSave(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveEdit = () => {
    if (!editing) return;
    const exists = experiences.find((e) => e.id === editing.id);
    const newList = exists
      ? experiences.map((e) => (e.id === editing.id ? editing : e))
      : [...experiences, editing];
    setExperiences(newList);
    onSave(newList);
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (editing) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setEditing(null)} className="w-9 h-9 flex items-center justify-center bg-stone-100 rounded-lg text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer">
            <i className="ri-arrow-left-line" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>{isNew ? 'Add Experience' : 'Edit Experience'}</h2>
          </div>
          <button onClick={handleSaveEdit} className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors cursor-pointer whitespace-nowrap">
            <i className="ri-save-line" />
            Save
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-stone-700 mb-2">Experience Info</h3>
            <div>
              <label className="block text-xs text-stone-500 mb-1">Title</label>
              <input type="text" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
            </div>
            <div>
              <label className="block text-xs text-stone-500 mb-1">Location</label>
              <input type="text" value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-stone-500 mb-1">Price (₹)</label>
                <input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 mb-1">Duration</label>
                <input type="text" value={editing.duration} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" placeholder="e.g. 2.5 hours" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-stone-500 mb-1">Rating</label>
                <input type="number" min={1} max={5} step={0.1} value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
              </div>
              <div>
                <label className="block text-xs text-stone-500 mb-1">Category</label>
                <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400 bg-white cursor-pointer">
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-stone-100 p-5">
            <h3 className="text-sm font-semibold text-stone-700 mb-3">Experience Image</h3>
            <ImageUploader
              images={editing.image ? [editing.image] : []}
              onChange={(imgs) => setEditing({ ...editing, image: imgs[0] ?? '' })}
              label="Experience Photo"
              multiple={false}
              aspectHint="Landscape recommended (800×500px)"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>Experiences</h2>
          <p className="text-stone-500 text-sm">{experiences.length} experiences</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-emerald-600 text-sm flex items-center gap-1"><i className="ri-check-line" />Saved!</span>}
          <button onClick={handleAdd} className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors cursor-pointer whitespace-nowrap">
            <i className="ri-add-line" />
            Add Experience
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="bg-white rounded-xl border border-stone-100 overflow-hidden">
            <div className="h-28 overflow-hidden bg-stone-100">
              {exp.image && <img src={exp.image} alt={exp.title} className="w-full h-full object-cover" />}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-stone-900">{exp.title}</div>
                  <div className="text-xs text-stone-400 mt-0.5">{exp.location} · {exp.duration}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">{exp.category}</span>
                    <span className="text-xs text-stone-600 font-medium">₹{exp.price.toLocaleString()}</span>
                    <span className="flex items-center gap-0.5 text-xs text-amber-600"><i className="ri-star-fill text-xs" />{exp.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => handleEdit(exp)} className="w-8 h-8 flex items-center justify-center bg-stone-100 rounded-lg text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer">
                    <i className="ri-edit-line text-xs" />
                  </button>
                  <button onClick={() => handleDelete(exp.id)} className="w-8 h-8 flex items-center justify-center bg-red-50 rounded-lg text-red-500 hover:bg-red-100 transition-colors cursor-pointer">
                    <i className="ri-delete-bin-line text-xs" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
