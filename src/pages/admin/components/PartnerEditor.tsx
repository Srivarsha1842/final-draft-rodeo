import { useState } from 'react';
import { CMSPartnerContent } from '../types';

interface PartnerEditorProps {
  data: CMSPartnerContent;
  onSave: (data: CMSPartnerContent) => void;
}

export default function PartnerEditor({ data, onSave }: PartnerEditorProps) {
  const [form, setForm] = useState<CMSPartnerContent>(JSON.parse(JSON.stringify(data)));
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'tiers' | 'benefits'>('hero');

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

  const updateTier = (index: number, field: string, val: string | number) => {
    const tiers = [...form.commissionTiers];
    tiers[index] = { ...tiers[index], [field]: val };
    setForm({ ...form, commissionTiers: tiers });
  };

  const updateBenefit = (index: number, field: string, val: string) => {
    const benefits = [...form.benefits];
    benefits[index] = { ...benefits[index], [field]: val };
    setForm({ ...form, benefits });
  };

  const tabs = [
    { id: 'hero', label: 'Hero & Stats' },
    { id: 'tiers', label: 'Commission Tiers' },
    { id: 'benefits', label: 'Benefits' },
  ] as const;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>Partner Page</h2>
          <p className="text-stone-500 text-sm">Edit hero section, commission tiers, and partnership benefits.</p>
        </div>
        <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${saved ? 'bg-emerald-500 text-white' : 'bg-stone-900 text-white hover:bg-stone-800'}`}>
          <i className={saved ? 'ri-check-line' : 'ri-save-line'} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="flex gap-1 bg-stone-100 rounded-xl p-1 mb-6 w-fit">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'hero' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700">Hero Text</h3>
            <div>
              <label className="block text-xs text-stone-500 mb-1">Headline</label>
              <input type="text" value={form.heroHeadline} onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
            </div>
            <div>
              <label className="block text-xs text-stone-500 mb-1">Subheadline</label>
              <textarea value={form.heroSubheadline} onChange={(e) => setForm({ ...form, heroSubheadline: e.target.value })} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400 resize-none" rows={2} maxLength={500} />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-stone-100 p-5">
            <h3 className="text-sm font-semibold text-stone-700 mb-4">Stats Bar</h3>
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

      {activeTab === 'tiers' && (
        <div className="space-y-4">
          {form.commissionTiers.map((tier, i) => (
            <div key={tier.id} className="bg-white rounded-xl border border-stone-100 p-5">
              <h3 className="text-sm font-semibold text-stone-700 mb-4">{tier.name}</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Tier Name</label>
                  <input type="text" value={tier.name} onChange={(e) => updateTier(i, 'name', e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Commission Rate</label>
                  <input type="text" value={tier.commissionRate} onChange={(e) => updateTier(i, 'commissionRate', e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" placeholder="e.g. 10%" />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Bonus/Booking</label>
                  <input type="text" value={tier.bonusPerBooking} onChange={(e) => updateTier(i, 'bonusPerBooking', e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" placeholder="e.g. ₹1,000" />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Min Bookings</label>
                  <input type="number" value={tier.minBookings} onChange={(e) => updateTier(i, 'minBookings', Number(e.target.value))} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'benefits' && (
        <div className="space-y-4">
          {form.benefits.map((benefit, i) => (
            <div key={benefit.id} className="bg-white rounded-xl border border-stone-100 p-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-stone-500 mb-1">Title</label>
                    <input type="text" value={benefit.title} onChange={(e) => updateBenefit(i, 'title', e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-500 mb-1">Description</label>
                    <textarea value={benefit.description} onChange={(e) => updateBenefit(i, 'description', e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400 resize-none" rows={2} maxLength={500} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-stone-500 mb-1">Stat Value</label>
                    <input type="text" value={benefit.stat} onChange={(e) => updateBenefit(i, 'stat', e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-500 mb-1">Stat Label</label>
                    <input type="text" value={benefit.statLabel} onChange={(e) => updateBenefit(i, 'statLabel', e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-stone-500 mb-1">Icon Class</label>
                    <input type="text" value={benefit.icon} onChange={(e) => updateBenefit(i, 'icon', e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400" placeholder="ri-money-rupee-circle-line" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
