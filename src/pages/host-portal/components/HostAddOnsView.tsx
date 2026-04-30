import { useState, useCallback } from 'react';
import { HostProperty, CMSAddOn } from '@/pages/admin/types';
import { loadHostData, saveHostData } from '@/pages/admin/hostStore';
import { syncHostPropertyToCMS } from '@/pages/admin/cmsStore';
import ImageUploader from '@/components/base/ImageUploader';

interface Props {
  hostId: string;
  properties: HostProperty[];
  onUpdate: (props: HostProperty[]) => void;
}

const PRESET_ADDONS = [
  { name: 'BBQ Evening Setup', price: 2500, description: 'Full BBQ setup with grill, marinated meats & vegetables, side dishes, and a dedicated host.' },
  { name: 'Private Chef for Dinner', price: 6000, description: 'A chef prepares a multi-course gourmet dinner using local, seasonal ingredients.' },
  { name: 'Couples Spa Package', price: 4500, description: '90-minute in-villa couples massage with aromatherapy oils and rose petal bath.' },
  { name: 'Guided Trek / Nature Walk', price: 1800, description: 'Expert-guided trek or nature walk with permits and packed refreshments.' },
  { name: 'Bonfire & Stargazing Kit', price: 1200, description: 'Evening bonfire setup with telescope, hot chocolate, and marshmallows.' },
  { name: 'Airport / Station Transfer', price: 2000, description: 'One-way pick-up or drop-off in a comfortable AC vehicle.' },
  { name: 'Sunset Canoe / Kayak Tour', price: 1500, description: 'Guided 2-hour sunset paddle through scenic waterways.' },
  { name: 'Yoga & Meditation Session', price: 1000, description: '60-minute guided yoga and meditation session on the property.' },
  { name: 'In-Villa Massage', price: 3000, description: '60-minute relaxation massage in the privacy of your room.' },
  { name: 'Bonfire Night with Live Music', price: 3500, description: 'Outdoor bonfire with a live folk/classical music performance.' },
];

const emptyAddon = (): CMSAddOn => ({
  id: `a_${Date.now()}_${Math.round(Math.random() * 1000)}`,
  name: '',
  price: 0,
  image: '',
  description: '',
});

