import { useState } from 'react';
import { HostProperty, CMSAddOn } from '@/pages/admin/types';
import { loadHostData, saveHostData } from '@/pages/admin/hostStore';
import { syncHostPropertyToCMS } from '@/pages/admin/cmsStore';
import ImageUploader from '@/components/base/ImageUploader';

interface Props {
  hostId: string;
  properties: HostProperty[];
  onUpdate: (props: HostProperty[]) => void;
}

type FormSection = 'basic' | 'addons' | 'daypackage';

const emptyAddOn = (): CMSAddOn => ({ id: `a_${Date.now()}_${Math.random()}`, name: '', price: 0, image: '', description: '' });

const emptyForm = (): Omit<HostProperty, 'id' | 'hostId' | 'createdAt' | 'rating' | 'reviewCount' | 'verified'> => ({
  name: '', location: '', city: '', state: '', pricePerNight: 0, images: [''], tags: [], type: 'villa',
  bedrooms: 1, bathrooms: 1, maxGuests: 2, description: '', status: 'pending',
  addOns: [],
  dayPackage: { enabled: false, description: '', timing: '', pricePerPerson: 0, meals: [], activities: [], facilities: [], image: '' },
});

export default function HostPropertiesManager({ hostId, properties, onUpdate }: Props) {
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [editing, setEditing] = useState<HostProperty | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [tagInput, setTagInput] = useState('');
  const [saved, setSaved] = useState(false);
  const [section, setSection] = useState<FormSection>('basic');
  const [mealInput, setMealInput] = useState('');
  const [activityInput, setActivityInput] = useState('');

  const persist = (updated: HostProperty[]) => {
    const data = loadHostData();
    data.properties = [...data.properties.filter((p) => p.hostId !== hostId), ...updated];
    saveHostData(data);
    // Sync each updated property's add-ons + day package to CMS store
    updated.forEach((p) => {
      syncHostPropertyToCMS({ id: p.id, addOns: p.addOns, dayPackage: p.dayPackage, housePolicies: p.housePolicies });
    });
    onUpdate(updated);
  };

  const openAdd = () => { setForm(emptyForm()); setEditing(null); setSection('basic'); setView('add'); };
  const openEdit = (p: HostProperty) => {
    setEditing(p);
    setForm({
      name: p.name, location: p.location, city: p.city, state: p.state, pricePerNight: p.pricePerNight,
      images: [...p.images], tags: [...p.tags], type: p.type, bedrooms: p.bedrooms, bathrooms: p.bathrooms,
      maxGuests: p.maxGuests, description: p.description, status: p.status,
      addOns: p.addOns ? [...p.addOns] : [],
      dayPackage: p.dayPackage ? { ...p.dayPackage, meals: [...(p.dayPackage.meals ?? [])], activities: [...(p.dayPackage.activities ?? [])], facilities: [...(p.dayPackage.facilities ?? [])] } : { enabled: false, description: '', timing: '', pricePerPerson: 0, meals: [], activities: [], facilities: [], image: '' },
    });
    setSection('basic');
    setView('edit');
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this property?')) return;
    const updated = properties.filter((p) => p.id !== id);
    persist(updated);
  };

  const handleSave = () => {
    if (!form.name || !form.location || !form.pricePerNight) return;
    if (view === 'edit' && editing) {
      const updated = properties.map((p) => p.id === editing.id ? { ...editing, ...form } : p);
      persist(updated);
    } else {
      const newProp: HostProperty = {
        id: `hp_${Date.now()}`,
        hostId,
        rating: 0,
        reviewCount: 0,
        verified: false,
        createdAt: new Date().toISOString(),
        ...form,
        images: form.images.filter(Boolean),
      };
      persist([...properties, newProp]);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setView('list');
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (t: string) => setForm({ ...form, tags: form.tags.filter((x) => x !== t) });

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    inactive: 'bg-stone-100 text-stone-500',
  };

  // Helpers for day package list fields
  const dpMeals = form.dayPackage?.meals ?? [];
  const dpActivities = form.dayPackage?.activities ?? [];
  const dpEnabled = form.dayPackage?.enabled ?? false;

  const addDpItem = (field: 'meals' | 'activities', val: string) => {
    if (!val.trim()) return;
    const dp = { ...(form.dayPackage ?? { enabled: false, description: '', timing: '', pricePerPerson: 0, meals: [], activities: [], facilities: [], image: '' }) };
    dp[field] = [...(dp[field] ?? []), val.trim()];
    setForm({ ...form, dayPackage: dp });
    if (field === 'meals') setMealInput('');
    else setActivityInput('');
  };

  const removeDpItem = (field: 'meals' | 'activities', val: string) => {
    const dp = { ...(form.dayPackage ?? { enabled: false, description: '', timing: '', pricePerPerson: 0, meals: [], activities: [], facilities: [], image: '' }) };
    dp[field] = (dp[field] ?? []).filter((x: string) => x !== val);
    setForm({ ...form, dayPackage: dp });
  };

  const updateDp = (patch: Partial<NonNullable<typeof form.dayPackage>>) => {
    setForm({ ...form, dayPackage: { ...(form.dayPackage ?? { enabled: false, description: '', timing: '', pricePerPerson: 0, meals: [], activities: [], facilities: [], image: '' }), ...patch } });
  };

  if (view === 'add' || view === 'edit') {
    const formAddOns = form.addOns ?? [];
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setView('list')} className="text-stone-400 hover:text-stone-700 cursor-pointer"><i className="ri-arrow-left-line text-xl" /></button>
          <h2 className="text-xl font-bold text-stone-900">{view === 'edit' ? 'Edit Property' : 'Add New Property'}</h2>
        </div>

        {/* Section tabs */}
        <div className="flex gap-1 mb-5 bg-stone-100 p-1 rounded-xl w-fit">
          {([
            { id: 'basic', label: 'Basic Info', icon: 'ri-home-4-line' },
            { id: 'addons', label: 'Add-ons', icon: 'ri-gift-line' },
            { id: 'daypackage', label: 'Day Package', icon: 'ri-sun-line' },
          ] as { id: FormSection; label: string; icon: string }[]).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                section === s.id ? 'bg-white text-stone-900' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <i className={s.icon} /> {s.label}
              {s.id === 'addons' && formAddOns.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">{formAddOns.length}</span>
              )}
              {s.id === 'daypackage' && dpEnabled && (
                <span className="ml-1 w-2 h-2 bg-emerald-500 rounded-full inline-block" />
              )}
            </button>
          ))}
        </div>

        {/* ── BASIC INFO ── */}
        {section === 'basic' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-5 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Property Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400" placeholder="e.g. Sunrise Beach Villa" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Full Location *</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400" placeholder="e.g. Vagator, Goa" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">City</label>
                <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400" placeholder="Goa" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">State</label>
                <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400" placeholder="Goa" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Price Per Night (₹) *</label>
                <input type="number" value={form.pricePerNight || ''} onChange={(e) => setForm({ ...form, pricePerNight: Number(e.target.value) })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400" placeholder="15000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Property Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 bg-white">
                  {['villa', 'apartment', 'cottage', 'boutique', 'resort', 'houseboat', 'treehouse'].map((t) => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Bedrooms</label>
                <input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400" min={1} />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Bathrooms</label>
                <input type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: Number(e.target.value) })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400" min={1} />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Max Guests</label>
                <input type="number" value={form.maxGuests} onChange={(e) => setForm({ ...form, maxGuests: Number(e.target.value) })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400" min={1} />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as HostProperty['status'] })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 bg-white">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending Review</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <ImageUploader
                  images={form.images.filter(Boolean)}
                  onChange={(imgs) => setForm({ ...form, images: imgs })}
                  label="Property Images"
                  multiple={true}
                  aspectHint="Landscape recommended (1200×800px)"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Tags / Amenities</label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {form.tags.map((t) => (
                    <span key={t} className="flex items-center gap-1 px-3 py-1 bg-stone-100 text-stone-700 text-xs rounded-full">
                      {t}
                      <button type="button" onClick={() => removeTag(t)} className="cursor-pointer text-stone-400 hover:text-red-500"><i className="ri-close-line" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} className="flex-1 px-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400" placeholder="e.g. Pool, Mountain View" />
                  <button type="button" onClick={addTag} className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-sm hover:bg-stone-200 cursor-pointer whitespace-nowrap">Add</button>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 resize-none" placeholder="Describe your property..." />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setView('list')} className="px-6 py-2.5 border border-stone-200 text-stone-700 rounded-xl text-sm font-medium hover:bg-stone-50 cursor-pointer whitespace-nowrap">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 cursor-pointer whitespace-nowrap">
                {view === 'edit' ? 'Save Changes' : 'Add Property'}
              </button>
            </div>
          </div>
        )}

        {/* ── ADD-ONS TAB ── */}
        {section === 'addons' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 max-w-2xl">
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-stone-700">Add-on Experiences</h3>
              <p className="text-stone-400 text-xs mt-1">Optional extras guests can select when booking — like a spa session, private chef dinner, or bonfire night. These will appear on your property page.</p>
            </div>

            {formAddOns.length === 0 ? (
              <div className="py-8 px-6 text-center border-2 border-dashed border-stone-200 rounded-2xl mb-5 bg-stone-50/60">
                <i className="ri-gift-line text-stone-300 text-3xl block mb-3" />
                <p className="text-stone-700 text-sm font-semibold mb-1">No Add-ons Yet</p>
                <p className="text-stone-400 text-xs max-w-xs mx-auto mb-3">
                  Add-ons help you earn more per booking. Guests can choose to add these when they book your property.
                </p>
                <div className="flex flex-wrap gap-2 justify-center text-xs text-stone-500">
                  {['Couples Spa', 'Private Chef Dinner', 'Bonfire Night', 'Kayaking Session', 'Yoga Class', 'Airport Transfer'].map((ex) => (
                    <span key={ex} className="px-2.5 py-1 bg-white border border-stone-200 rounded-full">{ex}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 mb-4">
                {formAddOns.map((addon, idx) => (
                  <div key={addon.id} className="bg-stone-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Add-on #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, addOns: formAddOns.filter((_, i) => i !== idx) })}
                        className="w-7 h-7 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg cursor-pointer border border-stone-200"
                      >
                        <i className="ri-delete-bin-line text-sm" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-stone-500 mb-1">Name</label>
                        <input
                          value={addon.name}
                          onChange={(e) => { const u = [...formAddOns]; u[idx] = { ...u[idx], name: e.target.value }; setForm({ ...form, addOns: u }); }}
                          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                          placeholder="e.g. Couples Spa"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-stone-500 mb-1">Price (&#x20B9;)</label>
                        <input
                          type="number"
                          value={addon.price || ''}
                          onChange={(e) => { const u = [...formAddOns]; u[idx] = { ...u[idx], price: Number(e.target.value) }; setForm({ ...form, addOns: u }); }}
                          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                          placeholder="2500"
                        />
                      </div>
                      <div className="col-span-2">
                        <ImageUploader
                          images={addon.image ? [addon.image] : []}
                          onChange={(imgs) => { const u = [...formAddOns]; u[idx] = { ...u[idx], image: imgs[0] ?? '' }; setForm({ ...form, addOns: u }); }}
                          label="Add-on Image"
                          multiple={false}
                          aspectHint="Landscape (400×300px)"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs text-stone-500 mb-1">Description</label>
                        <input
                          value={addon.description}
                          onChange={(e) => { const u = [...formAddOns]; u[idx] = { ...u[idx], description: e.target.value }; setForm({ ...form, addOns: u }); }}
                          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                          placeholder="Short description..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, addOns: [...formAddOns, emptyAddOn()] })}
                className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 cursor-pointer whitespace-nowrap"
              >
                <i className="ri-add-line" /> Add Add-on
              </button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 cursor-pointer whitespace-nowrap">
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* ── DAY PACKAGE TAB ── */}
        {section === 'daypackage' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 max-w-2xl">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-stone-700">Day Outing Package</h3>
                <p className="text-stone-400 text-xs mt-1">Let day visitors enjoy your property without an overnight stay. Appears on the home page Experiences section when enabled.</p>
              </div>
              <button
                type="button"
                onClick={() => updateDp({ enabled: !dpEnabled })}
                className={`relative inline-flex items-center w-10 h-5 rounded-full transition-colors cursor-pointer shrink-0 ${dpEnabled ? 'bg-emerald-500' : 'bg-stone-200'}`}
              >
                <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transition-transform ${dpEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {!dpEnabled ? (
              <div className="py-10 px-6 text-center border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50/60">
                <i className="ri-sun-line text-stone-300 text-4xl block mb-3" />
                <p className="text-stone-700 text-sm font-semibold mb-1">Day Package is Disabled</p>
                <p className="text-stone-400 text-xs max-w-xs mx-auto mb-4">
                  Enable it to offer day outings to visitors. Your package will show up in the &ldquo;Day Outing&rdquo; category on the home page Experiences section, and guests can book it directly from your property page.
                </p>
                <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-4 text-xs">
                  <div className="p-2 bg-white border border-stone-200 rounded-lg text-center">
                    <i className="ri-restaurant-2-line text-amber-500 text-lg block mb-0.5" />
                    <span className="text-stone-600">Meals included</span>
                  </div>
                  <div className="p-2 bg-white border border-stone-200 rounded-lg text-center">
                    <i className="ri-run-line text-amber-500 text-lg block mb-0.5" />
                    <span className="text-stone-600">Activities</span>
                  </div>
                  <div className="p-2 bg-white border border-stone-200 rounded-lg text-center">
                    <i className="ri-water-flash-line text-amber-500 text-lg block mb-0.5" />
                    <span className="text-stone-600">Facilities</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateDp({ enabled: true })}
                  className="px-5 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap"
                >
                  Enable Day Package
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1.5">Timing</label>
                    <input
                      value={form.dayPackage?.timing ?? ''}
                      onChange={(e) => updateDp({ timing: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                      placeholder="e.g. 10:00 AM – 6:00 PM"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1.5">Price per Person (&#x20B9;)</label>
                    <input
                      type="number"
                      value={form.dayPackage?.pricePerPerson || ''}
                      onChange={(e) => updateDp({ pricePerPerson: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                      placeholder="3500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1.5">Max Guests Allowed</label>
                    <input
                      type="number"
                      value={form.dayPackage?.maxGuests || ''}
                      onChange={(e) => updateDp({ maxGuests: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                      placeholder="e.g. 20"
                      min={1}
                      max={500}
                    />
                    <p className="text-xs text-stone-400 mt-1">Leave blank for no limit</p>
                  </div>
                  <div className="col-span-2">
                    <ImageUploader
                      images={form.dayPackage?.image ? [form.dayPackage.image] : []}
                      onChange={(imgs) => updateDp({ image: imgs[0] ?? '' })}
                      label="Package Image"
                      multiple={false}
                      aspectHint="Landscape recommended (800×500px)"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-stone-600 mb-1.5">Description</label>
                    <textarea
                      value={form.dayPackage?.description ?? ''}
                      onChange={(e) => updateDp({ description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400 resize-none"
                      placeholder="Describe the day outing experience..."
                    />
                  </div>
                </div>

                {/* Meals */}
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1.5">Meals Included</label>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {dpMeals.map((m) => (
                      <span key={m} className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-100">
                        <i className="ri-restaurant-2-line text-xs" />{m}
                        <button type="button" onClick={() => removeDpItem('meals', m)} className="cursor-pointer text-amber-400 hover:text-red-500"><i className="ri-close-line" /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={mealInput}
                      onChange={(e) => setMealInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDpItem('meals', mealInput))}
                      className="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                      placeholder="e.g. Continental Breakfast"
                    />
                    <button type="button" onClick={() => addDpItem('meals', mealInput)} className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm hover:bg-stone-200 cursor-pointer whitespace-nowrap">Add</button>
                  </div>
                </div>

                {/* Activities */}
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1.5">Activities</label>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {dpActivities.map((a) => (
                      <span key={a} className="flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-700 text-xs rounded-full">
                        <i className="ri-run-line text-xs" />{a}
                        <button type="button" onClick={() => removeDpItem('activities', a)} className="cursor-pointer text-stone-400 hover:text-red-500"><i className="ri-close-line" /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={activityInput}
                      onChange={(e) => setActivityInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDpItem('activities', activityInput))}
                      className="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                      placeholder="e.g. Nature Walk, Kayaking"
                    />
                    <button type="button" onClick={() => addDpItem('activities', activityInput)} className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm hover:bg-stone-200 cursor-pointer whitespace-nowrap">Add</button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-5">
              <button onClick={() => setView('list')} className="px-6 py-2.5 border border-stone-200 text-stone-700 rounded-xl text-sm font-medium hover:bg-stone-50 cursor-pointer whitespace-nowrap">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 cursor-pointer whitespace-nowrap">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">My Properties</h2>
          <p className="text-stone-500 text-sm mt-1">{properties.length} propert{properties.length !== 1 ? 'ies' : 'y'} listed</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-emerald-600 text-sm flex items-center gap-1"><i className="ri-check-line" /> Saved!</span>}
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 cursor-pointer whitespace-nowrap">
            <i className="ri-add-line" /> Add Property
          </button>
        </div>
      </div>

      {properties.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200">
          <div className="w-16 h-16 flex items-center justify-center bg-stone-100 rounded-2xl mx-auto mb-4"><i className="ri-building-line text-stone-400 text-3xl" /></div>
          <p className="font-semibold text-stone-700 mb-2">No properties yet</p>
          <p className="text-stone-400 text-sm mb-6">Add your first property to start accepting bookings</p>
          <button onClick={openAdd} className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold cursor-pointer whitespace-nowrap">Add Your First Property</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {properties.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="h-40 bg-stone-100 relative">
              {p.images[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover object-top" /> : <div className="w-full h-full flex items-center justify-center text-stone-300"><i className="ri-image-line text-4xl" /></div>}
              <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[p.status]}`}>{p.status}</span>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-stone-900 mb-1">{p.name}</h3>
              <p className="text-stone-500 text-xs mb-3 flex items-center gap-1"><i className="ri-map-pin-line" />{p.location}</p>
              <div className="flex items-center gap-4 text-xs text-stone-500 mb-3">
                <span><i className="ri-hotel-bed-line mr-1" />{p.bedrooms} bed</span>
                <span><i className="ri-group-line mr-1" />{p.maxGuests} guests</span>
                <span className="font-bold text-stone-900 text-sm ml-auto">₹{p.pricePerNight.toLocaleString('en-IN')}<span className="font-normal text-stone-400">/night</span></span>
              </div>
              <div className="flex gap-2 pt-3 border-t border-stone-100">
                <button onClick={() => openEdit(p)} className="flex-1 py-2 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50 cursor-pointer whitespace-nowrap flex items-center justify-center gap-1">
                  <i className="ri-edit-line" /> Edit
                </button>
                <button onClick={() => handleDelete(p.id)} className="flex-1 py-2 border border-red-100 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 cursor-pointer whitespace-nowrap flex items-center justify-center gap-1">
                  <i className="ri-delete-bin-line" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
