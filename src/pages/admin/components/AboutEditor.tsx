import { useState } from 'react';
import { CMSAboutContent } from '../types';
import ImageUploader from '@/components/base/ImageUploader';

interface AboutEditorProps {
  data: CMSAboutContent;
  onSave: (data: CMSAboutContent) => void;
}

export default function AboutEditor({ data, onSave }: AboutEditorProps) {
  const [form, setForm] = useState<CMSAboutContent>(JSON.parse(JSON.stringify(data)));
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'basics' | 'founders' | 'values' | 'offices'>('basics');

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const updateStat = (index: number, field: 'value' | 'label', val: string) => {
    const stats = [...form.stats];
    stats[index] = { ...stats[index], [field]: val };
    setForm({ ...form, stats });
  };

  const updateFounder = (index: number, field: string, val: string) => {
    const founders = [...form.founders];
    founders[index] = { ...founders[index], [field]: val };
    setForm({ ...form, founders });
  };

  const updateValue = (index: number, field: string, val: string) => {
    const values = [...form.values];
    values[index] = { ...values[index], [field]: val };
    setForm({ ...form, values });
  };

  const updateOffice = (index: number, field: string, val: string) => {
    const offices = [...form.officeLocations];
    offices[index] = { ...offices[index], [field]: val };
    setForm({ ...form, officeLocations: offices });
  };

  const tabs = [
    { id: 'basics', label: 'Basic Content' },
    { id: 'founders', label: 'Founders' },
    { id: 'values', label: 'Core Values' },
    { id: 'offices', label: 'Offices' },
  ] as const;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>About Page</h2>
          <p className="text-stone-500 text-sm">Edit brand story, founders, values and office locations.</p>
        </div>
        <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${saved ? 'bg-emerald-500 text-white' : 'bg-stone-900 text-white hover:bg-stone-800'}`}>
          <i className={saved ? 'ri-check-line' : 'ri-save-line'} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 rounded-xl p-1 mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'basics' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700">Hero Content</h3>
            <div>
              <label className="block text-xs text-stone-500 mb-1">Headline</label>
              <input type="text" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
            </div>
            <div>
              <label className="block text-xs text-stone-500 mb-1">Subheadline</label>
              <textarea value={form.subheadline} onChange={(e) => setForm({ ...form, subheadline: e.target.value })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400 resize-none" rows={2} maxLength={500} />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700">Brand Story</h3>
            <div>
              <label className="block text-xs text-stone-500 mb-1">Story Paragraph 1</label>
              <textarea value={form.storyParagraph1} onChange={(e) => setForm({ ...form, storyParagraph1: e.target.value })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400 resize-none" rows={4} maxLength={500} />
            </div>
            <div>
              <label className="block text-xs text-stone-500 mb-1">Story Paragraph 2</label>
              <textarea value={form.storyParagraph2} onChange={(e) => setForm({ ...form, storyParagraph2: e.target.value })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400 resize-none" rows={4} maxLength={500} />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-stone-100 p-5">
            <h3 className="text-sm font-semibold text-stone-700 mb-4">Stats</h3>
            <div className="space-y-3">
              {form.stats.map((stat, i) => (
                <div key={i} className="grid grid-cols-2 gap-3">
                  <input type="text" value={stat.value} onChange={(e) => updateStat(i, 'value', e.target.value)} placeholder="Value" className="px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
                  <input type="text" value={stat.label} onChange={(e) => updateStat(i, 'label', e.target.value)} placeholder="Label" className="px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'founders' && (
        <div className="space-y-4">
          {form.founders.map((founder, i) => (
            <div key={i} className="bg-white rounded-xl border border-stone-100 p-5">
              <h3 className="text-sm font-semibold text-stone-700 mb-4">Founder {i + 1}</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-stone-500 mb-1">Name</label>
                    <input type="text" value={founder.name} onChange={(e) => updateFounder(i, 'name', e.target.value)} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-500 mb-1">Role</label>
                    <input type="text" value={founder.role} onChange={(e) => updateFounder(i, 'role', e.target.value)} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-500 mb-1">Bio</label>
                    <textarea value={founder.bio} onChange={(e) => updateFounder(i, 'bio', e.target.value)} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400 resize-none" rows={3} maxLength={500} />
                  </div>
                </div>
                <div>
                  <ImageUploader
                    images={founder.image ? [founder.image] : []}
                    onChange={(imgs) => updateFounder(i, 'image', imgs[0] ?? '')}
                    label="Founder Photo"
                    multiple={false}
                    aspectHint="Square recommended (400×400px)"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'values' && (
        <div className="space-y-4">
          {form.values.map((val, i) => (
            <div key={i} className="bg-white rounded-xl border border-stone-100 p-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Icon Class</label>
                  <input type="text" value={val.icon} onChange={(e) => updateValue(i, 'icon', e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" placeholder="ri-heart-3-line" />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Title</label>
                  <input type="text" value={val.title} onChange={(e) => updateValue(i, 'title', e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Description</label>
                  <input type="text" value={val.description} onChange={(e) => updateValue(i, 'description', e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'offices' && (
        <div className="space-y-4">
          {form.officeLocations.map((office, i) => (
            <div key={i} className="bg-white rounded-xl border border-stone-100 p-5">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-stone-500 mb-1">City</label>
                  <input type="text" value={office.city} onChange={(e) => updateOffice(i, 'city', e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Role</label>
                  <input type="text" value={office.role} onChange={(e) => updateOffice(i, 'role', e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Address</label>
                  <input type="text" value={office.address} onChange={(e) => updateOffice(i, 'address', e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