export default function HostAddOnsView({ hostId, properties, onUpdate }: Props) {
  const [selectedPropId, setSelectedPropId] = useState<string>(properties[0]?.id ?? '');
  const [saved, setSaved] = useState(false);

  const selectedProp = properties.find((p) => p.id === selectedPropId);
  const addOns: CMSAddOn[] = selectedProp?.addOns ?? [];

  const persist = useCallback((updatedAddOns: CMSAddOn[]) => {
    if (!selectedProp) return;
    const updated: HostProperty = { ...selectedProp, addOns: updatedAddOns };
    const data = loadHostData();
    data.properties = data.properties.map((p) => p.id === updated.id ? updated : p);
    saveHostData(data);
    // Sync to CMS so the property page shows it
    syncHostPropertyToCMS({ id: updated.id, addOns: updatedAddOns });
    onUpdate(data.properties.filter((p) => p.hostId === hostId));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [selectedProp, hostId, onUpdate]);

  const updateAddon = (idx: number, patch: Partial<CMSAddOn>) => {
    const updated = addOns.map((a, i) => i === idx ? { ...a, ...patch } : a);
    persist(updated);
  };

  const removeAddon = (idx: number) => {
    persist(addOns.filter((_, i) => i !== idx));
  };

  const addBlank = () => persist([...addOns, emptyAddon()]);

  const addFromPreset = (preset: typeof PRESET_ADDONS[0]) => {
    persist([...addOns, { ...emptyAddon(), name: preset.name, price: preset.price, description: preset.description }]);
  };

  if (properties.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 flex items-center justify-center bg-stone-100 rounded-2xl mx-auto mb-4">
          <i className="ri-gift-line text-stone-400 text-3xl" />
        </div>
        <p className="font-semibold text-stone-700 mb-2">No properties yet</p>
        <p className="text-stone-400 text-sm">Add a property first to manage add-ons.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Add-on Experiences</h2>
          <p className="text-stone-500 text-sm mt-1">Optional extras guests can select when booking your property</p>
        </div>
        {saved && (
          <span className="text-emerald-600 text-sm flex items-center gap-1 font-medium">
            <i className="ri-check-line" /> Saved &amp; Published
          </span>
        )}
      </div>

      {/* Property selector */}
      {properties.length > 1 && (
        <div className="flex gap-2 flex-wrap mb-6">
          {properties.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPropId(p.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer whitespace-nowrap border ${
                selectedPropId === p.id ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-200 text-stone-600 hover:border-stone-400'
              }`}
            >
              {p.name}
              {(p.addOns?.length ?? 0) > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                  {p.addOns!.length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: existing add-ons */}
        <div className="lg:col-span-2 space-y-4">
          {addOns.length === 0 ? (
            <div className="py-10 px-6 text-center border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50/60">
              <i className="ri-gift-line text-stone-300 text-4xl block mb-3" />
              <p className="text-stone-700 text-sm font-semibold mb-1">No Add-ons Yet</p>
              <p className="text-stone-400 text-xs max-w-sm mx-auto mb-4">
                Add-ons let you offer optional extras — like a spa session, bonfire night, or guided trek — that guests can book alongside their stay. They appear in the <strong>&quot;Enhance Your Stay&quot;</strong> section on your property page.
              </p>
              <button
                onClick={addBlank}
                className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-add-line mr-1" /> Add First Add-on
              </button>
            </div>
          ) : (
            <>
              {addOns.map((addon, idx) => (
                <div key={addon.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                  {/* Image preview row */}
                  <div className="flex gap-4 p-4 border-b border-stone-100">
                    <div className="w-24 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0 flex items-center justify-center">
                      {addon.image ? (
                        <img src={addon.image} alt={addon.name} className="w-full h-full object-cover object-top" />
                      ) : (
                        <i className="ri-image-add-line text-stone-300 text-2xl" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Add-on #{idx + 1}</span>
                        <button
                          onClick={() => removeAddon(idx)}
                          className="w-7 h-7 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg cursor-pointer shrink-0 border border-stone-100"
                        >
                          <i className="ri-delete-bin-line text-sm" />
                        </button>
                      </div>
                      <input
                        value={addon.name}
                        onChange={(e) => updateAddon(idx, { name: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm font-semibold text-stone-900 focus:outline-none focus:border-stone-400 mb-2"
                        placeholder="e.g. Couples Spa Package"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-stone-400 text-sm font-medium">₹</span>
                        <input
                          type="number"
                          value={addon.price || ''}
                          onChange={(e) => updateAddon(idx, { price: Number(e.target.value) })}
                          className="w-28 px-3 py-2 border border-stone-200 rounded-lg text-sm font-bold text-stone-900 focus:outline-none focus:border-stone-400"
                          placeholder="0"
                        />
                        <span className="text-stone-400 text-xs">per booking</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <ImageUploader
                        images={addon.image ? [addon.image] : []}
                        onChange={(imgs) => updateAddon(idx, { image: imgs[0] ?? '' })}
                        label="Add-on Photo"
                        multiple={false}
                        aspectHint="Landscape (400×300px)"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-500 mb-1">Short Description</label>
                      <textarea
                        value={addon.description}
                        onChange={(e) => {
                          if (e.target.value.length <= 200) updateAddon(idx, { description: e.target.value });
                        }}
                        rows={2}
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400 resize-none"
                        placeholder="Describe what's included — e.g. '90-min massage with aromatherapy oils, rose petal bath, champagne'"
                      />
                      <p className="text-right text-xs text-stone-300 mt-0.5">{addon.description.length}/200</p>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addBlank}
                className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 cursor-pointer whitespace-nowrap w-full justify-center"
              >
                <i className="ri-add-line" /> Add Another Add-on
              </button>
            </>
          )}
        </div>

        {/* Right: presets panel */}
        <div className="space-y-3">
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-stone-800 mb-1 flex items-center gap-2">
              <i className="ri-lightbulb-line text-amber-500" /> Quick Add Presets
            </h3>
            <p className="text-xs text-stone-500 mb-3">Click any preset to add it instantly — then customise the photo and price.</p>
            <div className="space-y-2">
              {PRESET_ADDONS.map((preset) => {
                const alreadyAdded = addOns.some((a) => a.name === preset.name);
                return (
                  <button
                    key={preset.name}
                    onClick={() => !alreadyAdded && addFromPreset(preset)}
                    disabled={alreadyAdded}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                      alreadyAdded
                        ? 'bg-emerald-50 border border-emerald-100 text-emerald-700'
                        : 'bg-white border border-stone-200 text-stone-700 hover:border-amber-300 hover:bg-amber-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{preset.name}</span>
                      {alreadyAdded ? (
                        <i className="ri-check-line text-emerald-500 shrink-0" />
                      ) : (
                        <span className="text-stone-400 shrink-0">₹{preset.price.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Info card */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
            <h4 className="text-xs font-semibold text-stone-700 mb-2 flex items-center gap-1.5">
              <i className="ri-information-line text-stone-400" /> How add-ons work
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-500">
              <li className="flex items-start gap-1.5"><i className="ri-checkbox-circle-fill text-emerald-400 mt-0.5 shrink-0" />Shown in &ldquo;Enhance Your Stay&rdquo; on your property page</li>
              <li className="flex items-start gap-1.5"><i className="ri-checkbox-circle-fill text-emerald-400 mt-0.5 shrink-0" />Guests can select them at booking and the cost is added to their total</li>
              <li className="flex items-start gap-1.5"><i className="ri-checkbox-circle-fill text-emerald-400 mt-0.5 shrink-0" />Changes are published instantly — no review required</li>
              <li className="flex items-start gap-1.5"><i className="ri-checkbox-circle-fill text-emerald-400 mt-0.5 shrink-0" />Add a clear photo and description for best conversion</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
